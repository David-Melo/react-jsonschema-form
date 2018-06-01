import React from 'react';
import PropTypes from 'prop-types';

function RadioWidget(props) {
  const { options, value, disabled, readonly, required, autofocus } = props;
  // Generating a unique field name to identify this set of radio buttons
  const name = Math.random().toString();
  const { enumOptions, inline } = options;
  const inlineCls = inline ? 'form-check-inline' : '';
  const onChange = value => () => props.onChange(value);

  // checked={checked} has been moved above name={name}, As mentioned in #349;
  // this is a temporary fix for radio button rendering bug in React, facebook/react#7630.
  return (
    <div
      className="field-radio-group"
      data-testid={inline ? 'field-radio-group-inline' : 'field-radio-group'}
    >
      {enumOptions.map((option, index) => {
        const checked = option.value === value;
        const disabledCls = disabled || readonly ? 'disabled' : '';

        return (
          <div key={index} className={`form-check ${disabledCls} ${inlineCls}`}>
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                checked={checked}
                name={name}
                required={required}
                value={option.value}
                disabled={disabled || readonly}
                autoFocus={autofocus && index === 0}
                onChange={onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

RadioWidget.defaultProps = {
  autofocus: false
};

if (process.env.NODE_ENV !== 'production') {
  RadioWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func
  };
}
export default RadioWidget;
