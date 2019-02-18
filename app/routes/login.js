import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  beforeModel(transition) {    
    if (this.get('usuario').userId) {
      this.transitionTo('base.atendimento.novo');
    }
  },

});
