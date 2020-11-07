import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({

  usuario: service(),
  util: service(),

  beforeModel() {
    if (this.get('usuario').userId) {      
      if (this.get('util').isLocalhostOrControleDeAssistenciaHost()) {
        this.transitionTo('base.assistencia.novo');
      } else {
        this.transitionTo('base.atendimento.novo');
      }        
    }
  },

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
