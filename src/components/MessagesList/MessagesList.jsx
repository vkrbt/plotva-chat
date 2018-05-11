import React, { Component } from 'react';
import { Message } from '../Message/Message';
import './messagesList.css';

export class MessagesList extends Component {
  constructor() {
    super();
    this.messageList = React.createRef();
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    this.messageList.current.lastChild.scrollIntoView({behavior: 'smooth'});
  }
  render() {
    const { messages } = this.props;
    return <div ref={this.messageList} className="messages-list">{messages.map(message => <Message key={message.id} {...message} />)}</div>;
  }
}
