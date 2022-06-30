const router = require('express').Router()

router.use( (req,res,next) =>{
    if(Object.values(req.body).includes('')){
        res.status(400).json({message : "empty field error"})
        return
    }else if(!Object.keys(req.body).includes('email') || req.body.email.length<5 ){
        res.status(400).json({message:"wrong email field ! more than 3 characters"})
        return 
    }else if( !Object.keys(req.body).includes('password') || req.body.password.length<3 ){
        res.status(400).json({message:"wrong password field ! more than 3 characters"})
        return 
    }else if (req.body.username===req.body.password){
        res.status(400).json({message:"email should not be equal to the password"})
        return 
    }
    next()
})

module.exports = router