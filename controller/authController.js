const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const validateInput = (data) => {
    const usernamePattern = /^[a-zA-Z0-9]{3,30}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9]{6,30}$/;
    const phonePattern = /^[0-9]{10,15}$/; 
  
    if (!usernamePattern.test(data.username)) {
      return "Username must be alphanumeric and between 3 to 30 characters.";
    }
    if (!emailPattern.test(data.email)) {
      return "Invalid email format.";
    }
    if (!passwordPattern.test(data.password)) {
      return "Password must be alphanumeric and between 6 to 30 characters.";
    }
    if (!phonePattern.test(data.phone)) {
      return "Phone number must be numeric and between 10 to 15 digits.";
    }
    if (!data.address) {
      return "Address is required.";
    }
    return null;
  };


  

  


const authController={
    registerUser: async(req,res)=>{

        // Kiểm tra hợp lệ dữ liệu đầu vào
    // const validationError = validateInput(req.body);
    // if (validationError) {
    //   return res.status(400).json({ message: validationError });
    // }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed= await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                phone: req.body.phone,
                address: req.body.address,
                role: req.body.role || 'user' // Mặc định là 'user' nếu không truyền role
              });

              // save to DB

              const user =await newUser.save();
              res.status(200).json(user);


        }catch(err){
            res.status(500).json(err);
        }

    },
    //Generate access token
    generateAccessToken:(user)=>{
      return jwt.sign({
        id: user.id,
        role: user.role,
      },
      process.env.Token_Access_Key,{expiresIn:"30d"}
    );
  },
  generateRefressToken:(user)=>{
    return jwt.sign({
      id: user.id,
      role: user.role,
    },
    process.env.Token_Refress_Key,{expiresIn:"30d"}
  );

  },
  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
  
    jwt.verify(refreshToken, process.env.Token_Refress_Key, (err, user) => {
      if (err) return res.status(403).json("Refresh token is not valid!");
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefressToken(user);
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },


    

    loginUser:async(req,res)=>{
        try{
            const user=await User.findOne({username: req.body.username});
                if(!user){
                     return res.status(404).json({ message: "Sai username" });
                }
                const validPassword=await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if(!validPassword){
                   return  res.status(404).json({ message: "Sai password" });
                }
                if(user && validPassword){
                 const accessToken= authController.generateAccessToken(user);
                 const refreshToken=authController.generateRefressToken(user);
              const {password,...others}=user._doc;

                    res.status(200).json({...others,accessToken,refreshToken});
                }
            }
            
            catch(err){
               return  res.status(500).json(err);
            }

        },
        updateUser:async(req,res)=>{
          try{
            const { userId } = req.params;
            const {username,email,phone,adrress}=req.body;
             const updateData={username,email,phone,adrress};
             const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
             if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            res.json(user);

          }catch(err)
          {
            res.status(500).json({ message: 'Internal server error', error });

          }
          
        },
    
};

module.exports=authController;