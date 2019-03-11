import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  queryParams: ['from'],
  from: null,

  usuario: service(),
  alerta: service(),

  actions: {

    cadastrarPaciente() {
      this.get('store').query('paciente', {
        orderBy: 'nomeLowerCase',
        equalTo: this.get('nome').toLowerCase().trim()
      }).then(response => {
        if (response.length > 0) {
          let paciente = response.objectAt(0);
          if (!paciente.get('inativo')) {
            this.get('alerta').erro('Já existe um paciente com este nome');
          } else {
            this.set('pacienteReativacao', paciente);
            $('#modalConfirmarReativacao').modal('open');
          }
        } else {
          let paciente = this.get('store').createRecord('paciente', {
            nome: this.get('nome').trim(),
            nomeLowerCase: this.get('nome').toLowerCase().trim(),
            usuario: this.get('usuario').usuario
          })
          let self = this;
          paciente.save().then(function() {
            self.set('nome', null);
            self.get('alerta').sucesso('Paciente salvo com sucesso!');
            if (self.get('from')) {
              localStorage.setItem('novoPaciente', paciente.get('id'));
              self.transitionToRoute(self.get('from'));
            }
          })
        }
      })
    },

    reativarPaciente() {
      this.set('pacienteReativacao.inativo', false);
      let self = this;
      this.get('pacienteReativacao').save().then(function() {
        self.get('alerta').sucesso('Paciente reativado com sucesso');
      })
    }

  }
});
