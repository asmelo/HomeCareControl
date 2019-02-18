import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({

  usuario: service(),

  beforeModel(transition) {
    if (window.location.pathname == '/') {
      this.transitionTo('base.atendimento.novo');
    }
  },

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
