const {totalAmountModel} = require('../model/totalAmount')
const { UserModel } = require('../model/user')

const amountControllers = {
    // =====================check user amount===========
    checkUserAmount: async (id) => {
        try{
            let amount = await totalAmountModel.find({userId: id})
            console.log(amount, 'amount===')
            return amount
        }catch(error){
            return error
        }
    },

    // =====================update total amount=============
    totalAmountUpdate: async (id, updateData) => {
        try{
            let previousAmount = await totalAmountModel.findOneAndUpdate(
                {_id: id},
                {$set: updateData},
                {new: true}
                )
            return previousAmount
        }catch(error){
            return error
        }
    },

    // ===================add total amount =================
    totalAmount: async (data) => {
    try{
        let amount = await new totalAmountModel(data).populate('userId')
        amount.createdAt = new Date()
        await amount.save()
        return amount
    }catch(error){
        return error
    }
   },

//    ===============checking valid user Id============
    getTotalAmount: async (id) => {
        try{
            let amount = await totalAmountModel.find({userId: id}).populate('userId');
            return amount
        }catch(error){
            console.log(error, 'errro')
            return error
        }
    }

}

module.exports = amountControllers