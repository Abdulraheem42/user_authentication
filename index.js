const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoute')
const amountRouter = require('./routes/amountRoute')
const categoryRouter = require('./routes/categoriesRoute')
dotenv.config()


// ===========CONNECTION==========
mongoose.connect(process.env.MONGO_URI,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true,})
    .then(() => {
        console.log('Database successfully connected....')
    })
    .catch((err) => {
        console.log('Datebase not connected due to >',err)
    })


// ==============Middlewares=============
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/user', userRouter)
app.use('/api/amount', amountRouter)
app.use('/api/category', categoryRouter)
// =========Server running============
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})



