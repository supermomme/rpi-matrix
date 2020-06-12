const assert = require('assert');
const app = require('../../src/app');

describe('\'pixel\' service', () => {
  it('registered the service', () => {
    const service = app.service('pixel');

    assert.ok(service, 'Registered the service');
  });
});
