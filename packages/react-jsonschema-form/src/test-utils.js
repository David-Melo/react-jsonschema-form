/**
 * Test utils
 */

import React from 'react';
import { render } from 'react-testing-library';

import DefaultForm from './';

export function initRenderForm(Form = DefaultForm, baseProps = {}) {
  let state;

  return (props, existingContainer) => {
    let output;
    const idPrefix = props.idPrefix || 'root';
    const onChange = initSpyOnChange(props.onChange || baseProps.onChange);
    const tools = render(
      <Form {...baseProps} {...props} onChange={onChange} />,
      existingContainer
    );

    output = { ...tools };
    output.getState = getState;
    output.rerender = newProps =>
      tools.rerender(
        <Form {...baseProps} {...props} {...newProps} onChange={onChange} />
      );
    output.node = tools.container.firstChild;
    output.queryField = queryField;

    return output;

    function queryField(fieldId) {
      const id = fieldId
        ? idPrefix + '_' + fieldId.replace(/\./g, '_')
        : idPrefix;
      return tools.queryByTestId(id);
    }
  };

  function getState() {
    return state;
  }

  function initSpyOnChange(onChange) {
    if (onChange) {
      return _state => {
        onChange(_state);
        state = _state;
      };
    }
    return _state => (state = _state);
  }
}

export const renderForm = initRenderForm();

export const suppressLogs = (type, testCase) => {
  jest.spyOn(console, type);
  global.console[type].mockImplementation(() => {});
  testCase();
  global.console[type].mockRestore();
};

export const getArg = spy => spy.mock.calls[spy.mock.calls.length - 1][0];
