/* eslint-disable no-await-in-loop */
const { Router } = require('express');
const {
  models: {
    GameSession,
    Session,
    Prompt,
    Powerup,
  },
} = require('../../db/index');
const { codeGenerator } = require('../utils');

const gameRouter = Router();

// getsCurrentGame and players belonging to that game
gameRouter.get('/current', async (req, res) => {
  try {
    const session = await Session.findOne({ where: { id: req.session_id } });
    const game = await GameSession.findOne({
      where: { id: session.gameSessionId },
    });
    const players = await Session.findAll({
      where: { gameSessionId: game.id },
    });
    res.status(201).send({ game, players });
  } catch (e) {
    console.log('Error finding current game');
    console.log(e);
  }
});

// Create game session and set the number of rounds.
gameRouter.post('/createNew', async (req, res) => {
  try {
    let newCode = codeGenerator();
    let check = await GameSession.findOne({ where: { code: newCode } });
    while (check) {
      newCode = codeGenerator();
      check = await GameSession.findOne({ where: { code: newCode } });
    }
    if (!req.body.name) {
      return res.status(400).json({
        status: 'error',
        error: 'req body cannot be empty',
      });
    }
    const { rounds, difficulty } = req.body;
    const newGame = await GameSession.create({ rounds, difficulty, newCode });
    res.status(201).send(newGame);
  } catch (e) {
    console.log('Error creating game session');
    console.log(e);
  }
});

// Gets a game prompt based on difficulty
gameRouter.get('/prompt/:diff', async (req, res) => {
  try {
    const { diff } = req.params;
    const gamePrompts = await Prompt.findAll({ where: { difficulty: diff } });
    const randomGameIdx = Math.floor(Math.random() * gamePrompts.length);
    res.send(gamePrompts[randomGameIdx]);
  } catch (e) {
    console.log('failed to get game prompt');
    console.log(e);
  }
});

// This route destroys the game belonging to the session and updates gameSessionId
gameRouter.put('/joinGame', async (req, res) => {
  try {
    const { currentGameId, gameCode } = req.body;
    const session = await Session.findOne({ where: { id: req.session_id } });
    const game = await GameSession.findOne({ where: { code: gameCode } });
    if (!game) {
      res.status(404).send('Could not find game');
    } else {
      await session.update({ gameSessionId: game.id });
      const gameToDestroy = await GameSession.findOne({
        where: { id: currentGameId },
      });
      await gameToDestroy.destroy();
      res.status(200).send('Ok');
    }
  } catch (e) {
    console.log('failed to join game');
    console.log(e);
  }
});

gameRouter.get('/powerups', async (req, res) => {
  try {
    const powerupList = await Powerup.findAll();
    res.send(powerupList);
  } catch (e) {
    console.log(e);
  }
});

module.exports = {
  path: '/game',
  router: gameRouter,
};
