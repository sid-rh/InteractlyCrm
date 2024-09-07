const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dotenv=require('dotenv');
dotenv.config();
const contactRoutes=require('./routes/ContactRoutes');
const { handleWebhook,makeIVRCall } = require('./Twilio/twilio.js');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.use('/',contactRoutes);


//TWILIO apis
app.post('/makeCall',makeIVRCall);
app.post('/webhook', handleWebhook);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));