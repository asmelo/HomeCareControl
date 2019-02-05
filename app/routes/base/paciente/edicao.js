import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({

  model(params) {
    return this.store.findRecord('paciente', params.idPaciente);
  },

  actions: {
    didTransition() {
      schedule("afterRender",this,function() {
        document.getElementById('inputNome').focus();
      });

    }
  }


});
