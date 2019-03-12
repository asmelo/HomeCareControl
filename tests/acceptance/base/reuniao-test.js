import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module('Acceptance | base/reuniao', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /base/reuniao', async function(assert) {
    var idReuniaoTest = null;

    await visit('/reuniao/novo');

    await fillIn('input.duracao', '01:00');
    await fillIn('input.descricao', 'Reunião de teste automatizado do QUnit');
    await click('button.salvar');

    await timeout(1000);
    assert.dom('div.toast-message', document).hasText(
      'Reunião salva com sucesso!'
    );
    $('.toast-message').remove();

    let controller = this.owner.lookup('controller:base/reuniao/novo');
    idReuniaoTest = controller.get('ultimoIdReuniao');

    await visit('/reuniao/edicao/' + idReuniaoTest);

    await fillIn('input.duracao', '01:30');
    await fillIn('input.descricao', 'Reunião de teste automatizado do QUnit - Modificado.');
    await click('button.salvar');

    assert.dom('div.toast-message', document).hasText(
      'Reunião atualizada com sucesso!'
    );
    $('.toast-message').remove();

    await visit('/reuniao/edicao/' + idReuniaoTest);
    await click('a.excluir');
    await click('button.confirExclusao');
    await timeout(1000);

    assert.dom('div.toast-message', document).hasText(
      'Reunião excluída com sucesso!'
    );
    $('.toast-message').remove();
  });
});
