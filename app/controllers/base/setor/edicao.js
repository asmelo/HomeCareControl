import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  alerta: service(),
  router: service(),

  actions: {

    selecionaSituacao(situacao) {
      if (situacao == 'Ativo') {
        this.set('setor.inativo', false);
      } else {
        this.set('setor.inativo', true);
      }
    },

    atualizarSetor() {
      this.set('setor.nome', this.get('setor.nome').trim());
      this.set('setor.nomeLowerCase', this.get('setor.nome').toLowerCase().trim());
      let self = this;
      this.get('setor').save().then(function() {
        self.get('alerta').sucesso('Setor atualizado com sucesso!');
        self.transitionToRoute('base.setor.novo');
      })
    },

    cancelarEdicao() {
      this.get('setor').rollbackAttributes();
      this.transitionToRoute('base.setor.novo');
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirSetor() {
      this.get('store').query('assistencia', {
        orderBy: 'setor',
        equalTo: this.get('setor').get('id')
      }).then(response => {
        if (response.length > 0) {
          this.get('setor').set('inativo', true);
          let self = this;
          this.get('setor').save().then(function() {
            self.get('alerta').sucesso('Setor inativado com sucesso!');
            self.get('router').transitionTo('base.setor.novo');
          })
        } else {
          this.get('setor').deleteRecord();
          let self = this;
          this.get('setor').save().then(function() {
            self.get('alerta').sucesso('Setor excluído com sucesso!');
            self.get('router').transitionTo('base.setor.novo');
          })
        }

      })
    }
  }
});
