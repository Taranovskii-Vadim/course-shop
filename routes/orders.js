const { Router } = require("express");

const router = Router();

router.get("/", async (req, res) => {
  res.render("orders", {
    title: "Мои заказы",
    isOrders: true,
  });
});

module.exports = router;
