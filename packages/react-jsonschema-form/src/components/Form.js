import React from 'react';
import PropTypes from 'prop-types';

import FormContainer from './FormContainer';
import _fields from './fields';

const Form = ({ theme, fields, templates, widgets, ...props }) => {
  const components = {
    fields: { ..._fields, ...(fields || {}) },
    templates: { ...theme.templates, ...(templates || {}) },
    widgets: { ...theme.widgets, ...(widgets || {}) }
  };

  return <FormContainer {...props} {...components} />;
};

if (process.env.NODE_ENV !== 'production') {
  Form.propTypes = {
    theme: PropTypes.shape({
      templates: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired
    }).isRequired
  };
}

export default Form;
