const assert = require('assert');
const app = require('../../src/app');

describe('\'layer\' service', () => {
  it('registered the service', () => {
    const service = app.service('layer');

    assert.ok(service, 'Registered the service');
  });
});
