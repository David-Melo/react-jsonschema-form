import React from 'react';

import Form from '@react-schema-form/components-form';
import defaultFields from '@react-schema-form/components-fields';
import {
  templates as defaultTemplates,
  widgets as defaultWidgets
} from '@react-schema-form/components-bootstrap';

export default props => {
  const components = {
    fields: { ...defaultFields, ...(props.fields || {}) },
    templates: { ...defaultTemplates, ...(props.templates || {}) },
    widgets: { ...defaultWidgets, ...(props.widgets || {}) }
  };
  
  return <Form {...props} {...components} />;
};
