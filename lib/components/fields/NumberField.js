import React from 'react';
import PropTypes from 'prop-types';

import { asNumber } from '../../utils';

function NumberField(props) {
  var StringField = props.registry.fields.StringField;

  return React.createElement(StringField, Object.assign({}, props, {
    onChange: function onChange(value) {
      return props.onChange(asNumber(value));
    }
  }));
}

if (process.env.NODE_ENV !== 'production') {
  NumberField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    required: PropTypes.bool,
    formContext: PropTypes.object.isRequired
  };
}

NumberField.defaultProps = {
  uiSchema: {}
};

export default NumberField;