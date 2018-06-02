import React from 'react';
import PropTypes from 'prop-types';

import { asNumber } from '@react-schema-form/utils';

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, value) {
  if (value === '') {
    return undefined;
  } else if (
    type === 'array' &&
    items &&
    ['number', 'integer'].includes(items.type)
  ) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

function getValue(event, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else {
    return event.target.value;
  }
}

function SelectWidget(props) {
  const {
    id,
    schema,
    options,
    value,
    onChange,
    onBlur,
    onFocus,
    readonly,
    disabled,
    required,
    autofocus,
    placeholder,
    multiple
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = props.multiple ? [] : '';

  const _onBlur = event => {
    const newValue = getValue(event, props.multiple);
    onBlur(props.id, processValue(props.schema, newValue));
  };

  const _onFocus = event => {
    const newValue = getValue(event, props.multiple);
    onFocus(props.id, processValue(props.schema, newValue));
  };

  const _onChange = event => {
    const newValue = getValue(event, props.multiple);
    onChange(processValue(props.schema, newValue));
  };

  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control"
      value={typeof value === 'undefined' ? emptyValue : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={onBlur && _onBlur}
      onFocus={onFocus && _onFocus}
      onChange={_onChange}
    >
      {!multiple && !schema.default && <option value="">{placeholder}</option>}
      {enumOptions.map(({ value, label }, i) => {
        const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1;
        return (
          <option key={i} value={value} disabled={disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

SelectWidget.defaultProps = {
  autofocus: false
};

if (process.env.NODE_ENV !== 'production') {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
}

export default SelectWidget;
