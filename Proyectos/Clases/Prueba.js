let resultado = {}

for (let index = 0; index < 10000; index++) {
    const valor = Math.floor(Math.random()*(20-1+1)+1)
    
    if(resultado[valor]){
        resultado[valor] ++
    } else {
        resultado [valor]=1
    }
}

console.log(resultado)
