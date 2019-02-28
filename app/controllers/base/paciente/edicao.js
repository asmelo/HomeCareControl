import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  alerta: service(),
  router: service(),

  listaSituacao: ['Ativo', 'Inativo'],

  actions: {

    selecionaSituacao(situacao) {
      if (situacao == 'Ativo') {
        this.set('model.inativo', false);
      } else {
        this.set('model.inativo', true);
      }
    },

    atualizarPaciente() {
      this.set('model.nome', this.get('model.nome').trim());
      this.set('model.nomeLowerCase', this.get('model.nome').toLowerCase().trim());
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
      this.get('store').query('atendimento', {
        orderBy: 'paciente',
        equalTo: this.get('model').get('id')
      }).then(response => {
        if (response.length > 0) {
          this.get('model').set('inativo', true);
          this.get('model').save().then(response => {
            this.get('alerta').sucesso('Paciente inativado com sucesso!');
            this.get('router').transitionTo('base.paciente.novo');
          })
        } else {
          this.get('model').deleteRecord();
          this.get('model').save().then(response => {
            this.get('alerta').sucesso('Paciente excluído com sucesso!');
            this.get('router').transitionTo('base.paciente.novo');
          })
        }

      })
    }
  }
});
