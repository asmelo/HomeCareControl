import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend({

  usuario: service(),

  model() {
    return this.get('usuario').criaListenerAuth();
  }

});
