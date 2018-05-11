import { MESSAGES_SET, MESSAGES_APPENDED, GET_ROOMS_RECEIVED, GET_ROOMS_ERROR } from '../actions/actionTypes';

const defaultState = {
  error: null,
  next: true,
  success: false,
};

export const messagesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_ROOMS_RECEIVED:
      return {
        ...state,
        ...action.payload.rooms,
        success: true,
      };
    case GET_ROOMS_ERROR:
      return {
        ...state,
        error: action.payload.error,
        success: false,
      };
    case MESSAGES_SET:
      return {
        ...state,
        [action.payload.roomId]: {
          messages: [...action.payload.messages],
          next: action.payload.next,
        },
      };
    case MESSAGES_APPENDED: {
      const prevState = { ...state };
      if (state[action.payload.roomId] && state[action.payload.roomId].messages.length > 0) {
        prevState[action.payload.roomId] = {
          ...state[action.payload.roomId],
          messages: [...state[action.payload.roomId].messages, ...action.payload.messages],
          next: action.payload.next,
        };
        return {
          ...prevState,
        };
      }
      prevState[action.payload.roomId] = {
        messages: [...action.payload.messages],
        next: null,
      };
      return {
        ...prevState,
      };
    }
    default:
      return state;
  }
};
