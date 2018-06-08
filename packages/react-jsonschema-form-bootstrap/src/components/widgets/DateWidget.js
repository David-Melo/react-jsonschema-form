import React from "react";
import PropTypes from "prop-types";
import { hot } from 'react-hot-loader';

function DateWidget(props) {
  const {
    onChange,
    registry: {
      widgets: { BaseInput },
    },
  } = props;
  return (
    <BaseInput
      type="date"
      {...props}
      onChange={value => onChange(value || undefined)}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  DateWidget.propTypes = {
    value: PropTypes.string,
  };
}

export default hot(module)(DateWidget);
