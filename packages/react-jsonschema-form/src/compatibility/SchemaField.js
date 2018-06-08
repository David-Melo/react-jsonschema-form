import React from 'react';
import { Simulate } from 'react-testing-library';
import 'dom-testing-library/extend-expect';

import { pack, describe, it } from './helpers';
import { suppressLogs } from '../test-utils';

export default pack(({ renderForm, fields }) => {
  const { SchemaField } = fields;

  describe('SchemaField', () => {
    describe('Unsupported field', () => {
      it('should warn on invalid field type', () => {
        const { node } = renderForm({
          schema: { type: 'invalid' }
        });

        expect(node.querySelector('.unsupported-field').textContent).toContain(
          'Unknown field type invalid'
        );
      });
    });

    describe('Custom SchemaField component', () => {
      const CustomSchemaField = function(props) {
        return (
          <div id="custom">
            <SchemaField {...props} />
          </div>
        );
      };

      it('should use the specified custom SchemaType property', () => {
        const fields = { SchemaField: CustomSchemaField };
        const { node } = renderForm({
          schema: { type: 'string' },
          fields
        });

        expect(
          node.querySelectorAll('#custom > .field input[type=text]').length
        ).toBe(1);
      });
    });

    describe('ui:field support', () => {
      class MyObject extends React.Component {
        constructor(props) {
          super(props);
        }

        render() {
          return <div data-testid="custom" />;
        }
      }

      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string' }
        }
      };

      it('should use provided direct custom component for object', () => {
        const uiSchema = { 'ui:field': MyObject };

        const { node, queryByTestId } = renderForm({ schema, uiSchema });

        expect(queryByTestId('custom')).toBeInTheDOM();

        expect(node.querySelectorAll('label').length).toBe(0);
      });

      it('should use provided direct custom component for specific property', () => {
        const uiSchema = {
          foo: { 'ui:field': MyObject }
        };

        const { node, queryByTestId } = renderForm({ schema, uiSchema });

        expect(queryByTestId('custom')).toBeInTheDOM();

        expect(node.querySelectorAll('input').length).toBe(1);

        expect(node.querySelectorAll('label').length).toBe(1);
      });

      it('should provide custom field the expected fields', () => {
        let receivedProps;
        renderForm({
          schema,
          uiSchema: {
            'ui:field': class extends React.Component {
              constructor(props) {
                super(props);
                receivedProps = props;
              }
              render() {
                return <div />;
              }
            }
          }
        });

        const { registry } = receivedProps;
        expect(registry.widgets).toEqual(registry.widgets);
        expect(registry.definitions).toEqual({});
        expect(typeof registry.fields).toBe('object');
        expect(registry.fields.SchemaField).toEqual(SchemaField);

        // renamed to Title and Description and moved to registry.templates
        // expect(registry.fields.TitleField).toEqual(TitleField);
        // expect(registry.fields.DescriptionField).toEqual(DescriptionField);
      });

      it('should use registered custom component for object', () => {
        const uiSchema = { 'ui:field': 'myobject' };
        const fields = { myobject: MyObject };

        const { queryByTestId } = renderForm({ schema, uiSchema, fields });

        expect(queryByTestId('custom')).toBeInTheDOM();
      });

      it('should handle referenced schema definitions', () => {
        const schema = {
          definitions: {
            foobar: {
              type: 'object',
              properties: {
                foo: { type: 'string' },
                bar: { type: 'string' }
              }
            }
          },
          $ref: '#/definitions/foobar'
        };
        const uiSchema = { 'ui:field': 'myobject' };
        const fields = { myobject: MyObject };

        const { queryByTestId } = renderForm({ schema, uiSchema, fields });

        expect(queryByTestId('custom')).toBeInTheDOM();
      });

      it('should not pass classNames to child component', () => {
        const schema = {
          type: 'object',
          properties: {
            bar: { type: 'string' }
          }
        };
        const uiSchema = {
          classNames: 'foo'
        };

        const { node } = renderForm({ schema, uiSchema });

        expect(node.querySelectorAll('.foo').length).toBe(1);
      });
    });

    describe('label support', () => {
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      };

      it('should render label by default', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelector('label')).toBeInTheDOM();
      });

      it('should render label if ui:options label is set to true', () => {
        const uiSchema = {
          foo: { 'ui:options': { label: true } }
        };

        const { node } = renderForm({ schema, uiSchema });
        expect(node.querySelector('label')).toBeInTheDOM();
      });

      it('should not render label if ui:options label is set to false', () => {
        const uiSchema = {
          foo: { 'ui:options': { label: false } }
        };

        const { node } = renderForm({ schema, uiSchema });
        expect(node.querySelector('label')).not.toBeInTheDOM();
      });
    });

    describe('description support', () => {
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string', description: 'A Foo field' },
          bar: { type: 'string' }
        }
      };

      it('should render description if available from the schema', () => {
        const { queryByText } = renderForm({ schema });

        expect(queryByText('A Foo field')).toBeInTheDOM();
      });

      it('should render description if available from a referenced schema', () => {
        // Overriding.
        const schemaWithReference = {
          type: 'object',
          properties: {
            foo: { $ref: '#/definitions/foo' },
            bar: { type: 'string' }
          },
          definitions: {
            foo: {
              type: 'string',
              description: 'A Foo field'
            }
          }
        };
        const { queryByText } = renderForm({
          schema: schemaWithReference
        });

        expect(queryByText('A Foo field')).toBeInTheDOM();
      });

      it('should not render description if not available from schema', () => {
        const { node } = renderForm({ schema });

        expect(node.querySelector('#root_bar__description')).not.toBeInTheDOM();
      });

      // renamed to Description and moved to registry.templates
      it.skip('should render a customized description field', () => {
        const CustomDescriptionField = ({ description }) => (
          <div id="custom">{description}</div>
        );

        const { node } = renderForm({
          schema,
          fields: {
            DescriptionField: CustomDescriptionField
          }
        });

        expect(node.querySelector('#custom').textContent).toEqual(
          'A Foo field'
        );
      });
    });

    describe('errors', () => {
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      };

      const uiSchema = {
        'ui:field': props => {
          const { uiSchema, ...fieldProps } = props; //eslint-disable-line
          return <SchemaField {...fieldProps} />;
        }
      };

      function validate(formData, errors) {
        errors.addError('_container');
        errors.foo.addError('_test');
        return errors;
      }

      it('should render it\'s own errors', () => {
        const { node, queryAllByTestId, queryByText } = renderForm({
          schema,
          uiSchema,
          validate
        });

        suppressLogs('error', () => {
          Simulate.submit(node);
        });

        const matches = queryAllByTestId('error-detail');
        expect(matches.length).toBe(2);
        expect(queryByText('_container')).toBeInTheDOM();
      });

      it('should pass errors to child component', () => {
        const { node } = renderForm({
          schema,
          uiSchema,
          validate
        });

        suppressLogs('error', () => {
          Simulate.submit(node);
        });

        const matches = node.querySelectorAll(
          'form .form-group .form-group .text-danger'
        );
        expect(matches.length).toBe(1);
        expect(matches[0].textContent).toContain('test');
      });

      describe('Custom error rendering', () => {
        const customStringWidget = props => {
          return <div data-testid="custom-text-widget">{props.errors}</div>;
        };

        it('should pass errors down to custom widgets', () => {
          const { node, queryAllByTestId, queryByText } = renderForm({
            schema,
            uiSchema,
            validate,
            widgets: { BaseInput: customStringWidget }
          });

          suppressLogs('error', () => {
            Simulate.submit(node);
          });

          const matches = queryAllByTestId('custom-text-widget');
          expect(matches.length).toBe(1);
          expect(queryByText('_test')).toBeInTheDOM();
        });
      });
    });

    describe('schema dependencies [NEW]', () => {
      const schema = {
        type: 'object',
        properties: {
          credit_card: {
            title: 'Credit Card',
            type: 'number'
          }
        },
        dependencies: {
          credit_card: {
            properties: {
              billing_address: {
                title: 'Billing Address',
                type: 'string'
              }
            },
            required: ['billing_address']
          }
        }
      };
      const { getByLabelText, queryByLabelText } = renderForm({ schema });

      it('should not show dependent field', () => {
        expect(queryByLabelText('Billing Address')).not.toBeInTheDOM();
      });

      it('should show the dependent field', () => {
        Simulate.change(getByLabelText('Credit Card'), {
          target: { value: '55' }
        });
        expect(queryByLabelText('Billing Address')).toBeInTheDOM();
      });

      it('should update value of the dependent field', () => {
        Simulate.change(getByLabelText('Billing Address'), {
          target: { value: 'Abc' }
        });
        expect(getByLabelText('Billing Address').value).toBe('Abc');
      });
    });
  });
});
