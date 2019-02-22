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

    scrollUp() {
      window.scrollTo(0,0);
    },

  }
});
