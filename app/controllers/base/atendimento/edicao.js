import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  alerta: service(),
  router: service(),
  util: service(),

  actions: {

    selecionaData(data) {
      this.set('atendimento.dtAtendimento', data);
    },

    selecionaPaciente(paciente) {
      this.set('atendimento.paciente', paciente);
    },

    atualizarAtendimento() {
      if(!this.get('atendimento.paciente')) {
        this.get('alerta').erro('Informe o paciente');
        return;
      }

      let valorTratado = this.get('util').tratarValor(this.get('atendimento.valor'));
      this.set('atendimento.valor', valorTratado);

      this.get('atendimento').save().then(response => {
        this.get('alerta').sucesso('Atendimento atualizado com sucesso!');
        this.transitionToRoute('base.atendimento.novo');
      })
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirAtendimento() {
      this.get('atendimento').deleteRecord();
      this.get('atendimento').save().then(response => {
        this.get('alerta').sucesso('Atendimento excluído com sucesso!');
        this.get('router').transitionTo('base.atendimento.novo');
      })
    },

    cancelarEdicao() {
      this.get('atendimento').rollbackAttributes();
      this.transitionToRoute('base.atendimento.novo');
    },

  }
});
