import React from 'react';
import { hot } from 'react-hot-loader';

const SubmitTemplate = () => (
  <p>
    <button type="submit" className="btn btn-info">
      Submit
    </button>
  </p>
);

export default hot(module)(SubmitTemplate);
