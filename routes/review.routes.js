const router = require('express').Router()

const Review = require('../models/Review.model')
const authentication = require('../middleware/authentication.mid')
const Product = require('../models/Product.model')
//query - filter : newest

// NO time : newest, oldest //depends on the nFirst
//1 -- rate : number // min ou max !!
//--->quality : best, worse
// last  :nfirst: number

router.get('/:productId', async (req,res,next)=>{
    try {
        const {productId} = req.params
        //test there is a product with the productId
        const product = Product.findById(productId)
        if(product===null){
            res.status(400).json({message: 'product not found !'})
            return 
        }

        console.log(req.query)
        let reviewsFound = []
        //if rate is a number
        if('rate' in req.query && !isNaN(Number(req.query.rate))){
            reviewsFound = await Review.find({$and : [ {productId:productId}  ,{ rate:req.query.rate }]}) 
        //if rate is 'gte' or 'lte' and rateTreshold is a number
        }else if('rate' in req.query && req.query.rate==='gte' && 'rateTreshold' in req.query && !isNaN(Number(req.query.rateTreshold))){
            reviewsFound = await Review.find({$and : [ {productId:productId}  ,{ rate:{ $gte:req.query.rateTreshold } }]}) 
        }else if('rate' in req.query && req.query.rate==='lte' && 'rateTreshold' in req.query && !isNaN(Number(req.query.rateTreshold))){
            reviewsFound = await Review.find({$and : [ {productId:productId}  ,{ rate:req.query.rate }]}) 
        }else{
            reviewsFound = await Review.find({productId:productId}) 
        }
        //quality : 'best' of 'worse'
        
        if('quality' in req.query && req.query.quality==='worse'){
            reviewsFound.sort((a,b)=>a.rate-b.rate)
        }else {
            reviewsFound.sort((a,b)=>b.rate-a.rate)
        }

        //pagination - page=2
        const pagesInfo = {
            page:0,
            numberByPage:0,
            totalPageNumber:0
        }

        // if('numberByPage' in req.query && !isNaN(req.query.numberByPage)){
        //     // numberByPage=2 is valid
        //     if('page' in req.query && !isNaN(req.query.page)){
        //         if(req.query.page*(req.query.numberByPage-1)>reviewsFound.length || req.query.page*req.query.numberByPage<=0){
        //             res.status(400).json({message:'wrong page/numberOfPage'})
        //             return
        //         }
        //         pagesInfo.page=parseInt(req.query.page),
        //         pagesInfo.numberByPage=parseInt(req.query.numberByPage),
        //         pagesInfo.totalPageNumber=Math.ceil(reviewsFound.length/req.query.numberByPage)
        //         reviewsFound = reviewsFound.filter((review, i, arr)=>i>=((req.query.page-1)*req.query.numberByPage) && i<req.query.page*req.query.numberByPage )
        //     }
        //     //numberByPage=lkjdsf  is invalid
        //     //default : page 1 and 3 reviewsByPage
        //     else{
        //         console.log('(pagelà')
        //         pagesInfo.page=1,
        //         pagesInfo.numberByPage=req.query.numberByPage
        //         pagesInfo.totalPageNumber=Math.ceil(reviewsFound.length/req.query.numberByPage)-1
        //         reviewsFound = reviewsFound.filter((review,i,arr)=>i<req.query.numberByPage)
        //     }
        // }else{
        //     //no numberByPage
        //     pagesInfo.page=1,
        //     pagesInfo.numberByPage=3
        //     pagesInfo.totalPageNumber=Math.ceil(reviewsFound.length/3)-1
        //     reviewsFound = reviewsFound.filter((review,i,arr)=>i<3)
        // }

        // FOR 3 reviews / page
        if('page' in req.query){
            const totalPagesNumber = Math.ceil(reviewsFound.length/3)
            const page = parseInt(req.query.page)
            reviewsFound = reviewsFound.filter((review,i,arr)=>i>=(page-1)*3 && i<page*3)
            pagesInfo.page=page
            pagesInfo.totalPageNumber=totalPagesNumber
            pagesInfo.numberByPage=3
        }

        console.log(pagesInfo)
        //insert page AND numberByPage in the object
        //const reviewsFound = await Review.find({productId:productId})
        res.status(200).json({reviews:reviewsFound,pagesInfo})

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