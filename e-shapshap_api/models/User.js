const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    googleId: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return validator.isEmail(v); // Utilise le package pour valider l'email
            },
            message: props => `${props.value} n'est pas une adresse e-mail valide!`
        }
    },
    password: String,  // Pour l'authentification locale
    name: {
        type: String,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Hash le mot de passe avant de sauvegarder si le mot de passe est modifié ou nouveau
userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
