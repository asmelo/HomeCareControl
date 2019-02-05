import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({

  session: service(),
  store: service(),
  router: service(),
  toastr: service('toast'),
  alerta: service(),

  usuario: null,

  criaListenerAuth() {
    $('loading').css('display', '');
    var this2 = this;
    return new Promise(function(resolve, reject) {
      //Cria listener no firebase.auth().
      firebase.auth().onAuthStateChanged(function(user) {
        //Sempre que houver mudança de estado esta função será executada.
        if (user) {
          this2.get('store').query('usuario', {
            orderBy: 'email',
            equalTo: user.email
          }).then(response => {
            let usuario = response.objectAt(0);
            usuario.set('userFirebase', user);
            this2.set('usuario', usuario);
            $('loading').css('display', 'none');
          });
          this2.get('router').transitionTo('/');
          resolve(user);
        } else {
          this2.set('usuario', null);
          $('loading').css('display', 'none');
          this2.get('router').transitionTo('login');
        }
      });
    });
  },

  criarConta(nome, registro, email, senha) {
    $('loading').css('display', '');
    firebase.auth().createUserWithEmailAndPassword(email, senha).then(response => {
      let usuario = this.get('store').createRecord('usuario', {
        nome: nome,
        registro: registro,
        email: email
      });
      usuario.save().then(response => {
        this.get('router').transitionTo('/');
        this.get('alerta').sucesso('Conta cadastrada com sucesso!');
      })
    }).catch(error => {
      console.log(error.code);
      console.log(error.message);
      $('loading').css('display', 'none');
    })
  },

  signIn(email, senha) {
    $('loading').css('display', '');
    let user = firebase.auth().currentUser;
    if(user) {
      this.get('router').transitionTo('/');
    }else{
      var this2 = this;
      firebase.auth().signInWithEmailAndPassword(email, senha).catch(function(error) {
        if (error.code == 'auth/user-not-found') {
          this2.get('alerta').erro('Usuário ou senha inválido!');
        }
        console.log('Erro: ' + error.code + ' - ' + error.message);
        $('loading').css('display', 'none');
      });
    }

  },

  signOut() {
    $('loading').css('display', '');
    this.set('usuario', null);
    firebase.auth().signOut();
  },

});
