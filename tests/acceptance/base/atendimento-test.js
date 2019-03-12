import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';
import { selectChoose } from 'ember-power-select/test-support';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module('Acceptance | base/atendimento', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /base/atendimento', async function(assert) {
    var idAtendimentoTest = null;

    await visit('/atendimento/novo');

    await selectChoose('.selectPaciente', 'Roberto Costa');
    await click('button.salvar');

    await timeout(1000);
    assert.dom('div.toast-message', document).hasText(
      'Atendimento salvo com sucesso!'
    );
    $('.toast-message').remove();

    let controller = this.owner.lookup('controller:base/atendimento/novo');
    idAtendimentoTest = controller.get('ultimoIdAtendimento');

    await visit('/atendimento/edicao/' + idAtendimentoTest);

    await selectChoose('.selectPaciente', 'Maria Cristina');
    await click('button.salvar');

    assert.dom('div.toast-message', document).hasText(
      'Atendimento atualizado com sucesso!'
    );
    $('.toast-message').remove();

    await visit('/atendimento/edicao/' + idAtendimentoTest);
    await click('a.excluir');
    await click('button.confirExclusao');
    await timeout(1000);

    assert.dom('div.toast-message', document).hasText(
      'Atendimento excluído com sucesso!'
    );
    $('.toast-message').remove();
  });
});
