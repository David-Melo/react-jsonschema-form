import React from 'react';
import PropTypes from 'prop-types';

import FormContainer from './FormContainer';
import fields from './fields';

const Form = props => {
  const components = {
    fields: { ...fields, ...(props.fields || {}) },
    templates: { ...props.theme.templates, ...(props.templates || {}) },
    widgets: { ...props.theme.widgets, ...(props.widgets || {}) }
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
