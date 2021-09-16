const {UserModel} = require('../model/user')
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const crypto = require('crypto')
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);



const userControllers = {

    // ==========Check user in db by email============
    /**
   * existingUserByEmail - Check existing User by email Id.
   * @param email - email that need to check
   * @returns {Promise<void>}
   */
    userExistingByEmail: async (email) => {
        try{
            let user = await UserModel.findOne({email: email})
            return user
        }catch(error){
            return error
        }
    },
    // ===============Add user in database================
    createUser: async (object) => {
        try{
            let user = await new UserModel(object);
            await user.save();
            return user
        }catch(error){
            return error
        }
    },
    // =============password encryption============
    passwordEncryption: (password) => {
        try {
            const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
            const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
            return {
                iv: iv.toString('hex'),
                content: encrypted.toString('hex')
            };
          } catch (error) {
            return error;
          }
    },

    // =============password decryption============
    passwordDecryption: (hash) => {
        try {
            const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
            const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
            return decrpyted.toString();
          } catch (error) {
            return error;
          }
    },

    // ==============UPdate user token=============
    updateUserToken: async (userObj) => {
        try{
            let user = await UserModel.findById(userObj._id);
            userObj.save()
            await user.save()
            return user
        }catch(error){
            return error
        }
    },

    // ================Get User by id===========
    getUserById: async (id) => {
        try{
            let user = await UserModel.findById(id)
            return user
        }catch(error){
            return error
        }
    },

    // ==============Update user profile===========
    updateUserProfile: async (id, userObject) => {
        try{
            let updatedUser = await UserModel.findOneAndUpdate(
                {_id: id},
                {$set: userObject},
                {new: true}
            )
            return updatedUser
        }catch(error){
            return error
        }
    },

    // ===================get user by email============
    forgetPasswordToken: async (email) => {
        try{
            let user = await UserModel.findOne({email})
            let randomString = crypto.randomBytes(20).toString('hex');
            user.forgetPasswordToken = randomString
            user.forgetPasswordTime = Date.now()
            await user.save()
            return user
        }catch(error){
            return error
        }
    },

    // ================Checking valid user from data base by token============
    getForgetPasswordToken: async (token) => {
        try{
            let user = await UserModel.findOne({forgetPasswordToken: token})
            return user
        }catch(error){
            return error
        }
    },

    // ================Password change================
    changeUserPasswordByToken: async (password, token) => {
        try{
            console.log(password, 'password=====')
            let user = await UserModel.findOne({forgetPasswordToken: token})
            user.password = password
            user.save()
            return user
        }catch(error){
            return error
        }
    }

}

module.exports = userControllers