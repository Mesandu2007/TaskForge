const router=require('express').Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const passport= require('passport');
const crypto = require('crypto');



router.post('/register', async(req,res)=>{
    try {
        const {email, password, name} = req.body;

        const exists=await User.findOne({email});
        if(exists){
            return res.status(400).json({message:"User exists"});
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({email, password: hashed, name});
        await user.save();
        res.status(201).json({message:"User created"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async(req,res)=>{
    try {
        const{email, password} = req.body;

        const user=await User.findOne({email});
        if(! user){
            return res.status(400).json({message: "User not found"});
        }
        const valid=await bcrypt.compare(password,user.password);
        if(!valid){
            return res.status(400).json({message: "Wrong password"});
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not defined" });
        }

        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);
        res.json({ token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name },
      process.env.JWT_SECRET
    );

    
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);





const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("User not found");

        const token = crypto.randomBytes(32).toString('hex');

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; 
        await user.save();

        const resetLink = `http://localhost:5173/reset/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Todo App Password Reset',
            html: `<p>You requested a password reset.</p>
                   <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
                   <p>This link will expire in 1 hour.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.send("Reset link sent to your email");
    } catch (error) {
        console.error("SMTP Error Details:", error);
        res.status(500).send(`Error sending email: ${error.message}`);
    }
});


router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).send("Invalid or expired token");

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.send("Password reset successful");
});






module.exports=router;
