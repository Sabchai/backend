const jwt = require('jsonwebtoken');
const userSchema = require('../model/user');

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');  // Extraire le token après 'Bearer '
    
    if (!token) {
      return res.status(401).json({ msg: 'Token manquant.' });  // Si le token est absent
    }

    // Vérifier le token
    const decoder = jwt.verify(token, process.env.privateKey);  // Vérifier le token avec la clé secrète
    if (!decoder) {
      return res.status(401).json({ msg: 'Token invalide.' });  // Si le token est invalide
    }

    // Trouver l'utilisateur correspondant
    const user = await userSchema.findById(decoder.id);
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur introuvable.' });  // Si l'utilisateur n'existe pas
    }

    req.user = user;  // Ajouter l'utilisateur dans la requête
    next();  // Passer à la prochaine étape
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erreur du serveur lors de la vérification du token.' });
  }
};
