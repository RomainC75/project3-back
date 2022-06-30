const router = require('express').Router()
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const possibleCredentials = require('../middleware/possibleCredentials.mid')
const authentication = require('../middleware/authentication.mid')
require('dotenv').config()


router.get('/verify', authentication, async (req,res,next)=>{
    try{
        console.log('VERIFY : --->',req.user)
        res.status(200).json({user : req.user})
    }catch(e){
        next(e)
    }
})

router.post('/signup',possibleCredentials, async (req,res,next)=>{
    try{
        const {email , password} = req.body
        const recordedUser = await User.findOne({email})
        console.log( "recordedUser" ,recordedUser)
        if(recordedUser!==null){
            res.status(400).json({message:"user already exists ! try another one!"})
            return 
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)
        const ans = await User.create({
            email,
            password:hash
        })
        res.status(201).json(ans)
    }catch(e){
        next(e)
    }
})


router.post('/signin', possibleCredentials, async (req,res,next)=>{
    try{
        const {email,password} = req.body
        const recordedUser = await User.findOne({email})
        if(recordedUser===null){
            res.status(404).json({message: "user not found !"})
        }
        const isPasswordValid = await bcrypt.compare(password,recordedUser.password)
        if(isPasswordValid){
            console.log('recordedUser._id', recordedUser._id)
            res.status(200).json({
                userId: recordedUser._id,
                token: jwt.sign(
                    {userId: recordedUser._id},
                    process.env.TOKEN_SECRET,
                    {expiresIn:'10m'}
                )
            })
        }else{
            res.status(401).json({message:"wrong email or pass"})
        }
    }catch(e){
        next(e)
    }
})




module.exports = router