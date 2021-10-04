const mongoose = require("mongoose")
const Joi = require('joi')

const totalAmountSchema = new mongoose.Schema({
    totalAmount:{
        type: Number,
    },
    createdAt: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        minLength: 20,
        maxLength: 100
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

const totalAmountModel = mongoose.model("totalAmount", totalAmountSchema)

validateTotalAmount = (data) => {
    const schema = Joi.object({
        totalAmount: Joi.number().required(),
        userId: Joi.string().required()
    })
    return schema.validate(data)
}

validateTotalAmountUpdate = (data) => {
    const schema = Joi.object({
        totalAmount: Joi.number().required(),
        userId: Joi.string().required(),
        _id: Joi.string().required()
    })
    return schema.validate(data)
}


exports.totalAmountModel = totalAmountModel
exports.validateTotalAmount = validateTotalAmount
exports.validateTotalAmountUpdate = validateTotalAmountUpdate
