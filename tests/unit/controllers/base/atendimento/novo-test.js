import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | base/atendimento/novo', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:base/atendimento/novo');
    assert.ok(controller);
  });
});
