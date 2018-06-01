import React from 'react';

/**
 * @typedef {object} Props
 * @prop {string | React.ReactElement} help - string or JSX
 *
 * @param {Props} props
 */
const HelpTemplate = props => {
  const { help } = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  if (typeof help === 'string') {
    return <small className="form-text text-muted">{help}</small>;
  }
  return <div className="form-text">{help}</div>;
};

export default HelpTemplate;
