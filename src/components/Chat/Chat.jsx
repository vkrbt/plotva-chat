import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { MessagesList } from '../MessagesList/MessagesList';
import { fetchMessages } from '../../store/actions/messagesActions';
import { Error } from '../Error/Error';
import { NoResults } from '../NoResults/NoResults';
import { FETCH_MESSAGES_ERROR } from '../../errorCodes';
import api from '../../api';

class ChatComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
    this.joinRoom();
    this.fetchNext();
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  async joinRoom() {
    try {
      await api.currentUserJoinRoom(this.props.match.params.id);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async leaveRoom() {
    try {
      await api.leaveRoom();
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async fetchNext() {
    try {
      await this.props.fetchMessages(this.props.match.params.id);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  render() {
    const { error } = this.state;
    const { messages, match } = this.props;

    if (!messages.length && !error) {
      return <NoResults text="No messages here yet..." />;
    }
    return (
      <InfiniteScroller loadMore={this.fetchNext}>
        {messages[match.params.id] ? <MessagesList messages={messages[match.params.id].messages} /> : null}
        {error ? <Error code={FETCH_MESSAGES_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  user: state.user,
  messages: state.messages,
});

export const Chat = withRouter(connect(stateToProps, { fetchMessages })(ChatComponent));
