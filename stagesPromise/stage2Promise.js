const delayPromise = () => {
  return new Promise((delayResolve, reject) => {
    const t1 = Date.now() % 2000;
    setTimeout(() => {
      delayResolve(`STAGE 2(1) - waiting for ${t1}ms before logging`);
    }, t1);
  });
};

const logPromise = (message) => {
  return new Promise((logResolve, reject) => {
    logResolve(message);
  });
};

const step3Promise = () => {
  return new Promise((thirdResolve, reject) => {
    const t2 = Date.now() % 2000;
    setTimeout(() => {
      thirdResolve(`STAGE 2(3) - waiting for time ${t2}ms after logging `);
    }, t2);
  });
};

const stage2Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise().then((message) => {
      console.log(message);
      logPromise("STAGE 2(2)- fetching the plant").then((message) => {
        console.log(message);
        step3PromisePromise()
          .then((message) => {
            console.log(message);
          })
          .then(() => {
            resolve("stage 2 is resolved");
          });
      });
    });
  });
};
stage2Promise().then((message) => {
  console.log(message);
});
