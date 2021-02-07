import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  queryParams: ['from'],
  from: null,

  usuario: service(),
  alerta: service(),

  actions: {

    selecionaDeOutroProfissional(deOutroProfissional) {
      this.set('deOutroProfissional', deOutroProfissional);
    },

    cadastrarPaciente() {
      this.get('store').query('paciente', {
        orderBy: 'nomeLowerCase',
        equalTo: this.get('nome').toLowerCase().trim()
      }).then(response => {
        let pacientes = response.filter(p => {
          return p.get('usuario.id') == this.get('usuario').userId;
        })
        if (pacientes.length > 0) {
          let paciente = pacientes.objectAt(0);
          if (!paciente.get('inativo')) {
            this.get('alerta').erro('Já existe um paciente com este nome');
          } else {
            this.set('pacienteReativacao', paciente);
            $('#modalConfirmarReativacao').modal('open');
          }
        } else {
          let paciente = this.get('store').createRecord('paciente', {            
            numero: this.get('numero'),
            nome: this.get('nome').trim(),
            nomeLowerCase: this.get('nome').toLowerCase().trim(),            
            frequenciaSemanal: this.get('frequenciaSemanal'),
            deOutroProfissional: this.get('deOutroProfissional'),
            usuario: this.get('usuario').usuario
          })
          let self = this;
          paciente.save().then(function() {
            self.set('numero', null);
            self.set('nome', null);
            self.set('frequenciaSemanal', null);
            self.set('deOutroProfissional', 'Não');
            self.get('alerta').sucesso('Paciente salvo com sucesso!');
            self.set('ultimoIdPaciente', paciente.get('id'))
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
