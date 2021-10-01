const mongoose  = require('mongoose')
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
      },
    email: {
        type: String,
        required: true
    },
    password: {
        type: Object,
        required: true
    },
    jwtToken: {
        jwtToken: {type: String},
        createdAt: {type: Date}
    },
    loggedDevices: [
        {   
            deviceId: {type: String, required: true},
            jwtToken: {
                jwtToken: {type: String},
                createdAt: {type: Date}
            }
        }
    ],
    userRole: {
        type: Number,
        default: 0,
    },
    forgetPasswordToken: {
        type: String,
    },
    forgetPasswordTime: {
        type: Number,
    },
    userId: {
        type: String
    }
})

const UserModel = mongoose.model("user", userSchema);

// ============ validations================
validateSignup = (user) => {
    const schema = Joi.object({
      firstName: Joi.string().required().min(3).max(20),
      lastName: Joi.string().required().min(3).max(20),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(20),
    });
    return schema.validate(user);
  };

validateSignin = (user) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required().min(8).max(20)
    })
    return schema.validate(user)
}

exports.UserModel = UserModel;
exports.validateSignup = validateSignup
exports.validateSignin = validateSignin