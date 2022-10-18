require("dotenv").config({ path: "./config/.env" }); 

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require("express");
const UserRoutes = require('./routes/userRoutes');
const PostRoutes = require('./routes/postRoutes');
const MessageRoutes = require('./routes/messageRoutes');


require("./config/db");
const cors = require('cors');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
const app = express(); 

const corsOption = {
  origin: process.env.CLIENT_URL,  
  Credential: true,
  'allowedHeaders': ['sessionId', 'content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue' :false
} 
app.use(cors({credentials:true,origin:`${process.env.CLIENT_URL}`}));

app.use(cookieParser());
app.use(bodyParser.json()); // Transformer les body en json
app.use(bodyParser.urlencoded({ extended: true }));

// jwt


//routes
app.use('/api/user', UserRoutes);
app.use('/api/post',PostRoutes)
app.use('/api/message',MessageRoutes)


//server
app.listen(process.env.PORT, () =>
  console.log(`Listen to port ${process.env.PORT}`)
);
