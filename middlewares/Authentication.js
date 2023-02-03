const User = require("../models/userModel");

exports.isAuthenticate = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookie;

  if (!token) {
    return next(new ErrorHandler("Login to access this resource", 401));
  }

  const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedData) return res.status(400).json({
        error : "Incorrect token"
  })
  req.user = await User.findById(decodedData.id);
  next();
});

exports.AuthorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        error: "You are not allowed to access this resource",
      });
    }

    next();
  };
};
