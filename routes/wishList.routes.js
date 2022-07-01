const { restart } = require('nodemon')

const router = require('express').Router()

router.get('/',(req,res,next)=>{
    res.status(200).json({
        mesage : "route wishList"
    })
})

module.exports = router