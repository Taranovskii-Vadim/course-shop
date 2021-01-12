const { Router } = require("express");

// Models
const Course = require("../models/course");

const { mapCartItems, calculateTotalPrice } = require("./helpers");

const router = Router();

router.get("/", async (req, res) => {
  const user = await req.user.populate("cart.courseId").execPopulate();
  const items = mapCartItems(user.cart);
  res.render("cart", {
    title: "Корзина",
    isCart: true,
    cart: {
      items,
      totalPrice: calculateTotalPrice(items),
    },
  });
});

router.delete("/remove/:id", async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.courseId").execPopulate();
  const items = mapCartItems(user.cart);
  res.json({ items, totalPrice: calculateTotalPrice(items) });
});

router.post("/add", async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/cart");
});

module.exports = router;
