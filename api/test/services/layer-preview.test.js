const assert = require('assert');
const app = require('../../src/app');

describe('\'layer-preview\' service', () => {
  it('registered the service', () => {
    const service = app.service('layer-preview');

    assert.ok(service, 'Registered the service');
  });
});
