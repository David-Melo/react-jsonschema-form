import React from 'react';

const ErrorListTemplate = props => {
  const { errors } = props;

  return (
    <div className="card text-white bg-danger mb-3">
      <div className="card-header">Errors</div>
      <ul className="list-group list-group-flush">
        {errors.map((error, index) => {
          return (
            <li key={index} className="list-group-item list-group-item-danger">
              {error.stack}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ErrorListTemplate;
