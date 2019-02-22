import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  model() {
      return this.store.findRecord('usuario', this.get('usuario').userId)
  }

});
