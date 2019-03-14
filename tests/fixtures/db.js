const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneID = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneID,
  name: 'Yasuyuki Kikuchi',
  email: 'yasuyuki0321@gmail.com',
  password: 'pass123',
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }
  ]
}

const userTwoID = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoID,
  name: 'Noriko Kikuchi',
  email: 'notiko@example.com',
  password: 'abcd123',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET)
    }
  ]
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOne._id
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwo._id
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()

  await User(userOne).save()
  await User(userTwo).save()

  await Task(taskOne).save()
  await Task(taskTwo).save()
  await Task(taskThree).save()
}

module.exports = {
  userOneID,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
}
