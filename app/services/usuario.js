import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({

  store: service(),
  router: service(),
  toastr: service('toast'),
  alerta: service(),

  usuario: null,

  init() {
    this._super(...arguments);

    this.inicializarUsuario();

    if (!this.get('listenerAuthCriado')) {
        this.criaListenerAuth();
    }

  },

  inicializarUsuario() {
    this.set('userId', localStorage.getItem('userId'));
    this.set('userEmail', localStorage.getItem('userEmail'));

    if (this.get('userEmail')) {
      this.get('store').query('usuario', {
        orderBy: 'email',
        equalTo: this.get('userEmail')
      }).then(response => {
        let usuario = response.objectAt(0);
        this.set('usuario', usuario);
        localStorage.setItem('userId', usuario.get('id'));
        this.set('userId', usuario.get('id'));

        if (this.get('redirecionarParaAtendimento')) {
          this.get('router').transitionTo('base.atendimento.novo');
          this.set('redirecionarParaAtendimento', false);
        }
      });
    }
  },

  criaListenerAuth() {
    if (!this.get('userId')) {
      //Caso o userId carregado do localStora esteja vazio exibe o loading para aguardar o
      //listerner do firebase.auth executar e recuperar os dados do usuario logado
        $('loading').css('display', '');
    }

    //Cria listener no firebase.auth().
    var this2 = this;
    firebase.auth().onAuthStateChanged(function(user) {
      //Sempre que houver mudança de estado esta função será executada.
      if (user) {
        this2.set('userFirebase', user);
        localStorage.setItem('userEmail', user.email);
        this2.inicializarUsuario();
      } else {
        this2.set('usuario', null);
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        this2.inicializarUsuario();

        $('loading').css('display', 'none');
        if (window.location.pathname != '/login' && window.location.pathname != '/conta') {
          this2.get('router').transitionTo('login');
          location.reload();
        }
      }
    });

    this.set('listenerAuthCriado', true);
  },

  criarConta(nome, registro, email, senha) {
    $('loading').css('display', '');
    this.set('redirecionarParaAtendimento', true);
    firebase.auth().createUserWithEmailAndPassword(email, senha).then(response => {
      let usuario = this.get('store').createRecord('usuario', {
        nome: nome,
        registro: registro,
        email: email
      });
      usuario.save().then(response => {
        this.set('redirecionarParaAtendimento', true);
        this.get('alerta').sucesso('Conta cadastrada com sucesso!');
      })
    }).catch(error => {
      console.log(error.code);
      console.log(error.message);
      $('loading').css('display', 'none');
      
      if (error.code == 'auth/email-already-in-use') {
        this.get('alerta').erro('E-mail já cadastrado');
        return;
      }
      if (error.code == 'auth/weak-password') {
        this.get('alerta').erro('Sua senha deve possuir no mínimo 6 caracteres');
        return;
      }

      this.get('alerta').erro('Ocorreu um erro ao cadastrada a conta!');
    })
  },

  signIn(email, senha) {
    $('loading').css('display', '');

    this.set('redirecionarParaAtendimento', true);
    var this2 = this;
    console.log('email: ' + email);
    console.log('senha: ' + senha);
    firebase.auth().signInWithEmailAndPassword(email, senha).catch(function(error) {
      if (error.code == 'auth/invalid-email') {
        this2.get('alerta').erro('E-mail inválido!');
      }
      if (error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') {
        this2.get('alerta').erro('Usuário ou senha inválido!');
      }
      console.log('Erro: ' + error.code + ' - ' + error.message);
      $('loading').css('display', 'none');
    });

  },

  signOut() {
    $('loading').css('display', '');
    this.set('usuario', null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userNome');
    localStorage.removeItem('userRegistro');
    localStorage.removeItem('userEmail');
    this.inicializarUsuario();
    firebase.auth().signOut();
  },

});
