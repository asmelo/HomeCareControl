import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

const constraints = {
  paciente: {
    presence: {
      message: "Selecione um paciente"
    }
  },

  valor: {
    presence: {
      allowEmpty: false,
      message: "Informe o valor do atendimento"
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
      this.set('atendimento.dtAtendimento', data);
      this.get('atendimento.dtAtendimento').setHours(12);
    },

    selecionaPaciente(paciente) {
      this.set('atendimento.paciente', paciente);
    },

    selecionaTipoAtendimento(tipoAtendimento) {
      this.set('atendimento.tipo', tipoAtendimento);
    },

    atualizarAtendimento() {

      let valorTratado = this.get('util').tratarValor(this.get('atendimento.valor'));
      this.set('atendimento.valor', valorTratado);      

      let anoMes = this.get('util').formataAnoEmes(this.get('atendimento.dtAtendimento'));
      let usuarioAnoMes = this.get('util').formataUsuarioAnoEmes(this.get('atendimento.usuario'), this.get('atendimento.dtAtendimento'));
      this.set('atendimento.anoMes', anoMes);  
      this.set('atendimento.usuarioAnoMes', usuarioAnoMes);  

      if (!this.get('validacao').validar(this.get('atendimento'), constraints)) return;

      let self = this;
      this.get('atendimento').save().then(function() {
        self.get('alerta').sucesso('Atendimento atualizado com sucesso!', { timeOut: 4000 });
        self.transitionToRoute('base.atendimento.novo');
        window.scrollTo(0,0);
      })
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirAtendimento() {
      this.get('atendimento').deleteRecord();
      let self = this;
      this.get('atendimento').save().then(function() {
        self.get('alerta').sucesso('Atendimento excluído com sucesso!', { timeOut: 4000 });
        self.get('router').transitionTo('base.atendimento.novo');
      })
    },

    cancelarEdicao() {
      this.get('atendimento').rollbackAttributes();
      this.transitionToRoute('base.atendimento.novo');
    },

  }
});
