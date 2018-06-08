const stack = [];
let regex;

export function pack(testPackage) {
  return config => _regex => {
    if (_regex) {
      regex = [].concat(_regex);
    }
    testPackage(config);
  };
}

function call(_process) {
  return (name, fn) => {
    stack.push(name);
    const path = stack.join('/');
    if (!regex || regex.every(rx => rx.test(path))) {
      _process(name, fn);
    }
    stack.pop();
  };
}

export const describe = call(global.describe);
describe.only = global.describe.only;
describe.skip = global.describe.skip;
describe.each = table => call(global.describe.each(table));
describe.only.each = global.describe.only.each;
describe.skip.each = global.describe.skip.each;

export const test = call(global.test);
test.only = global.test.only;
test.skip = global.test.skip;
test.each = table => call(global.test.each(table));
test.only.each = global.test.only.each;
test.skip.each = global.test.skip.each;

export const it = test;
