import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({

  session: service(),
  store: service(),

  usuario: null,
  userId: firebase.auth().currentUser,

  verificaUsuarioLogado() {
    return this.get('session').fetch().catch(function() {});
  },

  carregaUsuario() {
    if(this.get('session').get('isAuthenticated')) {
      var uid = this.get('session').get('currentUser').uid
      this.get('store').query('usuario', {
        orderBy: 'uid',
        equalTo: uid
      }).then(response => {
        let usuario = response.objectAt(0);
        this.set('usuario', usuario);
      })
    }
  },

  criarConta(nome, registro, email, senha) {
    //Confirmar se após a criação da conta esta sendo feito o login para recuperar e salvar o uid
    firebase.auth().createUserWithEmailAndPassword(email, senha).then(response => {
      let usuario = this.get('store').createRecord('usuario', {
        nome: nome,
        registro: registro,
        email: email
      })
      this.set('novoUsuario', usuario);
      usuario.save().then(response => {
        this.get('session').open('firebase',{
          provider: "password",
          email: this.get('novoUsuario.email'),
          password: senha
        }).then(data => {
          var uid = this.get('session').get('currentUser').uid
          this.get('novoUsuario').set('uid', uid);
          usuario.save();
        }).catch(erro => {
          console.log('Erro: ' + erro)
        })
      })
    }).catch(error => {
      console.log(error.code)
      console.log(error.message)
    })
  },

  signIn(email, senha) {
    // TODO: Entender como o userId é passado numa requisição para o Firebase e se as regras do Database estão corretas
    //https://firebase.google.com/docs/database/security/user-security?hl=pt-br
    //https://medium.com/@martinmalinda/emberfire-is-awesome-but-querying-data-and-writing-security-rules-can-be-a-pain-f5370f4decb
    //https://github.com/firebase/emberfire
    //https://firebase.google.com/docs/database/web/read-and-write
    //https://firebase.google.com/docs/database/security/quickstart

    this.get('session').open('firebase',{
      provider: "password",
      email: email,
      password: senha
    }).then(data => {
      //this.set('userId', firebase.auth().currentUser.uid)
      console.log(data.currentUser);

      this.get('store').query('usuario', {
        orderBy: 'email',
        equalTo: email
      }).then(response => {
        let usuario = response.objectAt(0);
        this.set('usuario', usuario);
      })

    }).catch(erro => {
      console.log('Erro: ' + erro)
    })
  },

  signOut() {
    this.get('session').close()
  },

});
