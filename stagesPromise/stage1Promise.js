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

const stage3Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise().then((message) => {
      console.log(message);
      logPromise("STAGE 3(2)- finished fetching the plant").then((message) => {
        console.log(message);
        step3PromisePromise()
          .then((message) => {
            console.log(message);
          })
          .then(() => {
            resolve("stage 3 is resolved");
          });
      });
    });
  });
};
stage3Promise().then((message) => {
  console.log(message);
});


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

const stage5Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise().then((message) => {
      console.log(message);
      logPromise("STAGE 5(2)- Inserting the plant").then((message) => {
        console.log(message);
        step3PromisePromise()
          .then((message) => {
            console.log(message);
          })
          .then(() => {
            resolve("stage 5 is resolved");
          });
      });
    });
  });
};
stage5Promise().then((message) => {
  console.log(message);
});

const stage6Promise = () => {
  return new Promise((resolve, reject) => {
    delayPromise().then((message) => {
      console.log(message);
      logPromise("STAGE 6(2)- Finished inserting into mydb").then((message) => {
        console.log(message);
        step3Promise()
          .then((message) => {
            console.log(message);
          })
          .then(() => {
            resolve("stage 6 is resolved");
          });
      });
    });
  });
};
stage6Promise().then((message) => {
  console.log(message);
});