import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/setor', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/setor');
    assert.ok(route);
  });
});
