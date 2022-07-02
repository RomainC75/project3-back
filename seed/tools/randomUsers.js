//<64 characters
//no _ in the domain part



const halfAChance = () =>{
    return Math.random()<0.5 ? false : true
}


const getLocalPart = () =>{
    const availableChars = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const specialChars = "!#$%&'*+-/=?^_`{|}~"
    const allAvailableChars = availableChars+availableChars.toUpperCase()+specialChars+numbers
    let localPart = ""
    for(let i=0 ; i<40 ; i++){
        localPart += halfAChance() ? " " : allAvailableChars[Math.floor(Math.random()*allAvailableChars.length)]
    }
    localPart = localPart.replace(/ /g,'')
    if(halfAChance()){
        let temp = localPart.split('')
        temp.splice( Math.floor(Math.random()*(localPart.length-2))+1, 0 , '.')
        localPart=temp.join('')
    }
    return  localPart.length>6 ? localPart : getLocalPart()
}

const getRandomizedUser = ()=>{
    const domains = ['gmail.com','yahoo.com','outlook.com','aol.com','hubspot.com']
    const email = getLocalPart() + '@' + domains[ Math.floor(Math.random()*domains.length) ]
}

const test = () =>{
    for(let i =0; i<1000 ; i++ ){
        getRandomizedUser()
    }
}

test()