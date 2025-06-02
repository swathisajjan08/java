const delayPromise = () => {
  return new Promise((delayResolve, reject) => {
    const t1 = Date.now() % 2000;
    setTimeout(() => {
      delayResolve(`STAGE 4(1) - waiting for ${t1}ms before logging`);
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
      thirdResolve(`STAGE 4(3) - waiting for time ${t2}ms after logging `);
    }, t2);
  });
};

const stage4Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise().then((message) => {
      console.log(message);
      logPromise("STAGE 4(2)- Going to insert the plant").then((message) => {
        console.log(message);
        step3Promise()
          .then((message) => {
            console.log(message);
          })
          .then(() => {
            resolve("stage 4 is resolved");
          });
      });
    });
  });
};
stage4Promise().then((message) => {
  console.log(message);
});
