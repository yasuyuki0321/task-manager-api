const mongoose = require('mongoose')
const validater = require('validator')

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
