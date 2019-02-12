import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

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
  util: service(),
  validacao: service(),

  actions: {

    selecionaData(data) {
      this.set('atendimento.dtAtendimento', data);
    },

    selecionaPaciente(paciente) {
      this.set('atendimento.paciente', paciente);
    },

    selecionaGrupoCompartilhamento(grupoCompartilhamento) {
      this.set('grupoCompartilhamento', grupoCompartilhamento);
    },

    atualizarAtendimento() {

      let valorTratado = this.get('util').tratarValor(this.get('atendimento.valor'));
      this.set('atendimento.valor', valorTratado);

      if (this.get('grupoCompartilhamento.id') == -1) {
        this.set('atendimento.grupoCompartilhamento', null);
      } else {
        this.set('atendimento.grupoCompartilhamento', this.get('grupoCompartilhamento'));
      }

      if (!this.get('validacao').validar(this.get('atendimento'), constraints)) return;

      this.get('atendimento').save().then(response => {
        this.get('alerta').sucesso('Atendimento atualizado com sucesso!', { timeOut: 4000 });
        this.transitionToRoute('base.atendimento.novo');
        window.scrollTo(0,0);
      })
    },

    confirmarExclusao() {
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirAtendimento() {
      this.get('atendimento').deleteRecord();
      this.get('atendimento').save().then(response => {
        this.get('alerta').sucesso('Atendimento excluído com sucesso!', { timeOut: 4000 });
        this.get('router').transitionTo('base.atendimento.novo');
      })
    },

    cancelarEdicao() {
      this.get('atendimento').rollbackAttributes();
      this.transitionToRoute('base.atendimento.novo');
    },

  }
});
