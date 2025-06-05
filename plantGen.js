function* plantid(){
    for(let i=293;i<300;i++){
        yield i
    }
} 

const gen = plantid()
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
