module.exports.signUperror = (error) => {
    let errors = { groupe: '',activite:'' , email: '', password: '', nom:'',prenom:'',};
    
       if (error.message.includes("nom"))
        errors.nom = "Le champ nom doit pas être vide";
       if (error.message.includes("prenom"))
        errors.prenom = "Le champ prenom doit pas être vide";
       if (error.message.includes("email"))
        errors.email = "L'email est déja prise";
       if (error.message.includes("groupe"))
        errors.groupe = "Le champ groupe doit pas être vide";
       if (error.message.includes("activite"))
        errors.activite = "Le champ activite doit pas être vide";
    
       if (error.message.includes("password"))
        errors.password = "Le mot de passe doit faire au moins 6 caractère";
    

    return errors
}


module.exports.signInerrors = (error) => {
    let errors = { email: '', password: '' };
    if (error.message.includes('email'))
        errors.email ="L'email est incorrecte";
    
    if (error.message.includes("password"))
      errors.password = "Le mot de passe ne correspond pas";
    
    return errors
}

module.exports.uploadErrors = (error) => {
    let errors = { format: '', maxSize: '' };
    if (error.message.includes('invalid file'))
        errors.format = 'Format insuported';
    if (error.message.includes('max size'))
        errors.maxSize = 'Le fichier depasse la taille maiximum';
    
    
}