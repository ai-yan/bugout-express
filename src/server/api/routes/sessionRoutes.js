/* eslint-disable no-await-in-loop */
const { Router } = require('express');
const {
  models: { Session },
} = require('../../db/index');

const sessionRouter = Router();

sessionRouter.get('/name', async (req, res) => {
  try {
    const session = await Session.findOne({ where: { id: req.session_id } });
    res.status(201).send(session.name);
  } catch (e) {
    console.log('Error updating name');
    console.log(e);
  }
});

// updates name of the session
sessionRouter.put('/updateName', async (req, res) => {
  try {
    const { name } = req.body;
    const session = await Session.findOne({ where: { id: req.session_id } });
    session.update({ name });
    res.status(201).send();
  } catch (e) {
    console.log('Error updating name');
    console.log(e);
  }
});

sessionRouter.post('/makeHost', async (req, res) => {
  try {
    const session = await Session.findOne({ where: { id: req.session_id } });
    session.update({ host: true });
    if (!req.body.name) {
      return res.status(400).json({
        status: 'error',
        error: 'req body cannot be empty',
      });
    }
    res.status(201).send(session);
  } catch (e) {
    console.log('Error making host');
    console.log(e);
  }
});

module.exports = {
  path: '/session',
  router: sessionRouter,
};
