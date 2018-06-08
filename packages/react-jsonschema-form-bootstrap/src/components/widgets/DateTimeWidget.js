import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';

import { utcToLocal, localToUTC } from 'react-jsonschema-form/lib/utils';

function DateTimeWidget(props) {
  const {
    value,
    onChange,
    registry: {
      widgets: { BaseInput }
    }
  } = props;
  return (
    <BaseInput
      type="datetime-local"
      {...props}
      value={utcToLocal(value)}
      onChange={value => onChange(localToUTC(value))}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  DateTimeWidget.propTypes = {
    value: PropTypes.string
  };
}

export default hot(module)(DateTimeWidget);
