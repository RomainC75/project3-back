const router = require('express').Router()
const Product = require('../models/Product.model')

router.get('/',async(req,res,next)=>{
    try{
        const ans = await Product.find()
        res.status(200).json({length : ans.length})
    }catch(e){
        res.status(400).json(e)
    }
})


module.exports=router
