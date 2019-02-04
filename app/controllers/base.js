import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),

  actions: {
    
    signOut() {
      this.get('usuario').signOut()
    }

  }

});
