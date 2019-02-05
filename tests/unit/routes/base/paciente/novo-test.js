import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/paciente/novo', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:base/paciente/novo');
    assert.ok(route);
  });
});
