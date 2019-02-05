import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/paciente/edicao', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/paciente/edicao');
    assert.ok(route);
  });
});
