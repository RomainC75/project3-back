//require('dotenv').config('../.env')
require('../db/index')
const mongoose = require('mongoose')
const Product = require('../models/Product.model')
const Guitar = require('../models/Guitar.model')
const guitarList = require('./dataBass.json')

//console.log(guitarList)

const seed = async () =>{
    try{
        //console.log(data)
        await Product.deleteMany()
        await Guitar.deleteMany()

        const ans = await Guitar.insertMany(guitarList)
        // await Promise.all(ans.map(async(house,i)=>{
        //     if(i<4){
        //         await User.findByIdAndUpdate(allUsers[0],{ $push:{ ownedHouses:house._id } })
        //     }else{
        //         await User.findByIdAndUpdate(adminUser[0],{ $push:{ ownedHouses:house._id } })
        //     }
        // }))
        
        const answer = await Product.find({__t:"GuitarSchema"})
        console.log(answer)
        
        mongoose.connection.close()
    }catch(e){
        console.log('EROR : ',e)
    }
}

seed()