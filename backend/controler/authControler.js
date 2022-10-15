const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const _ = require("lodash");
const mailgun = require("mailgun-js");
const DOMAIN = `sandbox5764400e994d44009c7557adcda885e1.mailgun.org`;
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,

  domain: DOMAIN,
});

// Inscription d'un utilisateur
module.exports.signUp = async (req, res) => {
  const { nom, prenom, email, ville, activite, tel, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "L'utilisateur existe déja ! connecter vous" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    nom,
    prenom,
    email,
    ville,
    activite,
    tel,
    password: hashedPassword, 
  });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }
  return res.status(201).json({ message: user });
};

// Se connecter
module.exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return new Error(error);
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "Cet email n'existe pas, Inscrivez vous " });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ message: "Le mot de pass ou l'email est invalide" });
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.TOKEN_SECRETE, {
    expiresIn: "3d",
  });
  // console.log("GENERATED TOKEN\n",token);
  //   if (req.cookies[`${existingUser._id}`]) {
  //     req.cookies[`${existingUser._id}`]=""
  //   }
  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 1000 * 1000),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Connection réussie", user: existingUser, token });
};

module.exports.verifyToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies?.split("=")[1];
  // console.log(token);

  if (!token) {
    return res.status(404).json({ message: "Vous n'avez pas de token" });
    
  }
  jwt.verify(String(token), process.env.TOKEN_SECRETE, (err, user) => {
    if (err) {
      res.status(400).json({ message: "Votre Token est invalid" });
    }
    // console.log(user.id);
    req.id = user.id;
  });

  next();
};

module.exports.RefreshToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  const preventToken = cookies?.split("=")[1];
  if (!preventToken) {
    return res.status(404).json({ message: "Vous n'avez pas de token" });
  }
  jwt.verify(String(preventToken), process.env.TOKEN_SECRETE, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Authentification échoué" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user._id}`] = "";
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRETE, {
      expiresIn: "7d",
    });

    console.log("REGEBERATED TOKEN\n", token);

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    req.id = user.id;
    next();
  });
};

module.exports.getUser = async (req, res) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (error) {
    return new Error(error);
  }

  if (!user) {
    return res.status(404).json({ message: "L'utilisateur n'existe pas" });
  }
  return res.status(200).json({ user });
};

module.exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: "L'utilisateur avec cet email n'existe pas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "1hr",
    });
    const data = {
      from: "adinsiabdias@gmail.com",
      to: email,
      subject: "Password Activation Link",
      html: `<h2>Cliquez su le lien pour change votre mot de passe</h2>
      <p>${process.env.CLIENT_URL}/resetpassword/activate/${token}`,
    };
    return user.updateOne({ resetLink: token }, function (err, succees) {
      if (err) {
        return res
          .status(400)
          .json({ message: "Le lien d'Erreur de changement de mot de passe" });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({ message: error });
          }
        });
        return res.json({
          message: "L'Email a été envoyez, suivez les instructions",
        });
      }
    });
  });
};

module.exports.resetPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      function (err, decoded) {
        if (err) {
          return res
            .status(401)
            .json({ message: "Incorect Token ou votre token est expirer" });
        }
        User.findOne({ resetLink }, (err, user) => {
          if (err || !user) {
            return res
              .status(400)
              .json({ message: "L'utilisateur avec ce token n'existe pas" });
          }
          const obj = {
            password: newPass,
            resetLink: "",
          };
          user = _.extend(user, obj);

          user.save((err, result) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "Erreur de changement de mot de passe" });
            } else {
              return res.status(201).json({
                message: "Votre mot de passe à été changer",
              });
            }
          });
        });
      }
    );
  } else {
    return res.status(401).json({ message: "authentification erreur" });
  }
};
// Deconnexion
module.exports.logOut = async (req, res) => {
  // const cookies = req.headers.cookie;
  // const token = cookies.split("=")[1];
  // res.cookie(String(token), "", { maxAge: 1 });
  // res.redirect("/");

   const cookies = req.headers.cookie;
   const preventToken = cookies?.split("=")[1]; 
   if (!preventToken) {
     return res.status(404).json({ message: "Vous n'avez pas de token" });
  }
    jwt.verify(String(preventToken), process.env.TOKEN_SECRETE, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Authentification échoué" });
      }
      res.clearCookie(`${user.id}`);
      req.cookies[`${user._id}`] = "";
      return res.status(200).json({message:"Déconnexion"})


  
    });
};
