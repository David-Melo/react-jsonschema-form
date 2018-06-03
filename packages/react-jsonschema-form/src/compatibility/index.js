import { initRenderForm } from '../test-utils';

import Form from './Form';
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
  Form,
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
  const renderForm = initRenderForm(Form, props);
  return part => check[part](renderForm, Form, props);
}

export default initCheck;
