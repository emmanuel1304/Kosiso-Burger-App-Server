const express = require('express');
// const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
// const Order = require('../models/orderModel');
const admin = require('firebase-admin');
const db = require('../../index');




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

        const userSnapshot = await admin.firestore().collection('Users').where('email', '==', email).get();

        if(!userSnapshot.empty){ 
            return res.status(400).json({ 
                message: "A user with this email alredy exist!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await admin.firestore().collection('Users').add({ 
            email: email,
            password: hashedPassword,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            role: "User"
        });
        res.status(200).json({ 
            message: "User created successfully!",
            userData: user
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

        const userSnapshot = await admin.firestore().collection('Users').where('email', '==', email).get();

        if(!userSnapshot.empty){ 
            return res.status(400).json({ 
                message: "A user with this email alredy exist!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await admin.firestore().collection('Users').add({ 
            email: email,
            password: hashedPassword,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            role: "Admin"
        });
        res.status(200).json({ 
            message: "Admin user created successfully!",
            userData: user
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
    try { 
        const { email, password } = req.body;

        // Query Firestore for the user with the provided email
        const userSnapshot = await admin.firestore().collection('Users').where('email', '==', email).get();

        if(userSnapshot.empty){ 
            return res.status(400).json({ 
                message: "User not found!"
            });
        };

        const passwordExist = bcrypt.compare(password, userSnapshot.docs[0].data().password);

        if(!passwordExist){ 
            return res.status(401).json({ 
                message: "Invalid user password!"
            })
        }

        const token = jwt.sign({userId: userSnapshot.docs[0].id}, process.env.SECRET_KEY);

        res.status(200).json({ 
            message: "User logged in successfully!",
            token: token
        })
    } catch (error) { 
        console.error('Error logging in:', error);
        res.status(401).send(error.message);
    }
});
``




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

        const orderData = {
            userId: userId, // Optionally, add the userId to associate the order with a user
            totalOrderPrice: totalOrderPrice,
            deliveryAddress: deliveryAddress,
            contactInfo: contactInfo,
            orderStatus: orderStatus,
            paymentStatus: paymentStatus,
            orderDate: orderDate,
            items: items,
            additionalNotes: additionalNotes,
        };

        const orderRef = admin.firestore().collection('Orders').add({orderData});
        res.status(200).json({ 
            message: "Order created successfully!",
            orderData: orderRef.id
        })
        


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