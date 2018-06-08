import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

function check(renderForm, Form, { fields }) {
  const { SchemaField } = fields;

  describe('Rendering performance optimizations', () => {
    const spyFormRender = jest.spyOn(Form.prototype, 'render');

    afterEach(() => {
      spyFormRender.mockRestore();
    });

    describe('Form', () => {
      it('should not render if next props are equivalent', () => {
        const schema = { type: 'string' };
        const uiSchema = {};
        const { rerender } = renderForm({ schema, uiSchema });
        expect(spyFormRender).toHaveBeenCalledTimes(1);

        rerender({ schema });
        expect(spyFormRender).toHaveBeenCalledTimes(1);
      });

      it('should not render if next formData are equivalent', () => {
        const schema = { type: 'string' };
        const formData = 'foo';
        const { rerender } = renderForm({ schema, formData });

        rerender({ formData });

        expect(spyFormRender).toHaveBeenCalledTimes(1);
      });

      it('should only render changed object properties', done => {
        // const spyRender = jest.spyOn(SchemaField.prototype, 'render');
        const schema = {
          type: 'object',
          properties: {
            const: { type: 'string' },
            var: { type: 'string' }
          }
        };

        renderForm(
          {
            schema,
            formData: { const: '0', var: '0' }
          },
          component => {
            const fields = scryRenderedComponentsWithType(
              component,
              SchemaField
            ).reduce((modified, fieldComp) => {
              const id = fieldComp.props.idSchema.$id;
              modified[id] = jest.spyOn(fieldComp, 'render');
              return modified;
            }, {});

            renderForm({ schema, formData: { const: '0', var: '1' } }, () => {
              expect(fields.root_const).not.toHaveBeenCalled();
              expect(fields.root_var).toHaveBeenCalledTimes(1);
              done();
            });
          }
        );

        // renderForm(
        //   {
        //     schema,
        //     formData: { const: '0', var: '0' }
        //   },
        //   (comp, container, update) => {
        //     const fields = scryRenderedComponentsWithType(
        //       comp,
        //       SchemaField
        //     ).reduce((fields, fieldComp) => {
        //       fields[fieldComp.props.idSchema.$id] = {
        //         spy: jest.spyOn(fieldComp, 'render'),
        //         fieldComp
        //       };
        //       return fields;
        //     });

        //     update({ schema, formData: { const: '0', var: '1' } }, () => {
        //       expect(fields.root_const.spy).not.toHaveBeenCalled();
        //       expect(fields.root_var.spy).toHaveBeenCalledTimes(1);

        //       done();
        //     });
        //   }
        // );
      });
    });

    //   it('should only render changed array items', () => {
    //     const schema = {
    //       type: 'array',
    //       items: { type: 'string' }
    //     };

    //     const { comp } = renderForm({
    //       schema,
    //       formData: ['const', 'var0']
    //     });

    //     const fields = scryRenderedComponentsWithType(comp, SchemaField).reduce(
    //       (fields, fieldComp) => {
    //         sandbox.stub(fieldComp, 'render').returns(<div />);
    //         fields[fieldComp.props.idSchema.$id] = fieldComp;
    //         return fields;
    //       }
    //     );

    //     setProps(comp, { schema, formData: ['const', 'var1'] });

    //     sinon.assert.notCalled(fields.root_0.render);
    //     sinon.assert.calledOnce(fields.root_1.render);
    //   });
    // });

    // describe('SchemaField', () => {
    //   const onChange = () => {};
    //   const onBlur = () => {};
    //   const onFocus = () => {};
    //   const registry = getDefaultRegistry();
    //   const uiSchema = {};
    //   const schema = {
    //     type: 'object',
    //     properties: {
    //       foo: { type: 'string' }
    //     }
    //   };
    //   const idSchema = { $id: 'root', foo: { $id: 'root_plop' } };

    //   it('should not render if next props are equivalent', () => {
    //     const props = {
    //       registry,
    //       schema,
    //       uiSchema,
    //       onChange,
    //       idSchema,
    //       onBlur,
    //       onFocus
    //     };

    //     const { comp } = createComponent(SchemaField, props);
    //     sandbox.stub(comp, 'render').returns(<div />);

    //     setProps(comp, props);

    //     sinon.assert.notCalled(comp.render);
    //   });

    //   it('should not render if next formData are equivalent', () => {
    //     const props = {
    //       registry,
    //       schema,
    //       formData: { foo: 'blah' },
    //       onChange,
    //       idSchema,
    //       onBlur
    //     };

    //     const { comp } = createComponent(SchemaField, props);
    //     sandbox.stub(comp, 'render').returns(<div />);

    //     setProps(comp, { ...props, formData: { foo: 'blah' } });

    //     sinon.assert.notCalled(comp.render);
    //   });
    // });
  });
}

export default check;
