import React from 'react';

import Form from '@rjsform/form';
import defaultFields from '@rjsform/fields';
import {
  templates as defaultTemplates,
  widgets as defaultWidgets
} from '@rjsform/ui-bootstrap';

export default props => {
  const components = {
    fields: { ...defaultFields, ...(props.fields || {}) },
    templates: { ...defaultTemplates, ...(props.templates || {}) },
    widgets: { ...defaultWidgets, ...(props.widgets || {}) }
  };
  
  return <Form {...props} {...components} />;
};
