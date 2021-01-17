module.exports = function (req, res, next) {
  if (!req.session.isSignIn) {
    return res.redirect("/auth/login");
  }
  next();
};
