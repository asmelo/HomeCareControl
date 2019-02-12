import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { later } from '@ember/runloop';

export default Route.extend({

  usuario: service(),  

  model() {
    if (!this.get('usuario').listenerAuthCriado) {
        return this.get('usuario').criaListenerAuth();
    }
  }


});
