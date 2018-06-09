import React from 'react';
import { Simulate } from 'react-testing-library';
import 'dom-testing-library';

import { pack, describe, it } from './helpers';
import { getArg, suppressLogs } from '../test-utils';

export default pack(({ renderForm }) => {
  describe('<ArrayField>', () => {
    const CustomgetStateonent = props => {
      return <div data-testid="custom">{props.errors}</div>;
    };

    describe('Unsupported array schema', () => {
      it('should warn on missing items descriptor', () => {
        const { node } = renderForm({ schema: { type: 'array' } });
        expect(
          node.querySelector('.field-array > .unsupported-field').textContent
        ).toContain('Missing items definition');
      });
    });
    describe('List of inputs', () => {
      const schema = {
        type: 'array',
        title: 'my list',
        description: 'my description',
        items: { type: 'string' }
      };

      it('should render a fieldset', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelectorAll('fieldset').length).toBe(1);
      });

      it('should render a fieldset legend', () => {
        const { node } = renderForm({ schema });
        const legend = node.querySelector('fieldset > legend');
        expect(legend.textContent).toEqual('my list');
        expect(legend.id).toEqual('root__title');
      });

      it('should render a description', () => {
        const { node } = renderForm({ schema });
        const description = node.querySelector('fieldset > .field-description');
        expect(description.textContent).toEqual('my description');
        expect(description.id).toEqual('root__description');
      });

      // renamed to Title and moved into templates
      it.skip('should render a customized title', () => {
        const CustomTitleField = ({ title }) => <div id="custom">{title}</div>;
        const { node } = renderForm({
          schema,
          fields: { TitleField: CustomTitleField }
        });
        expect(node.querySelector('fieldset > #custom').textContent).toEqual(
          'my list'
        );
      });

      // renamed to Description and moved into templates
      it.skip('should render a customized description', () => {
        const CustomDescriptionField = ({ description }) => (
          <div id="custom">{description}</div>
        );
        const { node } = renderForm({
          schema,
          fields: {
            DescriptionField: CustomDescriptionField
          }
        });
        expect(node.querySelector('fieldset > #custom').textContent).toEqual(
          'my description'
        );
      });

      it('should render a customized file widget', () => {
        const { node } = renderForm({
          schema,
          uiSchema: {
            'ui:widget': 'files'
          },
          widgets: { FileWidget: CustomgetStateonent }
        });
        expect(node.querySelector('#custom')).toBeDefined();
      });

      it('should pass errors down to custom array field templates', () => {
        const schema = {
          type: 'array',
          title: 'my list',
          description: 'my description',
          items: { type: 'string' },
          minItems: 2
        };
        const { queryAllByTestId, queryByText } = renderForm({
          schema,
          templates: { ArrayFieldNormalTemplate: CustomgetStateonent },
          formData: [1],
          liveValidate: true
        });

        expect(queryAllByTestId('custom').length).toBe(1);
        expect(queryByText('should NOT have less than 2 items')).toBeInTheDOM();
      });

      it('should contain no field in the list by default', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelectorAll('.field-string').length).toBe(0);
      });

      it('should have an add button', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelector('.array-item-add button')).not.toEqual(null);
      });

      it('should not have an add button if addable is false', () => {
        const { node } = renderForm({
          schema,
          uiSchema: { 'ui:options': { addable: false } }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('should add a new field when clicking the add button', () => {
        const { node } = renderForm({ schema });
        Simulate.click(node.querySelector('.array-item-add button'));
        expect(node.querySelectorAll('.field-string').length).toBe(1);
      });

      it('should not provide an add button if length equals maxItems', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schema },
          formData: ['foo', 'bar']
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('should provide an add button if length is lesser than maxItems', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schema },
          formData: ['foo']
        });
        expect(node.querySelector('.array-item-add button')).not.toEqual(null);
      });

      it('should not provide an add button if addable is expliclty false regardless maxItems value', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schema },
          formData: ['foo'],
          uiSchema: {
            'ui:options': {
              addable: false
            }
          }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('should ignore addable value if maxItems constraint is not satisfied', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schema },
          formData: ['foo', 'bar'],
          uiSchema: {
            'ui:options': {
              addable: true
            }
          }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('should mark a non-null array item widget as required', () => {
        const { node } = renderForm({ schema });
        Simulate.click(node.querySelector('.array-item-add button'));
        expect(
          node.querySelector('.field-string input[type=text]').required
        ).toEqual(true);
      });

      it('should fill an array field with data', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar']
        });
        const inputs = node.querySelectorAll('.field-string input[type=text]');
        expect(inputs.length).toBe(2);
        expect(inputs[0].value).toEqual('foo');
        expect(inputs[1].value).toEqual('bar');
      });

      it('should\'t have reorder buttons when list length <= 1', () => {
        const { node } = renderForm({ schema, formData: ['foo'] });
        expect(node.querySelector('.array-item-move-up')).toEqual(null);
        expect(node.querySelector('.array-item-move-down')).toEqual(null);
      });

      it('should have reorder buttons when list length >= 2', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar']
        });
        expect(node.querySelector('.array-item-move-up')).not.toEqual(null);
        expect(node.querySelector('.array-item-move-down')).not.toEqual(null);
      });

      it('should move down a field from the list', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar', 'baz']
        });
        const moveDownBtns = node.querySelectorAll('.array-item-move-down');
        Simulate.click(moveDownBtns[0]);
        const inputs = node.querySelectorAll('.field-string input[type=text]');
        expect(inputs.length).toBe(3);
        expect(inputs[0].value).toEqual('bar');
        expect(inputs[1].value).toEqual('foo');
        expect(inputs[2].value).toEqual('baz');
      });

      it('should move up a field from the list', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar', 'baz']
        });
        const moveUpBtns = node.querySelectorAll('.array-item-move-up');
        Simulate.click(moveUpBtns[2]);
        const inputs = node.querySelectorAll('.field-string input[type=text]');
        expect(inputs.length).toBe(3);
        expect(inputs[0].value).toEqual('foo');
        expect(inputs[1].value).toEqual('baz');
        expect(inputs[2].value).toEqual('bar');
      });

      it('should disable move buttons on the ends of the list', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar']
        });
        const moveUpBtns = node.querySelectorAll('.array-item-move-up');
        const moveDownBtns = node.querySelectorAll('.array-item-move-down');
        expect(moveUpBtns[0].disabled).toEqual(true);
        expect(moveDownBtns[0].disabled).toEqual(false);
        expect(moveUpBtns[1].disabled).toEqual(false);
        expect(moveDownBtns[1].disabled).toEqual(true);
      });

      it('should not show move up/down buttons if orderable is false', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar'],
          uiSchema: { 'ui:options': { orderable: false } }
        });
        const moveUpBtns = node.querySelector('.array-item-move-up');
        const moveDownBtns = node.querySelector('.array-item-move-down');
        expect(moveUpBtns).toBeNull();
        expect(moveDownBtns).toBeNull();
      });

      it('should remove a field from the list', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar']
        });
        const dropBtns = node.querySelectorAll('.array-item-remove');
        Simulate.click(dropBtns[0]);
        const inputs = node.querySelectorAll('.field-string input[type=text]');
        expect(inputs.length).toBe(1);
        expect(inputs[0].value).toEqual('bar');
      });

      it('should not show remove button if removable is false', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar'],
          uiSchema: { 'ui:options': { removable: false } }
        });
        const dropBtn = node.querySelector('.array-item-remove');
        expect(dropBtn).toBeNull();
      });

      it('should force revalidation when a field is removed', () => {
        // refs #195
        const { node, queryAllByTestId, queryByTestId } = renderForm({
          schema: {
            ...schema,
            items: { ...schema.items, minLength: 4 }
          },
          formData: ['foo', 'bar!']
        });

        suppressLogs('error', () => {
          Simulate.submit(node);
        });

        expect(queryAllByTestId('error-detail').length).toBe(1);

        const dropBtns = queryAllByTestId('array-remove');

        Simulate.click(dropBtns[0]);

        expect(queryByTestId('error-detail')).not.toBeInTheDOM();
      });

      it('should handle cleared field values in the array', () => {
        const schema = {
          type: 'array',
          items: { type: 'integer' }
        };
        const formData = [1, 2, 3];
        const { node, getState } = renderForm({
          liveValidate: true,
          schema,
          formData
        });

        Simulate.change(node.querySelector('#root_1'), {
          target: { value: '' }
        });
        expect(getState().formData).toEqual([1, null, 3]);
        expect(getState().errors.length).toBe(1);
      });

      it('should render the input widgets with the expected ids', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 'bar']
        });
        const inputs = node.querySelectorAll('input[type=text]');
        expect(inputs[0].id).toEqual('root_0');
        expect(inputs[1].id).toEqual('root_1');
      });

      it('should render nested input widgets with the expected ids', () => {
        const getStatelexSchema = {
          type: 'object',
          properties: {
            foo: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  bar: { type: 'string' },
                  baz: { type: 'string' }
                }
              }
            }
          }
        };
        const { node } = renderForm({
          schema: getStatelexSchema,
          formData: {
            foo: [{ bar: 'bar1', baz: 'baz1' }, { bar: 'bar2', baz: 'baz2' }]
          }
        });
        const inputs = node.querySelectorAll('input[type=text]');
        expect(inputs[0].id).toEqual('root_foo_0_bar');
        expect(inputs[1].id).toEqual('root_foo_0_baz');
        expect(inputs[2].id).toEqual('root_foo_1_bar');
        expect(inputs[3].id).toEqual('root_foo_1_baz');
      });

      it('should render enough inputs with proper defaults to match minItems in schema when no formData is set', () => {
        const getStatelexSchema = {
          type: 'object',
          definitions: {
            Thing: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  default: 'Default name'
                }
              }
            }
          },
          properties: {
            foo: {
              type: 'array',
              minItems: 2,
              items: {
                $ref: '#/definitions/Thing'
              }
            }
          }
        };
        let form = renderForm({
          schema: getStatelexSchema,
          formData: {}
        });
        let inputs = form.node.querySelectorAll('input[type=text]');
        expect(inputs[0].value).toEqual('Default name');
        expect(inputs[1].value).toEqual('Default name');
      });

      it('should render an input for each default value, even when this is greater than minItems', () => {
        const schema = {
          type: 'object',
          properties: {
            turtles: {
              type: 'array',
              minItems: 2,
              default: ['Raphael', 'Michaelangelo', 'Donatello', 'Leonardo'],
              items: {
                type: 'string'
              }
            }
          }
        };
        const { node } = renderForm({ schema });
        const inputs = node.querySelectorAll('input[type=text]');
        expect(inputs.length).toEqual(4);
        expect(inputs[0].value).toEqual('Raphael');
        expect(inputs[1].value).toEqual('Michaelangelo');
        expect(inputs[2].value).toEqual('Donatello');
        expect(inputs[3].value).toEqual('Leonardo');
      });

      it('should render enough input to match minItems, populating the first with default values, and the rest empty', () => {
        const schema = {
          type: 'object',
          properties: {
            turtles: {
              type: 'array',
              minItems: 4,
              default: ['Raphael', 'Michaelangelo'],
              items: {
                type: 'string'
              }
            }
          }
        };
        const { node } = renderForm({ schema });
        const inputs = node.querySelectorAll('input[type=text]');
        expect(inputs.length).toEqual(4);
        expect(inputs[0].value).toEqual('Raphael');
        expect(inputs[1].value).toEqual('Michaelangelo');
        expect(inputs[2].value).toEqual('');
        expect(inputs[3].value).toEqual('');
      });

      it('should render enough input to match minItems, populating the first with default values, and the rest with the item default', () => {
        const schema = {
          type: 'object',
          properties: {
            turtles: {
              type: 'array',
              minItems: 4,
              default: ['Raphael', 'Michaelangelo'],
              items: {
                type: 'string',
                default: 'Unknown'
              }
            }
          }
        };
        const { node } = renderForm({ schema });
        const inputs = node.querySelectorAll('input[type=text]');
        expect(inputs.length).toEqual(4);
        expect(inputs[0].value).toEqual('Raphael');
        expect(inputs[1].value).toEqual('Michaelangelo');
        expect(inputs[2].value).toEqual('Unknown');
        expect(inputs[3].value).toEqual('Unknown');
      });

      it.skip('should not add minItems extra formData entries when schema item is a multiselect', () => {
        const schema = {
          type: 'object',
          properties: {
            multipleChoicesList: {
              type: 'array',
              minItems: 3,
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['Aramis', 'Athos', 'Porthos', 'd\'Artagnan']
              }
            }
          }
        };
        const uiSchema = {
          multipleChoicesList: {
            'ui:widget': 'checkboxes'
          }
        };
        const { getState } = renderForm({
          schema: schema,
          uiSchema: uiSchema,
          formData: {},
          liveValidate: true
        });

        expect(getState().formData).toHaveProperty('multipleChoicesList');
        expect(getState().formData.multipleChoicesList).toHaveLength(0);
        expect(getState().errors.length).toBe(1);
        expect(getState().errors[0].name).toBe('minItems');
        expect(getState().errors[0].params.limit).toBe(3);
      });

      it('should honor given formData, even when it does not meet ths minItems-requirement', () => {
        const getStatelexSchema = {
          type: 'object',
          definitions: {
            Thing: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  default: 'Default name'
                }
              }
            }
          },
          properties: {
            foo: {
              type: 'array',
              minItems: 2,
              items: {
                $ref: '#/definitions/Thing'
              }
            }
          }
        };
        const form = renderForm({
          schema: getStatelexSchema,
          formData: { foo: [] }
        });
        const inputs = form.node.querySelectorAll('input[type=text]');
        expect(inputs.length).toEqual(0);
      });
    });

    describe('Multiple choices list', () => {
      const schema = {
        type: 'array',
        title: 'My field',
        items: {
          enum: ['foo', 'bar', 'fuzz'],
          type: 'string'
        },
        uniqueItems: true
      };

      describe('Select multiple widget', () => {
        it('should render a select widget', () => {
          const { node } = renderForm({ schema });
          expect(node.querySelectorAll('select').length).toBe(1);
        });

        it('should render a select widget with a label', () => {
          const { node } = renderForm({ schema });
          expect(node.querySelector('.field label').textContent).toEqual(
            'My field'
          );
        });

        it('should render a select widget with multiple attribute', () => {
          const { node } = renderForm({ schema });
          expect(
            node.querySelector('.field select').getAttribute('multiple')
          ).not.toBeNull();
        });

        it('should render options', () => {
          const { node } = renderForm({ schema });
          expect(node.querySelectorAll('select option').length).toBe(3);
        });

        it('should handle a change event', () => {
          const onChange = jest.fn();
          const { node } = renderForm({ schema, onChange });

          Simulate.change(node.querySelector('.field select'), {
            target: {
              options: [
                { selected: true, value: 'foo' },
                { selected: true, value: 'bar' },
                { selected: false, value: 'fuzz' }
              ]
            }
          });

          expect(getArg(onChange).formData).toEqual(['foo', 'bar']);
        });

        it('should handle a blur event', () => {
          const onBlur = jest.fn();
          const { node } = renderForm({ schema, onBlur });
          const select = node.querySelector('.field select');

          Simulate.blur(select, {
            target: {
              options: [
                { selected: true, value: 'foo' },
                { selected: true, value: 'bar' },
                { selected: false, value: 'fuzz' }
              ]
            }
          });

          expect(getArg(onBlur)).toEqual(select.id);
        });

        it('should handle a focus event', () => {
          const onFocus = jest.fn();
          const { node } = renderForm({ schema, onFocus });
          const select = node.querySelector('.field select');

          Simulate.focus(select, {
            target: {
              options: [
                { selected: true, value: 'foo' },
                { selected: true, value: 'bar' },
                { selected: false, value: 'fuzz' }
              ]
            }
          });

          expect(getArg(onFocus)).toEqual(select.id);
        });

        it('should fill field with data', () => {
          const { node } = renderForm({
            schema,
            formData: ['foo', 'bar']
          });
          const options = node.querySelectorAll('.field select option');
          expect(options.length).toBe(3);
          expect(options[0].selected).toEqual(true); // foo
          expect(options[1].selected).toEqual(true); // bar
          expect(options[2].selected).toEqual(false); // fuzz
        });

        it('should render the select widget with the expected id', () => {
          const { node } = renderForm({ schema });
          expect(node.querySelector('select').id).toEqual('root');
        });

        it('should pass errors down to custom widgets', () => {
          const { queryAllByTestId, queryByText } = renderForm({
            schema,
            widgets: {
              SelectWidget: CustomgetStateonent
            },
            formData: ['foo', 'foo'],
            liveValidate: true
          });
          const matches = queryAllByTestId('custom');

          expect(matches.length).toBe(1);
          expect(
            queryByText(
              /should NOT have duplicate items \(items ## \d and \d are identical\)/
            )
          ).toBeInTheDOM();
        });
      });

      describe('CheckboxesWidget', () => {
        const uiSchema = {
          'ui:widget': 'checkboxes'
        };

        it('should render the expected number of checkboxes', () => {
          const { node } = renderForm({ schema, uiSchema });
          expect(node.querySelectorAll('[type=checkbox]').length).toBe(3);
        });

        it('should render the expected labels', () => {
          const { queryByText } = renderForm({ schema, uiSchema });

          expect(queryByText('foo')).toBeInTheDOM();
          expect(queryByText('bar')).toBeInTheDOM();
          expect(queryByText('fuzz')).toBeInTheDOM();
        });

        it('should handle a change event', () => {
          const onChange = jest.fn();
          const { node } = renderForm({
            schema,
            uiSchema,
            onChange
          });
          const checkboxes = node.querySelectorAll('[type=checkbox]');

          Simulate.change(checkboxes[0], {
            target: { checked: true }
          });
          Simulate.change(checkboxes[2], {
            target: { checked: true }
          });

          expect(getArg(onChange).formData).toEqual(['foo', 'fuzz']);
        });

        it('should fill field with data', () => {
          const { node } = renderForm({
            schema,
            uiSchema,
            formData: ['foo', 'fuzz']
          });
          const labels = [].map.call(
            node.querySelectorAll('[type=checkbox]'),
            node => node.checked
          );
          expect(labels).toEqual([true, false, true]);
        });

        it('should render the widget with the expected id', () => {
          const { node } = renderForm({ schema, uiSchema });
          expect(node.querySelector('.checkboxes').id).toEqual('root');
        });

        it('should support inline checkboxes', () => {
          const { queryByTestId } = renderForm({
            schema,
            uiSchema: {
              'ui:widget': 'checkboxes',
              'ui:options': {
                inline: true
              }
            }
          });

          expect(queryByTestId('checkboxes-inline')).toBeInTheDOM();
        });

        it('should pass errors down to custom widgets', () => {
          const schema = {
            type: 'array',
            title: 'My field',
            items: {
              enum: ['foo', 'bar', 'fuzz'],
              type: 'string'
            },
            minItems: 3,
            uniqueItems: true
          };
          const { queryAllByTestId, queryByText } = renderForm({
            schema,
            widgets: {
              CheckboxesWidget: CustomgetStateonent
            },
            uiSchema,
            formData: [],
            liveValidate: true
          });
          const matches = queryAllByTestId('custom');

          expect(matches.length).toBe(1);
          expect(
            queryByText('should NOT have less than 3 items')
          ).toBeInTheDOM();
        });
      });
    });

    describe('Multiple files field', () => {
      const schema = {
        type: 'array',
        title: 'My field',
        items: {
          type: 'string',
          format: 'data-url'
        }
      };

      it('should render an input[type=file] widget', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelectorAll('input[type=file]').length).toBe(1);
      });

      it('should render a select widget with a label', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelector('.field label').textContent).toEqual(
          'My field'
        );
      });

      it('should render a file widget with multiple attribute', () => {
        const { node } = renderForm({ schema });
        expect(
          node.querySelector('.field [type=file]').getAttribute('multiple')
        ).not.toBeNull();
      });

      // TODO: async, filereader
      it.skip('should handle a change event', () => {
        // sandbox.stub(window, 'FileReader').returns({
        //   set onload(fn) {
        //     fn({ target: { result: 'data:text/plain;base64,x=' } });
        //   },
        //   readAsDataUrl() {}
        // });
        // const { getState, node } = renderForm({ schema });
        // Simulate.change(node.querySelector('.field input[type=file]'), {
        //   target: {
        //     files: [
        //       { name: 'file1.txt', size: 1, type: 'type' },
        //       { name: 'file2.txt', size: 2, type: 'type' }
        //     ]
        //   }
        // });
        // return new Promise(setImmediate).then(() =>
        //   expect(getState().formData).toEqual([
        //     'data:text/plain;name=file1.txt;base64,x=',
        //     'data:text/plain;name=file2.txt;base64,x='
        //   ])
        // );
      });

      it('should fill field with data', () => {
        const { node } = renderForm({
          schema,
          formData: [
            'data:text/plain;name=file1.txt;base64,dGVzdDE=',
            'data:image/png;name=file2.png;base64,ZmFrZXBuZw=='
          ]
        });
        const li = node.querySelectorAll('.file-info li');
        expect(li.length).toBe(2);
        expect(li[0].textContent).toEqual('file1.txt (text/plain, 5 bytes)');
        expect(li[1].textContent).toEqual('file2.png (image/png, 7 bytes)');
      });

      it('should render the file widget with the expected id', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelector('input[type=file]').id).toEqual('root');
      });

      it('should pass errors down to custom widgets', () => {
        const schema = {
          type: 'array',
          title: 'My field',
          items: {
            type: 'string',
            format: 'data-url'
          },
          minItems: 5
        };
        const { queryAllByTestId, queryByText } = renderForm({
          schema,
          widgets: {
            FileWidget: CustomgetStateonent
          },
          formData: [],
          liveValidate: true
        });
        const matches = queryAllByTestId('custom');

        expect(matches.length).toBe(1);
        expect(queryByText('should NOT have less than 5 items')).toBeInTheDOM();
      });
    });

    describe('Nested lists', () => {
      const schema = {
        type: 'array',
        title: 'A list of arrays',
        items: {
          type: 'array',
          title: 'A list of numbers',
          items: {
            type: 'number'
          }
        }
      };

      it('should render two lists of inputs inside of a list', () => {
        const { node } = renderForm({
          schema,
          formData: [[1, 2], [3, 4]]
        });
        expect(node.querySelectorAll('fieldset fieldset').length).toBe(2);
      });

      it('should add an inner list when clicking the add button', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelectorAll('fieldset fieldset')).toHaveLength(0);
        Simulate.click(node.querySelector('.array-item-add button'));
        expect(node.querySelectorAll('fieldset fieldset').length).toBe(1);
      });

      it('should pass errors down to every level of custom widgets', () => {
        const CustomItem = props => (
          <div id="custom-item">{props.children}</div>
        );
        const CustomTemplate = props => {
          return (
            <div id="custom">
              {props.items &&
                props.items.map((p, i) => <CustomItem key={i} {...p} />)}
              <div data-testid="custom-error">
                {props.errors && props.errors.join(', ')}
              </div>
            </div>
          );
        };
        const schema = {
          type: 'array',
          title: 'A list of arrays',
          items: {
            type: 'array',
            title: 'A list of numbers',
            items: {
              type: 'number'
            },
            minItems: 3
          },
          minItems: 2
        };
        const { queryAllByTestId, queryByText } = renderForm({
          schema,
          templates: { ArrayFieldNormalTemplate: CustomTemplate },
          formData: [[]],
          liveValidate: true
        });
        const matches = queryAllByTestId('custom-error');

        expect(matches.length).toBe(2);
        expect(queryByText('should NOT have less than 3 items')).toBeInTheDOM();
        expect(queryByText('should NOT have less than 2 items')).toBeInTheDOM();
      });
    });

    describe('Fixed items lists', () => {
      const schema = {
        type: 'array',
        title: 'List of fixed items',
        items: [
          {
            type: 'string',
            title: 'Some text'
          },
          {
            type: 'number',
            title: 'A number'
          }
        ]
      };
      const schemaAdditional = {
        type: 'array',
        title: 'List of fixed items',
        items: [
          {
            type: 'number',
            title: 'A number'
          },
          {
            type: 'number',
            title: 'Another number'
          }
        ],
        additionalItems: {
          type: 'string',
          title: 'Additional item'
        }
      };

      it('should render a fieldset', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelectorAll('fieldset').length).toBe(1);
      });

      it('should render a fieldset legend', () => {
        const { node } = renderForm({ schema });
        const legend = node.querySelector('fieldset > legend');
        expect(legend.textContent).toEqual('List of fixed items');
        expect(legend.id).toEqual('root__title');
      });

      it('should render field widgets', () => {
        const { node } = renderForm({ schema });
        const strInput = node.querySelector(
          'fieldset .field-string input[type=text]'
        );
        const numInput = node.querySelector(
          'fieldset .field-number input[type=text]'
        );
        expect(strInput.id).toEqual('root_0');
        expect(numInput.id).toEqual('root_1');
      });

      it('should mark non-null item widgets as required', () => {
        const { node } = renderForm({ schema });
        const strInput = node.querySelector(
          'fieldset .field-string input[type=text]'
        );
        const numInput = node.querySelector(
          'fieldset .field-number input[type=text]'
        );
        expect(strInput.required).toEqual(true);
        expect(numInput.required).toEqual(true);
      });

      it('should fill fields with data', () => {
        const { node } = renderForm({
          schema,
          formData: ['foo', 42]
        });
        const strInput = node.querySelector(
          'fieldset .field-string input[type=text]'
        );
        const numInput = node.querySelector(
          'fieldset .field-number input[type=text]'
        );
        expect(strInput.value).toEqual('foo');
        expect(numInput.value).toEqual('42');
      });

      it('should handle change events', () => {
        const onChange = jest.fn();
        const { node } = renderForm({ schema, onChange });
        const strInput = node.querySelector(
          'fieldset .field-string input[type=text]'
        );
        const numInput = node.querySelector(
          'fieldset .field-number input[type=text]'
        );

        Simulate.change(strInput, { target: { value: 'bar' } });
        Simulate.change(numInput, { target: { value: '101' } });

        expect(getArg(onChange).formData).toEqual(['bar', 101]);
      });

      it('should generate additional fields and fill data', () => {
        const { node } = renderForm({
          schema: schemaAdditional,
          formData: [1, 2, 'bar']
        });
        const addInput = node.querySelector(
          'fieldset .field-string input[type=text]'
        );
        expect(addInput.id).toEqual('root_2');
        expect(addInput.value).toEqual('bar');
      });

      it('should have an add button if additionalItems is an object', () => {
        const { node } = renderForm({ schema: schemaAdditional });
        expect(node.querySelector('.array-item-add button')).not.toBeNull();
      });

      it('should not have an add button if additionalItems is not set', () => {
        const { node } = renderForm({ schema });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('should not have an add button if addable is false', () => {
        const { node } = renderForm({
          schema,
          uiSchema: { 'ui:options': { addable: false } }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('[fixed-noadditional] should not provide an add button regardless maxItems', () => {
        const { node } = renderForm({
          schema: { maxItems: 3, ...schema }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('[fixed] should not provide an add button if length equals maxItems', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schemaAdditional }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('[fixed] should provide an add button if length is lesser than maxItems', () => {
        const { node } = renderForm({
          schema: { maxItems: 3, ...schemaAdditional }
        });
        expect(node.querySelector('.array-item-add button')).not.toBeNull();
      });

      it('[fixed] should not provide an add button if addable is expliclty false regardless maxItems value', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schema },
          uiSchema: {
            'ui:options': {
              addable: false
            }
          }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      it('[fixed] should ignore addable value if maxItems constraint is not satisfied', () => {
        const { node } = renderForm({
          schema: { maxItems: 2, ...schema },
          uiSchema: {
            'ui:options': {
              addable: true
            }
          }
        });
        expect(node.querySelector('.array-item-add button')).toBeNull();
      });

      describe('operations for additional items', () => {
        const spy = jest.fn();
        const { node } = renderForm({
          schema: schemaAdditional,
          formData: [1, 2, 'foo'],
          onChange: spy
        });

        afterEach(() => {
          spy.mockReset();
        });

        it('should add a field when clicking add button', () => {
          const addBtn = node.querySelector('.array-item-add button');

          Simulate.click(addBtn);
          expect(node.querySelectorAll('.field-string').length).toBe(2);
          expect(getArg(spy).formData).toEqual([1, 2, 'foo', undefined]);
        });

        it('should change the state when changing input value', () => {
          const inputs = node.querySelectorAll(
            '.field-string input[type=text]'
          );

          Simulate.change(inputs[0], { target: { value: 'bar' } });
          Simulate.change(inputs[1], { target: { value: 'baz' } });
          expect(getArg(spy).formData).toEqual([1, 2, 'bar', 'baz']);
        });

        it('should remove array items when clicking remove buttons', () => {
          let dropBtns = node.querySelectorAll('.array-item-remove');

          Simulate.click(dropBtns[0]);

          expect(node.querySelectorAll('.field-string').length).toBe(1);
          expect(getArg(spy).formData).toEqual([1, 2, 'baz']);

          dropBtns = node.querySelectorAll('.array-item-remove');
          Simulate.click(dropBtns[0]);

          expect(node.querySelectorAll('.field-string')).toHaveLength(0);
          expect(getArg(spy).formData).toEqual([1, 2]);
        });
      });
    });

    describe('Multiple number choices list', () => {
      const schema = {
        type: 'array',
        title: 'My field',
        items: {
          enum: [1, 2, 3],
          type: 'integer'
        },
        uniqueItems: true
      };

      it('should convert array of strings to numbers if type of items is \'number\'', () => {
        const spy = jest.fn();
        const { node } = renderForm({
          schema,
          onChange: spy
        });

        Simulate.change(node.querySelector('.field select'), {
          target: {
            options: [
              { selected: true, value: '1' },
              { selected: true, value: '2' },
              { selected: false, value: '3' }
            ]
          }
        });

        expect(getArg(spy).formData).toEqual([1, 2]);
      });
    });

    describe.skip('Title', () => {
      const TitleField = props => <div id={`title-${props.title}`} />;
      const fields = { TitleField };

      it('should pass field name to TitleField if there is no title', () => {
        const schema = {
          type: 'object',
          properties: {
            array: {
              type: 'array',
              items: {}
            }
          }
        };
        const { node } = renderForm({ schema, fields });
        expect(node.querySelector('#title-array')).not.toBeNull();
      });

      it('should pass schema title to TitleField', () => {
        const schema = {
          type: 'array',
          title: 'test',
          items: {}
        };
        const { node } = renderForm({ schema, fields });
        expect(node.querySelector('#title-test')).not.toBeNull();
      });

      it('should pass empty schema title to TitleField', () => {
        const schema = {
          type: 'array',
          title: '',
          items: {}
        };
        const { node } = renderForm({ schema, fields });
        expect(node.querySelector('#title-')).toBeNull();
      });
    });
  });
});
