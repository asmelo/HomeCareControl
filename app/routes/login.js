import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({

  usuario: service(),

  beforeModel() {
    if (this.get('usuario').userId) {
      this.transitionTo('base.atendimento.novo');
    }
  },

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
