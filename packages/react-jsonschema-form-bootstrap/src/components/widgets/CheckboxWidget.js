import React from 'react';
import PropTypes from 'prop-types';

import DescriptionTemplate from '../templates/DescriptionTemplate';

function CheckboxWidget(props) {
  const {
    id,
    schema,
    value,
    onChange,
    label,
    disabled,
    readonly,
    required,
    autofocus
  } = props;

  return (
    <div className="checkbox">
      {schema.description && (
        <DescriptionTemplate description={schema.description} />
      )}
      <div className={`form-check ${disabled || readonly ? 'disabled' : ''}`}>
        <label className="form-check-label">
          <input
            type="checkbox"
            id={id}
            className="form-check-input"
            checked={typeof value === 'undefined' ? false : value}
            required={required}
            disabled={disabled || readonly}
            autoFocus={autofocus}
            onChange={event => onChange(event.target.checked)}
          />
          <span>{label}</span>
        </label>
      </div>
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false
};

if (process.env.NODE_ENV !== 'production') {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func
  };
}

export default CheckboxWidget;
