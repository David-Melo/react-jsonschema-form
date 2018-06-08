import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';

function TextWidget(props) {
  const { BaseInput } = props.registry.widgets;
  return <BaseInput {...props} />;
}

if (process.env.NODE_ENV !== 'production') {
  TextWidget.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.string
  };
}

export default hot(module)(TextWidget);
