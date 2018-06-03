var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { orderProperties, retrieveSchema } from "../../utils";

var ObjectField = function (_Component) {
  _inherits(ObjectField, _Component);

  function ObjectField() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ObjectField);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ObjectField.__proto__ || Object.getPrototypeOf(ObjectField)).call.apply(_ref, [this].concat(args))), _this), _this.onPropertyChange = function (name) {
      return function (value, errorSchema) {
        var newFormData = Object.assign({}, _this.props.formData, _defineProperty({}, name, value));
        _this.props.onChange(newFormData, errorSchema && _this.props.errorSchema && Object.assign({}, _this.props.errorSchema, _defineProperty({}, name, errorSchema)));
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ObjectField, [{
    key: "isRequired",
    value: function isRequired(name) {
      var schema = this.props.schema;
      return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          uiSchema = _props.uiSchema,
          formData = _props.formData,
          errorSchema = _props.errorSchema,
          idSchema = _props.idSchema,
          name = _props.name,
          required = _props.required,
          disabled = _props.disabled,
          readonly = _props.readonly,
          idPrefix = _props.idPrefix,
          onBlur = _props.onBlur,
          onFocus = _props.onFocus,
          registry = _props.registry;
      var definitions = registry.definitions,
          fields = registry.fields,
          templates = registry.templates,
          formContext = registry.formContext;
      var SchemaField = fields.SchemaField;
      var TitleTemplate = templates.TitleTemplate,
          DescriptionTemplate = templates.DescriptionTemplate;

      var template = uiSchema["ui:ObjectFieldTemplate"] || "ObjectFieldTemplate";
      var ObjectFieldTemplate = templates[template];
      var schema = retrieveSchema(this.props.schema, definitions, formData);
      var title = schema.title === undefined ? name : schema.title;
      var description = uiSchema["ui:description"] || schema.description;
      var orderedProperties = void 0;

      try {
        var properties = Object.keys(schema.properties);
        orderedProperties = orderProperties(properties, uiSchema["ui:order"]);
      } catch (err) {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            { className: "config-error", style: { color: "red" } },
            "Invalid ",
            name || "root",
            " object field configuration:",
            React.createElement(
              "em",
              null,
              err.message
            ),
            "."
          ),
          React.createElement(
            "pre",
            null,
            JSON.stringify(schema)
          )
        );
      }

      var templateProps = {
        title: uiSchema["ui:title"] || title,
        description: description,
        TitleTemplate: TitleTemplate,
        DescriptionTemplate: DescriptionTemplate,
        properties: orderedProperties.map(function (name) {
          return {
            content: React.createElement(SchemaField, {
              key: name,
              name: name,
              required: _this2.isRequired(name),
              schema: schema.properties[name],
              uiSchema: uiSchema[name],
              errorSchema: errorSchema[name],
              idSchema: idSchema[name],
              idPrefix: idPrefix,
              formData: formData[name],
              onChange: _this2.onPropertyChange(name),
              onBlur: onBlur,
              onFocus: onFocus,
              registry: registry,
              disabled: disabled,
              readonly: readonly
            }),
            name: name,
            readonly: readonly,
            disabled: disabled,
            required: required
          };
        }),
        required: required,
        idSchema: idSchema,
        uiSchema: uiSchema,
        schema: schema,
        formData: formData,
        formContext: formContext
      };
      return React.createElement(ObjectFieldTemplate, templateProps);
    }
  }]);

  return ObjectField;
}(Component);

ObjectField.defaultProps = {
  uiSchema: {},
  formData: {},
  errorSchema: {},
  idSchema: {},
  required: false,
  disabled: false,
  readonly: false
};


if (process.env.NODE_ENV !== "production") {
  ObjectField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      templates: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired
    })
  };
}

export default ObjectField;