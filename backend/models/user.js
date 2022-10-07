const mongoose = require("mongoose");


const schema = mongoose.Schema;

const userSchema = new schema(
  {
    nom: {
      type: String,
      required: true,
     
    },
    prenom: {
      type: String,
      required: true,
     
    },
    email: {
      type: String,
      required: true,
      unique: true, 
     
    },
    groupe: {
      type: String,
      required: true,
    
    },
    activite: {
      type: String,
      required: true,
    
    },
  
    password: {
      type: String,
      required: true,
    
    },
    picture: {
      type: String,
      default: "./uploads/profil/profil.png",
    },
    bio: {
      type: String,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);




module.exports = mongoose.model("User", userSchema);
