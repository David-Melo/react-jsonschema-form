import arrays from './arrays';
import nested from './nested';
import numbers from './numbers';
import simple from './simple';
import widgets from './widgets';
import ordering from './ordering';
import references from './references';
import custom from './custom';
import errors from './errors';
import large from './large';
import date from './date';
import validation from './validation';
import files from './files';
import single from './single';
import customArray from './customArray';
import customObject from './customObject';
import alternatives from './alternatives';
import propertyDependencies from './propertyDependencies';
import schemaDependencies from './schemaDependencies';

const byId = {
  simple: {
    title: 'Simple',
    formProps: simple
  },
  nested: {
    title: 'Nested',
    formProps: nested
  },
  arrays: {
    title: 'Arrays',
    formProps: arrays
  },
  numbers: {
    title: 'Numbers',
    formProps: numbers
  },
  widgets: {
    title: 'Widgets',
    formProps: widgets
  },
  ordering: {
    title: 'Ordering',
    formProps: ordering
  },
  references: {
    title: 'References',
    formProps: references
  },
  custom: {
    title: 'Custom',
    formProps: custom
  },
  errors: {
    title: 'Errors',
    formProps: errors
  },
  large: {
    title: 'Large',
    formProps: large
  },
  date: {
    title: 'Date & Time',
    formProps: date
  },
  validation: {
    title: 'Validation',
    formProps: validation
  },
  files: {
    title: 'Files',
    formProps: files
  },
  single: {
    title: 'Single',
    formProps: single
  },
  customArray: {
    title: 'Custom Array',
    formProps: customArray
  },
  customObject: {
    title: 'Custom Object',
    formProps: customObject
  },
  alternatives: {
    title: 'Alternatives',
    formProps: alternatives
  },
  propertyDependencies: {
    title: 'Property Dependencies',
    formProps: propertyDependencies
  },
  schemaDependencies: {
    title: 'Schema Dependencies',
    formProps: schemaDependencies
  }
};

const allIds = Object.keys(byId);

export default { byId, allIds };
