import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({

  usuario: service(),
  router: service(),

  didInsertElement() {

    this.$('.sidenav').sidenav();

  },

  actions: {

    abrirItemMenu(rota) {
      $('loading').css('display', '');
      let transition = this.get('router').transitionTo(rota);
      if (!transition.targetName) {
        $('loading').css('display', 'none');
      }
      if ($('body').width() < 992) {
        $('.sidenav-overlay').click();
      }
    }
  }

});
