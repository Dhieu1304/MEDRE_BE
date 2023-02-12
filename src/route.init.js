const express = require('express');

module.exports.initRouter = (app) => {
  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('MEDRE_API');
  });
};
