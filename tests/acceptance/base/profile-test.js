import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | base/profile', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /base/profile', async function(assert) {

    await visit('/profile');

    let controller = this.owner.lookup('controller:base/profile');
    let nome = await controller.get('nome');
    let registro = await controller.get('registro');

    await fillIn('input.nome', 'Nome de teste do QUnit');
    await fillIn('input.registro', 'Reg. QUnit');
    await click('button.salvar');

    assert.dom('div.toast-message', document).hasText(
      'Registro atualizado com sucesso'
    );

    //Salva o nome e registro antigo
    await fillIn('input.nome', nome);
    await fillIn('input.registro', registro);
    await click('button.salvar');

  });
});
