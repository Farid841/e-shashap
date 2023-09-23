const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const User = require('./models/User');

const router = express.Router();

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}


// Route d'inscription
router.post('/signup', async (req, res) => {
    console.log(res.status(500).send('Erreur lors de la connexion après inscription.'));

    try {
        // Vérifiez d'abord si l'e-mail est déjà utilisé
        const existingUser = await User.findOne({ email: req.body.email });
        
        if (existingUser) {
            // Si l'e-mail est déjà pris, envoyez une réponse appropriée
            return res.status(400).send('Cet e-mail est déjà utilisé.');
        }

        // Si l'e-mail n'est pas déjà pris, hashons le mot de passe
        const hashedPassword = await hashPassword(req.body.password);

        // Créez un nouvel utilisateur
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            firstname: req.body.firstname
        });

        // Sauvegardez l'utilisateur dans la base de données
        await user.save();

        // Connectez l'utilisateur (si vous le souhaitez)
        req.login(user, (err) => {
            if (err) {
                return res.status(500).send('Erreur lors de la connexion après inscription.');
            }
            // Redirigez vers le tableau de bord après inscription et connexion réussies
            res.status(200).json({ message: "Inscription réussie" });
;
        });

    } catch (error) {
        // En cas d'erreur (par exemple, une erreur de base de données), envoyez une réponse d'erreur
        res.status(500).send('Erreur lors de l\'inscription.');
    }
});




// Route de connexion avec la stratégie locale de Passport
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',   // Rediriger vers la page de connexion en cas d'échec
    failureFlash: true          // Utiliser les messages flash pour afficher les erreurs
}), (req, res) => {
    // Si l'authentification est réussie, l'utilisateur est redirigé vers son tableau de bord.
    res.send('ok');
});


// Route de déconnexion
router.get('/logout', (req, res) => {
    // Passport expose une méthode logout() sur la requête (req) que vous pouvez appeler.
    req.logout();   
    // Après la déconnexion, redirigez l'utilisateur vers la page d'accueil ou la page de connexion.
    res.redirect('/');
});


// Route de redirection vers l'authentification Google
router.get('/google', passport.authenticate('google', {
    // Demander à Google l'accès au profil et à l'e-mail de l'utilisateur.
    scope: ['profile', 'email']
}));


// Callback pour l'authentification Google
// Après avoir été authentifié par Google, l'utilisateur est redirigé vers cette route.
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'   // Rediriger vers la page de connexion en cas d'échec
}), (req, res) => {
    // Si l'authentification est réussie, l'utilisateur est redirigé vers son tableau de bord.
    res.redirect('/dashboard');
});


// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Vérifier si l'e-mail existe dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Aucun compte avec cet e-mail trouvé');
    }

    // Générer un jeton unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = Date.now() + 3600000; // 1 heure plus tard

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiryDate;
    await user.save();

    // Préparez l'e-mail
    const mailOptions = {
        to: email,
        from: process.env.GMAIL_USER,
        subject: 'Réinitialisation du mot de passe',
        text: `Vous avez demandé la réinitialisation du mot de passe. Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe: http://127.0.0.1:8000/reset-password/${resetToken}`,
        html: `<p>Vous avez demandé la réinitialisation du mot de passe. Veuillez <a href="http://127.0.0.1:8000/reset-password/${resetToken}">cliquer ici</a> pour réinitialiser votre mot de passe.</p>`
    };

    // Envoyez l'e-mail
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return res.status(500).send("Erreur lors de l'envoi de l'e-mail");
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Un e-mail de réinitialisation a été envoyé à ' + email + '.');
        }
    });
});


router.post('/reset-password/:token', async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        return res.status(400).send('Jeton de réinitialisation non valide ou expiré.');
    }
    user.password = await hashPassword(req.body.password);  // Hashage du mot de passe
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/dashboard');
    });
});



router.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
  
    if (!name || !email || !subject || !message) {
      return res.status(400).send({ error: 'Tous les champs sont obligatoires.' });
    }
  
    const mailOptions = {
      from: email, // Adresse e-mail de l'expéditeur (doit être la même que celle définie dans le transporter)
      to: 'farid.ousmane01@gmail.com', // Adresse e-mail du destinataire
      subject: subject,
      text: `
        Nom: ${name}
        Email: ${email}
        Message: ${message}
      `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l’envoi de l’e-mail:', error);
        return res.status(500).send({ error: 'Erreur lors de l’envoi de l’e-mail.' });
      }
      res.status(200).send({ success: true, message: 'E-mail envoyé avec succès!' });
    });
  });
  

// Cette tâche s'exécutera tous les jours à minuit.
cron.schedule('0 0 * * *', async () => {
    console.log("Vérification des jetons expirés...");
    
    await User.updateMany(
        { resetPasswordExpires: { $lt: Date.now() } },
        {
            $unset: {
                resetPasswordToken: 1,
                resetPasswordExpires: 1
            }
        }
    );

    console.log("Anciens jetons supprimés.");
});

module.exports = router;  // N'oubliez pas d'exporter le routeur pour l'utiliser dans d'autres fichiers !
