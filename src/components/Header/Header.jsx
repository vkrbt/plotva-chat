import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import { SearchInput } from '../SearchInput/SearchInput';
import { HeaderTitle } from '../HeaderTitle/HeaderTitle';
import { HeaderBtn } from '../HeaderBtn/HeaderBtn';
import { Avatar } from '../Avatar/Avatar';
import './Header.css';
import api from '../../api';
import { setSelectedUsers, setUsers } from '../../store/actions/userActions';

import { connect } from 'react-redux';

class HeaderComponent extends Component {
  newChat = async () => {
    const { selectedUsers } = this.props;
    try {
      const rooms = await api.getRooms({ name: this.props.chatName });
      if (!rooms.count) {
        const room = await this.createRoomWithUsers(this.props.chatName, selectedUsers);

        const users = [].concat(this.props.users);
        users.forEach(user => {
          user.checked = false;
        });
        this.props.dispatch(setUsers(users));
        this.props.dispatch(setSelectedUsers([]));
        this.props.history.push(`/chats/${room._id}`);
      }
    } catch (err) {
      this.setState({ error: 'Произошла ошибка.' });
    }
  };

  createRoomWithUsers = async (name, users) => {
    try {
      const room = await api.createRoom({ name, users });
      return room;
    } catch (err) {
      this.setState({ error: 'Произошла при создании комнаты.' });
      return err;
    }
  };

  joinUserToRoom = async (userId, roomId) => {
    try {
      await api.userJoinRoom(userId, roomId);
    } catch (err) {
      this.setState({ error: 'Произошла ошибка при создании комнаты.' });
    }
  };

  render() {
    let { title, subtitle, type = 'chats' } = this.props;
    let size = subtitle ? 'lg' : 'sm';

    return (
      <div className={`header header_${size}`}>
        <div className="header__left">
          {type === 'search' && <SearchInput />}
          {type === 'dialog' && <HeaderBtn onClick={this.props.history.goBack} type="back" txt="Back" />}
        </div>

        {title && (
          <div className="header__center">
            <HeaderTitle title={title} subtitle={subtitle} />
          </div>
        )}

        <div className="header__right">
          {type === 'contacts' &&
            (this.props.createChat ? (
              <Icon type="header-add" onClick={this.newChat} />
            ) : (
              <Link to="/search">
                <Icon type="header-add" />
              </Link>
            ))}
          {type === 'chats' && (
            <Link to="/create_chat">
              <Icon type="header-write" />
            </Link>
          )}
          {type === 'search' && (
            <Link to="/contacts">
              <Header type="action" txt="Cancel" />
            </Link>
          )}
          {type === 'dialog' && <Avatar size="xsmall" />}
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  selectedUsers: state.users.selectedUsers,
  chatName: state.chatName.currentChatName,
  user: state.user,
  users: state.users.users,
});

export const Header = connect(stateToProps)(withRouter(HeaderComponent));
