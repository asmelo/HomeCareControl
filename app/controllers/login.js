import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),

  actions: {

    signIn() {
      let email = this.get('email').trim();
      let senha = this.get('senha');

      this.get('usuario').signIn(email, senha);
    }

  }

});
