const router = require('express').Router()
const isAdmin = require('../middleware/isAdmin.mid')
const authentication = require('../middleware/authentication.mid')
const User = require('../models/User.model')
const House = require('../models/House.model')

router.get('/', authentication, isAdmin , async(req,res,next)=>{
    console.log(req.headers.authentication)
    try{
        const list = await User.find()
        res.status(200).json(list)
    }catch(e){
        next(e)
    }
})

router.get('/:id', authentication, async (req,res,next)=>{
    console.log(req.headers.authentication)
    try{
        if(req.user.accessLevel === 'admin' || req.params.id===req.user._id.toString()){
            const ans = await User.findById(req.params.id)
            res.status(400).json( ans )
        }else{
            res.status(400).json({message:"unauthorized !"})
        }
    }catch(e){
        next(e)
    }
})

router.put('/:id', authentication, async (req,res,next)=>{
    console.log(req.body)
    try{
        if(req.user.accessLevel === 'admin' || req.params.id===req.user._id.toString()){
            const ans = await User.findByIdAndUpdate(req.params.id, req.body ,{new:true})
            res.status(200).json(ans)
        }else{
            res.status(400).json({message:"unauthorized !"})
        }
    }catch(e){
        next(e)
    }
})

router.delete('/:id', authentication, async (req,res,next)=>{
    console.log(req.body)
    try{
        if(req.user.accessLevel === 'admin' || req.params.id===req.user._id.toString()){
            const foundUser = await User.findById(req.params.id)
            const response = await Promise.all(foundUser.ownedHouses.map(async (houseId)=> await House.findByIdAndDelete(houseId) ))
            const ans = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: "deleted with the houses !" })
        }else{
            res.status(400).json({ message: "unauthorized !" })
        }
    }catch(e){
        next(e)
    }
})

module.exports=router