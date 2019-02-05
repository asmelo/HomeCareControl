import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({

  pacientesOrdenados: computed('model.[]', function() {
    return this.get('model').sortBy('nome');
  }),

  actions: {

    editarPaciente(idPaciente) {
      this.transitionToRoute('base.paciente.edicao', idPaciente);
      window.scrollTo(0,0)
    }
    
  }
});
