const router = require('express').Router()

router.use('/:id',(req,res,next)=>{
    const {id} = req.params
    if(id.length!=24){
        res.status(404).json({message:'wrong ID Format'})
    }
    next()
})

module.exports = router