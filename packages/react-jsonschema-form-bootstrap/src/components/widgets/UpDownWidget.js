import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';

import { rangeSpec } from 'react-jsonschema-form/lib/utils';

function UpDownWidget(props) {
  const {
    registry: {
      widgets: { BaseInput }
    }
  } = props;
  return <BaseInput type="number" {...props} {...rangeSpec(props.schema)} />;
}

if (process.env.NODE_ENV !== 'production') {
  UpDownWidget.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };
}

export default hot(module)(UpDownWidget);
