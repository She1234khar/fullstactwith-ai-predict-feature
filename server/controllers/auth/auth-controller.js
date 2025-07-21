const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../../models/Users')

const registerUser=async(req,res)=>{
  try{
    const {userName,email,password}=req.body;
    if(!userName || !email || !password){
      return res.status(400).json({
        success:false,
        message:'All fields are required'
      })
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:'User already exists'
      })
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=new User({
      userName,
      email,
      password:hashedPassword,
      role: 'user' // Default role
    })
    await newUser.save();
    res.status(201).json({
      success:true,
      message:'User registered successfully',
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role
      }
    })
  }catch(error){
    console.log('Registration error:', error);
    res.status(500).json({
      success:false,
      message:'Internal server error'
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      })
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,         // Always true on Render
      sameSite: 'None',     // Important for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/', // path zaroori hai!
    });
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.log('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

const authMiddleware=async(req,res,next)=>{
  try{
    const token=req.cookies.token;
    if(!token){
      return res.status(401).json({
        success:false,
        message:'No token provided'
      })
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.userId);
    if(!user){
      return res.status(401).json({
        success:false,
        message:'Invalid token'
      })
    }
    req.user=user;
    next();
  }catch(error){
    console.log('Auth middleware error:', error);
    res.status(401).json({
      success:false,
      message:'Invalid token'
    })
  }
}

module.exports={registerUser,loginUser,logout,authMiddleware};


//2:41