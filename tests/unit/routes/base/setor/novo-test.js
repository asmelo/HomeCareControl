import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/setor/novo', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/setor/novo');
    assert.ok(route);
  });
});
