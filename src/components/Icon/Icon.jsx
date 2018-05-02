import React from 'react';
import './Icon.css';

export function Icon (props) {
  let {type, onClick, className} = props;
  return (
      <span onClick={onClick} className={`icon icon_${type} ${className}`} />
    );
}
