import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/assistencia/edicao', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/assistencia/edicao');
    assert.ok(route);
  });
});
