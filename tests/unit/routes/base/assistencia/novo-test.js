import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/assistencia/novo', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/assistencia/novo');
    assert.ok(route);
  });
});
