import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/relatorio-assistencia', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/relatorio-assistencia');
    assert.ok(route);
  });
});
