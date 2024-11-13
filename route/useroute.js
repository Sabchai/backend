const express = require("express");
const useroute = express.Router();
const userSchema = require("../model/user");
const bcrypt = require("bcrypt");
const isAuth = require("../middleware/authToken");
const jwt = require("jsonwebtoken");
const { SignUpValidation, login, validation } = require("../middleware/SignUpValidation");

// Sign Up
useroute.post('/SignUp', SignUpValidation, validation, async (req, res) => {
  try {
    const { Name, userName, Email, Password, Address, Phone, Role } = req.body;

    // Verificar si el correo electrónico ya existe
    const foundUser = await userSchema.findOne({ Email });
    if (foundUser) {
      return res.status(400).json({ msg: "Ya tienes una cuenta, por favor inicia sesión." });
    }

    // Crear nuevo usuario
    const newUser = new userSchema({
      Name,
      userName,
      Email,
      Password,
      Address,
      Phone, // Agregamos el campo Phone aquí
      Role
    });

    // Encriptar la contraseña
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(Password, salt); // Asegúrate de usar Password en lugar de password
    newUser.Password = hash;  // Guardar la contraseña encriptada

    await newUser.save();
    res.status(201).json({ msg: "¡Bienvenido a la plataforma!", newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Login
useroute.post("/SignIn", login, validation, async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const foundUser = await userSchema.findOne({ Email });

    if (!foundUser) {
      return res.status(404).json({ msg: "El correo no está registrado, por favor regístrate." });
    }

    const match = await bcrypt.compare(Password, foundUser.Password);  // Asegúrate de usar Password en lugar de password
    if (!match) {
      return res.status(401).json({ msg: "Contraseña incorrecta." });
    }

    // Generar JWT token
    const payload = { id: foundUser._id };
    const token = jwt.sign(payload, process.env.privateKey);
    res.status(200).json({ msg: "¡Bienvenido!", foundUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Ver perfil
useroute.get("/account", isAuth, async (req, res) => {
  try {
    // Renvoie l'utilisateur trouvé à partir du middleware isAuth
    res.send(req.user);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erreur lors de la récupération du compte utilisateur.' });
  }
});


module.exports = useroute;
