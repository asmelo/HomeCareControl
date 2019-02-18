import Route from '@ember/routing/route';
import { schedule } from '@ember/runloop';


export default Route.extend({

  actions: {
    didTransition() {
      schedule("afterRender",this,function() {
        document.getElementById('inputNome').focus();
      });

      return true;
    }
  }

});
