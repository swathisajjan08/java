const delayPromise = (ms) => {
  return new Promise((delayResolve, reject) => {
    setTimeout(() => {
      delayResolve(`STAGE 1(1)-waiting for ${ms}ms before logging`);
    }, ms);
  });
};

const logPromise = (message) => {
  return new Promise((logResolve, reject) => {
    logResolve(message);
  });
};

const step3Promise = (t1) => {
  return new Promise((thirdResolve, reject) => {
    const t1 = Date.now() % 2000;
    setTimeout(() => {
      thirdResolve(`STAGE 1(3) - waiting for time ${t1}ms after logging `);
    }, t1);
  });
};

const stage1Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise(1200).then((message) => {
      console.log(message);
      logPromise("STAGE1(2) - Going to fetch from dev db").then((message) => {
        console.log(message);
        step3Promise()
          .then((message) => {
            console.log(message);
          })
          .then(() => {
            resolve("stage 1 is resolved");
          });
      });
    });
  });
};
stage1Promise().then((message) => {
  console.log(message);
});
