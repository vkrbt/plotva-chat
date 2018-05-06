import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { usersReducer } from './usersReducer';
import { messagesReducer } from './messagesReducer';
import { searchReducer } from './searchReducer';
import { chatNameReducer } from './chatNameReducer';
import { chatReducer } from './chatReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  messages: messagesReducer,
  search: searchReducer,
  chatName: chatNameReducer,
  chat: chatReducer,
});
