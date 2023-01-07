const express = require("express");
const errorHandler = require("../../middleware/error");
const User = require("../../models/user");
const { generateAuthToken, generateHash, compareHash } = require("../../utils/helpers");
const createUserSchema = require("./validationSchema");
const authHandler = require("../../middleware/auth");
const { FormateUserObj } = require("./UserFormatter");
const {sendVerificationEmail} = require("./email")
const router = express.Router();
 require("../../utils/helpers");

//get all users
router.get(
  "/",
  errorHandler(async (req, res) => {
    if(req.headers.limit !== undefined){
      const limit = req.headers.limit;
      const skip = req.headers.skip;
      const users = await User.find()
    .limit(limit).skip(skip).sort({username: 1});
    res.status(200).send(users);
    }
     else
     {
      const users = await User.find().sort({username: 1})
      res.status(200).send(users);
    }
    
  })
);
//Veiw profile of a specific user
router.get(
  "/:userId/viewprofile", authHandler,
  errorHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });
    const UserObj = FormateUserObj(user);
    res.status(200).send({
      status: true,
      message: "user found successfully",
      data: UserObj,
    });
  })
);
//login a user
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }
  const isPasswordValid = compareHash(req.body.password, user.password)

  if (!isPasswordValid) {
    return res.status(400).send({ message: "Invalid Email or Password" });
  }

  const token = generateAuthToken({
    username: user.username,
    email: user.email
  });
  // user.token = token;
  await User.findOneAndUpdate({ _id: user._id}, {token : token})
  console.log("this is your tokens",token)
  const UserObj = FormateUserObj(user);
  res.status(200).send(
    {
       message: "success", token, user ,
       data: UserObj,
  }
    );
 
});
//sign up
router.post("/signup", async (req, res) => {
  const payload = req.body;
  const { error } = createUserSchema(payload);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  payload.password = generateHash(payload.password);
  console.log(payload)
  let user = new User(payload);
  const token = generateAuthToken({
    username: user.username,
    email: user.email
  });
  // payload.token = token
  user = await user.save();
  await User.findByIdAndUpdate({ _id: user._id}, {token : token})
  const UserObj = FormateUserObj(user);
  //to send verification code
  sendVerificationEmail(payload.email, token)
  res
    .status(200)
    .send({ status: true, message: "Signup successfully!", UserObj, token});

});

//edit profile of a user
router.put("/:userId/editprofile",authHandler,async (req,res)=>{

  console.log ('body', req.body ,req.params.userId)

    try {
        const user = await User.findOneAndUpdate({_id: req.params.userId}, req.body);
        console.log('json',user)
        res.json({ data: user, status: "success" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
//delete a user
router.delete("/:userId/deleteuser",authHandler,async (req,res)=>{

  try {
      const user = await User.findByIdAndDelete(req.params.userId);
      res.json({ data: user, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//logout
router.get(
  "/logout",
  authHandler,
  errorHandler(async (req, res) => {
    const user = await User.findOne({ token: req.headers.token });
    await User.findOneAndUpdate({ _id: user._id }, { token: "" });
    res.status(200).send({
      status: true,
      message: "Logout successfully",
    });
  })
);
//VERIFICATION END POINT
// app.post('/sendverify', async (req, res) => {
//   // Generate a random verification code
//   let verificationCode = Math.floor(Math.random() * 1000000);

//   // Save the code, email, and verification status in the database
//   await User.create({
//     email: req.body.email,
//     verificationCode: verificationCode,
//     isVerified: false
//   });

//   // Send the verification email
//   await sendVerificationEmail(req.body.email, verificationCode);

//   // Return a success message
//   res.send({ message: 'Verification email sent' });
// });


module.exports = router;
