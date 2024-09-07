const twilio = require('twilio');
const dotenv=require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const makeIVRCall = async (req,res) => {
  try {
    const {phone}=req.body;
    const call = await client.calls.create({
      twiml: `
        <Response>
        <Gather action="${process.env.BASE_URL}/webhook" method="POST">
          <Play>${process.env.BASE_URL}/audio/audio.mp3</Play>
        </Gather>
        </Response>
        `,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log(`Call SID: ${call.sid}`);
    res.json({ message: 'Call sent', call_sid: call.sid })
  } catch (error) {
    console.error(`Error making IVR call: ${error}`);
  }
};

const sendInterviewLink = async (phone) => {
  try {
    const message = await client.messages.create({
      body: `Here's your personalized interview link: ${process.env.INTERVIEW_LINK}`,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log(`Message SID: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending interview link: ${error}`);
  }
};


const handleWebhook = (req, res) => {
  const digits = req.body.Digits;
  const to = req.body.To;

  if (digits === '1') {
    sendInterviewLink(to);
    res.send(`
      <Response>
        <Say>Thank you for your interest. We've sent you a personalized interview link via SMS.</Say>
      </Response>
    `);
  } else {
    res.send(`
      <Response>
        <Say>Thank you for your time. Have a great day!</Say>
      </Response>
    `);
  }
};


  

module.exports = { makeIVRCall, handleWebhook };