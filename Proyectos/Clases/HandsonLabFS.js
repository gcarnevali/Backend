/*function suma (a, b, callback) {
    let resultado=a+b
    callback(resultado)
}*/
let array = [1, 2, 3, 4, 5] 

function miMap(array[], callback){

    let arraySalida=[]
    
    for(let i=0; i<array.lenght; i++){
        let resultado = array[i]=callback(array[i])
        arraySalida.push(resultado)
    }

    return arraySalida
}

miMap(array, numero=>2*numero)