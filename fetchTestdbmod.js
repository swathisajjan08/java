import { createConnection } from "mysql2/promise";
import fs from "fs";
//Read DB config from JSON
const config = fs.readFileSync("config_dbs.json", "utf-8");
const configj = JSON.parse(config);

//Function to simulate delay and log to testlogs table
function delayTimelog(ms, plant_id = 10, plant_name = "log", comnc_date = "2025-05-20", capacity = 0, message = null) {
  return new Promise((resolve, reject) => {
    if (ms > 200) {
      setTimeout(() => {
        resolve();
      }, ms);
      logtotestdb({
        delayTime: ms,
        plant_id,
        plant_name,
        comnc_date,
        capacity,
        message,
      }).catch(() => {
        reject();
      });
    } else {
      setTimeout(() => {
        resolve();
      }, ms);
    }
  });
}

//Function to upgrade the plant capacity until it reached average
function avgCapacity(row) {
  return createConnection(configj.dev_db)
    .then((connection) => {
      return connection.execute("SELECT site_capacity FROM mas_sites WHERE site_capacity > 50");
    })
    .then(([rows]) => {
      let total = 0;
      for (let i = 0; i < rows.length; i++) {
        total = total + rows[i].site_capacity;
      }
      //calculate total capacity
      const average = total / rows.length;
      let current = row.site_capacity;
      // console.log("average", average)
      const startTime = Date.now();
      return new Promise((resolve) => {
        function loop() {
          if (current >= average) {
            row.site_capacity = current;
            const timeUpgrade = (Date.now() - startTime) / 1000;
            return logtotestdb({
              delayTime: 0,
              plant_id: row.id,
              plant_name: row.name,
              comnc_date: row.comm_date,
              capacity: current,
              message: `Plant id ${row.id} capacity reached average value of ${current}. `,
            })
              .then(() => {
                logtotestdb({
                  delayTime: 0,
                  plant_id: row.id,
                  plant_name: row.name,
                  comnc_date: row.comm_date,
                  capacity: current,
                  message: `Total time taken to upgrade plant id ${row.id} is ${timeUpgrade}`,
                });
              })
              .then(() => resolve(row));
          } else {
            const t1 = Date.now() % 2000;
            delayTimelog(t1, 10, "log", "2025-05-20", 0, `Delaying for  ${t1} ms while upgrading.`)
              .then(() => {
                const previous = current;
                current = current + 3;

                logtotestdb({
                  delayTime: 0,
                  plant_id: row.id,
                  plant_name: row.name,
                  comnc_date: row.comm_date,
                  capacity: current,
                  message: `Plant capacity of id ${row.id} incremented from ${previous} to ${current}.`,
                });
              })
              .then(() => loop());
          }
        }

        loop();
      });
    });
}

//Function to log a message to test_log table along with ts,date
function logtotestdb({ delayTime, plant_id = 10, plant_name = "log", comnc_date = "2025-05-20", capacity = 0, message = null }) {
  return new Promise((resolve, reject) => {
    return createConnection(configj.dev_db)
      .then((connection) => {
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
      })
      .catch(() => {
        reject();
      });
  });
}

//Function to fetch the plant data from dev_db by Id
function fetchPlantFromDev(id) {
  return new Promise((resolve, reject) => {
    return createConnection(configj.dev_db)
      .then((connection) => {
        return connection.execute(`SELECT * FROM mas_sites WHERE id = ?`, [id]);
      })
      .then(([rows]) => {
        resolve(rows);
      })
      .catch(() => {
        reject();
      });
  });
}

//Function to insert and update the plant data into my_db
function insertIntoMydb(c) {
  return new Promise((resolve, reject) => {
    return createConnection(configj.my_db)
      .then((connection) => {
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
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

//STAGE 1: Initial delay and log "going to fetch"
function plantStage1(id) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    delayTimelog(500, 10, "*****", "2025-05-20", 0, `${id}-Stage 1 - Waiting 500 ms before fetching the plant ID ${id}.`)
      .then(() =>
        logtotestdb({
          delayTime: 500,
          plant_id: 10,
          plant_name: "log",
          comnc_date: "2025-05-20",
          capacity: 0,
          message: `${id}-STAGE 1-Preparing to fetch the plant id  ${id} from devdb.`,
        })
      )
      .then(() => {
        const t1 = (Date.now() % 2000 ) + 250;
        delayTimelog(t1, 10, "log", "2025-05-20", 0, `${id}-Stage 1 - additional wait of ${t1}ms before moving to Stage 2.`).then(() => {
          resolve({ id, t1, startTime });
        });
      })
      .catch((error) => {
        reject();
        console.log(error);
      });
  });
}

//STAGE 2: Function call for FetchPlantFromDev to fetch the plant and check if the plant id is present or not
function plantStage2({ id, t1, startTime }) {
  return new Promise((stage2Resolve, stage2Reject) => {
    delayTimelog(t1, 10, "log", "2025-05-20", 0, `${id}-Stage 2 - Waiting  ${t1}ms in 2nd stage before fetching the plant id ${id}.`)
      .then(() => fetchPlantFromDev(id))
      .then((rows) => {
        if (rows.length === 0) {
          logtotestdb({
            delayTime: t1,
            plant_id: 10,
            plant_name: "log",
            comnc_date: "2025-05-20",
            capacity: 0,
            message: `${id}-STAGE 2 - No data found for plant id ${id} in devdb.`,
          })
            .then(() => {
							const t2 = Date.now() % 2000;
              return delayTimelog(t2, 10, "log", "2025-05-20", 0, `${id}-Stage 2 - Waiting for ${t2} after no data found for plant id ${id}`);
            })
						.then(()=>{
							stage2Reject()
						})
        } else {
          const row = rows[0];
					logtotestdb({
						delayTime: t1,
						plant_id: row.id,
						plant_name: row.name,
						comnc_date: row.comm_date,
						capacity: row.site_capacity,
						message: `${id}-STAGE 2-fetched plant id ${id} from dev_db.`,
					})
					.then(()=>{
          const t2 = (Date.now() % 2000)+250;
          return delayTimelog(t2, 10, "log", "2025-05-20", 0, `${id}-Stage 2 - Waiting for ${t2} in 2nd stage after fetching plant id.`)
					
					.then(() => {
            stage2Resolve({ id: id, row: row, t2: t2, startTime });
          });
				})
        }
      })
			.catch(()=>{
				stage2Reject()
			})
  });
}

//STAGE 3: Log and update the plant capacity
function plantStage3({ id, row, t2, startTime }) {
  return new Promise((resolve, reject) => {
    delayTimelog(t2, 10, "log", "2025-05-20", 0, `${id}-Stage 3 - Waiting for ${t2} in 3rd stage before logging fetched plant id.`)
      .then(() =>
        logtotestdb({
          delayTime: t2,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 3-fetched plant id  ${id} from dev_db.`,
        })
      )

      // .then(() => avgCapacity(row))
      .then(() => {
        const t3 = (Date.now() % 2000)+250;
        return delayTimelog(t3, 10, "log", "2025-05-20", 0, `${id}-Stage 3 - Waiting ${t3}ms before proceeding to  stage 4.`).then(() => resolve({ id, row, t3, startTime }));
      })
      .catch(() => {
        reject();
      });
  });
}

//STAGE 4: Log before inserting into my_db
function plantStage4({ id, row, t3, startTime }) {
  return new Promise((resolve, reject) => {
    delayTimelog(t3, 10, "log", "2025-05-20", 0, `${id}-Stage 4 - Waiting ${t3}ms before logging insert into my_db.`)
      .then(() =>
        logtotestdb({
          delayTime: t3,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 4-Preparing to insert Plant id ${id} into my_db.`,
        })
      )
      .then(() => {
        const t4 = (Date.now() % 2000)+250;
        return delayTimelog(t4, 10, "log", "2025-05-20", 0, `${id}-Stage 4 - Waiting ${t4}ms before starting Stage 5`).then(() => resolve({ id, row, t4, startTime }));
      })
      .catch(() => {
        reject();
      });
  });
}

//STAGE 5: Function call insertintomydb to insert into my_db
function plantStage5({ id, row, t4, startTime }) {
  return new Promise((resolve, reject) => {
    delayTimelog(t4, 10, "log", "2025-05-20", 0, `${id}-Stage 5 - Waiting  ${t4}ms before inserting into my_db `)
      .then(() => insertIntoMydb(row))
      .then(() => {
        const t5 = (Date.now() % 2000)+250;
        delayTimelog(t5, 10, "log", "2025-05-20", 0, `${id}-Stage 5 - Waiting ${t5}ms before starting Stage 6.`).then(() => resolve({ id, row, t5, startTime }));
      })
      .catch(() => {
        reject();
      });
  });
}

//STAGE 6: Final logging and calculate the total time taken.
function plantStage6({ id, row, t5, startTime }) {
  return new Promise((resolve, reject) => {
    delayTimelog(t5, 10, "log", "2025-05-20", 0, `${id}-Stage 6 - Waiting  ${t5}ms before logging inserted.`)
      .then(() => {
        const totalTime = (Date.now() - startTime) / 1000;
        return logtotestdb({
          delayTime: t5,
          plant_id: row.id,
          plant_name: row.name,
          comnc_date: row.comm_date,
          capacity: row.site_capacity,
          message: `${id}-STAGE 6- Successfully inserted  Plant id ${id} into mydb.`,
        }).then(() => {
          return logtotestdb({
            delayTime: t5,
            plant_id: row.id,
            plant_name: row.name,
            comnc_date: row.comm_date,
            capacity: row.site_capacity,
            message: `${id}-STAGE 6-Total time taken for processing Plant id ${id} is ${totalTime}.`,
          });
        });
      })
      .then(() => resolve())
      .catch(() => {
        reject();
      });
  });
}

// main function -processes multiple plants
function main(id) {
  const stage1Promise = plantStage1(id); // calls the stage 1 function and stores the returned promise in the variable 
  stage1Promise // when stage 1 is resolved after the delay is over and the values are ready, it will return result 1 which has id,t1
    .then((result1) => {
		const stage2Promise = plantStage2(result1)
		return stage2Promise ;})
    .then((result2) => {
      if (!result2.row) {
        reject();
      }
      const stage3Promise = plantStage3(result2)
			return stage3Promise ;
    })
    .then((result3) =>{
		const stage4Promise = plantStage4(result3)
		return stage4Promise ;})
    .then((result4) => {
			const stage5Promise = plantStage5(result4)
			return stage5Promise ;})
    .then((result5) => {
			const stage6Promise = plantStage6(result5)
			return stage6Promise ;})
    .then(() => {
      if (id < 296) {
        main(id + 1);
      }
    })
    .catch((error) => {
      if (id < 296) {
        main(id + 1);
      }
    });
}

//Function call for main and handler for callback functions
main(293);
