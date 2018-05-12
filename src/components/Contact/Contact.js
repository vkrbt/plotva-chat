import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon/Icon';

export const Contact = props => {
  const {
    avatar,
    userName,
    time,
    count,
    icon,
    onClick,
    content,
    link,
    color,
    size = 'large',
    contentType = 'message',
    checked = false,
  } = props;

  let defaultName = '';
  if (userName) {
    userName.split(' ').forEach(word => {
      defaultName += word[0];
    });
  }
  const messageLen = props.messages && props.messages.length;
  const lastMesage = content
    ? content
    : (props.messages && props.messages[messageLen - 1] && props.messages[messageLen - 1].text) || 'No messages';
  return (
    <div onClick={onClick} className={`contact contact_${size}`}>
      <Avatar avatar={avatar} size={size} checked={checked} defaultName={defaultName} color={color} />
      <div className="contact__content">
        <div className="content__header">
          <div className="content__name">{userName}</div>
          {time ? (
            <div className="content__time">
              {icon ? (
                <div className="content__icon">
                  <Icon type={icon} />
                </div>
              ) : (
                false
              )}
              {time}
            </div>
          ) : (
            false
          )}
        </div>
        <div className="content__body">
          {lastMesage ? <div className={`content__text content__text_${contentType}`}>{lastMesage}</div> : false}
          {count ? <div className="content__counter">{count}</div> : false}
        </div>
      </div>
      {link ? <Link to={link} /> : false}
    </div>
  );
};
