const express = require("express")
const router = express.Router()
const {validateSignup, validateSignin, UserModel} = require('../model/user')
const userControllers  = require("../controllers/user")
const jwt = require('jsonwebtoken')
const verifyToken = require("../utils/verifyToken")
const nodemailer = require("nodemailer");

router.post('/signup', async (req, res) => {
  try{
    // ========firstly Checking validation on front end user==============
    const {error} = validateSignup(req.body);
    if(error){
      return res.status(400).json({
        status: 400,
        data: null,
        error: error.details[0].message
      })
    }

    //  ==========Check user in db by email============
    let user = await userControllers.userExistingByEmail(req.body.email)
    console.log("user============", user)
    if(user){
      return res.status(400).json({
        status: 400,
        data: null,
        error: "user already exist"
      })
    }
    
    let userObject = {...req.body}
    userObject.password = await userControllers.passwordEncryption(req.body.password) //Password encryption
    // ===============Add user in database================    
    await userControllers.createUser(userObject)
    return res.status(200).json({
      status: 200,
      data: userObject,
      error: null
    });
  }catch(error) {
    return res.status(400).json({
      status: 400,
      data: null,
      error: error,
    });
  }
})



// =================LOGIN============
router.post("/signin", async (req, res) => {
  try{
    let {error} = validateSignin(req.body)
    if(error){
      return res.status(400).json({
        status: 400,
        data: null,
        error: error.details[0].message
      })
    }
    let existUser = await userControllers.userExistingByEmail(req.body.email);
    if(!existUser){
      return res.status(400).json({
        status: 400,
        data: '',
        error: "Email or password incorrect"
      })
    }
    let encryptionPassword = await userControllers.passwordDecryption(existUser.password, req.body.password);
    if(!encryptionPassword){
      return res.status(400).json({
        status: 400,
        data: '',
        error: "Email or password incorrect"
      })
    }
    let jwtToken = jwt.sign({_id: existUser._id}, process.env.TOKEN_KEY)
    let tokenDetail = {
      jwtToken: jwtToken,
      createdAt: Date.now()
    }
    let loggedDevice = {
      jwtToken: tokenDetail,
      deviceId: req.body.deviceId
    }
    existUser.jwtToken = tokenDetail
    existUser.loggedDevices.push(loggedDevice)
    await userControllers.updateUserToken(existUser);
    delete existUser.firstName
    res.cookie('jwtToken', jwtToken, {httpOnly: true})
    console.log(existUser, 'user---------------------------')
   return res.status(200).json({
      status: 200,
      data: existUser,
      error: null
    })
  }catch(error){
    return res.status(400).json({
      status: 400,
      data: null,
      error: error
    })
  }
})

// =======================Log out=================
router.post("/logout", verifyToken, async (req, res) => {
  // clear the cookie
  try{
    let user = await userControllers.getUserById(req.body._id)
    // Remove deviceId
    let deleteIndex = user.loggedDevices.findIndex(item => item.deviceId == req.body.deviceId)
    user.loggedDevices.splice(deleteIndex, 1)
    // Update database
    await userControllers.updateUserProfile(req.body._id, user)
    res.status(200).json({
      status: 200,
      error: null,
      data: "Logout successfully"
    })
  }catch(error){
    return res.status(400).json({
      status: 400,
      data: null,
      error: error
    })
  }
});

// ===================UPdate user profile===================
router.put("/updateProfile", verifyToken, async (req, res) => {
  try{
    let user = await userControllers.getUserById(req.body._id)
    if(!user){
      res.status(400).json({
        status: 400,
        data: null,
        error: "User not found"
      })
    }
    let userObject = {...req.body}
      userObject.firstName = req.body.firstName
      userObject.lastName = req.body.lastName
    let updateUser = await userControllers.updateUserProfile(req.body._id, userObject)
    res.status(200).json({
      status: 200,
      data: updateUser,
      error: null
    })
  }catch(error){
    return error
  }
})

// ================= reset password ===============
router.post('/resetPassword', async (req, res) => {
  try{
    let user = await userControllers.userExistingByEmail(req.body.email)
    if(!user){
      res.status(400).json({
        status: 400,
        data: null,
        error: "User not found"
      })
    }
    user = await userControllers.forgetPasswordToken(req.body.email)

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.MAIL_HOST_USER,
      to: req.body.email,
      subject: "Title",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n 
      Please click on the following link, or paste this into your browser to complete the process:\n\n 
      http://localhost:4000/api/users/getresetpassword/${user.forgetPasswordToken} \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    }
    
    transporter.sendMail(mailOptions, async (error, data) => {
      if(error){
        res.status(400).json({
          status: 400,
          data: null,
          error: error
        })
      }else{
        res.status(200).json({
          status: 200,
          data: mailOptions,
          error: null
        })

      }
    })
  }catch(error){
    return error
  }
})

// ==================checking user verify by token=================
router.get("/getResetPasswordToken/:token", async (req, res) => {
  try{
    let user = await userControllers.getForgetPasswordToken(req.params.token)
    if(!user){
      res.status(400).json({
        status: 400,
        data: null,
        error: "User not found"
      })
    }
    let tokenTime = user.forgetPasswordTime
    let currentTime = Date.now()
    let expiryTime = Math.floor((currentTime - tokenTime)/1000/60)
    console.log(expiryTime, 'time')
    if(expiryTime >= 15){
      res.status(400).json({
        status: 400,
        data: null,
        error: "Password reset token is invalid or expired"
      })
    }
    res.status(200).json({
      status: 200,
      data: "token is valid",
      error: null
    })
  }catch(error){
    return error
  }
})

router.post("/changePassword/:token", async (req, res) => {
    try{
      let user = await userControllers.getForgetPasswordToken(req.params.token)
      if(!user){
        res.status(400).json({
          status: 400,
          data: null,
          error: 'User not found'
        })
      }
      let tokenTime = user.forgetPasswordTime
      let currentTime = Date.now()
      let expiryTime = Math.floor((currentTime - tokenTime)/1000/60)
      if(expiryTime >=15){
        res.status(400).json({
          status: 400,
          data: null,
          error: 'Password reset token is invalid or expired'
        })
      }
      let password = await userControllers.passwordEncryption(req.body.password)
      userControllers.changeUserPasswordByToken(password, req.params.token)
      res.status(200).json({
        status: 200,
        data: "Password changed",
        error: null
      })
    }catch(error){
      return error
    }
  })


module.exports = router