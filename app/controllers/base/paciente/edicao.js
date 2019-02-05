import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  alerta: service(),

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
    }
  }
});
