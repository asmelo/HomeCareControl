import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';

export default Route.extend({

  model(params) {
    return this.store.findRecord('paciente', params.id_paciente);
  },

  setupController(controller, model) {
    controller.set('paciente', model);
    controller.set('listaSituacao', ['Ativo', 'Inativo']);

    let listaDeOutroPaciente = ['Sim', 'Não'];
    controller.set('listaDeOutroPaciente', listaDeOutroPaciente);       
  },


  actions: {
    didTransition() {
      schedule("afterRender",this,function() {
        document.getElementById('inputNome').focus();
        document.getElementById('inputFrequencia').focus();
        document.getElementById('inputNumero').focus();
      });

      return true;

    }
  }


});
