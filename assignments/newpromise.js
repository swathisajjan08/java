// 

const downloadfile = () =>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            let success = true
            if(success){
                resolve("file downloaded")
            } else{
                reject("download failed")
            }
        }, 1000);
    })
}

downloadfile()
.then((message)=>{console.log(message)})
.catch((message)=>{console.log(message)})






