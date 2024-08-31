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
    isVerified:{type:Boolean,default:false},
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }]
  
}));
//authentication token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token is provided

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid
        req.user = user;
        next();
    });
};


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
// In your server file (e.g., server.js)
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.status(200).send({ email: user.email });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send({ error: 'Server error', details: error.message });
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

// Add Item to Cart
app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const existingProduct = user.cart.find(item => item.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }
        await user.save();
        res.status(200).send(user.cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});
// Retrieve Cart Details
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});
// Remove Item from Cart
app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).send(user.cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});
const Order = mongoose.model('Order', new mongoose.Schema({
    email: { type: String, required: false }, // No longer required
    cartProducts: [{  // Assuming this structure for cart products
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }, // No longer required
        quantity: { type: Number, required: false } // No longer required
    }],
    totalAmount: { type: Number, required: false, default: 0 }, // Default to 0
    address: { type: String, required: false, default: '' }, // Default to empty string
    paymentMethod: { type: String, required: false, default: '' }, // Default to empty string
    cardDetails: {
        cardNumber: { type: String, required: false, default: '' }, // Default to empty string
        cardExpiry: { type: String, required: false, default: '' }, // Default to empty string
        cardCVV: { type: String, required: false, default: '' } // Default to empty string
    },
    upiId: { type: String, required: false, default: '' } // Default to empty string
}, { timestamps: true }));

// Save Checkout Details
// Checkout Route
// Checkout Route

app.post('/api/checkout', async (req, res) => {
    try {
        const { cartProducts, totalAmount, email, address, paymentMethod, cardDetails, upiId } = req.body;

        // Ensure cartProducts is provided
        if (!cartProducts || cartProducts.length === 0) {
            return res.status(400).send({ error: 'No products in cart' });
        }

        // Create an order with provided fields or default values
        const order = {
            cartProducts,
            totalAmount: totalAmount || 0,  // Default to 0 if not provided
            email: email || '',             // Default to empty string if not provided
            address: address || '',         // Default to empty string if not provided
            paymentMethod: paymentMethod || '', // Default to empty string if not provided
            cardDetails: cardDetails || {}, // Default to empty object if not provided
            upiId: upiId || '',             // Default to empty string if not provided
            createdAt: new Date()
        };

        // Save order to the database
        const newOrder = new Order(order);
        await newOrder.save();

        res.status(201).send(newOrder);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send({ error: 'Server error', details: error.message });
    }
});
// Retrieve Orders for a User
// Add this to your existing server.js file

// Fetch Orders Route
// app.get('/api/orders', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         // Fetch orders for the authenticated user
//         const orders = await Order.find({ 'cartProducts.productId.userId': userId })
//             .populate('cartProducts.productId'); // Populate product details
//         res.status(200).json(orders);
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).json({ error: 'Server error', details: error.message });
//     }
// });


// app.get('/api/orders', (req, res) => {
//     const email = req.query.email;
    
//     if (!email) {
//       return res.status(400).json({ error: 'Email parameter is missing' });
//     }
  
//     Order.find({ email: email }, (err, orders) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to fetch orders' });
//       }
//       res.json(orders);
//     });
//   });

// server.js or your API routes file
app.get('/api/orders', async (req, res) => {
    try {
      const userEmail = req.query.email; // Extract email from query parameter
      if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const orders = await Order.find({ email: userEmail }).populate('cartProducts.productId');
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  









app.listen(port, () => console.log(`Server running on port ${port}`));
