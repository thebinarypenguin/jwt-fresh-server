const express      = require('express');
const config       = require('./config');
const TokenService = require('./token-service');

const router = express.Router();

router.post('/login', (req, res) => {

  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username not provided' });
  }

  if (!password) {
    return res.status(400).json({ error: 'password not provided' });
  }

  if (username !== password) {
    return res.status(400).json({ error: 'invalid username or password' });
  }

  TokenService
    .createToken({ username }, config.jwt_secret, { expiresIn: config.jwt_expiry })
    .then((token) => {
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      res.status(500).json({ error: 'error creating token' });
      console.log(err);
    });
});

router.get('/refresh', (req, res) => {

  const authorization = req.get('Authorization');

  if (!authorization) {
    return res.status(400).json({ error: 'authorization not provided' });
  }

  const token = authorization.slice(7);

  TokenService
    .checkToken(token, config.jwt_secret)
    .then((payload) => {

      const { username } = payload;

      TokenService
        .createToken({ username }, config.jwt_secret, { expiresIn: config.jwt_expiry })
        .then((newToken) => {
          res.status(200).json({ token: newToken });
        })
        .catch((err) => {
          res.status(500).json({ error: 'error creating token' });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(401).json({ error: 'invalid authorization' });
    });
});

module.exports = router;
