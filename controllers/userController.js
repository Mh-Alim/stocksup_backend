const User = require("../models/User");

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("login ", email, password);

  // checking if the user has name and password both

  if (!email || !password) {
    return next(new ErrorHandler("Fill the empty Fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Enter valid email or password", 400));
  }

  const isPasswordMatched = await user.passwordMatched(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Enter valid email or password", 400));

  sendToken(user, 200, res);
});



// Register a user

exports.registerUser = catchAsyncErrors( async(req,res,next)=>{

    const { name , email, password,cpassword} = req.body;
    console.log(name,email,password,cpassword);
    if(!name || !email || !password || !cpassword){
        return next(new ErrorHandler("Fill the empty Fields",400));
    }

    if(password !== cpassword) return next(new ErrorHandler("Password not matched",400));
    
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width:150,
        crop : "scale"
    })
    const user = await User.create({
        name,email,password,
        avatar: {
            public_id : myCloud.public_id,
            url : myCloud.secure_url
        }
    });
    sendToken(user,201,res);
});

