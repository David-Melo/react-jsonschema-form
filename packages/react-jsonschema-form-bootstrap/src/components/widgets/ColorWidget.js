import React from 'react';
import PropTypes from 'prop-types';

function ColorWidget(props) {
  const {
    className = '',
    disabled,
    readonly,
    registry: {
      widgets: { BaseInput }
    }
  } = props;
  const style = {
    ...(props.styles || {}),
    height: '2.25rem'
  };
  return (
    <BaseInput
      type="color"
      {...props}
      style={style}
      disabled={disabled || readonly}
      className={`color-input ${className}`}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  ColorWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func
  };
}

export default ColorWidget;
