import errorHandler from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  const user = req.user;

  if (user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    if (req.body.password) {
      const salt = bcrypt.genSaltSync();
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req,res,next) => {
  const user = req.user;

  if (user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try{
    await User.findByIdAndDelete(req.params.id)

    res.clearCookie('access_token')
    res.status(200).json("User deleted successfully")
  }
  catch(error){
    next(error)
  }
}