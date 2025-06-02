const delayPromise = (ms) => {
  return new Promise((delayResolve, reject) => {
    setTimeout(() => {
      delayResolve(`waiting for ${ms}ms`);
    }, ms);
  });
};

const logPromise = (message) => {
  return new Promise((logResolve, reject) => {
    logResolve(message);
  });
};

const thirdPromise = (t1) => {
  return new Promise((thirdResolve, reject) => {
    const t1 = Date.now() % 2000;
    setTimeout(() => {
      thirdResolve(`Step 3 - waiting for time ${t1}ms `);
    }, t1);
  });
};

const stage1Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise(1200).then((message) => {
      console.log(message);
      logPromise("fetching").then((message) => {
        console.log(message);
        thirdPromise()
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
