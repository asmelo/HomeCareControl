import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  model() {
    return this.store.query('paciente', {
      orderBy: 'usuario',
      equalTo: this.get('usuario').usuario.get('id')
    })
  }

  /*
  afterModel() {
    var this2 = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this2.get('store').query('usuario', {
          orderBy: 'email',
          equalTo: user.email
        }).then(response => {
          let usuario = response.objectAt(0);
          usuario.set('userFirebase', user);
          this2.store.query('paciente', {
            orderBy: 'usuario',
            equalTo: usuario.get('id')
          }).then(response => {
            this2.controller.set('pacientes', response)
          });
        })
      }
    });
  }*/

});
