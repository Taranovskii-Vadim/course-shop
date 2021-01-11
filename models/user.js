const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      count: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

module.exports = model("User", UserSchema);
