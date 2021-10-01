const {categoriesModel} = require('../model/categories')
const {UserModel} = require("../model/user")

const categoryControllers = {


    // ===================add category===============
    addCategory: async (data) => {
       try{
            let category = await new categoriesModel(data)
            // category.createdAt = new Date()
            category.save()
            return category
       }catch(error){
           return error
       }
   },

//    ======================get all category=============
    getAllCatedgories: async (id) => {
        try{
            let getCategory = await categoriesModel.find({userId: id}).populate('userId')
            return getCategory
        }catch(error){
            return error
        }
    }
}

module.exports = categoryControllers