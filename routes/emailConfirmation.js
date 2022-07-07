const router = require('express').Router()
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const path = require('path');

router.get('/:token',async (req,res,next)=>{
    try {
        
        const {token}=req.params
        let tokenData = {}
        try{
            tokenData = jwt.verify(token,process.env.TOKEN_SECRET)
        }catch(e){
            console.log('token decryption problem')
            res.status(400).sendFile(path.join(__dirname, '../pages/emailNotValidated.html'));
            return
        }
        const foundUsers = await User.find({email:tokenData.email})
        if(foundUsers.length===0){
            res.status(400).json({message:'user not found !'})
            return
        }
        if(foundUsers[0].emailValidationCode!==tokenData.emailValidationCode){
            console.log('emailValidationCode not valid !')
            res.status(404).sendFile(path.join(__dirname, '../pages/emailNotValidated.html'));
            return
        }
        if(foundUsers[0].isMailValidated===true){
            res.status(404).sendFile(path.join(__dirname, '../pages/emailAlreadyValidated.html'));
            return
        }
        //set user.isMailValidated -> true 
        const ans = await User.findByIdAndUpdate(foundUsers[0]._id,{
            isMailValidated:true,

        })
        res.status(200).sendFile(path.join(__dirname, '../pages/emailValidated.html'));

    } catch (error) {
        next(error)
    }
})

module.exports = router