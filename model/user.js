const mongoose  = require('mongoose')
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        default: ""
      },
      lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        default: ""
      },
    email: {
        type: String,
        required: true,
        default: ""
    },
    password: {
        type: Object,
        required: true
    },
    jwtToken: {
        jwtToken: {type: String, default: ""},
        createdAt: {type: Date}
    },
    loggedDevices: [
        {   
            deviceId: {type: String, required: true,default: ""},
            jwtToken: {
                jwtToken: {type: String, default: ""},
                createdAt: {type: Date}
            }
        }
    ],
    userRole: {
        type: Number,
        default: 0,
    },
    forgetPasswordToken: {
        type: String, default: "",
    },
    forgetPasswordTime: {
        type: Number,
    },
    userId: {
        type: String, default: ""
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
        password: Joi.string().required().min(8).max(20),
        deviceId: Joi.string().required()
    })
    return schema.validate(user)
}

exports.UserModel = UserModel;
exports.validateSignup = validateSignup
exports.validateSignin = validateSignin