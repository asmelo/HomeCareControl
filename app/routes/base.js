import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({

  usuario: service(),

  beforeModel() {
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
