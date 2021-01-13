const { Router } = require("express");
const order = require("../models/order");

// models
const Order = require("../models/order");

// MiddleWares
const isProtectedRoute = require("../middlewares/isProtectedRoute");

const router = Router();

router.get("/", isProtectedRoute, async (req, res) => {
  try {
    const data = await Order.find({ userId: req.user.id })
      .populate("userId")
      .populate("courses.courseId");

    res.render("orders", {
      title: "Мои заказы",
      isOrders: true,
      orders: data.map(item => ({
        id: item._id,
        date: item.date,
        price: item.courses.reduce(
          (acc, val) => (acc += val.count * val.courseId.price),
          0
        ),
        user: {
          name: item.userId.name,
          email: item.userId.email,
        },
        courses: item.courses.map(c => ({
          title: c.courseId.title,
          count: c.count,
        })),
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", isProtectedRoute, async (req, res) => {
  try {
    const user = await req.user.populate("cart.courseId").execPopulate();
    const order = new Order({
      userId: req.user,
      courses: user.cart.map(item => ({
        count: item.count,
        courseId: item.courseId,
      })),
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
