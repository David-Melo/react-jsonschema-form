import React from 'react';

import { pack, describe, it } from './helpers';

export default pack(({ renderForm }) => {
  describe('Custom FieldTemplate for disabled property', () => {
    function FieldTemplate(props) {
      return <div className={props.disabled ? 'disabled' : 'foo'} />;
    }

    it('should render with disabled when ui:disabled is truthy', () => {
      const { node } = renderForm({
        schema: { type: 'string' },
        uiSchema: { 'ui:disabled': true },
        templates: { FieldTemplate }
      });
      expect(node.querySelectorAll('.disabled').length).toBe(1);
    });

    it('should render with disabled when ui:disabled is falsey', () => {
      const { node } = renderForm({
        schema: { type: 'string' },
        uiSchema: { 'ui:disabled': false },
        templates: { FieldTemplate }
      });
      expect(node.querySelectorAll('.disabled').length).toBe(0);
    });
  });
});
