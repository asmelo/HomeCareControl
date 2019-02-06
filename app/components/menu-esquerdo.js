import Component from '@ember/component';
import { inject as service } from '@ember/service'

export default Component.extend({

  usuario: service(),
  router: service(),

  didInsertElement() {

    this.$('.sidenav').sidenav();

  },

  actions: {

    abrirItemMenu(rota) {
      this.get('router').transitionTo(rota);
      if ($('body').width() < 992) {
        $('.sidenav-overlay').click();
      }
    }
  }

});
