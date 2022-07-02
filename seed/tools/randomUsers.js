//<64 characters
//no _ in the domain part

const fs = require('fs')

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
    return {
        email : getLocalPart() + '@' + domains[ Math.floor(Math.random()*domains.length) ],
        password : getLocalPart()
    }
}

const createUsersJsonFile = () => {
    const users = []
    for(let i =0 ; i<15; i++){
        users.push(getRandomizedUser())
    }
    
    fs.writeFile("../dataUser.json",JSON.stringify(users), (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully :-) !\n");
        }
      });
}

const test = () =>{
    for(let i =0; i<1000 ; i++ ){
        getRandomizedUser()
    }
}

createUsersJsonFile()