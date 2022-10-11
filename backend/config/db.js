const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@cluster0.ioigbmz.mongodb.net/?retryWrites=true&w=majority`,

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("connected to  mongo Db"))
  .catch((error) => {
    console.log("Failled to " + error);   
  });
 
