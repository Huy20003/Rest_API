const jwt=require("jsonwebtoken");



const middlewareController={
    verifyToken: (req,res,next)=>{
        const authHeader =req.headers.authorization;
        if(authHeader){
            const accessToken=authHeader.split(" ")[1];
            jwt.verify(accessToken, process.env.Token_Access_Key,(err,user)=>{
                if(err){
                    return   res.status(403).json("Token không hợp lệ");
                }
                req.user=user;
                next();
            });

        }
        else{
           return res.status(401).json("You're not authenticated");
        }
    },

    veryTokenAndAdminAuth:(req,res,next)=>{
        middlewareController.verifyToken(req,res,()=>{
            if(req.user.id=req.params.id||  req.user.role== "admin")
                {
                    
                    next(); 
                }else{
                   return res.status(403).json("Bạn không có quyền thực hiện điều này");
                }
        });
    }
   

}

module.exports=middlewareController;