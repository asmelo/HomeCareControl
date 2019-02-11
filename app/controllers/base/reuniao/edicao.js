import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({

  alerta: service(),
  router: service(),
  util: service(),

  valor: computed('reuniao.duracao', function() {
    return this.get('util').calculaValorReuniao(this.get('reuniao.duracao'));
  }),

  actions: {

    selecionaData(data) {
      this.set('reuniao.dtReuniao', data);
    },

    selecionaGrupoCompartilhamento(grupoCompartilhamento) {
      this.set('grupoCompartilhamento', grupoCompartilhamento);
    },

    atualizarReuniao() {

      this.set('reuniao.valor', this.get('valor'));

      if (this.get('grupoCompartilhamento.id') == -1) {
        this.set('reuniao.grupoCompartilhamento', null);
      } else {
        this.set('reuniao.grupoCompartilhamento', this.get('grupoCompartilhamento'));
      }

      this.get('reuniao').save().then(response => {
        this.get('alerta').sucesso('Reunião atualizada com sucesso!', { timeOut: 4000 });
        this.transitionToRoute('base.reuniao.novo');
        window.scrollTo(0,0);
      })
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirReuniao() {
      this.get('reuniao').deleteRecord();
      this.get('reuniao').save().then(response => {
        this.get('alerta').sucesso('Reunião excluída com sucesso!', { timeOut: 4000 });
        this.get('router').transitionTo('base.reuniao.novo');
      })
    },

    cancelarEdicao() {
      this.get('reuniao').rollbackAttributes();
      this.transitionToRoute('base.reuniao.novo');
    },

  }
});
