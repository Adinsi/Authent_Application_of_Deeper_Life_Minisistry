// module.exports.signUperror = (error) => {
//     let errors = { groupe: '',activite:'' , email: '', password: '', nom:'',prenom:'',};
    
//        if (error.message.includes("nom"))
//         errors.nom = "Le champ nom doit pas être vide";
//        if (error.message.includes("prenom"))
//         errors.prenom = "Le champ prenom doit pas être vide";
//        if (error.message.includes("email"))
//         errors.email = "L'email est déja prise";
//        if (error.message.includes("groupe"))
//         errors.groupe = "Le champ groupe doit pas être vide";
//        if (error.message.includes("activite"))
//         errors.activite = "Le champ activite doit pas être vide";
    
//        if (error.message.includes("password"))
//         errors.password = "Le mot de passe doit faire au moins 6 caractère";
    

//     return errors
// }


// module.exports.signInerrors = (error) => {
//     let errors = { email: '', password: '' };
//     if (error.message.includes('email'))
//         errors.email ="L'email est incorrecte";
    
//     if (error.message.includes("password"))
//       errors.password = "Le mot de passe ne correspond pas";
    
//     return errors
// }

// module.exports.uploadErrors = (error) => {
//     let errors = { format: '', maxSize: '' };
//     if (error.message.includes('invalid file'))
//         errors.format = 'Format insuported';
//     if (error.message.includes('max size'))
//         errors.maxSize = 'Le fichier depasse la taille maiximum';
    
    
// }

const nodemailer = require('nodemailer');
module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        });
        console.log('Email send Successfully');
    } catch (error) {
        console.log("Email not sent",error); 
    }
}