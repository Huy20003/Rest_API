const User = require("../models/user");



const userController={
    //get all user

    getAlluser: async (req, res)=>{
        try{
            const user=await User.find();
            res.status(200).json(user);

        }catch(err){
            res.status(500).json(err);
        }
    },

    // delete user

    deleteUser: async(req,res)=>{
        try{
            const user= await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Xóa user thành công");




        }catch(err){
            res.status(500).json(err);

        }
    },

    // updateUser:async(req,res)=>{
    //     try{
    //         const
    //     }
    // }
}
module.exports=userController;