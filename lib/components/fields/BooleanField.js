function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import PropTypes from 'prop-types';

import { getWidget, getUiOptions, optionsList } from '../../utils';

function BooleanField(props) {
  var schema = props.schema,
      name = props.name,
      uiSchema = props.uiSchema,
      idSchema = props.idSchema,
      formData = props.formData,
      registry = props.registry,
      required = props.required,
      disabled = props.disabled,
      readonly = props.readonly,
      autofocus = props.autofocus,
      onChange = props.onChange,
      rawErrors = props.rawErrors;
  var title = schema.title;
  var widgets = registry.widgets,
      formContext = registry.formContext;

  var _getUiOptions = getUiOptions(uiSchema),
      _getUiOptions$widget = _getUiOptions.widget,
      widget = _getUiOptions$widget === undefined ? 'checkbox' : _getUiOptions$widget,
      options = _objectWithoutProperties(_getUiOptions, ['widget']);

  var Widget = getWidget(schema, widget, widgets);
  var enumOptions = optionsList({
    enum: [true, false],
    enumNames: schema.enumNames || ['yes', 'no']
  });

  return React.createElement(Widget, {
    options: Object.assign({}, options, { enumOptions: enumOptions }),
    schema: schema,
    id: idSchema && idSchema.$id,
    onChange: onChange,
    label: title === undefined ? name : title,
    value: formData,
    required: required,
    disabled: disabled,
    readonly: readonly,
    registry: registry,
    formContext: formContext,
    autofocus: autofocus,
    rawErrors: rawErrors
  });
}

if (process.env.NODE_ENV !== 'production') {
  BooleanField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      templates: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired
    }),
    rawErrors: PropTypes.arrayOf(PropTypes.string)
  };
}

BooleanField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false
};

export default BooleanField;