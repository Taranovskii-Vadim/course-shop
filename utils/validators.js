const { body } = require("express-validator");
const crypt = require("bcryptjs");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Пользователь уже существует");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Введите корректный пароль")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли должные совпадать");
      }
      return true;
    })
    .trim(),
  body("name", "Имя слишком короткое").isLength({ min: 2 }),
];

exports.loginValidators = [
  body("email", "Введите корректный email")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject("Пользователь не существует");
        }
        const isSame = await crypt.compare(req.body.password, user.password);
        if (!isSame) {
          return Promise.reject("Неверный пароль");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Введите корректный пароль")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
];
