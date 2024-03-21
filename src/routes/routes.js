const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const Order = require('../models/orderModel');




const router = express.Router();

router.get('/', authMiddleware, (req, res)=> { 
    res.send('This is the homepage!');
});


///////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////



router.post('/user/register', async (req, res) => { 
    try{ 
        const {firstName, lastName, email, password, phone} = req.body;

        const isUserExist = await User.findOne({ email });

        if(isUserExist){ 
            return res.status(401).json({message: 'Email is already in use!'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = User({ 
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phone: phone
        });

        user.save();
        res.status(200).json({ 
            message: 'User created successfully!',
            user: user
        })
    } catch (error){ 
        return res.status(401).send(error.message);
    }
});


///////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////





router.post('/admin/register', async (req, res) => { 
    try{ 
        const {firstName, lastName, email, password, phone} = req.body;

        const isUserExist = await User.findOne({ email });

        if(isUserExist){ 
            return res.status(401).json({message: 'Email is already in use!'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = User({ 
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phone: phone,
            role: 'Admin'
        });

        user.save();
        res.status(200).json({ 
            message: 'Admin created successfully!',
            user: user
        })
    } catch (error){ 
        return res.status(401).send(error.message);
    }
});


///////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////


router.post('/user/login', async (req, res) => { 
    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if(!user){ 
        return res.status(400).json({message: 'User does not exist!'})
    }

    const passwordMatch = bcrypt.compare(password, user?.password);

    if(!passwordMatch){ 
        return res.status(400).json({message: 'Password does not match!'})
    }

    const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY,);

    res.status(200).json({message: 'Login Successful!', token: token, user: user});
});



///////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////


router.post('/user/create-order', authMiddleware, async (req, res) => { 
    try{ 
        const {items, totalOrderPrice, deliveryAddress, contactInfo, orderStatus, paymentStatus, orderDate, additionalNotes} = req.body;
        const userId = req.userId;
        
        const newOrder = Order({ 
            userId,
            items,
            totalOrderPrice,
            deliveryAddress,
            contactInfo,
            orderStatus,
            paymentStatus,
            orderDate,
            additionalNotes
        });

        newOrder.save();

        res.status(201).json({
            message: 'Order created successfully!',
            order: newOrder
        });

    } catch (error){ 
        return res.status(400).json({
            message: `An error occured while creating order! ${error}`
        })
    }
});


///////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////



router.get('/admin/retrieve-all-orders',adminAuthMiddleware, async (req, res) => { 
    try{ 
        const userId = req.userId;

        const user = await User.findById({_id: userId });

        if(!user){ 
            return res.status(400).json({ 
                message: 'User not found!',
            });
        } else { 
            const orders = await Order.find();
            return res.status(200).json({ 
                message: 'Orders retrieved successfully!',
                data: orders
            })
        };
    } catch(error){ 
        return res.status(400).json({ 
            message: 'An error occured while retrieving orders!',
        })
    }
})



///////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////




router.get('/user/retrieve-user-orders', authMiddleware, async (req, res) => { 
    try{ 
        const userId = req.userId;

        const orders = await Order.find({userId: userId});

        res.status(200).json({ 
            message: 'Order retrieved successfully!',
            orders: orders,
        })
    } catch (error){ 
        res.status(400).json({ 
            message: 'Unable to retrieve orders!',
            error: error
        })
    }
});



router.post('/admin/open-order/:orderId', adminAuthMiddleware, async (req, res) => { 
    try{ 
        const orderId = req.params.orderId;

        const order = await Order.findByIdAndUpdate(orderId, { opened: true }, { new: true });

        if(!order){ 
            return res.status(400).json({ 
                message: 'Order does not exist!'
            })
        }

        res.status(200).json({ 
            message: 'Order has been opened successfully!'
        })

    } catch(error){
        return res.status(400).json({ 
            message: 'An error occured while opening order!'
        })
    }
});



module.exports = router;