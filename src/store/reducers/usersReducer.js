import { SET_USERS, SET_NEXT, SET_SELECTED } from '../actions/actionTypes';

export const usersReducer = (state = { users: [], selectedUsers: [] }, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: [...action.users],
      };
    case SET_NEXT:
      return {
        ...state,
        next: action.next,
      };
    case SET_SELECTED:
      return {
        ...state,
        selectedUsers: [...action.users],
      };
    default:
      return state;
  }
};
