import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({

  model(params) {
    return this.store.findRecord('setor', params.id_setor);
  },

  setupController(controller, model) {
    controller.set('setor', model);
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
