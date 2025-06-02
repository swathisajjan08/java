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

const stage1Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise(500).then((message) => {
      console.log(message);
      logPromise("STAGE1(2) - Going to fetch from dev db").then((message) => {
        console.log(message);
        const t1 = Date.now() % 2000;
        step3Promise(t1).then((message) => {
          console.log(message);
          resolve({ message: "stage 1 is resolved", t1 });
        });
      });
    });
  });
};

const stage2Promise = (t1) => {
  return new Promise((resolve, reject) => {
    step3Promise(t1).then((message) => {
      console.log(message);
      logPromise("STAGE 2(2)- fetching the plant").then((message) => {
        console.log(message);
        const t2 = Date.now() % 2000;
        step3Promise(t2).then((message) => {
          console.log(message);
          resolve({ message: "stage 2 is resolved", t2 });
        });
      });
    });
  });
};

const stage3Promise = (t2) => {
  return new Promise((resolve, reject) => {
    step3Promise(t2).then((message) => {
      console.log(message);
      logPromise("STAGE 3(2)- finished fetching the plant").then((message) => {
        console.log(message);
        const t3 = Date.now() % 2000;
        step3Promise(t3).then((message) => {
          console.log(message);
          resolve({ message: "stage 3 is resolved", t3 });
        });
      });
    });
  });
};

const stage4Promise = (t3) => {
  return new Promise((resolve, reject) => {
    step3Promise(t3).then((message) => {
      console.log(message);
      logPromise("STAGE 4(2)- Going to insert the plant").then((message) => {
        console.log(message);
        const t4 = Date.now() % 2000;
        step3Promise(t4).then((message) => {
          console.log(message);
          resolve({ message: "stage 4 is resolved", t4 });
        });
      });
    });
  });
};

const stage5Promise = (t4) => {
  return new Promise((resolve, reject) => {
    step3Promise(t4).then((message) => {
      console.log(message);
      logPromise("STAGE 5(2)- Inserting the plant").then((message) => {
        console.log(message);
        const t5 = Date.now() % 2000;
        step3Promise(t5).then((message) => {
          console.log(message);
          resolve({ message: "stage 5 is resolved", t5 });
        });
      });
    });
  });
};

const stage6Promise = (t5) => {
  return new Promise((resolve, reject) => {
    step3Promise(t5).then((message) => {
      console.log(message);
      logPromise("STAGE 6(2)- Finished inserting into mydb").then((message) => {
        console.log(message);
        const t6 = Date.now() % 2000;
        step3Promise(t6).then((message) => {
          console.log(message);
          resolve({ message: "stage 6 is resolved" });
        });
      });
    });
  });
};

const stages = () => {
  return new Promise((resolve, reject) => {
    stage1Promise().then(({ message: message, t1 }) => {
      console.log(message);
      stage2Promise(t1).then(({ message: message, t2 }) => {
        console.log(message);
        stage3Promise(t2).then(({ message: message, t3 }) => {
          console.log(message);
          stage4Promise(t3).then(({ message: message, t4 }) => {
            console.log(message);
            stage5Promise(t4).then(({ message: message, t5 }) => {
              console.log(message);
              stage6Promise(t5)
                .then(({ message: message }) => {
                  console.log(message);
                  resolve("All stages are resolved");
                })
                .catch((error) => {
                  reject("error", error);
                });
            });
          });
        });
      });
    });
  });
};

stages().then((message) => {
  console.log(message);
});
