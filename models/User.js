const { Schema, model } = require('mongoose');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      max_length: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    
    thoughts: [
      {type: Schema.Types.ObjectId,
        ref: 'thought',
      }
    ],

    friends: [
      {type: Schema.Types.ObjectId,
        ref: 'user',
        default: [] 
      }
    ],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends ? this.friends.length : 0;
});

const User = model('user', userSchema);

module.exports = User;
