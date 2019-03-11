import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({

  model(params) {
    return this.store.findRecord('paciente', params.id_paciente);
  },

  setupController(controller, model) {
    controller.set('paciente', model);
    controller.set('listaSituacao', ['Ativo', 'Inativo']);
  },


  actions: {
    didTransition() {
      schedule("afterRender",this,function() {
        document.getElementById('inputNome').focus();
      });

      return true;

    }
  }


});
