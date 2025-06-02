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

const step3Promise = (t1) => {
  return new Promise((thirdResolve, reject) => {
    const t1 = Date.now() % 2000;
    setTimeout(() => {
      thirdResolve(`Waiting for t1 time ${t1}ms  `);
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



const stage2Promise = () => {
  return new Promise((resolve, reject) => {
    step3Promise().then((message) => {
      console.log(message);
      logPromise("STAGE 2(2)- fetching the plant").then((message) => {
        console.log(message);
        step3Promise()
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


const stage3Promise = () => {
  return new Promise((resolve, reject) => {
    step3Promise().then((message) => {
      console.log(message);
      logPromise("STAGE 3(2)- finished fetching the plant").then((message) => {
        console.log(message);
        step3Promise()
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



const stage4Promise = () => {
  return new Promise((resolve, reject) => {
    step3Promise().then((message) => {
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


const stage5Promise = () => {
  return new Promise((resolve, reject) => {
    step3Promise().then((message) => {
      console.log(message);
      logPromise("STAGE 5(2)- Inserting the plant").then((message) => {
        console.log(message);
        step3Promise()
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


const stage6Promise = () => {
  return new Promise((resolve, reject) => {
    step3Promise().then((message) => {
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



const stages = () =>{
return new Promise((resolve,reject)=>{
stage1Promise().then((message) => {
  console.log(message);
  stage2Promise().then((message) => {
    console.log(message);
    stage3Promise().then((message) => {
      console.log(message);
      stage4Promise().then((message) => {
        console.log(message);
        stage5Promise().then((message) => {
          console.log(message);
          stage6Promise().then((message) => {
            console.log(message);
          })
          .then(()=>{
            resolve("All stages are resolved")
          })
          .catch((error)=>{
            reject("error",error)
          })
        });
      });
    });
  });
})
})
}

stages().then((message)=>{
  console.log(message)
})