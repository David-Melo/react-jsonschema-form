var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from "react";
import PropTypes from "prop-types";

import { isMultiSelect, retrieveSchema, toIdSchema, mergeObjects, getUiOptions, isFilesArray, deepEquals, getSchemaType } from "../../utils";

var COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField"
};

function getFieldComponent(schema, uiSchema, idSchema, fields, UnsupportedTemplate) {
  var field = uiSchema["ui:field"];
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields) {
    return fields[field];
  }

  var componentName = COMPONENT_TYPES[getSchemaType(schema)];
  return componentName in fields ? fields[componentName] : function () {
    return React.createElement(UnsupportedTemplate, {
      schema: schema,
      idSchema: idSchema,
      reason: "Unknown field type " + schema.type
    });
  };
}

function SchemaFieldRender(props) {
  var uiSchema = props.uiSchema,
      formData = props.formData,
      errorSchema = props.errorSchema,
      idPrefix = props.idPrefix,
      name = props.name,
      required = props.required,
      registry = props.registry;
  var definitions = registry.definitions,
      fields = registry.fields,
      templates = registry.templates,
      formContext = registry.formContext;

  var idSchema = props.idSchema;
  var schema = retrieveSchema(props.schema, definitions, formData);
  idSchema = mergeObjects(toIdSchema(schema, null, definitions, formData, idPrefix), idSchema);
  var DescriptionTemplate = templates.DescriptionTemplate,
      UnsupportedTemplate = templates.UnsupportedTemplate;

  var template = uiSchema["ui:FieldTemplate"] || "FieldTemplate";
  var FieldTemplate = templates[template];
  var FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields, UnsupportedTemplate);
  var disabled = Boolean(props.disabled || uiSchema["ui:disabled"]);
  var readonly = Boolean(props.readonly || uiSchema["ui:readonly"]);
  var autofocus = Boolean(props.autofocus || uiSchema["ui:autofocus"]);

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return React.createElement("div", null);
  }

  var uiOptions = getUiOptions(uiSchema);
  var _uiOptions$label = uiOptions.label,
      displayLabel = _uiOptions$label === undefined ? true : _uiOptions$label;

  if (schema.type === "array") {
    displayLabel = isMultiSelect(schema, definitions) || isFilesArray(schema, uiSchema, definitions);
  } else if (schema.type === "object") {
    displayLabel = false;
  } else if (schema.type === "boolean" && !uiSchema["ui:widget"]) {
    displayLabel = false;
  } else if (uiSchema["ui:field"]) {
    displayLabel = false;
  }

  var __errors = errorSchema.__errors,
      fieldErrorSchema = _objectWithoutProperties(errorSchema, ["__errors"]);

  // See #439: uiSchema: Don't pass consumed class names to child components


  var field = React.createElement(FieldComponent, Object.assign({}, props, {
    idSchema: idSchema,
    schema: schema,
    uiSchema: Object.assign({}, uiSchema, { classNames: undefined }),
    disabled: disabled,
    readonly: readonly,
    autofocus: autofocus,
    errorSchema: fieldErrorSchema,
    formContext: formContext,
    rawErrors: __errors
  }));

  var type = schema.type;

  var id = idSchema.$id;
  var label = uiSchema["ui:title"] || props.schema.title || schema.title || name;
  var description = uiSchema["ui:description"] || props.schema.description || schema.description;
  var errors = __errors;
  var help = uiSchema["ui:help"];
  var hidden = uiSchema["ui:widget"] === "hidden";
  var classNames = ["form-group", "field", "field-" + type, errors && errors.length > 0 ? "field-error has-error has-danger" : "", uiSchema.classNames].join(" ").trim();

  var fieldProps = {
    description: React.createElement(DescriptionTemplate, {
      id: id + "__description",
      description: description,
      formContext: formContext
    }),
    rawDescription: description,
    help: help,
    errors: errors,
    id: id,
    label: label,
    hidden: hidden,
    required: required,
    disabled: disabled,
    readonly: readonly,
    displayLabel: displayLabel,
    classNames: classNames,
    formContext: formContext,
    fields: fields,
    schema: schema,
    uiSchema: uiSchema
  };

  return React.createElement(
    FieldTemplate,
    fieldProps,
    field
  );
}

var SchemaField = function (_React$Component) {
  _inherits(SchemaField, _React$Component);

  function SchemaField() {
    _classCallCheck(this, SchemaField);

    return _possibleConstructorReturn(this, (SchemaField.__proto__ || Object.getPrototypeOf(SchemaField)).apply(this, arguments));
  }

  _createClass(SchemaField, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      // if schemas are equal idSchemas will be equal as well,
      // so it is not necessary to compare
      return !deepEquals(Object.assign({}, this.props, { idSchema: undefined }), Object.assign({}, nextProps, { idSchema: undefined }));
    }
  }, {
    key: "render",
    value: function render() {
      return SchemaFieldRender(this.props);
    }
  }]);

  return SchemaField;
}(React.Component);

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false
};

if (process.env.NODE_ENV !== "production") {
  SchemaField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    formData: PropTypes.any,
    errorSchema: PropTypes.object,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      templates: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired
    })
  };
}

export default SchemaField;