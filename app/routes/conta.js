import Route from '@ember/routing/route';
import $ from 'jquery';

export default Route.extend({

  setupController(controller) {
    controller.set('profissoes', ['Fonoaudiólogo', 'Fisioterapeuta']);
  },

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
