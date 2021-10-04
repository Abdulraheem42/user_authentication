const express = require('express')
const router = express.Router()
const {validateTotalAmount, validateTotalAmountUpdate} = require('../model/totalAmount')
const verifyToken = require('../utils/verifyToken')
const amountControllers = require('../controllers/totalAmount')

// ================Add total amount ===================
router.post("/totalAmount", verifyToken, async (req, res) => {
    try{
        console.log(req.body, 'body---------')
        if(req.body._id){
            let {error} = validateTotalAmountUpdate(req.body)
            if(error){
                return res.status(400).json({
                    status: 400,
                    error: error.details[0].message
                })
            }
            let totalAmountUpdate = await amountControllers.totalAmountUpdate(req.body._id, req.body)
            return res.status(200).json({
                status: 200,
                error: null,
                data: totalAmountUpdate
            })
        }
        else{
            let {error} = validateTotalAmount(req.body)
            if(error){
                return res.status(400).json({
                    status: 400,
                    error: error.details[0].message
                })
            }
            let amount = await amountControllers.totalAmount(req.body)
            return res.status(200).json({
                status: 200,
                error: null,
                data: amount
            })
        }


    }catch(error){
        return error
    }
})

// ================Add total amount update===================
router.put("/totalAmountUpdate", verifyToken, async (req, res) => {
    try{
        console.log(req.body, 'body')
        let {error} = validateTotalAmountUpdate(req.body)
        if(error){
            return res.status(400).json({
                status: 400,
                error: error.details[0].message
            })
        }
            let totalAmountUpdate = await amountControllers.totalAmountUpdate(req.body._id, req.body)
            return res.status(200).json({
                status: 200,
                error: null,
                data: totalAmountUpdate
            })
    }catch(error){
        return error
    }
})

// =================get Total Amount================
router.get("/getTotalAmount", verifyToken, async (req, res) => {
    try {   
        console.log('getotatl')
        if(!req.body.userId){
            res.status(400).json({
                status: 400,
                error: "userId not valid",
                data: null
            })
        }
        let getTotalAmount = await amountControllers.getTotalAmount(req.body.userId)
        console.log(getTotalAmount, 'gettotal')
        if(!getTotalAmount){
            res.status(400).json({
                status: 400,
                error: "userId not valid",
                data: null
            })
        }
            res.status(200).json({
                status: 200,
                error: null,
                data: getTotalAmount
            })
    }catch(error){
        return error
    }
})

module.exports = router