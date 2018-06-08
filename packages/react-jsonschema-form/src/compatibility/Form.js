import React from 'react';
import { Simulate } from 'react-testing-library';
import * as _ from 'dom-testing-library';
import 'dom-testing-library/extend-expect';

import { pack, describe, it } from './helpers';
import { suppressLogs, getArg } from '../test-utils';

export default pack(({ renderForm }) => {
  describe('<Form>', () => {
    describe('Empty form', () => {
      it('should render a form tag', () => {
        const { container } = renderForm({ schema: {} });

        expect(container.firstChild.nodeName).toBe('FORM');
      });

      it('should render a submit button', () => {
        const { getByText } = renderForm({ schema: {} });

        expect(getByText('Submit')).toBeInTheDOM();
      });
    });

    describe('Option idPrefix', () => {
      it('should change the rendered ids', () => {
        const schema = {
          type: 'object',
          title: 'root object',
          required: ['foo'],
          properties: {
            count: {
              title: 'Count',
              type: 'number'
            }
          }
        };
        const { getByLabelText } = renderForm({ schema, idPrefix: 'rjsf' });

        expect(getByLabelText('Count')).toHaveAttribute('id', 'rjsf_count');
      });
    });

    describe('Changing idPrefix', () => {
      it('should work with oneOf', () => {
        const schema = {
          $schema: 'http://json-schema.org/draft-06/schema#',
          type: 'object',
          properties: {
            connector: {
              type: 'string',
              enum: ['aws', 'gcp'],
              title: 'Provider',
              default: 'aws'
            }
          },
          dependencies: {
            connector: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    connector: {
                      type: 'string',
                      enum: ['aws']
                    },
                    key_aws: {
                      title: 'Key AWS',
                      type: 'string'
                    }
                  }
                },
                {
                  type: 'object',
                  properties: {
                    connector: {
                      type: 'string',
                      enum: ['gcp']
                    },
                    key_gcp: {
                      title: 'Key GCP',
                      type: 'string'
                    }
                  }
                }
              ]
            }
          }
        };

        const { getByLabelText } = renderForm({ schema, idPrefix: 'rjsf' });

        expect(getByLabelText('Key AWS')).toHaveAttribute('id', 'rjsf_key_aws');
      });
    });

    describe('Custom field template', () => {
      const schema = {
        type: 'object',
        title: 'root object',
        required: ['foo'],
        properties: {
          foo: {
            title: 'Foo',
            type: 'string',
            description: 'this is description',
            minLength: 32
          }
        }
      };

      const uiSchema = {
        foo: {
          'ui:help': 'this is help'
        }
      };

      const formData = { foo: 'invalid' };

      function FieldTemplate(props) {
        const {
          id,
          classNames,
          label,
          help,
          required,
          description,
          errors,
          children
        } = props;
        return (
          <div data-testid="my-field" className={classNames}>
            <label htmlFor={id} data-testid="label">
              {label}
              {required ? '*' : null}
            </label>
            {children}
            <span data-testid="help">
              {`${help} rendered from the raw format`}
            </span>
            <span data-testid="description">{description}</span>
            {errors ? (
              <ul>
                {errors.map((error, i) => (
                  <li key={i} data-testid="error">
                    {error}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      }

      let getByText, queryByLabelText, queryByTestId, queryAllByTestId;

      beforeEach(() => {
        const bag = renderForm({
          schema,
          uiSchema,
          formData,
          templates: { FieldTemplate },
          liveValidate: true
        });
        getByText = bag.getByText;
        queryByLabelText = bag.queryByLabelText;
        queryByTestId = bag.queryByTestId;
        queryAllByTestId = bag.queryAllByTestId;
      });

      it('should use the provided field template', () => {
        expect(queryByTestId('my-field')).toBeInTheDOM();
      });

      it('should use the provided template for labels', () => {
        expect(getByText('root object')).toBeInTheDOM();

        /**
         * Here I can use label text because it has related input tag.
         */
        expect(queryByLabelText(/Foo/)).toBeInTheDOM();
      });

      it('should pass description', () => {
        expect(getByText('this is description')).toBeInTheDOM();
      });

      it('should pass errors', () => {
        expect(queryAllByTestId('error').length).toBe(1);
      });

      it('should pass help', () => {
        expect(
          getByText('this is help rendered from the raw format')
        ).toBeInTheDOM();
      });
    });

    describe.only('Schema definitions', () => {
      it('should use a single schema definition reference', () => {
        const schema = {
          definitions: {
            testdef: { title: 'From definition', type: 'string' }
          },
          $ref: '#/definitions/testdef'
        };

        const { getByLabelText } = renderForm({ schema });

        expect(getByLabelText('From definition')).toBeInTheDOM();
      });

      it('should handle multiple schema definition references', () => {
        const schema = {
          definitions: {
            testdef: { title: 'From definition', type: 'string' }
          },
          type: 'object',
          properties: {
            foo: { $ref: '#/definitions/testdef' },
            bar: { $ref: '#/definitions/testdef' }
          }
        };

        const { queryAllByLabelText } = renderForm({ schema });

        expect(queryAllByLabelText('From definition').length).toBe(2);
      });

      it('should handle deeply referenced schema definitions', () => {
        const schema = {
          definitions: {
            testdef: { title: 'From definition', type: 'string' }
          },
          type: 'object',
          properties: {
            foo: {
              type: 'object',
              properties: {
                bar: { $ref: '#/definitions/testdef' }
              }
            }
          }
        };

        const { getByLabelText } = renderForm({ schema });

        expect(getByLabelText('From definition')).toBeInTheDOM();
      });

      it('should handle references to deep schema definitions', () => {
        const schema = {
          definitions: {
            testdef: {
              type: 'object',
              properties: {
                bar: { title: 'From deep definition', type: 'string' }
              }
            }
          },
          type: 'object',
          properties: {
            foo: { $ref: '#/definitions/testdef/properties/bar' }
          }
        };

        const { getByLabelText } = renderForm({ schema });

        expect(getByLabelText('From deep definition')).toBeInTheDOM();
      });

      it.only('should handle referenced definitions for array items', () => {
        const schema = {
          definitions: {
            testdef: { title: 'From definition', type: 'string' }
          },
          type: 'object',
          properties: {
            foo: {
              type: 'array',
              items: { $ref: '#/definitions/testdef' }
            }
          }
        };

        const { getByLabelText } = renderForm({
          schema,
          formData: {
            foo: ['blah']
          }
        });

        expect(getByLabelText(/From definition/)).toBeInTheDOM();
      });

      it('should raise for non-existent definitions referenced', () => {
        const schema = {
          type: 'object',
          properties: {
            foo: { $ref: '#/definitions/nonexistent' }
          }
        };

        suppressLogs('error', () => {
          expect(() => renderForm({ schema })).toThrowError(Error);
        });
      });

      it('should propagate referenced definition defaults', () => {
        const schema = {
          definitions: {
            testdef: {
              title: 'With default',
              type: 'string',
              default: 'hello'
            }
          },
          $ref: '#/definitions/testdef'
        };

        const { getByLabelText } = renderForm({ schema });

        expect(getByLabelText('With default').value).toBe('hello');
      });

      it('should propagate nested referenced definition defaults', () => {
        const schema = {
          definitions: {
            testdef: { title: 'With default', type: 'string', default: 'hello' }
          },
          type: 'object',
          properties: {
            foo: { $ref: '#/definitions/testdef' }
          }
        };

        const { getByLabelText } = renderForm({ schema });

        expect(getByLabelText('With default').value).toBe('hello');
      });

      it('should propagate referenced definition defaults for array items', () => {
        const schema = {
          definitions: {
            testdef: { title: 'With default', type: 'string', default: 'hello' }
          },
          type: 'array',
          items: {
            $ref: '#/definitions/testdef'
          }
        };

        const { getByLabelText, getByTestId } = renderForm({ schema });

        Simulate.click(getByTestId('array-add'));

        expect(getByLabelText('With default').value).toBe('hello');
      });

      it('should recursively handle referenced definitions', () => {
        const schema = {
          $ref: '#/definitions/node',
          definitions: {
            node: {
              title: 'Node object',
              type: 'object',
              properties: {
                name: { title: 'Name', type: 'string' },
                children: {
                  title: 'Children',
                  type: 'array',
                  items: {
                    $ref: '#/definitions/node'
                  }
                }
              }
            }
          }
        };

        const { getByTestId, queryField } = renderForm({ schema });

        expect(queryField('children.0.name')).not.toBeInTheDOM();

        Simulate.click(getByTestId('array-add'));

        expect(queryField('children.0.name')).toBeInTheDOM();
      });

      it('should priorize definition over schema type property', () => {
        // Refs bug #140
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            childObj: {
              type: 'object',
              $ref: '#/definitions/childObj'
            }
          },
          definitions: {
            childObj: {
              type: 'object',
              properties: {
                otherName: { type: 'string' }
              }
            }
          }
        };

        const { node } = renderForm({ schema });

        expect(node.querySelectorAll('input[type=text]').length).toBe(2);
      });

      it('should priorize local properties over definition ones', () => {
        // Refs bug #140
        const schema = {
          type: 'object',
          properties: {
            foo: {
              title: 'custom title',
              $ref: '#/definitions/objectDef'
            }
          },
          definitions: {
            objectDef: {
              type: 'object',
              title: 'definition title',
              properties: {
                field: { type: 'string' }
              }
            }
          }
        };

        const { queryByText } = renderForm({ schema });

        expect(queryByText('custom title')).toBeInTheDOM();
      });

      it('should propagate and handle a resolved schema definition', () => {
        const schema = {
          definitions: {
            enumDef: { type: 'string', enum: ['a', 'b'] }
          },
          type: 'object',
          properties: {
            name: { $ref: '#/definitions/enumDef' }
          }
        };

        const { node } = renderForm({ schema });

        expect(node.querySelectorAll('option').length).toBe(3);
      });
    });

    describe('Default value handling on clear', () => {
      const schema = {
        title: 'Input',
        type: 'string',
        default: 'foo'
      };

      it('should not set default when a text field is cleared', () => {
        const { getByLabelText } = renderForm({ schema, formData: 'bar' });

        Simulate.change(getByLabelText('Input'), {
          target: { value: '' }
        });

        expect(getByLabelText('Input').value).toEqual('');
      });
    });

    describe('Defaults array items default propagation', () => {
      const schema = {
        type: 'object',
        title: 'lvl 1 obj',
        properties: {
          object: {
            type: 'object',
            title: 'lvl 2 obj',
            properties: {
              array: {
                type: 'array',
                items: {
                  type: 'object',
                  title: 'lvl 3 obj',
                  properties: {
                    bool: {
                      type: 'boolean',
                      default: true
                    }
                  }
                }
              }
            }
          }
        }
      };

      it('should propagate deeply nested defaults to form state', () => {
        const { node, getByTestId, getState } = renderForm({ schema });

        Simulate.click(getByTestId('array-add'));
        Simulate.submit(node);

        expect(getState().formData).toEqual({
          object: { array: [{ bool: true }] }
        });
      });
    });

    describe('Submit handler', () => {
      it('should call provided submit handler with form state', () => {
        const schema = {
          type: 'object',
          properties: { foo: { type: 'string' } }
        };
        const formData = { foo: 'bar' };
        const onSubmit = jest.fn();
        const { node } = renderForm({ schema, formData, onSubmit });

        Simulate.submit(node);

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(getArg(onSubmit).formData).toEqual(formData);
        expect(getArg(onSubmit).schema).toEqual(schema);
      });

      it('should not call provided submit handler on validation errors', () => {
        const schema = {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              minLength: 1
            }
          }
        };
        const formData = { foo: '' };
        const onSubmit = jest.fn();
        const onError = jest.fn();
        const { node } = renderForm({
          schema,
          formData,
          onSubmit,
          onError
        });

        Simulate.submit(node);

        expect(onSubmit).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledTimes(1);
      });
    });

    describe('Change handler', () => {
      it('should call provided change handler on form state change', () => {
        const schema = {
          type: 'object',
          properties: {
            foo: {
              title: 'Foo',
              type: 'string'
            }
          }
        };
        const formData = {
          foo: ''
        };
        const onChange = jest.fn();
        const { getByLabelText } = renderForm({
          schema,
          formData,
          onChange
        });

        Simulate.change(getByLabelText('Foo'), {
          target: { value: 'new' }
        });

        expect(onChange).toHaveBeenCalled();
        expect(getArg(onChange).formData).toEqual({ foo: 'new' });
      });
    });

    describe('Blur handler', () => {
      it('should call provided blur handler on form input blur event', () => {
        const schema = {
          type: 'object',
          properties: {
            foo: {
              title: 'Foo',
              type: 'string'
            }
          }
        };
        const formData = { foo: '' };
        const onBlur = jest.fn();
        const { getByLabelText } = renderForm({ schema, formData, onBlur });
        const input = getByLabelText('Foo');

        Simulate.blur(input, {
          target: { value: 'new' }
        });

        expect(onBlur).toHaveBeenCalled();
        expect(getArg(onBlur)).toEqual(input.id);
      });
    });

    describe('Focus handler', () => {
      it('should call provided focus handler on form input focus event', () => {
        const schema = {
          type: 'object',
          properties: {
            foo: {
              title: 'Foo',
              type: 'string'
            }
          }
        };
        const formData = { foo: '' };
        const onFocus = jest.fn();
        const { getByLabelText } = renderForm({ schema, formData, onFocus });

        const input = getByLabelText('Foo');
        Simulate.focus(input, {
          target: { value: 'new' }
        });

        expect(onFocus).toHaveBeenCalled();
        expect(getArg(onFocus)).toEqual(input.id);
      });
    });

    describe('Error handler', () => {
      it('should call provided error handler on validation errors', () => {
        const schema = {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              minLength: 1
            }
          }
        };
        const formData = { foo: '' };
        const onError = jest.fn();
        const { node } = renderForm({ schema, formData, onError });

        Simulate.submit(node);

        expect(onError).toHaveBeenCalledTimes(1);
      });
    });

    describe('External formData updates', () => {
      describe('root level', () => {
        const formProps = {
          schema: { title: 'Foo', type: 'string' },
          liveValidate: true
        };

        it('should update form state from new formData prop value', () => {
          const { getByLabelText, rerender } = renderForm(formProps);

          rerender({ formData: 'yo' });

          expect(getByLabelText('Foo').value).toEqual('yo');
        });

        it('should validate formData when the schema is updated', () => {
          const { rerender, getState } = renderForm(formProps);

          rerender({
            formData: 'yo',
            schema: { type: 'number' }
          });

          expect(getState().errors.length).toBe(1);
          expect(getState().errors[0].stack).toEqual('should be number');
        });
      });

      describe('object level', () => {
        it('should update form state from new formData prop value', () => {
          const { getByLabelText, rerender } = renderForm({
            schema: {
              type: 'object',
              properties: {
                foo: {
                  title: 'Foo',
                  type: 'string'
                }
              }
            }
          });

          rerender({ formData: { foo: 'yo' } });

          expect(getByLabelText('Foo').value).toEqual('yo');
        });
      });

      describe('array level', () => {
        it('should update form state from new formData prop value', () => {
          const schema = {
            type: 'array',
            items: {
              title: 'Item',
              type: 'string'
            }
          };
          const { getByLabelText, rerender } = renderForm({ schema });

          rerender({ formData: ['yo'] });

          expect(getByLabelText('Item').value).toEqual('yo');
        });
      });
    });

    describe('Error contextualization', () => {
      describe('on form state updated', () => {
        const schema = {
          title: 'Foo',
          type: 'string',
          minLength: 8
        };

        describe('Lazy validation', () => {
          it('should not update the errorSchema when the formData changes', () => {
            const { getState, node } = renderForm({ schema });

            Simulate.change(node.querySelector('input[type=text]'), {
              target: { value: 'short' }
            });

            expect(getState().errorSchema).toEqual({});
          });

          it('should not denote an error in the field', () => {
            const { getByTestId, getByLabelText } = renderForm({ schema });

            Simulate.change(getByLabelText('Foo'), {
              target: { value: 'short' }
            });

            expect(getByTestId('root')).not.toHaveClass('.field-error');
          });

          it('should clean contextualized errors up when they\'re fixed', () => {
            const altSchema = {
              type: 'object',
              properties: {
                field1: { title: 'Field 1', type: 'string', minLength: 8 },
                field2: { title: 'Field 2', type: 'string', minLength: 8 }
              }
            };
            const { node, queryField, getByLabelText } = renderForm({
              schema: altSchema,
              formData: {
                field1: 'short',
                field2: 'short'
              }
            });

            // Fix the first field
            Simulate.change(getByLabelText('Field 1'), {
              target: { value: 'fixed error' }
            });

            suppressLogs('error', () => {
              Simulate.submit(node);
            });

            expect(queryField('field1')).not.toHaveClass('field-error');

            // Fix the second field
            Simulate.change(node.querySelectorAll('input[type=text]')[1], {
              target: { value: 'fixed error too' }
            });

            suppressLogs('error', () => {
              Simulate.submit(node);
            });

            // No error remaining, shouldn't throw.
            Simulate.submit(node);

            expect(queryField('field2')).not.toHaveClass('field-error');
          });
        });

        describe('Live validation', () => {
          it('should update the errorSchema when the formData changes', () => {
            const { getByLabelText, getState } = renderForm({
              schema,
              liveValidate: true
            });

            Simulate.change(getByLabelText('Foo'), {
              target: { value: 'short' }
            });

            expect(getState().errorSchema).toEqual({
              __errors: ['should NOT be shorter than 8 characters']
            });
          });

          it('should denote the new error in the field', () => {
            const { queryField, queryByText, getByLabelText } = renderForm({
              schema,
              liveValidate: true
            });

            Simulate.change(getByLabelText('Foo'), {
              target: { value: 'short' }
            });

            expect(queryField()).toHaveClass('field-error');
            expect(
              queryByText('should NOT be shorter than 8 characters')
            ).toBeInTheDOM();
          });
        });

        describe('Disable validation onChange event', () => {
          it('should not update errorSchema when the formData changes', () => {
            const { getState, getByLabelText } = renderForm({
              schema,
              noValidate: true,
              liveValidate: true
            });

            Simulate.change(getByLabelText('Foo'), {
              target: { value: 'short' }
            });

            expect(getState().errorSchema).toEqual({});
          });
        });

        describe('Disable validation onSubmit event', () => {
          it('should not update errorSchema when the formData changes', () => {
            const { getState, getByLabelText, node } = renderForm({
              schema,
              noValidate: true
            });

            Simulate.change(getByLabelText('Foo'), {
              target: { value: 'short' }
            });
            Simulate.submit(node);

            expect(getState().errorSchema).toEqual({});
          });
        });
      });

      describe('on form submitted', () => {
        const schema = {
          title: 'Bar',
          type: 'string',
          minLength: 8
        };

        it('should update the errorSchema on form submission', () => {
          const { getState, getByLabelText, node } = renderForm({ schema });

          Simulate.change(getByLabelText('Bar'), {
            target: { value: 'short' }
          });

          suppressLogs('error', () => {
            Simulate.submit(node);
          });

          expect(getState().errorSchema).toEqual({
            __errors: ['should NOT be shorter than 8 characters']
          });
        });

        it('should call the onError handler', () => {
          const onError = jest.fn();
          const { getByLabelText, node } = renderForm({ schema, onError });

          Simulate.change(getByLabelText('Bar'), {
            target: { value: 'short' }
          });
          Simulate.submit(node);

          const value = getArg(onError);
          expect(value.length).toBe(1);
          expect(value[0].message).toBe(
            'should NOT be shorter than 8 characters'
          );
        });
      });
    });

    describe('root level', () => {
      const formProps = {
        liveValidate: true,
        schema: {
          type: 'string',
          minLength: 8
        },
        formData: 'short'
      };

      it('should reflect the contextualized error in state', () => {
        const { getState } = renderForm(formProps);

        expect(getState().errorSchema).toEqual({
          __errors: ['should NOT be shorter than 8 characters']
        });
      });

      it('should denote the error in the field', () => {
        const { queryField, queryByText } = renderForm(formProps);

        expect(queryField()).toHaveClass('field-error');
        expect(
          queryByText('should NOT be shorter than 8 characters')
        ).toBeInTheDOM();
      });
    });

    describe('root level with multiple errors', () => {
      const formProps = {
        liveValidate: true,
        schema: {
          type: 'string',
          minLength: 8,
          pattern: 'd+'
        },
        formData: 'short'
      };

      it('should reflect the contextualized error in state', () => {
        const { getState } = renderForm(formProps);
        expect(getState().errorSchema).toEqual({
          __errors: [
            'should NOT be shorter than 8 characters',
            'should match pattern "d+"'
          ]
        });
      });

      it('should denote the error in the field', () => {
        const { queryByText } = renderForm(formProps);

        expect(
          queryByText('should NOT be shorter than 8 characters')
        ).toBeInTheDOM();
        expect(queryByText('should match pattern "d+"')).toBeInTheDOM();
      });
    });

    describe('nested field level', () => {
      const schema = {
        type: 'object',
        properties: {
          level1: {
            type: 'object',
            properties: {
              level2: {
                type: 'string',
                minLength: 8
              }
            }
          }
        }
      };

      const formProps = {
        schema,
        liveValidate: true,
        formData: {
          level1: {
            level2: 'short'
          }
        }
      };

      it('should reflect the contextualized error in state', () => {
        const { getState } = renderForm(formProps);

        expect(getState().errorSchema).toEqual({
          level1: {
            level2: {
              __errors: ['should NOT be shorter than 8 characters']
            }
          }
        });
      });

      it('should denote the error in the field', () => {
        const { queryField, queryByText } = renderForm(formProps);

        expect(queryField('level1.level2')).toHaveClass('field-error');
        expect(
          queryByText('should NOT be shorter than 8 characters')
        ).toBeInTheDOM();
      });
    });

    describe('array indices', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'string',
          minLength: 4
        }
      };

      const formProps = {
        schema,
        liveValidate: true,
        formData: ['good', 'bad', 'good']
      };

      it('should contextualize the error for array indices', () => {
        const { getState } = renderForm(formProps);

        expect(getState().errorSchema).toEqual({
          1: {
            __errors: ['should NOT be shorter than 4 characters']
          }
        });
      });

      it('should denote the error in the item field in error', () => {
        const { queryField, queryAllByTestId, queryByText } = renderForm(
          formProps
        );

        expect(queryField('1')).toHaveClass('field-error');
        expect(queryAllByTestId('error-detail').length).toBe(1);
        expect(queryByText('should NOT be shorter than 4 characters'));
      });

      it('should not denote errors on non impacted fields', () => {
        const { queryField } = renderForm(formProps);

        expect(queryField('0')).not.toHaveClass('field-error');
        expect(queryField('2')).not.toHaveClass('field-error');
      });
    });

    describe('nested array indices', () => {
      const schema = {
        type: 'object',
        properties: {
          level1: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 4
            }
          }
        }
      };

      const formProps = { schema, liveValidate: true };

      it('should contextualize the error for nested array indices', () => {
        const { getState } = renderForm({
          ...formProps,
          formData: {
            level1: ['good', 'bad', 'good', 'bad']
          }
        });

        expect(getState().errorSchema).toEqual({
          level1: {
            1: { __errors: ['should NOT be shorter than 4 characters'] },
            3: { __errors: ['should NOT be shorter than 4 characters'] }
          }
        });
      });

      it('should denote the error in the nested item field in error', () => {
        const { queryField, queryByText } = renderForm({
          ...formProps,
          formData: {
            level1: ['good', 'bad', 'good']
          }
        });
        const fieldArray = queryField('level1');

        expect(_.queryAllByTestId(fieldArray, 'error-detail').length).toBe(1);
        expect(
          queryByText('should NOT be shorter than 4 characters')
        ).toBeInTheDOM();
      });
    });

    describe('nested arrays', () => {
      const schema = {
        type: 'object',
        properties: {
          outer: {
            title: 'Outer list',
            type: 'array',
            items: {
              title: 'Inner list',
              type: 'array',
              items: {
                title: 'Item',
                type: 'string',
                minLength: 4
              }
            }
          }
        }
      };

      const formData = {
        outer: [['good', 'bad'], ['bad', 'good']]
      };

      const formProps = { schema, formData, liveValidate: true };

      it('should contextualize the error for nested array indices', () => {
        const { getState } = renderForm(formProps);

        expect(getState().errorSchema).toEqual({
          outer: {
            0: {
              1: { __errors: ['should NOT be shorter than 4 characters'] }
            },
            1: {
              0: { __errors: ['should NOT be shorter than 4 characters'] }
            }
          }
        });
      });

      it('should denote the error in the nested item field in error', () => {
        const { node } = renderForm(formProps);
        const fields = node.querySelectorAll('.field-string');
        const errors = [].map.call(fields, field => {
          const error = _.queryByTestId(field, 'error-detail');
          return error && error.textContent;
        });

        expect(errors).toEqual([
          null,
          'should NOT be shorter than 4 characters',
          'should NOT be shorter than 4 characters',
          null
        ]);
      });
    });

    describe('array nested items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              minLength: 4
            }
          }
        }
      };

      const formProps = {
        schema,
        liveValidate: true,
        formData: [{ foo: 'good' }, { foo: 'bad' }, { foo: 'good' }]
      };

      it('should contextualize the error for array nested items', () => {
        const { getState } = renderForm(formProps);

        expect(getState().errorSchema).toEqual({
          1: {
            foo: { __errors: ['should NOT be shorter than 4 characters'] }
          }
        });
      });

      it('should denote the error in the array nested item', () => {
        const { queryField, queryAllByTestId, queryByText } = renderForm(
          formProps
        );

        expect(queryField('1.foo')).toHaveClass('field-error');
        expect(queryAllByTestId('error-detail').length).toBe(1);
        expect(
          queryByText('should NOT be shorter than 4 characters')
        ).toBeInTheDOM();
      });
    });

    describe('schema dependencies', () => {
      const schema = {
        type: 'object',
        properties: {
          branch: {
            type: 'number',
            enum: [1, 2, 3],
            default: 1
          }
        },
        required: ['branch'],
        dependencies: {
          branch: {
            oneOf: [
              {
                properties: {
                  branch: {
                    enum: [1]
                  },
                  field1: {
                    type: 'number'
                  }
                },
                required: ['field1']
              },
              {
                properties: {
                  branch: {
                    enum: [2]
                  },
                  field1: {
                    type: 'number'
                  },
                  field2: {
                    type: 'number'
                  }
                },
                required: ['field1', 'field2']
              }
            ]
          }
        }
      };

      it('should only show error for property in selected branch', () => {
        const { getState, node } = renderForm({ schema, liveValidate: true });

        Simulate.change(node.querySelector('input[type=text]'), {
          target: { value: 'not a number' }
        });

        expect(getState().errorSchema).toEqual({
          field1: {
            __errors: ['should be number']
          }
        });
      });

      it('should only show errors for properties in selected branch', () => {
        const { getState, node } = renderForm({
          schema,
          liveValidate: true,
          formData: { branch: 2 }
        });

        Simulate.change(node.querySelector('input[type=text]'), {
          target: { value: 'not a number' }
        });

        expect(getState().errorSchema).toEqual({
          field1: {
            __errors: ['should be number']
          },
          field2: {
            __errors: ['is a required property']
          }
        });
      });

      it('should not show any errors when branch is empty', () => {
        suppressLogs('warn', () => {
          const { getState, node } = renderForm({
            schema,
            liveValidate: true,
            formData: { branch: 3 }
          });

          Simulate.change(node.querySelector('select'), {
            target: { value: 3 }
          });

          expect(getState().errorSchema).toEqual({});
        });
      });
    });

    describe('Schema and formData updates', () => {
      // https://github.com/mozilla-services/react-jsonschema-form/issues/231
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string' }
        }
      };

      it('should replace state when formData have keys removed', () => {
        const spy = jest.fn();
        const formData = { foo: 'foo', bar: 'bar' };
        const { container, rerender } = renderForm({
          schema,
          formData,
          onChange: spy
        });

        rerender({
          schema: {
            type: 'object',
            properties: {
              bar: { type: 'string' }
            }
          },
          formData: { bar: 'bar' }
        });

        Simulate.change(container.querySelector('#root_bar'), {
          target: { value: 'baz' }
        });

        expect(getArg(spy).formData).toEqual({ bar: 'baz' });
      });

      it('should replace state when formData keys have changed', () => {
        const spy = jest.fn();
        const formData = { foo: 'foo', bar: 'bar' };
        const { container, rerender } = renderForm({
          schema,
          formData,
          onChange: spy
        });

        rerender({
          schema: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
              baz: { type: 'string' }
            }
          },
          formData: { foo: 'foo', baz: 'bar' }
        });

        Simulate.change(container.querySelector('#root_baz'), {
          target: { value: 'baz' }
        });

        expect(getArg(spy).formData).toEqual({ foo: 'foo', baz: 'baz' });
      });
    });

    // TODO: internal tests
    // describe('idSchema updates based on formData', () => {
    //   const schema = {
    //     type: 'object',
    //     properties: {
    //       a: { type: 'string', enum: ['int', 'bool'] }
    //     },
    //     dependencies: {
    //       a: {
    //         oneOf: [
    //           {
    //             properties: {
    //               a: { enum: ['int'] }
    //             }
    //           },
    //           {
    //             properties: {
    //               a: { enum: ['bool'] },
    //               b: { type: 'boolean' }
    //             }
    //           }
    //         ]
    //       }
    //     }
    //   };

    //   TODO: internal test
    //   it('should not update idSchema for a falsey value', () => {
    //     const formData = { a: 'int' };
    //     const { getState } = renderForm({ schema, formData });
    //     getState.componentWillReceiveProps({
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           a: { type: 'string', enum: ['int', 'bool'] }
    //         },
    //         dependencies: {
    //           a: {
    //             oneOf: [
    //               {
    //                 properties: {
    //                   a: { enum: ['int'] }
    //                 }
    //               },
    //               {
    //                 properties: {
    //                   a: { enum: ['bool'] },
    //                   b: { type: 'boolean' }
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       },
    //       formData: { a: 'int' }
    //     });
    //     expect(getState().idSchema).toEqual({
    //       $id: 'root',
    //       a: { $id: 'root_a' }
    //     });
    //   });

    //   TODO: internal test
    //   it('should update idSchema based on truthy value', () => {
    //     const formData = {
    //       a: 'int'
    //     };
    //     const { getState } = renderForm({ schema, formData });
    //     getState.componentWillReceiveProps({
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           a: { type: 'string', enum: ['int', 'bool'] }
    //         },
    //         dependencies: {
    //           a: {
    //             oneOf: [
    //               {
    //                 properties: {
    //                   a: { enum: ['int'] }
    //                 }
    //               },
    //               {
    //                 properties: {
    //                   a: { enum: ['bool'] },
    //                   b: { type: 'boolean' }
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       },
    //       formData: { a: 'bool' }
    //     });
    //     expect(getState().idSchema).toEqual({
    //       $id: 'root',
    //       a: { $id: 'root_a' },
    //       b: { $id: 'root_b' }
    //     });
    //   });
    // });

    describe('Attributes', () => {
      const formProps = {
        schema: {},
        id: 'test-form',
        className: 'test-class other-class',
        name: 'testName',
        method: 'post',
        target: '_blank',
        action: '/users/list',
        autocomplete: 'off',
        enctype: 'multipart/form-data',
        acceptcharset: 'ISO-8859-1',
        noHtml5Validate: true
      };

      let node;

      beforeEach(() => {
        node = renderForm(formProps).node;
      });

      it('should set attr id of form', () => {
        expect(node.getAttribute('id')).toEqual(formProps.id);
      });

      it('should set attr class of form', () => {
        expect(node.getAttribute('class')).toEqual(formProps.className);
      });

      it('should set attr name of form', () => {
        expect(node.getAttribute('name')).toEqual(formProps.name);
      });

      it('should set attr method of form', () => {
        expect(node.getAttribute('method')).toEqual(formProps.method);
      });

      it('should set attr target of form', () => {
        expect(node.getAttribute('target')).toEqual(formProps.target);
      });

      it('should set attr action of form', () => {
        expect(node.getAttribute('action')).toEqual(formProps.action);
      });

      it('should set attr autoComplete of form', () => {
        expect(node.getAttribute('autocomplete')).toEqual(
          formProps.autocomplete
        );
      });

      it('should set attr enctype of form', () => {
        expect(node.getAttribute('enctype')).toEqual(formProps.enctype);
      });

      it('should set attr acceptcharset of form', () => {
        expect(node.getAttribute('accept-charset')).toEqual(
          formProps.acceptcharset
        );
      });

      it('should set attr novalidate of form', () => {
        expect(node.getAttribute('novalidate')).not.toBeNull();
      });
    });
  });
});
