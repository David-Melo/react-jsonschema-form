import { initRenderForm } from '../test-utils';

import FormTest from './Form';
import ArrayField from './ArrayField';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import BooleanField from './BooleanField';
import FieldTemplate from './FieldTemplate';
import NumberField from './NumberField';
import ObjectField from './ObjectField';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import SchemaField from './SchemaField';
import StringField from './StringField';
import FormContext from './FormContext';
import uiSchema from './uiSchema';
import performance from './performance';

const check = {
  Form: FormTest,
  ArrayField,
  ArrayFieldTemplate,
  BooleanField,
  FieldTemplate,
  NumberField,
  ObjectField,
  ObjectFieldTemplate,
  SchemaField,
  StringField,
  FormContext,
  uiSchema,
  performance
};

function initCheck(Form, props) {
  const renderForm = initRenderForm(Form, {
    safeRenderCompletion: true,
    ...props
  });
  return (part, options) => check[part]({ renderForm, Form, props })(options);
}

export default initCheck;
