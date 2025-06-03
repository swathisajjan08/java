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
const delayPromise = (ms) => {
  return new Promise((delayResolve, reject) => {
    setTimeout(() => {
      delayResolve(`Waiting for ${ms}ms before logging`);
    }, ms);
  });
};

const logPromise = (message) => {
  return new Promise((logResolve, reject) => {
    logResolve(message);
  });
};

const step3Promise = (delay) => {
  return new Promise((thirdResolve, reject) => {
    setTimeout(() => {
      thirdResolve(`Waiting for time ${delay}ms`);
    }, delay);
  });
};

const stage1Promise = (id) => {
  return new Promise((resolve, reject) => {
    delayPromise(500).then((message) => {
      console.log(message);
      logPromise(`${id}- STAGE1(2) - Going to fetch plant id ${id}`).then((message) => {
        console.log(message);
        const t1 = Date.now() % 2000;
        step3Promise(t1).then((message) => {
          console.log(message);
          resolve({ message: `stage 1 is resolved for plant id ${id}`, t1 });
        });
      });
    });
  });
};

const stage2Promise = (t1, id) => {
  return new Promise((resolve, reject) => {
    step3Promise(t1).then((message) => {
      console.log(message);
      fetchFromDev(id).then((rows) => {
        if (rows.length === 0) {
          logPromise(`${id}-STAGE 2- no such plant id ${id} found`).then((message) => {
            console.log(message);
            const t2 = Date.now() % 2000;
            step3Promise(t2).then((message) => {
              console.log(message);
              reject({ message: `stage 2 is rejected for plant id ${id}` });
            });
          });
        } else {
          const row = rows[0];
          logPromise(`${id}-STAGE 2(2)- fetching the plant id ${row.id}`).then((message) => {
            console.log(message);
            const t2 = Date.now() % 2000;
            step3Promise(t2).then((message) => {
              console.log(message);
              resolve({ message: `stage 2 is resolved for plant id ${id}`, t2, row });
            });
          });
        }
      });
    });
  });
};

const stage3Promise = (t2, id) => {
  return new Promise((resolve, reject) => {
    step3Promise(t2).then((message) => {
      console.log(message);
      logPromise(`${id}-STAGE 3(2)- finished fetching the plant id ${id}`).then((message) => {
        console.log(message);
        const t3 = Date.now() % 2000;
        step3Promise(t3).then((message) => {
          console.log(message);
          resolve({ message: `stage 3 is resolved for plant id ${id}`, t3 });
        });
      });
    });
  });
};

const stage4Promise = (t3, id) => {
  return new Promise((resolve, reject) => {
    step3Promise(t3).then((message) => {
      console.log(message);
      logPromise(`${id}-STAGE 4(2)- Going to insert the plant id ${id}`).then((message) => {
        console.log(message);
        const t4 = Date.now() % 2000;
        step3Promise(t4).then((message) => {
          console.log(message);
          resolve({ message: `stage 4 is resolved for plant id ${id}`, t4 });
        });
      });
    });
  });
};

const stage5Promise = (t4, row, id) => {
  return new Promise((resolve, reject) => {
    step3Promise(t4).then((message) => {
      console.log(message);
      insertIntoMydb(row).then(() => {
        logPromise(`${id}-STAGE 5(2)- Inserting the plant id ${row.id}`).then((message) => {
          console.log(message);
          const t5 = Date.now() % 2000;
          step3Promise(t5).then((message) => {
            console.log(message);
            resolve({ message: `stage 5 is resolved for plant id ${id}`, t5 });
          });
        });
      });
    });
  });
};

const stage6Promise = (t5, id) => {
  return new Promise((resolve, reject) => {
    step3Promise(t5).then((message) => {
      console.log(message);
      logPromise(`${id}-STAGE 6(2)- Finished inserting into mydb for plant id ${id}`).then((message) => {
        console.log(message);
        const t6 = Date.now() % 2000;
        step3Promise(t6).then((message) => {
          console.log(message);
          resolve({ message: `stage 6 is resolved for plant id ${id}` });
        });
      });
    });
  });
};
const main = (id) => {
  const stages = (id) => {
    return new Promise((resolve, reject) => {
      stage1Promise(id)
        .then(({ message: message, t1 }) => {
          console.log(message);
          stage2Promise(t1, id)
            .then(({ message: message, t2, row }) => {
              console.log(message);
              stage3Promise(t2, id)
                .then(({ message: message, t3 }) => {
                  console.log(message);
                  stage4Promise(t3, id)
                    .then(({ message: message, t4 }) => {
                      console.log(message);
                      stage5Promise(t4, row, id)
                        .then(({ message: message, t5 }) => {
                          console.log(message);
                          stage6Promise(t5, id)
                            .then(({ message: message }) => {
                              console.log(message);
                              resolve("All stages are resolved");
                            })
                            .catch((error) => {
                              console.log(error);
                              reject(error);
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          reject(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      reject(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                  reject(error);
                });
            })
            .catch((error) => {
              console.log("stage 2 error", error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
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
