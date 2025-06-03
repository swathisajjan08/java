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
const delayPromise = (ms, id) => {
  return new Promise((delayResolve, reject) => {
    setTimeout(() => {
      logtotestdb({ message: `${id}-Stage 1 - Waiting 500 ms before fetching the plant ID ${id}.` })
        .then(() => delayResolve())
        .catch((error) => reject(error));
    }, ms);
  });
};

const logPromise = (message) => {
  return new Promise((logResolve, reject) => {
    logtotestdb(message)
      .then((message) => logResolve(message))
      .catch((error) => reject(error));
  });
};

const step3Promise = (delay, id, stagenumber) => {
  return new Promise((thirdResolve, reject) => {
    setTimeout(() => {
      logtotestdb({ delayTime: delay, message: `${id}-STAGE ${stagenumber} - Additional wait of ${delay}ms.` })
        .then(() => thirdResolve())
        .catch((error) => reject(error));
    }, delay);
  });
};

const stage1Promise = (id) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    delayPromise(500, id).then(() => {
      logPromise({ message: `${id}-STAGE 1 - Preparing to fetch the plant id  ${id} from devdb.` }).then(() => {
        const t1 = Date.now() % 2000;
        step3Promise(t1, id, 1).then(() => {
          resolve({ id, startTime, t1 });
        });
      });
    });
  });
};

const stage2Promise = ({ id, startTime, t1 }) => {
  return new Promise((resolve, reject) => {
    step3Promise(t1, id, 2).then(() => {
      fetchFromDev(id).then((rows) => {
        if (rows.length === 0) {
          logPromise({ delayTime: t1, message: `${id}-STAGE 2 - No data found for plant id ${id} in devdb.` }).then(() => {
            const t2 = Date.now() % 2000;
            step3Promise(t2, id, 2).then(() => {
              reject({ message: `stage 2 is rejected for plant id ${id}` });
            });
          });
        } else {
          const row = rows[0];
          logPromise({
            delayTime: t1,
            plant_id: row.id,
            plant_name: row.name,
            comnc_date: row.comm_date,
            capacity: row.site_capacity,
            message: `${id}-STAGE 2 - fetched plant id ${id} from dev_db.`,
          }).then(() => {
            const t2 = Date.now() % 2000;
            step3Promise(t2, id, 2).then(() => {
              resolve({ t2, id, row, startTime });
            });
          });
        }
      });
    });
  });
};

const stage3Promise = ({ t2, id, row, startTime }) => {
  return new Promise((resolve, reject) => {
    step3Promise(t2, id, 3).then(() => {
      logPromise({
        delayTime: t2,
        plant_id: row.id,
        plant_name: row.name,
        comnc_date: row.comm_date,
        capacity: row.site_capacity,
        message: `${id}-STAGE 3 - Fetched plant id  ${id} from dev_db.`,
      }).then(() => {
        const t3 = Date.now() % 2000;
        step3Promise(t3, id, 3).then(() => {
          resolve({ message: `stage 3 is resolved for plant id ${id}`, t3, startTime });
        });
      });
    });
  });
};

const main = (id) => {
  const stages = (id) => {
    return new Promise((resolve, reject) => {
      stage1Promise(id).then(stage2Promise).then(stage3Promise).then(resolve).catch(reject);
    });
  };

  stages(id)
    .then((message) => {
      console.log(message);
      if (id < 295) {
        main(id + 1);
      }
    })
    .catch((error) => {
      console.log(error);
      if (id < 295) {
        main(id + 1);
      }
    });
};
main(293);
