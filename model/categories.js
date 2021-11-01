const mongoose = require('mongoose')
const Joi = require('joi')

const categoriesSchema = new mongoose.Schema({
    categoryName:{
        type: String
    },
    categoryIcon: {
        type: String
    },
    categroyBgColor: {
        type: String
    },
    categoryAmount:{
        type: Number
    },
    categoryItem: {
        type: String
    },
    description: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "user"
    }
})

const categoriesModel = mongoose.model("categories", categoriesSchema)

validateAddCategory= (data) => {
    const schema = Joi.object({
        categoryAmount: Joi.number().required(),
        categoryIcon: Joi.string(),
        categroyBgColor: Joi.string(),
        categoryName: Joi.string().required().min(3).max(12),
        categoryItem: Joi.string().required().min(3).max(20),
        userId: Joi.string().required()
    })
    return schema.validate(data)
}


exports.categoriesModel = categoriesModel
exports.validateAddCategory = validateAddCategory