import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  queryParams: ['from'],
  from: null,

  usuario: service(),
  alerta: service(),

  actions: {

    cadastrarSetor() {
      this.get('store').query('setor', {
        orderBy: 'nomeLowerCase',
        equalTo: this.get('nome').toLowerCase().trim()
      }).then(setores => {        
        if (setores.length > 0) {
          let setor = setores.objectAt(0);
          if (!setor.get('inativo')) {
            this.get('alerta').erro('Já existe um setor com este nome');
          } else {
            this.set('setorReativacao', setor);
            $('#modalConfirmarReativacao').modal('open');
          }
        } else {
          let setor = this.get('store').createRecord('setor', {
            nome: this.get('nome').trim(),
            nomeLowerCase: this.get('nome').toLowerCase().trim()
          })
          let self = this;
          setor.save().then(function() {
            self.set('nome', null);
            self.get('alerta').sucesso('Setor salvo com sucesso!');
            self.set('ultimoIdSetor', setor.get('id'))
            if (self.get('from')) {
              localStorage.setItem('novoSetor', setor.get('id'));
              self.transitionToRoute(self.get('from'));
            }
          })
        }
      })
    },

    reativarSetor() {
      this.set('setorReativacao.inativo', false);
      let self = this;
      this.get('setorReativacao').save().then(function() {
        self.get('alerta').sucesso('Setor reativado com sucesso');
      })
    }

  }
});
