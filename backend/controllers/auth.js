const User = require("../models/User");

const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      //add for frontend
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      //end for frontend
      token,
    });
};

//@desc     Register user
//@route    POST /api/v5/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, tel, email, password, role } = req.body;

    //Create user
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
    });

    // sendTokenResponse(user, 200, res);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
    if (err.name === "ValidationError") {
      console.error(
        Object.values(err.errors).map((val) => {
          return { [val.path]: val.message };
        })
      );
    }
    // console.error(err.errors.message);
  }
};

//@desc     Login user
//@route    POST /api/v5/auth/login
//@access   Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: `Please provide an email and password` });
    }

    //Check for user
    const user = await User.findOne({ email }).select(`+password`);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: `Invalid credentials` });
    }

    //Check if password is matched
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json({ success: true, data: user });
};

exports.logout = async (req, res, next) => {
  // res.cookie("token", "", {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  //   sameSite: "none",
  //   secure: process.env.NODE_ENV === "production",
  // });

  res.clearCookie("token");

  res.status(200).json({
    success: true,
  });
};
