const assert = require('assert');
const app = require('../../src/app');

describe('\'currentImage\' service', () => {
  it('registered the service', () => {
    const service = app.service('current-image');

    assert.ok(service, 'Registered the service');
  });
});
