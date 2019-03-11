import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

const constraints = {
    descricao: {
      presence: {
        allowEmpty: false,
        message: "Informe a descrição da reunião"
      }
    },

    duracao: {
      presence: {
        message: "Informe a duração da reunião"
      },
      format: {
        pattern: /^\d{2}:\d{2}$/,
        message: "O formato da duração deve ser hh:mm. (Ex.: 01:00)"
      }
    }
};

export default Controller.extend({

  alerta: service(),
  router: service(),
  util: service(),
  validacao: service(),

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

      if (!this.get('validacao').validar(this.get('reuniao'), constraints)) return;

      let self = this;
      this.get('reuniao').save().then(function() {
        self.get('alerta').sucesso('Reunião atualizada com sucesso!', { timeOut: 4000 });
        self.transitionToRoute('base.reuniao.novo');
        window.scrollTo(0,0);
      })
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirReuniao() {
      this.get('reuniao').deleteRecord();
      let self = this;
      this.get('reuniao').save().then(function() {
        self.get('alerta').sucesso('Reunião excluída com sucesso!', { timeOut: 4000 });
        self.get('router').transitionTo('base.reuniao.novo');
      })
    },

    cancelarEdicao() {
      this.get('reuniao').rollbackAttributes();
      this.transitionToRoute('base.reuniao.novo');
    },

  }
});
