import Code from "../models/codeModel.js";

// Login User
const loginUser = async (req, res, next) => {
  const { code, name } = req.body;
  console.log("login ", code, name);

  // checking if the user has name and password both

  if (!code || !name) {
    return res.status(400).json({
      message: "Fill the empty fields",
    });
  }

  const user = await Code.findOne({ code });
  console.log(user);

  if (!user) {
    return res.status(400).json({
      message: "Invalid Code",
    });
  }

  user.name = name;
  user.isActive = true;
  await user.save();
  const token = await user.getJWTToken();

  res.status(200).json({
    success: true,
    info: user,
    token,
  });
};

const alredyLoggedIn = async (req, res) => {
  res.status(200).json({
    success: true,
  });
};
export { loginUser, alredyLoggedIn };
