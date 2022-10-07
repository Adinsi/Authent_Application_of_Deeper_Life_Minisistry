const PostModel = require('../models/post.models');
const UserModel = require('../models/user');
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const fs = require("fs");



const ObjectId = require('mongoose').Types.ObjectId;
const {uploadErrors} = require('../utils/error.utils')

module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error to get data:' + err);
    }).sort({createdAt:-1})
}

module.exports.createPost = async (req, res) => { 
  let fileName;
  if (req.file !== null) {
    try {
      if (
        req.file.detectedMineType !== "image/jpg" &&
        req.file.detectedMineType !== "image/png" &&
        req.file.detectedMineType !== "image/jpeg"
      )
        throw Error("Invalid File");

      if (req.file.size > 500000) throw Error("max size");
    } catch (error) {
      const errors = uploadErrors(error);
      res.status(200).json({ errors });
    }

    fileName = `${req.body.posterId}${Date.now()}.jpg`; 
      await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/../../../client/public/uploads/posts/${fileName}`
        )
      );
  }
    const newPost = new PostModel({
        posterId: req.body.posterId,
      message: req.body.message,
        picture:req.file !== null ? "./uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [] 
    })

    try {
        const post = await newPost.save();
       return res.status(201).json(post);
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports.updatePost = (req, res) => { 
    
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Id Inconnue" + req.params.id);
      }
      const Upadatemessage = {
        message: req.body.message,
      };

      PostModel
        .findByIdAndUpdate(
          req.params.id,
          {
            $set: Upadatemessage,
          },
          {
            new: true,
          },
          (error, docs) => {
            if (!error) res.send(docs);
            else res.status(500).json({ message: error });
          }
        )
        .select("-password");
    } catch (error) {
      res.status(500).json({ message: error });
    }
}

module.exports.deletePost = (req, res) => {
    
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Id Inconnue" + req.params.id);
    }
    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs)
            else console.log("Delete error" + err);
        }
    )
   
}

module.exports.likePost = async (req, res) => {
    if (
      !ObjectId.isValid(req.params.id)
    ) 
      return res.status(400).json("Id Inconnue" + req.params.id);
    

    try {
      // Ajouter le like au publication
      PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true, upsert: true },
        (error, docs) => {
            if (!error) res.status(201).json(docs);
            else return res.status(400).json(error);
       
        }
      );

      //Ajouter l'id au likes

      UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true, upsert: true },
        (error, docs) => {
            if (error) return res.send(error);
          
        }
      );
    } catch (error) {
      res.status(500).json({ message: error });
    }
}

module.exports.unlikePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).json("Id Inconnue" + req.params.id);

    try {
      // Ajouter le like au publication
      PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true, upsert: true },
        (error, docs) => {
          if (!error) res.status(201).json(docs);
          else return res.status(400).json(error);
        }
      );

      //Ajouter l'id au likes

      UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true, upsert: true },
        (error, docs) => {
            if (error) return res.send(error);
            
        }
      );
    } catch (error) {
      res.status(500).json({ message: error });
    }

}

module.exports.commentPost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).json("Id Inconnue" + req.params.id);
    try {
        return PostModel.findByIdAndUpdate(req.params.id, {
          $push: {
            comments: {
              commenterId: req.body.commenterId,
              commenterPseudo: req.body.commenterPseudo,
              text:req.body.text ,
              timestamp: new Date().getTime(),
            },
          },
        },
            {
            new:true
            },
            (error, docs) => {
                if (!error) return res.send(docs)
                else return res.status(400).send(error)
        });  
    } catch (error) {
        return res.status(400).send(error)
    }
}
module.exports.editCommentPost = async (req, res) => {
        if (!ObjectId.isValid(req.params.id))
        return res.status(400).json("Id Inconnue" + req.params.id);
    try {
        return PostModel.findById(
            req.params.id,
            (error, docs) => {
                const theComment = docs.comments.find(comment => {
                    comment._id.equals(req.body.commenterId)
                })
                if (!theComment) return res.status(404).send('comment not found')
                theComment.text = req.body.text;

                return docs.save((error) => {
                    if (!error) return res.status(200).docs
                    return res.status(500).send(docs)
                }

                )
            }
       ) 
    } catch (error) {
         return res.status(400).send(error);
    }
}
module.exports.deleteCommentPost = async (req, res) => {
        if (!ObjectId.isValid(req.params.id))
        return res.status(400).json("Id Inconnue " + req.params.id);
    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                pull: {
                    comments: {
                        _id: req.body.commenterId
                    }
                    
                }
            },
            {
                new :true
            },
            (error, docs) => {
                if (!error) return res.send(docs)
                else return res.status(400).send(error)
            }
        )
    } catch (error) {
       return res.status(400).send(error);  
    }
}