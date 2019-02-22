import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  alerta: service(),
  router: service(),

  actions: {

    atualizarPaciente() {
      this.get('model').save().then(response => {
        this.get('alerta').sucesso('Paciente atualizado com sucesso!');
        this.transitionToRoute('base.paciente.novo');
      })
    },

    cancelarEdicao() {
      this.get('model').rollbackAttributes();
      this.transitionToRoute('base.paciente.novo');
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirPaciente() {
      this.get('model').deleteRecord();
      this.get('model').save().then(response => {
        this.get('alerta').sucesso('Paciente excluído com sucesso!');
        this.get('router').transitionTo('base.paciente.novo');
      })
    }
  }
});
