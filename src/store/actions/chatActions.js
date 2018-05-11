import { SET_CHAT_INFO, CLEAR_CHAT_INFO, SET_CHAT_NAME, GET_ROOMS_ERROR, GET_ROOMS_RECEIVED } from './actionTypes';
import api from '../../api';
import { mapMessages } from './messagesActions';

export const setChatName = query => ({
  type: SET_CHAT_NAME,
  payload: query,
});

export const setChatInfo = payload => {
  return {
    payload,
    type: SET_CHAT_INFO,
  };
};

export const clearChatInfo = () => {
  return {
    type: CLEAR_CHAT_INFO,
  };
};

export const fetchChat = roomId => async dispatch => {
  const room = await api.getRoom(roomId);
  if (room) {
    dispatch(setChatInfo({ title: room.name, subtitle: `${room.users.length} members` }));
  }
};

export const clearChat = () => dispatch => {
  dispatch(clearChatInfo());
};

const getRoomsReceived = (rooms, next) => ({
  type: GET_ROOMS_RECEIVED,
  payload: {
    rooms,
    next,
  },
});

const errorWhileLoadingRooms = error => ({
  type: GET_ROOMS_ERROR,
  payload: { error },
});

export const getRooms = () => async (dispatch, getState) => {
  const next = getState().messages.next;
  const currentRooms = getState().messages;
  const currentUserId = getState().user._id;
  try {
    if (next) {
      const res = await api.getCurrentUserRooms(next);
      let rooms = await Promise.all(
        res.items.map(async room => {
          const messages = await api.getRoomMessages(room._id);
          const messagesNormalized = mapMessages(messages.items, currentUserId);
          const lastMessage = messagesNormalized[messagesNormalized.length - 1];
          return {
            _id: room._id,
            userName: room.name,
            messages: messagesNormalized,
            next:
              lastMessage && lastMessage.id
                ? {
                    limit: 10,
                    lastId: lastMessage.id,
                    roomId: room._id,
                  }
                : null,
          };
        }),
      );
      rooms = rooms.reduce((roomsObj, room) => {
        roomsObj[room._id] = {
          ...room,
          ...roomsObj[room._id]
        };
        return roomsObj;
      }, currentRooms);
      dispatch(getRoomsReceived(rooms, res.next));
      return res;
    }
  } catch (err) {
    dispatch(errorWhileLoadingRooms(err));
    return err;
  }
};
