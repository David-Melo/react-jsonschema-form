import React from "react";
import PropTypes from "prop-types";
import { hot } from 'react-hot-loader';

function PasswordWidget(props) {
  const { BaseInput } = props.registry.widgets;
  return <BaseInput type="password" {...props} />;
}

if (process.env.NODE_ENV !== "production") {
  PasswordWidget.propTypes = {
    value: PropTypes.string,
  };
}

export default hot(module)(PasswordWidget);
