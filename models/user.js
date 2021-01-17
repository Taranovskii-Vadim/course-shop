const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  password: {
    type: String,
    required: true,
  },
  avatarUrl: String,
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

UserSchema.methods.addToCart = function (course) {
  const cart = [...this.cart];
  const idx = cart.findIndex(
    item => item.courseId.toString() === course._id.toString()
  );

  if (idx >= 0) {
    cart[idx].count++;
  } else {
    cart.push({
      courseId: course._id,
      count: 1,
    });
  }

  this.cart = [...cart];
  return this.save();
};

UserSchema.methods.removeFromCart = function (id) {
  let cart = [...this.cart];
  const idx = cart.findIndex(
    item => item.courseId.toString() === id.toString()
  );

  if (cart[idx].count > 1) {
    cart[idx].count--;
  } else {
    cart = cart.filter(item => item.courseId.toString() !== id.toString());
  }

  this.cart = [...cart];
  return this.save();
};

UserSchema.methods.clearCart = function () {
  this.cart = [];
  return this.save();
};

module.exports = model("User", UserSchema);
