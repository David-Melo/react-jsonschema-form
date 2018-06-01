import React from 'react';

import Form from '@rjsform/form';
import defaultFields from '@rjsform/fields';
import {
  templates as defaultTemplates,
  widgets as defaultWidgets
} from '@rjsform/ui-bootstrap';

export default ({ fields = {}, templates = {}, widgets = {}, ...props }) => {
  const components = {
    fields: { ...defaultFields, ...fields },
    templates: { ...defaultTemplates, ...templates },
    widgets: { ...defaultWidgets, ...widgets }
  };

  return <Form {...props} {...components} />;
};
