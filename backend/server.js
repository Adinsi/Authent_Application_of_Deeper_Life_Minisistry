require("dotenv").config({ path: "./config/.env" }); 

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require("express");
const UserRoutes = require('./routes/userRoutes');
const PostRoutes = require('./routes/postRoutes');


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
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(cookieParser());
app.use(bodyParser.json()); // Transformer les body en json
app.use(bodyParser.urlencoded({ extended: true }));

// jwt


//routes
app.use('/api/user', UserRoutes);
app.use('/api/post',PostRoutes)


//server
app.listen(process.env.PORT, () =>
  console.log(`Listen to port ${process.env.PORT}`)
);
