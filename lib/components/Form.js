import React from 'react';
import PropTypes from 'prop-types';

import FormContainer from './FormContainer';
import fields from './fields';

var Form = function Form(props) {
  var components = {
    fields: Object.assign({}, fields, props.fields || {}),
    templates: Object.assign({}, props.theme.templates, props.templates || {}),
    widgets: Object.assign({}, props.theme.widgets, props.widgets || {})
  };

  return React.createElement(FormContainer, Object.assign({}, props, components));
};

if (process.env.NODE_ENV !== 'production') {
  Form.propTypes = {
    theme: PropTypes.shape({
      templates: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired
    }).isRequired
  };
}

export default Form;