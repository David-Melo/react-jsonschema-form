import React from 'react';
import PropTypes from 'prop-types';

function TextareaWidget(props) {
  const {
    id,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    required,
    readonly,
    disabled,
    autofocus,
    value,
    options
  } = props;
  const _onChange = ({ target: { value } }) => {
    return onChange(value === '' ? props.options.emptyValue : value);
  };

  return (
    <textarea
      id={id}
      className="form-control"
      value={typeof value === 'undefined' ? '' : value}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={options.rows}
      onBlur={onBlur && (event => onBlur(props.id, event.target.value))}
      onFocus={onFocus && (event => onFocus(props.id, event.target.value))}
      onChange={_onChange}
    />
  );
}

TextareaWidget.defaultProps = {
  autofocus: false,
  options: {}
};

if (process.env.NODE_ENV !== 'production') {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.number
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
}

export default TextareaWidget;
