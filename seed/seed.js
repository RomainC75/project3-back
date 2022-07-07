//require('dotenv').config('../.env')
require('../db/index')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {LoremIpsum} =  require ("lorem-ipsum");

const Product = require('../models/Product.model')
const Guitar = require('../models/Guitar.model')
const Woodwind = require('../models/Woodwind.model')
const String = require('../models/String.model')
const User = require('../models/User.model')
const Review = require('../models/Review.model')

const bassList = require('./dataBass.json')
const guitarList = require('./dataGuitar.json')
const stringList = require('./dataString.json')
const woodList = require('./dataWoodwind.json')
const usersList = require('./dataUser.json')

const reviewsCreation = async (guitarName) =>{
    //create reviews about "guitarName"
    const [guitarFound] = await Product.find({name:guitarName})
    await Promise.all(usersList.map( async (user)=>{
        const lorem = new LoremIpsum({
            sentencesPerParagraph: {
              max: Math.floor(Math.random()*8)+2,
              min: 1
            },
            wordsPerSentence: {
              max: Math.floor(Math.random()*16)+5,
              min: 4
            }
          });
        const [foundUser] = await User.find({email:user.email})
        const paragraphes = lorem.generateParagraphs(Math.floor(Math.random()*5))
        const ans = await Review.create({
            userId:foundUser._id,
            productId:guitarFound._id,
            rate:Math.floor(Math.random()*5),
            comment:paragraphes==="" ? "abac" : paragraphes
        })
    }))
}

const seed = async () =>{
    try{
        await Product.deleteMany()
        await Guitar.deleteMany()
        await Woodwind.deleteMany()
        await String.deleteMany()
        await User.deleteMany({"email":{$ne:"sponge.b0b@gmail.com"}}) // ajouter son mail
        await Review.deleteMany()

        const guitarAns = await Guitar.insertMany(guitarList)
        const bassAns = await Guitar.insertMany(bassList)
        const stringAns = await String.insertMany(stringList)
        const woodAns = await Woodwind.insertMany(woodList)

        //const userAns = await User.insertMany(usersList)
        await Promise.all( usersList.map(async(user)=>{
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(user.password,salt)
            await User.create({
                email:user.email,
                password:hash
            })
        }))
        
        //see tools/randomUsers.js to create a new JSON file with more or less randomUsers
        const answer = await Product.find({__t:"GuitarSchema"})
        
        await Promise.all( guitarList.map(async(guitar,i)=>{
            await reviewsCreation(guitar.name)
        }))
        

        await reviewsCreation()
        
        mongoose.connection.close()
    }catch(e){
        console.log('EROR : ',e)
    }
}

seed()