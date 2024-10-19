const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const cors = require('cors'); 
const authRoute=require("./routes/auth");
const userRoute=require("./routes/User");
const categoriesRoute=require("./routes/category");
const productRoute=require("./routes/product");
const cartRoute=require("./routes/cart");
const restaurantRoute=require("./routes/restaurant");
const fs = require('fs');
const path = require('path');



dotenv.config();
const app =express();


app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use("/food/auth", authRoute);
app.use("/food/user",userRoute);
app.use("/food/categories",categoriesRoute);
app.use("/food/product",productRoute);
app.use("/food/cart",cartRoute);
app.use("/food/restaurant",restaurantRoute);



const connectToMongo = async () => {
   try {
     await mongoose.connect(process.env.MONGOODB_URL);
      
     console.log("Connected to MongoDB");
   } catch (error) {
     console.error("Error connecting to MongoDB", error);
     process.exit(1); // Exit the process with failure
   }
 };
 
 connectToMongo();
 const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
