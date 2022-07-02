//require('dotenv').config('../.env')
require('../db/index')
const mongoose = require('mongoose')
const Product = require('../models/Product.model')
const Guitar = require('../models/Guitar.model')
const Woodwind = require('../models/Woodwind.model')
const String = require('../models/String.model')
const User = require('../models/User.model')

const bassList = require('./dataBass.json')
const guitarList = require('./dataGuitar.json')
const stringList = require('./dataString.json')
const woodList = require('./dataWoodwind.json')
const usersList = require('./dataUser.json')

const getRandomizedUser = require('./tools/randomUsers')


//console.log(bassList)

const seed = async () =>{
    try{
        //console.log(data)
        await Product.deleteMany()
        await Guitar.deleteMany()
        await Woodwind.deleteMany()
        await String.deleteMany()
        
        const guitarAns = await Guitar.insertMany(guitarList)
        const bassAns = await Guitar.insertMany(bassList)
        const stringAns = await String.insertMany(stringList)
        const woodAns = await Woodwind.insertMany(woodList)
        const userAns = await User.insertMany(usersList)
        const answer = await Product.find({__t:"GuitarSchema"})
        
            
        mongoose.connection.close()
    }catch(e){
        console.log('EROR : ',e)
    }
}

seed()