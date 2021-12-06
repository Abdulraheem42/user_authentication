const express = require('express')
const router = express.Router()
const {validateTotalAmount, validateTotalAmountUpdate, totalAmountModel} = require('../model/totalAmount')
const verifyToken = require('../utils/verifyToken')
const amountControllers = require('../controllers/totalAmount')
const userControllers = require('../controllers/user')
const { totalAmountUpdate } = require('../controllers/totalAmount')

// ================Add total amount ===================
router.post("/totalAmount", verifyToken, async (req, res) => {
    try{
        console.log(req.body, 'body---------')
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

    }catch(error){
        return error
    }
})

// ================Add total amount update===================
router.put("/totalAmountUpdate", verifyToken, async (req, res) => {
    try{
        let {error} = validateTotalAmountUpdate(req.body)
        if(error){
            return res.status(400).json({
                status: 400,
                error: error.details[0].message
            })
        }
            let totalAmountUpdate = await amountControllers.totalAmountUpdate(req.body._id, req.body)
            totalAmountUpdate.createdAt = undefined
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
router.get("/getTotalAmount/:userId", verifyToken, async (req, res) => {
    try {   
        if(!req.params.userId){
            res.status(400).json({
                status: 400,
                error: "userId not valid",
                data: null
            })
        }
        let getTotalAmount = await amountControllers.getTotalAmount(req.params.userId)
        if(getTotalAmount.length < 1){
            res.status(400).json({
                status: 400,
                error: "No exist amount of this user",
                data: null
            })
        }
        let resData = {
            _id: getTotalAmount[0]._id,
            totalAmount: getTotalAmount[0].totalAmount,
            createdAt: getTotalAmount[0].createdAt
        }
            res.status(200).json({
                status: 200,
                error: null,
                data: resData
            })
    }catch(error){
        return error
    }
})

module.exports = router