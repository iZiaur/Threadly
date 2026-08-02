const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const bcrypt=require("bcrypt");
const cloudinary=require("cloudinary").v2;
app.use(express.json());

app.use(cors())
require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connecting with mongodb
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.fjpmheu.mongodb.net/Ecommerce`);



//API Creation

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server Running");
});


app.get("/",(req,res)=>{
    res.send("Backend is running");
})

//Image Storage Engine — Use memory storage for Vercel (no disk access)
const storage=multer.memoryStorage();

const upload=multer({storage:storage})

// Upload endpoint — uploads to Cloudinary instead of local disk
app.post('/upload',upload.single('product'),async (req,res)=>{
    try{
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "ecommerce_products",
            resource_type: "image",
        });
        res.json({
            success:1,
            image_url: result.secure_url
        })
    }catch(error){
        console.error("Upload error:", error);
        res.status(500).json({success:0, message:"Image upload failed"});
    }
})


//Schema for Mongoose

const Product=mongoose.model(" Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    available:{
        type:Boolean,
        default:true
    },


})
//Adding new Products
app.post('/addproduct',async (req,res)=>{

    let products= await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;

    }else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,



    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json(
        {
            success:true,
            name:req.body.name
        }
    )
})

// Creating API for deletion

app.post("/removeproduct",async(req,res)=>{
   let obj= await Product.findOneAndDelete({id:req.body.id});
   if (obj) {
        res.json({
            success:1,
            name:obj.name
        })
   } else {
        res.json({ success:0, errors: "Product not found" })
   }
})



//Api for getting all products

app.get("/allproducts",async (req,res)=>{
    let products=await Product.find({});
    res.send(products);
})




const Users=mongoose.model("Users",{
    name:{type:String,
        
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object
    },
    Date:{
        type:Date,
        default:Date.now()
    }
})

//Api for user creation

app.post("/signup",async (req,res)=>{
    let check=await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,error:"Existing User Found with same email id"})
    }

    let cart={};
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    for(let i=0;i<=301;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:hashedPassword,
        cartData:cart,
    })

    await user.save();

    const data={
        user:{
            id:user.id
        }
    }

    const token=jwt.sign(data,process.env.JWT_SECRET || 'secret_ecom');
    res.json({
        success:true,
        token
    })
})  


// Api for User Login;

app.post('/login',async (req,res)=>{
    let user=await Users.findOne({email:req.body.email})
    if(user){
        const passcompare = await bcrypt.compare(req.body.password, user.password);
        if(passcompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,process.env.JWT_SECRET || 'secret_ecom');
            res.json({success:true,token});

        }else{
            res.json({success:false,errors:"Wrong password"});
        }
    } else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// API For New Collection data

app.get("/newcollections",async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    res.send(newcollection);
})

//api for popular category

app.get("/popularinwomen",async (req,res)=>{
    let products=await Product.find({category:"women"});
    let popularinwomen=products.slice(0,4);
    res.send(popularinwomen);
})

//api for related products
app.post("/relatedproducts", async (req, res) => {
    const { category } = req.body;
    let products = await Product.find({category});
    let relatedproducts = products.slice(0, 4);
    res.send(relatedproducts);
})

// Creating Middleware to fetch user

const fetchUser=async(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"});
    }else{
        try{
            const data=jwt.verify(token,process.env.JWT_SECRET || 'secret_ecom');
            req.user=data.user;
            next();
        } catch(error){
                res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}
//Cart API

app.post("/addtocart",fetchUser,async (req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    let itemId = req.body.itemId;
    userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({success:true, message:"Added"})
})

// Cart Api to remove product from cart data

app.post("/removefromcart",fetchUser,async (req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    let itemId = req.body.itemId;
    if(userData.cartData[itemId]>0){
        userData.cartData[itemId]-=1;
        // Clean up 0 quantity items to save space
        if (userData.cartData[itemId] === 0) {
            delete userData.cartData[itemId];
        }
        await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    }
    res.json({success:true, message:"Removed"})
})


// Get cart data API

app.post("/getcart",fetchUser,async(req,res)=>{
     let userData=await Users.findOne({_id:req.user.id});
     res.json(userData.cartData);
})

// Get username

app.post("/getuser",fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    res.send(userData.name);
})

// Admin Schema

const Admin=mongoose.model("Admin",{
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

// Admin Login

app.post("/adminlogin",async(req,res)=>{
    let admin=await Admin.findOne({email:req.body.email});
    if(admin){
        const passcompare = await bcrypt.compare(req.body.password, admin.password);
        if(passcompare){
            const data={admin:{id:admin.id}};
            const token=jwt.sign(data,process.env.JWT_SECRET || 'secret_ecom');
            res.json({success:true,token});
        }else{
            res.json({success:false,errors:"Wrong password"});
        }
    }else{
        res.json({success:false,errors:"Admin not found"});
    }
})

// Admin Analytics
app.get("/admin/analytics", async (req, res) => {
    try {
        const totalUsers = await Users.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        res.json({ success: true, totalUsers, totalProducts });
    } catch (error) {
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

module.exports = app;