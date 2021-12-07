const express = require("express")
const router = express.Router()
const {validateAddCategory} = require('../model/categories')
const verifyToken = require("../utils/verifyToken")
const categoryControllers = require("../controllers/categories")
const { deleteCategory } = require("../controllers/categories")

// ===================Add category ================
router.post("/addCategory", verifyToken, async (req, res) => {
    try{
        let {error} = validateAddCategory(req.body)
        if(error){
           return res.status(400).json({
                status: 400,
                error: error.details[0].message,
                data: null
            })
        }

        let categoryres= await categoryControllers.addCategory(req.body)
        return res.status(200).json({
            status: 200,
            error: null,
            data: categoryres
        })
    }catch(error){
        return error
    }
})

// =======================Get all categories===================
router.get("/getAllCategory/:userId", verifyToken, async(req, res) => {
    try{
        let category = await categoryControllers.getAllCatedgories(req.params.userId)   
        res.status(200).json({
            state: 200,
            error: null,
            data: category
        })
    }catch(error){
        return error
    }
})

// ===============Update category==============
router.put("/updateCategory", verifyToken, async (req, res) => {
    try{
        let updatedCategory = await categoryControllers.updateCategory(req.body._id, req.body)
        // updatedCategory.createdAt = undefined
        res.status(200).json({
            status: 200,
            error: null,
            data: updatedCategory
        })
    }catch(error){
        return error
    }
})

// ===============Delete category==============
router.get("/deleteCategory/:id", verifyToken, async (req, res) => {
    try{
        let deletedCategory = await categoryControllers.deleteCategory(req.params.id)
        res.status(200).json({
            status: 200,
            error: null,
            message: "Remove successfully",
            data: deletedCategory
        })
    }catch(error){
        return error
    }
})

module.exports = router