const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
//import user model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
// checks validate name, email and password fields
router.post(
  '/',
  [
    check('name', 'Please enter a name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are errors, report them
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if user exists
      let user = await User.findOne({ email });
      //if there is a user, show error in similar format to validator
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      //Get users gravatar
      //s= size, r= rating, d=default (mm is a default user icon)
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //create instance of user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt password using bcrypt
      //create salt, then hash pw with salt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user into database
      await user.save();

      //grab the id from the user in db to be used
      //for auth to private routes
      const payload = {
        user: {
          id: user.id,
        },
      };

      //create jwt. payload = userId, config.get the secret,
      //determine how long token is good for (optional)
      //handle errors or return token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
