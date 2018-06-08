import React from 'react';

import { pack, describe, it } from './helpers';

export default pack(({ renderForm }) => {
  describe('FormContext', () => {
    const schema = { type: 'string' };

    const formContext = { foo: 'bar' };

    const CustomComponent = function(props) {
      return <div id={props.formContext.foo} />;
    };

    // TODO: internal test (props)
    it.skip('should be passed to Form', () => {
      const { comp } = renderForm({
        schema: schema,
        formContext
      });
      expect(comp.props.formContext).toEqual(formContext);
    });

    it('should be passed to custom field', () => {
      const fields = { custom: CustomComponent };

      const { node } = renderForm({
        schema: schema,
        uiSchema: { 'ui:field': 'custom' },
        fields,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to custom widget', () => {
      const widgets = { custom: CustomComponent };

      const { node } = renderForm({
        schema: { type: 'string' },
        uiSchema: { 'ui:widget': 'custom' },
        widgets,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to TemplateField', () => {
      function CustomTemplateField({ formContext }) {
        return <div id={formContext.foo} />;
      }

      const { node } = renderForm({
        schema: {
          type: 'object',
          properties: {
            prop: {
              type: 'string'
            }
          }
        },
        FieldTemplate: CustomTemplateField,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to ArrayTemplateField', () => {
      function CustomArrayTemplateField({ formContext }) {
        return <div id={formContext.foo} />;
      }

      const { node } = renderForm({
        schema: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        ArrayFieldTemplate: CustomArrayTemplateField,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to custom TitleField', () => {
      const fields = { TitleField: CustomComponent };

      const { node } = renderForm({
        schema: {
          type: 'object',
          title: 'A title',
          properties: {
            prop: {
              type: 'string'
            }
          }
        },
        fields,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to custom DescriptionField', () => {
      const fields = { DescriptionField: CustomComponent };

      const { node } = renderForm({
        schema: { type: 'string', description: 'A description' },
        fields,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to multiselect', () => {
      const widgets = { SelectWidget: CustomComponent };
      const { node } = renderForm({
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['foo'],
            enumNames: ['bar']
          },
          uniqueItems: true
        },
        widgets,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });

    it('should be passed to files array', () => {
      const widgets = { FileWidget: CustomComponent };
      const { node } = renderForm({
        schema: {
          type: 'array',
          items: {
            type: 'string',
            format: 'data-url'
          }
        },
        widgets,
        formContext
      });

      expect(node.querySelector('#' + formContext.foo)).toBeDefined();
    });
  });
});
