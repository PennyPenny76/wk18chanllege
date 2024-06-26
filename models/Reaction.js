const { Schema, Types } = require('mongoose');
const user = require('./User'); 

// Schema to create a course model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 0,
    },

    username: {
      type: String,
      required: true,
    },

    userID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => new Date(timestamp).toLocaleString('en-US', { timeZone: 'UTC' }),
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);


module.exports = reactionSchema;
