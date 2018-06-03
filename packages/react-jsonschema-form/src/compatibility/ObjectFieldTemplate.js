import React, { PureComponent } from 'react';

function check(renderForm) {
  describe('ObjectFieldTemplate', () => {
    const formData = { foo: 'bar', bar: 'foo' };
    const TitleField = () => <div className="title-field" />;
    const DescriptionField = ({ description }) =>
      description ? <div className="description-field" /> : null;
    class ObjectFieldTemplate extends PureComponent {
      render() {
        const { properties, title, description } = this.props;
        return (
          <div className="root">
            <TitleField title={title} />
            <DescriptionField description={description} />
            <div>
              {properties.map(({ content }, index) => (
                <div key={index} className="property">
                  {content}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    const { node } = renderForm({
      schema: {
        type: 'object',
        properties: { foo: { type: 'string' }, bar: { type: 'string' } }
      },
      uiSchema: { 'ui:description': 'foobar' },
      formData,
      templates: { ObjectFieldTemplate }
    });

    it('should render one root element', () => {
      expect(node.querySelectorAll('.root').length).toBe(1);
    });

    it('should render one title', () => {
      expect(node.querySelectorAll('.title-field').length).toBe(1);
    });

    it('should render one description', () => {
      expect(node.querySelectorAll('.description-field').length).toBe(1);
    });

    it('should render two property containers', () => {
      expect(node.querySelectorAll('.property').length).toBe(2);
    });
  });
}

export default check;
