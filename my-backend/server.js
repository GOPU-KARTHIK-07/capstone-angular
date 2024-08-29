require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure key
//aws

const multer = require('multer')
const AWS = require('aws-sdk');
//mail
const nodemailer = require('nodemailer');
const crypto = require('crypto')

// Middleware
app.use(bodyParser.json());
app.use(cors());


//AWS CONFIGUration
const s3 = new AWS.S3({
    
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_REGION,
    
});
//multer configuration
const storage = multer.memoryStorage();
const upload = multer({storage});
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_REGION:', process.env.AWS_REGION);

//nodemailer with gmail
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS
    }
});
console.log(`GMAIL user ${process.env.GMAIL_USER}`);
console.log(`Gmail pass ${process.env.GMAIL_PASS}`)



// MongoDB Connection
const mongoURI = 'mongodb+srv://doopgk:EOH0DY8xwJ2Uy4AG@capangular.xjtne.mongodb.net/?retryWrites=true&w=majority&appName=capangular';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp:{type:String},
    isVerified:{type:Boolean,default:false}
}));


// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //gnerate 6 digit otp
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log('Generated OTP:',otp);
 

        const user = new User({
            username,
            email,
            password: hashedPassword,
            otp, //Store otp In database
            isVerified:false //initially set to false
        });

        await user.save();
       // Send OTP to user's email
       const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP for verification is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send({ error: 'Error sending OTP email' });
        }
        res.status(201).send({ message: 'Signup successful! Please check your email for the OTP.' ,otp});
    });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(400).send({ error: 'Error saving user', details: error.message });
    }
});

//otp verifcation Route
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if the OTP matches
        if (user.otp !== otp) {
            return res.status(400).send({ error: 'Invalid OTP' });
        }

        // Mark the user as verified and clear the OTP
        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.send({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).send({ error: 'Error during OTP verification', details: error.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'Email not registered' });
        }

        // Compare the provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});

// Get All Users Route
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username email');
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});


// Product Model
const Product = mongoose.model('Product', new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['laptop', 'mobile', 'electronics'] // Predefined categories
    },
    imageUrl : {type:String},
    createdAt:{type:Date,default:Date.now}
}));


// Add Product Route
app.post('/api/products',upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const file = req.file;

        // Check if the category is valid
        if (!['laptop', 'mobile', 'electronics'].includes(category)) {
            return res.status(400).send({ error: 'Invalid category' });
        }
        let imageUrl = '';
        if (file){
            const params = { 
                //upload file to s3
                Bucket:'cap-angular',
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            const data = await s3.upload(params).promise();
            imageUrl = data.Location; //URL of the uplaoded Image
            console.log(imageUrl);

        }

        const product = new Product({
            name,
            price,
            description,
            category,
            imageUrl
        });

        const savedProduct = await product.save();
        res.status(201).send(savedProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).send({ error: 'Error adding product', details: error.message });
    }
});

// Get All Products Route
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});

// Update Product Route
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category } = req.body;

        // Check if the category is valid
        if (!['laptop', 'mobile', 'electronics'].includes(category)) {
            return res.status(400).send({ error: 'Invalid category' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description, category },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).send({ error: 'Error updating product', details: error.message });
    }
});

// Delete Product Route
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});








app.listen(port, () => console.log(`Server running on port ${port}`));
