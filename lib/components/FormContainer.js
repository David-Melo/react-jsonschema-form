var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { getDefaultFormState, retrieveSchema, shouldRender, toIdSchema, setState } from "../utils";
import validateFormData, { toErrorList } from "../validate";

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.onChange = function (formData, newErrorSchema) {
      var mustValidate = !_this.props.noValidate && _this.props.liveValidate;
      var state = { formData: formData };
      if (mustValidate) {
        var _this$validate = _this.validate(formData),
            errors = _this$validate.errors,
            errorSchema = _this$validate.errorSchema;

        state = Object.assign({}, state, { errors: errors, errorSchema: errorSchema });
      } else if (!_this.props.noValidate && newErrorSchema) {
        state = Object.assign({}, state, {
          errorSchema: newErrorSchema,
          errors: toErrorList(newErrorSchema)
        });
      }
      setState(_this, state, function () {
        if (_this.props.onChange) {
          _this.props.onChange(_this.state);
        }
      });
    };

    _this.onBlur = function () {
      if (_this.props.onBlur) {
        var _this$props;

        (_this$props = _this.props).onBlur.apply(_this$props, arguments);
      }
    };

    _this.onFocus = function () {
      if (_this.props.onFocus) {
        var _this$props2;

        (_this$props2 = _this.props).onFocus.apply(_this$props2, arguments);
      }
    };

    _this.onSubmit = function (event) {
      event.preventDefault();

      if (!_this.props.noValidate) {
        var _this$validate2 = _this.validate(_this.state.formData),
            errors = _this$validate2.errors,
            errorSchema = _this$validate2.errorSchema;

        if (Object.keys(errors).length > 0) {
          setState(_this, { errors: errors, errorSchema: errorSchema }, function () {
            if (_this.props.onError) {
              _this.props.onError(errors);
            } else {
              console.error("Form validation failed", errors);
            }
          });
          return;
        }
      }

      setState(_this, { errors: [], errorSchema: {} }, function () {
        if (_this.props.onSubmit) {
          _this.props.onSubmit(Object.assign({}, _this.state, { status: "submitted" }));
        }
      });
    };

    _this.state = _this.getStateFromProps(props);
    return _this;
  }

  _createClass(Form, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }, {
    key: "getStateFromProps",
    value: function getStateFromProps(props) {
      var state = this.state || {};
      var schema = "schema" in props ? props.schema : this.props.schema;
      var uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
      var edit = typeof props.formData !== "undefined";
      var liveValidate = props.liveValidate || this.props.liveValidate;
      var mustValidate = edit && !props.noValidate && liveValidate;
      var definitions = schema.definitions;

      var formData = getDefaultFormState(schema, props.formData, definitions);
      var retrievedSchema = retrieveSchema(schema, definitions, formData);

      var _ref = mustValidate ? this.validate(formData, schema) : {
        errors: state.errors || [],
        errorSchema: state.errorSchema || {}
      },
          errors = _ref.errors,
          errorSchema = _ref.errorSchema;

      var idSchema = toIdSchema(retrievedSchema, uiSchema["ui:rootFieldId"], definitions, formData, props.idPrefix);
      return {
        schema: schema,
        uiSchema: uiSchema,
        idSchema: idSchema,
        formData: formData,
        edit: edit,
        errors: errors,
        errorSchema: errorSchema
      };
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }
  }, {
    key: "validate",
    value: function validate(formData) {
      var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.schema;
      var _props = this.props,
          validate = _props.validate,
          transformErrors = _props.transformErrors;

      var _getRegistry = this.getRegistry(),
          definitions = _getRegistry.definitions;

      var resolvedSchema = retrieveSchema(schema, definitions, formData);
      return validateFormData(formData, resolvedSchema, validate, transformErrors);
    }
  }, {
    key: "renderErrors",
    value: function renderErrors(ErrorListTemplate) {
      var _state = this.state,
          errors = _state.errors,
          errorSchema = _state.errorSchema,
          schema = _state.schema,
          uiSchema = _state.uiSchema;
      var _props2 = this.props,
          showErrorList = _props2.showErrorList,
          formContext = _props2.formContext;


      if (errors.length && showErrorList != false) {
        return React.createElement(ErrorListTemplate, {
          errors: errors,
          errorSchema: errorSchema,
          schema: schema,
          uiSchema: uiSchema,
          formContext: formContext
        });
      }
      return null;
    }
  }, {
    key: "getRegistry",
    value: function getRegistry() {
      return {
        fields: this.props.fields,
        widgets: this.props.widgets,
        templates: this.props.templates,
        definitions: this.props.schema.definitions || {},
        formContext: this.props.formContext || {}
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          children = _props3.children,
          safeRenderCompletion = _props3.safeRenderCompletion,
          id = _props3.id,
          idPrefix = _props3.idPrefix,
          className = _props3.className,
          name = _props3.name,
          method = _props3.method,
          target = _props3.target,
          action = _props3.action,
          autocomplete = _props3.autocomplete,
          enctype = _props3.enctype,
          acceptcharset = _props3.acceptcharset,
          noHtml5Validate = _props3.noHtml5Validate;
      var _state2 = this.state,
          schema = _state2.schema,
          uiSchema = _state2.uiSchema,
          formData = _state2.formData,
          errorSchema = _state2.errorSchema,
          idSchema = _state2.idSchema;

      var registry = this.getRegistry();
      var SchemaField = registry.fields.SchemaField,
          _registry$templates = registry.templates,
          ErrorListTemplate = _registry$templates.ErrorListTemplate,
          SubmitTemplate = _registry$templates.SubmitTemplate;


      return React.createElement(
        "form",
        {
          className: className ? className : "rjsf",
          id: id,
          name: name,
          method: method,
          target: target,
          action: action,
          autoComplete: autocomplete,
          encType: enctype,
          acceptCharset: acceptcharset,
          noValidate: noHtml5Validate,
          onSubmit: this.onSubmit },
        this.renderErrors(ErrorListTemplate),
        React.createElement(SchemaField, {
          schema: schema,
          uiSchema: uiSchema,
          errorSchema: errorSchema,
          idSchema: idSchema,
          idPrefix: idPrefix,
          formData: formData,
          onChange: this.onChange,
          onBlur: this.onBlur,
          onFocus: this.onFocus,
          registry: registry,
          safeRenderCompletion: safeRenderCompletion
        }),
        children ? children : React.createElement(SubmitTemplate, null)
      );
    }
  }]);

  return Form;
}(Component);

Form.defaultProps = {
  uiSchema: {},
  noValidate: false,
  liveValidate: false,
  safeRenderCompletion: false,
  noHtml5Validate: false
};
export default Form;


if (process.env.NODE_ENV !== "production") {
  Form.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    formData: PropTypes.any,
    templates: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
    widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])),
    fields: PropTypes.objectOf(PropTypes.func),
    onChange: PropTypes.func,
    onError: PropTypes.func,
    showErrorList: PropTypes.bool,
    onSubmit: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    method: PropTypes.string,
    target: PropTypes.string,
    action: PropTypes.string,
    autocomplete: PropTypes.string,
    enctype: PropTypes.string,
    acceptcharset: PropTypes.string,
    noValidate: PropTypes.bool,
    noHtml5Validate: PropTypes.bool,
    liveValidate: PropTypes.bool,
    validate: PropTypes.func,
    transformErrors: PropTypes.func,
    safeRenderCompletion: PropTypes.bool,
    formContext: PropTypes.object
  };
}