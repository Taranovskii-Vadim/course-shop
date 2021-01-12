const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Order", OrderSchema);
