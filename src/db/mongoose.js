const mongoose = require('mongoose')
const validater = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
})
