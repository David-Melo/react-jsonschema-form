function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import PropTypes from 'prop-types';

import { getWidget, getUiOptions, isSelect, optionsList } from '../../utils';

function StringField(props) {
  var schema = props.schema,
      name = props.name,
      uiSchema = props.uiSchema,
      idSchema = props.idSchema,
      formData = props.formData,
      required = props.required,
      disabled = props.disabled,
      readonly = props.readonly,
      autofocus = props.autofocus,
      onChange = props.onChange,
      onBlur = props.onBlur,
      onFocus = props.onFocus,
      registry = props.registry,
      rawErrors = props.rawErrors;
  var title = schema.title,
      format = schema.format;
  var widgets = registry.widgets,
      formContext = registry.formContext;

  var enumOptions = isSelect(schema) && optionsList(schema);
  var defaultWidget = format || (enumOptions ? 'select' : 'text');

  var _getUiOptions = getUiOptions(uiSchema),
      _getUiOptions$widget = _getUiOptions.widget,
      widget = _getUiOptions$widget === undefined ? defaultWidget : _getUiOptions$widget,
      _getUiOptions$placeho = _getUiOptions.placeholder,
      placeholder = _getUiOptions$placeho === undefined ? '' : _getUiOptions$placeho,
      options = _objectWithoutProperties(_getUiOptions, ['widget', 'placeholder']);

  var Widget = getWidget(schema, widget, widgets);

  return React.createElement(Widget, {
    options: Object.assign({}, options, { enumOptions: enumOptions }),
    schema: schema,
    id: idSchema && idSchema.$id,
    label: title === undefined ? name : title,
    value: formData,
    onChange: onChange,
    onBlur: onBlur,
    onFocus: onFocus,
    required: required,
    disabled: disabled,
    readonly: readonly,
    formContext: formContext,
    autofocus: autofocus,
    registry: registry,
    placeholder: placeholder,
    rawErrors: rawErrors
  });
}

if (process.env.NODE_ENV !== 'production') {
  StringField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    formData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      templates: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired
    }),
    formContext: PropTypes.object.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    rawErrors: PropTypes.arrayOf(PropTypes.string)
  };
}

StringField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false
};

export default StringField;