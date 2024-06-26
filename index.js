const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./src/routes/routes');
// const crypto = require('crypto');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');




admin.initializeApp({ 
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


dotenv.config();
const app = express();



const mongodbUrl=process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use('/api', routes);
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));



module.exports = db;






/*
mongoose.connect(mongodbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log('Connected to MongoDB')).catch((error)=>{ 
    console.error(`Error connecting to MongoDB!${error}`)
}); */