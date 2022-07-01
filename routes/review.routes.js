const router = require('express').Router()

const Review = require('../models/Review.model')
const authentication = require('../middleware/authentication.mid')
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

router.post('/:productId', (req,res,next)=>{
    try {
        const {productId} = req.params
    } catch (error) {
        next(error)
    }
})



module.exports = router