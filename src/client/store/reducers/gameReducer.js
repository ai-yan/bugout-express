import { types } from '../actions';

const initialGameState = {
  code: '',
  rounds: '',
  currentId: '',
  players: [],
  active: false,
  private: true,
  prompt: '',
  powerUps: [],
};

const gameReducer = (state = initialGameState, action) => {
  switch (action.type) {
    case types.UPDATE_PLAYERS:
      return {
        ...state,
        players: [...action.players],
      };
    case types.NEW_GAME:
      return {
        ...state,
        id: action.payload.game.id,
        active: action.payload.game.active,
        code: action.payload.game.code,
        private: action.payload.game.private,
        rounds: action.payload.game.rounds,
        difficulty: action.payload.game.difficulty,
      };
    case types.GET_CURRENT_GAME:
      return {
        ...state,
        id: action.payload.game.id,
        active: action.payload.game.active,
        code: action.payload.game.code,
        private: action.payload.game.private,
        rounds: action.payload.game.rounds,
        difficulty: action.payload.game.difficulty,
        players: action.payload.players,
      };
    case types.SET_PROMPT:
      return {
        ...state,
        prompt: action.payload,
      };
    case types.SET_POWERUPS:
      return {
        ...state,
        powerUps: action.payload,
      };
    default:
      return state;
  }
};

export default gameReducer;
