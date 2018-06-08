import React from 'react';
import { Simulate } from 'react-testing-library';
import 'dom-testing-library/extend-expect';

import { pack, describe, it } from './helpers';

export default pack(({ renderForm }) => {
  describe('<NumberField>', () => {
    describe('TextWidget', () => {
      it('should render a string field', () => {
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Number',
            type: 'number'
          }
        });

        expect(getByLabelText('Number').type).toBe('text');
      });

      it('should render a string field with a label', () => {
        const { queryByLabelText } = renderForm({
          schema: {
            type: 'number',
            title: 'Foo'
          }
        });

        expect(queryByLabelText('Foo')).toBeInTheDOM();
      });

      it('should render a string field with a description', () => {
        const { queryByText } = renderForm({
          schema: {
            type: 'number',
            description: 'Bar'
          }
        });

        expect(queryByText('Bar')).toBeInTheDOM();
      });

      it('should default state value to undefined', () => {
        const { getState } = renderForm({
          schema: { type: 'number' }
        });

        expect(getState().formData).toEqual(undefined);
      });

      it('should assign a default value', () => {
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number',
            default: 2
          }
        });

        expect(getByLabelText('Foo').value).toBe('2');
      });

      it('should handle a change event', () => {
        const { getByLabelText, getState } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          }
        });

        Simulate.change(getByLabelText('Foo'), {
          target: { value: '2' }
        });

        expect(getState().formData).toEqual(2);
      });

      /**
       * TODO: more info - does it work in original tests?
       * expected behavior: ["root", 2]
       * actual behavior: ["root", "2"]
       */
      it.skip('should handle a blur event', () => {
        const onBlur = jest.fn();
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          },
          onBlur
        });

        const input = getByLabelText('Foo');
        Simulate.blur(input, {
          target: { value: '2' }
        });

        expect(onBlur).toHaveBeenCalledWith(input.id, 2);
      });

      /**
       * TODO: more info - does it work in original tests?
       * expected behavior: ["root", 2]
       * actual behavior: ["root", "2"]
       */
      it.skip('should handle a focus event', () => {
        const onFocus = jest.fn();
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          },
          onFocus
        });

        const input = getByLabelText('Foo');
        Simulate.focus(input, {
          target: { value: '2' }
        });

        expect(onFocus).toHaveBeenCalledWith(input.id, 2);
      });

      it('should fill field with data', () => {
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          },
          formData: 2
        });

        expect(getByLabelText('Foo').value).toBe('2');
      });

      it('should not cast the input as a number if it ends with a dot', () => {
        const { getByLabelText, getState } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          }
        });

        Simulate.change(getByLabelText('Foo'), {
          target: { value: '2.' }
        });

        expect(getState().formData).toEqual('2.');
      });

      it('should render the widget with the expected id', () => {
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          }
        });

        expect(getByLabelText('Foo').id).toBe('root');
      });

      it('should render with trailing zeroes', () => {
        const { getByLabelText } = renderForm({
          schema: {
            title: 'Foo',
            type: 'number'
          }
        });
        const input = getByLabelText('Foo');

        Simulate.change(input, {
          target: { value: '2.' }
        });
        expect(input.value).toBe('2.');

        Simulate.change(input, {
          target: { value: '2.0' }
        });
        expect(input.value).toBe('2.0');

        Simulate.change(input, {
          target: { value: '2.00' }
        });
        expect(input.value).toBe('2.00');

        Simulate.change(input, {
          target: { value: '2.000' }
        });
        expect(input.value).toBe('2.000');
      });

      it('should render customized StringField', () => {
        const CustomStringField = () => <div data-testid="custom" />;

        const { queryByTestId } = renderForm({
          schema: {
            type: 'number'
          },
          fields: {
            StringField: CustomStringField
          }
        });

        expect(queryByTestId('custom')).toBeInTheDOM();
      });
    });

    describe('SelectWidget', () => {
      it('should render a number field', () => {
        const { node } = renderForm({
          schema: {
            type: 'number',
            enum: [1, 2]
          }
        });

        expect(node.querySelectorAll('.field select').length).toBe(1);
      });

      it('should render a string field with a label', () => {
        const { node } = renderForm({
          schema: {
            type: 'number',
            enum: [1, 2],
            title: 'foo'
          }
        });

        expect(node.querySelector('.field label').textContent).toEqual('foo');
      });

      it('should assign a default value', () => {
        const { getState } = renderForm({
          schema: {
            type: 'number',
            enum: [1, 2],
            default: 1
          }
        });

        expect(getState().formData).toEqual(1);
      });

      it('should handle a change event', () => {
        const { node, getState } = renderForm({
          schema: {
            type: 'number',
            enum: [1, 2]
          }
        });

        Simulate.change(node.querySelector('select'), {
          target: { value: '2' }
        });

        expect(getState().formData).toEqual(2);
      });

      it('should fill field with data', () => {
        const { getState } = renderForm({
          schema: {
            type: 'number',
            enum: [1, 2]
          },
          formData: 2
        });

        expect(getState().formData).toEqual(2);
      });

      it('should render the widget with the expected id', () => {
        const { node } = renderForm({
          schema: {
            type: 'number',
            enum: [1, 2]
          }
        });

        expect(node.querySelector('select').id).toEqual('root');
      });
    });
  });
});
