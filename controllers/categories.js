const {categoriesModel} = require('../model/categories')
const {UserModel} = require("../model/user")

const categoryControllers = {


    // ===================add category===============
    addCategory: async (data) => {
       try{
            let category = await new categoriesModel(data)
            category.updatedAt = undefined
            category.createdAt = new Date()
            category.save()
            return category
       }catch(error){
           return error
       }
   },

    //    ======================get all category=============
    getAllCatedgories: async (id) => {
        try{
            let getCategory = await categoriesModel.find({userId: id})
            return getCategory
        }catch(error){
            return error
        }
    },

    //    ======================update category=============
    updateCategory: async (id, updateData) => {
        try{
            let updatedCategory = await categoriesModel.findOneAndUpdate(
                {_id: id},
                {$set: updateData},
                {new: true}
            )
            return updatedCategory
        }catch(error){
            return error
        }
    },

     //    ======================Delete category=============
     deleteCategory: async (id) => {
        try{
            let deletedCategory = await categoriesModel.findOneAndRemove({_id: id})
            return deletedCategory
        }catch(error){
            return error
        }
    }
}

module.exports = categoryControllers