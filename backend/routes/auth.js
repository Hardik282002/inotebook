const express = require("express");
const user = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt=require("bcryptjs");
const fetchuser=require("../middleware/fetchuser")
const jwt=require("jsonwebtoken");

const JWT_SEC="hardikisverysmartandintelligentb$oy";
// ROUTE 1 creating a new user using post /api/auth/createuser no login required 
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there are bad request show error
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    // check whetehr the email already exist
    try {
      let User = await user.findOne({ email: req.body.email });
      // console.log(User);
      if (User) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "This email is already registered" });
      }
    //   bcrypting the password
    const salt=await bcrypt.genSalt(10);
    const secpass=await bcrypt.hash(req.body.password,salt)
    //   create a new user

      User = await user.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      const data={
        user:{
            id:user.id
        }
      } 
      const token = jwt.sign(data, JWT_SEC);
     success=true;
      res.json({success,token});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
//  ROUTE 2: authenticate the user using post /api/auth/login no login required
  })
router.post(
    "/login",
    [
      body("email","enter a valid email").isEmail(),
      body("password","password cannot be blank").exists()
    ],
    async (req, res) => {
      // if there are bad request show error
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {email,password}=await req.body;
      try {
        const User=await user.findOne({email}).select("+password");
        if(!User){
          let success=false;
          return  res.status(400).json({success,error:"please enter correct login credentials"});
        }
        const passwordcompare=await bcrypt.compare(password,User.password);
        if(!passwordcompare){
          let success=false;
            res.status(400).json({ success,error:"please enter correct login credentials"}); 
        }
        //   if password matches then i will send this data
        const data={
            user:{
                id:user.id
            }
          } 
          const token = jwt.sign(data, JWT_SEC);
          let success=true
          res.json({success,token});
     } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
      
     }
  
})

//  ROUTE 3: get loggedin user details using post /api/auth/getuser  login required
router.post(
    "/getuser",fetchuser, async (req, res) => {
     try {
         const userid=req.user.id;
        let User=await user.findById(userid);
        return res.send(User);
        // console.log(User);     
     } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
      
     }
    })
module.exports = router

