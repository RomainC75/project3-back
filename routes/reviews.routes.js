const router = require('express').router()

router.get('/:productId', (req,res,next)=>{
    try {
        const {productId} = req.params
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