import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  actions: {

    cadastrarPaciente() {
        let paciente = this.get('store').createRecord('paciente', {
          nome: this.get('nome'),
          usuario: this.get('usuario').usuario
        })
        paciente.save().then(response => {
          this.set('nome', null);
          this.get('alerta').sucesso('Paciente salvo com sucesso!');
        })
    }

  }
});
