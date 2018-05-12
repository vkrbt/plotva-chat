import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { FETCH_ROOMS_ERROR } from '../../errorCodes';
import api from '../../api';
import { getRooms } from '../../store/actions/chatActions';

const sortByLastMessage = roomsObj =>
  Object.keys(roomsObj)
    .filter(room => !['error', 'next', 'success'].includes(room))
    .map(room => roomsObj[room])
    .sort((room1, room2) => {
      const room1length = room1.messages.length;
      const room2length = room2.messages.length;
      if (!room1.messages.length) {
        return 1;
      }
      if (!room2.messages.length) {
        return -1;
      }
      return (
        room2.messages[room2length - 1].time - room1.messages[room1length - 1].time
      );
    });

class ChatsPageComponent extends PureComponent {
  async componentDidMount() {
    await this.props.getRooms();
    await Promise.all(
      sortByLastMessage(this.props.rooms).map(async room => {
        try {
          await api.currentUserJoinRoom(room._id);
        } catch (err) {}
      }),
    );
  }

  render() {
    const { rooms } = this.props;
    if (!rooms.success && !rooms.error) {
      return <NoResults text="No chats here yet..." />;
    }
    const roomsArray = sortByLastMessage(rooms);

    return (
      <InfiniteScroller hasMore={!!this.next} loadMore={this.fetchNext}>
        <Contacts contacts={roomsArray} search="" />
        {rooms.error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  user: state.user,
  rooms: state.messages,
});

const dispatchToProps = {
  getRooms,
};

export const ChatsPage = connect(stateToProps, dispatchToProps)(ChatsPageComponent);
