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
      this.$('loading').css('display', '');
      let transition = this.get('router').transitionTo(rota);
      if (!transition.targetName) {
        this.$('loading').css('display', 'none');
      }
      if (this.$('body').width() < 992) {
        this.$('.sidenav-overlay').click();
      }
    }
  }

});
