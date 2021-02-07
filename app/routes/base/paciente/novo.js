import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';


export default Route.extend({

  setupController(controller, model) {
    
    let listaDeOutroPaciente = ['Sim', 'Não'];
    controller.set('listaDeOutroPaciente', listaDeOutroPaciente);   
    controller.set('deOutroProfissional', 'Não');

  },

  actions: {
    didTransition() {
      schedule("afterRender",this,function() {
        document.getElementById('inputNumero').focus();
      });

      return true;
    }
  }

});
