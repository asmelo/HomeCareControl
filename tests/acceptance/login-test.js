import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, andThen } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /login', async function(assert) {
    await visit('/login');
    await fillIn('input.email', 'demo_asmelo@yahoo.com');
    await fillIn('input.senha', 'demo_asmelo');
    //await click('button.submit');

    andThen(function() {
      assert.equal(currentURL(), '/atendimento/novo');
    });
  });
});
