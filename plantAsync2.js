import { createConnection } from "mysql2/promise";
import fs from "fs";

const config = fs.readFileSync("config_dbs.json", "utf-8");
const configj = JSON.parse(config);

const fetchFromDev = (id) => {
  return new Promise((resolve, reject) => {
    let conn;
    createConnection(configj.dev_db)
      .then((connection) => {
        conn = connection;
        return connection.execute(`SELECT * FROM mas_sites WHERE id = ?`, [id]);
      })
      .then(([rows]) => {
        conn.close();
        resolve(rows);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const insertIntoMydb = (c) => {
  return new Promise((resolve, reject) => {
    let conn;
    createConnection(configj.my_db)
      .then((connection) => {
        conn = connection;
        const sql = `INSERT INTO mas_sites (id,name,region_id_fk, asset_type_id_fk, created_on,created_by_fk,comm_date,lati,longi,unit_price,site_capacity,power_metric_fk,
        address,spv_id_fk,utr_num,store_address,contact_num,fax_num,num_of_turbines,price_unit,feeder_id_fk,isDataCollectionEnabled,alias_name,timezone_id_fk,effeciency,
        def_air_density,hcode,isMetMastAvailable) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE site_capacity = VALUES(site_capacity)`;
        const values = [
          c.id,
          c.name,
          c.region_id_fk,
          c.asset_type_id_fk,
          c.created_on,
          c.created_by_fk,
          c.comm_date,
          c.lati,
          c.longi,
          c.unit_price,
          c.site_capacity,
          c.power_metric_fk,
          c.address,
          c.spv_id_fk,
          c.utr_num,
          c.store_address,
          c.contact_num,
          c.fax_num,
          c.num_of_turbines,
          c.price_unit,
          c.feeder_id_fk,
          c.isDataCollectionEnabled,
          c.alias_name,
          c.timezone_id_fk,
          c.effeciency,
          c.def_air_density,
          c.hcode,
          c.isMetMastAvailable,
        ];
        return connection.query(sql, values);
      })
      .then(() => {
        conn.close();
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const logtotestdb = ({ delayTime = 0, plant_id = 10, plant_name = "log", comnc_date = "2025-05-20", capacity = 0, message = null }) => {
  return new Promise((resolve, reject) => {
    let conn;
    createConnection(configj.dev_db)
      .then((connection) => {
        conn = connection;
        const offset = 330 * 60 * 1000;
        const timeStamp = Date.now() + offset;
        const dateOnly = new Date(timeStamp).toISOString();
        return connection.execute(`INSERT INTO test_logs_swathi (ts,tdate,delay,plant_id,plant_name,comnc_date,capacity,description) VALUES (?,?,?,?,?,?,?,?)`, [
          timeStamp,
          dateOnly,
          delayTime,
          plant_id,
          plant_name,
          comnc_date,
          capacity,
          message,
        ]);
      })
      .then(() => {
        resolve();
        conn.close();
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const delayPromise = async (ms, id) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      logtotestdb({ message: `${id}-Stage 1 - Waiting 500 ms before fetching the plant ID ${id}.` })
        .then(resolve)
        .catch(reject);
    }, ms);
  });
};

const logPromise = async (message) => {
  let result = await logtotestdb(message);
  return result;
};

const step3Promise = async (delay, id, stagenumber) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      logtotestdb({ delayTime: delay, message: `${id}-STAGE ${stagenumber} - Additional wait of ${delay}ms.` })
        .then(resolve)
        .catch(reject);
    }, delay);
  });
};

const p1 = (id) => {
  return new Promise((resolve, reject) => {
    const asyncP1 = async () => {
      try {
        const startTime = Date.now();
        await delayPromise(500, id);
        await logPromise({ message: `${id}-STAGE 1 - Preparing to fetch the plant id  ${id} from devdb.` });
        const t1 = Date.now() % 2000;
        await step3Promise(t1, id, 1);
        resolve({ id, startTime, t1 });
      } catch (error) {
        reject(error);
      }
    };
    asyncP1();
  });
};

const p2 = ({ id, startTime, t1 }) => {
  return new Promise((resolve, reject) => {
    const asyncP2 = async () => {
      try {
        await step3Promise(t1, id, 2);
        const rows = await fetchFromDev(id);

        if (rows.length === 0) {
          await logPromise({ delayTime: t1, message: `${id}-STAGE 2 - No data found for plant id ${id} in devdb.` });
          const t2 = Date.now() % 2000;
          await step3Promise(t2, id, 2);
          reject({ message: `stage 2 is rejected for plant id ${id}` });
        } else {
          const row = rows[0];
          await logPromise({
            delayTime: t1,
            plant_id: row.id,
            plant_name: row.name,
            comnc_date: row.comm_date,
            capacity: row.site_capacity,
            message: `${id}-STAGE 2 - fetched plant id ${id} from dev_db.`,
          });
          const t2 = Date.now() % 2000;
          await step3Promise(t2, id, 2);
          resolve({ t2, id, row, startTime });
        }
      } catch (error) {
        reject(error);
      }
    };
    asyncP2();
  });
};

const p3 = ({ t2, id, row, startTime }) => {
  return new Promise((resolve, reject) => {
    const asyncP3 = async () => {
      try {
        await step3Promise(t2, id, 3);
        await logPromise({
          delayTime: t2,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 3 - Fetched plant id  ${id} from dev_db.`,
        });
        const t3 = Date.now() % 2000;
        await step3Promise(t3, id, 3);
        resolve({ t3, id, row, startTime });
      } catch (error) {
        reject(error);
      }
    };
    asyncP3();
  });
};

const p4 = ({ t3, id, row, startTime }) => {
  return new Promise((resolve, reject) => {
    const asyncP4 = async () => {
      try {
        await step3Promise(t3, id, 4);
        await logPromise({
          delayTime: t3,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 4 - Preparing to insert Plant id ${id} into my_db.`,
        });
        const t4 = Date.now() % 2000;
        await step3Promise(t4, id, 4);
        resolve({ t4, row, id, startTime });
      } catch (error) {
        reject(error);
      }
    };
    asyncP4();
  });
};

const p5 = ({ t4, row, id, startTime }) => {
  return new Promise((resolve, reject) => {
    const asyncP5 = async () => {
      try {
        await step3Promise(t4, id, 5);
        await insertIntoMydb(row);
        await logPromise({
          delayTime: t4,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 5 - Inserting Plant id ${id} into mydb.`,
        });
        const t5 = Date.now() % 2000;
        await step3Promise(t5, id, 5);
        resolve({ t5, id, row, startTime });
      } catch (error) {
        reject(error);
      }
    };
    asyncP5();
  });
};

const p6 = ({ t5, id, row, startTime }) => {
  return new Promise((resolve, reject) => {
    const asyncP6 = async () => {
      try {
        await step3Promise(t5, id, 6);
        await logPromise({
          delayTime: t5,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 6 - Successfully inserted  Plant id ${id} into mydb.`,
        });
        const t6 = Date.now() % 2000;
        await step3Promise(t6, id, 6);
        const totalTime = (Date.now() - startTime) / 1000;
        await logPromise({
          delayTime: t6,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 6-Total time taken for processing Plant id ${id} is ${totalTime}.`,
        });
        resolve({ message: `all stages are resolved for plant id ${id}` });
      } catch (error) {
        reject(error);
      }
    };
    asyncP6();
  });
};

const stages = async (id) => {
        try {
            const result1 = await p1(id);
            const result2 = await p2(result1);
            const result3 = await p3(result2);
            const result4 = await p4(result3);
            const result5 = await p5(result4);
            await p6(result5);
            if (id < 296) {
              stages(id + 1);
            }
          } catch (error) {
            if (id < 296) {
              stages(id + 1);
            }
          }
        
    }

stages(293);
