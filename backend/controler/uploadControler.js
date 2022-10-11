const UserModel = require("../models/user");
// const multer = require('multer');
// const fs = require("fs");
// const { promisify } = require("util");
// const {  uploadErrors } = require("../utils/error.utils");
// const pipeline = promisify(require("stream").pipeline);

const fileupoad = require('express-fileupload')

module.exports.uploadProfil = async (req, res) => {
//   try {
//     if (
//       req.file.detectedMineType !== "image/jpg" &&
//       req.file.detectedMineType !== "image/png" &&
//       req.file.detectedMineType !== "image/jpeg"
//     )
//       throw Error("Invalid File"); 
      
//       if(req.file.size > 500000) throw Error('max size')
//   } catch (error) {
//       const errors = uploadErrors(error)
//       res.status(200).json({errors}); 
//     }
    
    // const fileName = `${req.body.name}.jpg`;   
    // await pipeline(
    //     req.file.stream,
    //     fs.createWriteStream( 
    //         `${__dirname}/../../../client/public/uploads/profil/${fileName}`
    //     )
    // )
   
    
    // try {
    //     await UserModel.findByIdAndUpdate( 
    //         req.body.userId,
    //         {
    //             $set : {picture : './upolads/profil/'+ fileName}
    //         },
    //         {
    //             new:true,upsert :true,setDefaultsOnInsert :true
    //         },
    //         (error, docs) => {
    //             if (!error) return res.send(docs)
    //             else return res.status(500).send({message :error})
    //         }
    //     )
    // } catch (error) {
    //     return res.status(500).send({message :error})
    // }
    
    
};
