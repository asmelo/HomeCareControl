import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  alerta: service(),
  router: service(),

  actions: {

    selecionaDeOutroProfissional(deOutroProfissional) {
      this.set('paciente.deOutroProfissional', deOutroProfissional);      
    },

    selecionaSituacao(situacao) {
      if (situacao == 'Ativo') {
        this.set('paciente.inativo', false);
      } else {
        this.set('paciente.inativo', true);
      }
    },

    atualizarPaciente() {      
      this.set('paciente.nome', this.get('paciente.nome').trim());
      this.set('paciente.nomeLowerCase', this.get('paciente.nome').toLowerCase().trim());      
            
      let self = this;
      this.get('paciente').save().then(function() {
        self.get('alerta').sucesso('Paciente atualizado com sucesso!');
        self.transitionToRoute('base.paciente.novo');
      })
    },

    cancelarEdicao() {
      this.get('paciente').rollbackAttributes();
      this.transitionToRoute('base.paciente.novo');
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirPaciente() {
      this.get('store').query('atendimento', {
        orderBy: 'paciente',
        equalTo: this.get('paciente').get('id')
      }).then(response => {
        if (response.length > 0) {
          this.get('paciente').set('inativo', true);
          let self = this;
          this.get('paciente').save().then(function() {
            self.get('alerta').sucesso('Paciente inativado com sucesso!');
            self.get('router').transitionTo('base.paciente.novo');
          })
        } else {
          this.get('paciente').deleteRecord();
          let self = this;
          this.get('paciente').save().then(function() {
            self.get('alerta').sucesso('Paciente excluído com sucesso!');
            self.get('router').transitionTo('base.paciente.novo');
          })
        }

      })
    }
  }
});
