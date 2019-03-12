import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module('Acceptance | base/paciente', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /base/paciente', async function(assert) {
    var idPacienteTest = null;

    await visit('/paciente/novo');

    await fillIn('input.nome', 'Paciente de teste do QUnit');
    await click('button.salvar');

    await timeout(1000);
    assert.dom('div.toast-message', document).hasText(
      'Paciente salvo com sucesso!'
    );
    $('.toast-message').remove();

    let controller = this.owner.lookup('controller:base/paciente/novo');
    idPacienteTest = controller.get('ultimoIdPaciente');

    await visit('/paciente/edicao/' + idPacienteTest);

    await fillIn('input.nome', 'Paciente modificado do QUnit');
    await click('button.salvar');

    assert.dom('div.toast-message', document).hasText(
      'Paciente atualizado com sucesso!'
    );
    $('.toast-message').remove();

    await visit('/paciente/edicao/' + idPacienteTest);
    await click('a.excluir');
    await click('button.confirExclusao');
    await timeout(1000);

    assert.dom('div.toast-message', document).hasText(
      'Paciente excluído com sucesso!'
    );
    $('.toast-message').remove();

  });
});
