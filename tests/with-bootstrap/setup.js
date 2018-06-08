import Form from '../../packages/react-jsonschema-form/src';
import initCheck from '../../packages/react-jsonschema-form/src/compatibility';
import theme from '../../packages/react-jsonschema-form-bootstrap/src';

const check = initCheck(Form, { theme });

export default check;
