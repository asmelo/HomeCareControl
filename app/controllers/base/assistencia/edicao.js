import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

const constraints = {
  setor: {
    presence: {
      message: "Selecione um setor"
    }
  },

  valor: {
    presence: {
      allowEmpty: false,
      message: "Informe o valor da assistência"
    }
  }
}

export default Controller.extend({

  alerta: service(),
  router: service(),
  usuario: service(),
  util: service(),
  validacao: service(),

  actions: {

    selecionaData(data) {
      this.set('assistencia.dtAssistencia', data);
      this.get('assistencia.dtAssistencia').setHours(12);
    },

    selecionaSetor(setor) {
      this.set('assistencia.setor', setor);
    },

    selecionaGrupoCompartilhamento(grupoCompartilhamento) {
      this.set('grupoCompartilhamento', grupoCompartilhamento);
    },

    selecionaTurno(turno) {
      this.set('assistencia.turno', turno);
    },

    atualizarAssistencia() {

      let valorTratado = this.get('util').tratarValor(this.get('assistencia.valor'));
      this.set('assistencia.valor', valorTratado);

      if (this.get('grupoCompartilhamento.id') == -1) {
        this.set('assistencia.grupoCompartilhamento', null);
      } else {
        this.set('assistencia.grupoCompartilhamento', this.get('grupoCompartilhamento'));
      }

      if (!this.get('validacao').validar(this.get('assistencia'), constraints)) return;

      let self = this;
      this.get('assistencia').save().then(function() {
        self.get('alerta').sucesso('Assistência atualizada com sucesso!', { timeOut: 4000 });
        self.transitionToRoute('base.assistencia.novo');
        window.scrollTo(0,0);
      })
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirAssistencia() {
      this.get('assistencia').deleteRecord();
      let self = this;
      this.get('assistencia').save().then(function() {
        self.get('alerta').sucesso('Assistência excluída com sucesso!', { timeOut: 4000 });
        self.get('router').transitionTo('base.assistencia.novo');
      })
    },

    cancelarEdicao() {
      this.get('assistencia').rollbackAttributes();
      this.transitionToRoute('base.assistencia.novo');
    },

  }
});
