import React, { PureComponent } from 'react';

function check(renderForm) {
  describe('ArrayFieldTemplate', () => {
    const formData = ['one', 'two', 'three'];

    describe('Custom ArrayFieldTemplate of string array', () => {
      function ArrayFieldTemplate(props) {
        return (
          <div className={props.uiSchema.classNames}>
            {props.canAdd && <button className="custom-array-add" />}
            {props.items.map(element => {
              return (
                <div className="custom-array-item" key={element.index}>
                  {element.hasMoveUp && (
                    <button className="custom-array-item-move-up" />
                  )}
                  {element.hasMoveDown && (
                    <button className="custom-array-item-move-down" />
                  )}

                  {element.children}
                </div>
              );
            })}
          </div>
        );
      }

      describe('Stateful ArrayFieldTemplate', () => {
        class ArrayFieldTemplate extends PureComponent {
          render() {
            return <div>{this.props.items.map(item => item.element)}</div>;
          }
        }

        it('should render a stateful custom component', () => {
          const { node } = renderForm({
            schema: { type: 'array', items: { type: 'string' } },
            formData,
            templates: { ArrayFieldNormalTemplate: ArrayFieldTemplate }
          });

          expect(node.querySelectorAll('.field-array div').length).toBe(3);
        });
      });

      describe('not fixed items', () => {
        const schema = {
          type: 'array',
          title: 'my list',
          description: 'my description',
          items: { type: 'string' }
        };

        const uiSchema = {
          classNames: 'custom-array'
        };

        let node;

        beforeEach(() => {
          node = renderForm({
            templates: { ArrayFieldNormalTemplate: ArrayFieldTemplate },
            formData,
            schema,
            uiSchema
          }).node;
        });

        it('should render one root element for the array', () => {
          expect(node.querySelectorAll('.custom-array').length).toBe(1);
        });

        it('should render one add button', () => {
          expect(node.querySelectorAll('.custom-array-add').length).toBe(1);
        });

        it('should render one child for each array item', () => {
          expect(node.querySelectorAll('.custom-array-item').length).toBe(
            formData.length
          );
        });

        it('should render text input for each array item', () => {
          expect(
            node.querySelectorAll('.custom-array-item .field input[type=text]')
              .length
          ).toBe(formData.length);
        });

        it('should render move up button for all but one array items', () => {
          expect(
            node.querySelectorAll('.custom-array-item-move-up').length
          ).toBe(formData.length - 1);
        });

        it('should render move down button for all but one array items', () => {
          expect(
            node.querySelectorAll('.custom-array-item-move-down').length
          ).toBe(formData.length - 1);
        });
      });

      describe('fixed items', () => {
        const schema = {
          type: 'array',
          title: 'my list',
          description: 'my description',
          items: [{ type: 'string' }, { type: 'string' }, { type: 'string' }]
        };

        const uiSchema = {
          classNames: 'custom-array'
        };

        let node;

        beforeEach(() => {
          node = renderForm({
            templates: { ArrayFieldFixedTemplate: ArrayFieldTemplate },
            formData,
            schema,
            uiSchema
          }).node;
        });

        it('should render one root element for the array', () => {
          expect(node.querySelectorAll('.custom-array').length).toBe(1);
        });

        it('should not render an add button', () => {
          expect(node.querySelectorAll('.custom-array-add').length).toBe(0);
        });

        it('should render one child for each array item', () => {
          expect(node.querySelectorAll('.custom-array-item').length).toBe(
            formData.length
          );
        });

        it('should render text input for each array item', () => {
          expect(
            node.querySelectorAll('.custom-array-item .field input[type=text]')
              .length
          ).toBe(formData.length);
        });

        it('should not render any move up buttons', () => {
          expect(
            node.querySelectorAll('.custom-array-item-move-up').length
          ).toBe(0);
        });

        it('should not render any move down buttons', () => {
          expect(
            node.querySelectorAll('.custom-array-item-move-down').length
          ).toBe(0);
        });
      });
    });
  });
}

export default check;
