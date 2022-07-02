const router = require('express').Router()

const Review = require('../models/Review.model')
const authentication = require('../middleware/authentication.mid')
const Product = require('../models/Product.model')
//query - filter : newest

//time : newest, oldest //depends on the nFirst
//quality : best, worst, x stars
//nfirst: number

router.get('/:productId', authentication, async (req,res,next)=>{
    try {
        const {productId} = req.params
        const reviewsFound = await Review.find({userId:req.user._id})
        if(reviewsFound.length===0){
            res.status(404).json(reviewsFound)
            return
        }
        const filterdList = reviewFound.filtered()
        console.log(req.query)

    } catch (error) {
        next(error)
    }
})

// there should be only ONE review by user AND by product
// check the validity of the productId
router.post('/:productId', authentication, async (req,res,next)=>{
    try {
        const {productId} = req.params
        
        const foundReview = await Review.find({
            userId: req.user._id,
            productId: productId
        })
        if(foundReview.length>0){
            res.status(403).json({message:"you already have a review about this product"})
            return 
        }
        const foundProduct = await Product.findById(productId)
        if(foundProduct===null){
            res.status(403).json({message:"invalid product ID"})
            return
        }
        
        const ans = await Review.create({
            userId:req.user._id,
            productId:productId,
            ...req.body
        })


    } catch (error) {
        next(error)
    }
})

module.exports = router