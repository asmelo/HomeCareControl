import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),
  alerta: service(),


  pacientesOrdenados: computed('model.[]', function() {
    if(this.get('model')) {
      return this.get('model').sortBy('nome');
    }else{
      return null;
    }

  }),

  actions: {

    editarPaciente(paciente) {
      this.transitionToRoute('base.paciente.edicao', paciente.get('id'));
      window.scrollTo(0,0);
    },

    confirmarExclusao(paciente) {
      this.set('pacienteExclusao', paciente);
      $('#modalConfirmarExclusao').modal('open');
    },

    excluirPaciente() {
      this.get('pacienteExclusao').deleteRecord();
      this.get('pacienteExclusao').save().then(response => {
        this.get('alerta').sucesso('Paciente excluído com sucesso!');
      })
    }

  }
});
