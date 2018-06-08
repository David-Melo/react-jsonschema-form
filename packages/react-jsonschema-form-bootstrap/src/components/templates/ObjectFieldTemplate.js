import React from 'react';
import { hot } from 'react-hot-loader';

const ObjectFieldTemplate = props => {
  const { TitleTemplate, DescriptionTemplate } = props;
  return (
    <fieldset>
      {(props.uiSchema['ui:title'] || props.title) && (
        <TitleTemplate
          id={`${props.idSchema.$id}__title`}
          title={props.title || props.uiSchema['ui:title']}
          required={props.required}
          formContext={props.formContext}
        />
      )}
      {props.description && (
        <DescriptionTemplate
          id={`${props.idSchema.$id}__description`}
          description={props.description}
          formContext={props.formContext}
        />
      )}
      {props.properties.map(prop => prop.content)}
    </fieldset>
  );
};

export default hot(module)(ObjectFieldTemplate);
