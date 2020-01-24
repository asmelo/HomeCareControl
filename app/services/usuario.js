import Service from '@ember/service';
import { inject as service } from '@ember/service';
import $ from 'jquery';

/*global firebase*/
/*eslint no-undef: "error"*/

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
          //location.reload();
        }
      }
    });

    this.set('listenerAuthCriado', true);
  },

  criarConta(nome, profissao, registro, email, senha) {
    $('loading').css('display', '');
    this.set('redirecionarParaAtendimento', true);

    let self = this;
    firebase.auth().createUserWithEmailAndPassword(email, senha).then(function() {
      let usuario = self.get('store').createRecord('usuario', {
        nome: nome,
        profissao: profissao,
        registro: registro,
        email: email
      });
      let self_2 = self;
      usuario.save().then(function(novoUsuario) {
        if (novoUsuario.get('profissao') == 'Fonoaudiólogo' || novoUsuario.get('profissao') == 'Fisioterapeuta') {
            let grupo = self_2.get('store').createRecord('grupo-compartilhamento', {
              nome: 'SOS Vida',
              principal: true,
              usuario: novoUsuario
            });

            var coordenadorEmail = 'analusiqueira@hotmail.com';
            if (novoUsuario.get('profissao') == 'Fisioterapeuta')
              coordenadorEmail = 'carolreina_fisio@hotmail.com';

            let self_3 = self_2;
            self_2.get('store').query('usuario', {
                  orderBy: 'email',
                  equalTo: coordenadorEmail
                }).then(function(coordenador) {
                  grupo.get('listaUsuarios').pushObject(coordenador.objectAt(0));

                  let self_4 = self_3;
                  grupo.save().then(function() {
                    self_4.set('redirecionarParaAtendimento', true);
                    self_4.get('alerta').sucesso('Conta cadastrada com sucesso!');
                  }).catch(function() {
                    self_4.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
                  })
                })
        } else {
          self_2.set('redirecionarParaAtendimento', true);
          self_2.get('alerta').sucesso('Conta cadastrada com sucesso!');
        }
      })
    }).catch(error => {
      $('loading').css('display', 'none');

      if (error.code == 'auth/email-already-in-use') {
        self.get('alerta').erro('E-mail já cadastrado');
        return;
      }
      if (error.code == 'auth/weak-password') {
        self.get('alerta').erro('Sua senha deve possuir no mínimo 6 caracteres');
        return;
      }
      if (error.code == 'auth/invalid-email') {
        self.get('alerta').erro('E-mail inválido!');
        return;
      }

      self.get('alerta').erro('Ocorreu um erro ao cadastrada a conta!');
    })
  },

  signIn(email, senha) {
    $('loading').css('display', '');

    this.set('redirecionarParaAtendimento', true);
    var this2 = this;
    firebase.auth().signInWithEmailAndPassword(email, senha).catch(function(error) {
      if (error.code == 'auth/invalid-email') {
        this2.get('alerta').erro('E-mail inválido!');
      }
      if (error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') {
        this2.get('alerta').erro('Usuário ou senha inválido!');
      }
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

  recoverPassword(emailAddress) {
    var auth = firebase.auth();
    var this2 = this;
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      this2.get('alerta').sucesso('Um e-mail foi enviado com instruções para recuperar sua senha.');
    }).catch(function(error) {
      this2.get('alerta').erro('Erro ao enviar e-mail. Verifique se seu e-mail está preenchido corretamente.');
    });
  },

  criarGrupoSOSVidaFono() {
    let grupoSOS = this.get('gruposCompartilhamento').filter(grupo => {
      return grupo.get('nome') == 'SOS Vida';
    });
    if (grupoSOS.length > 0) {
      this.get('alerta').erro('Este grupo já existe');
      return;
    }

    let grupo = this.get('store').createRecord('grupo-compartilhamento', {
      nome: 'SOS Vida',
      principal: true,
      usuario: this.get('usuario').usuario
    });

    grupo.get('listaUsuarios').pushObject(this.get('analu'));

    let self = this;
    grupo.save().then(function() {
      self.get('alerta').sucesso('Grupo SOS Vida Criado com sucesso!');
    }).catch(function() {
      self.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
    })
  },

  criarGrupoSOSVidaFisio() {
    let grupoSOS = this.get('gruposCompartilhamento').filter(grupo => {
      return grupo.get('nome') == 'SOS Vida';
    });
    if (grupoSOS.length > 0) {
      this.get('alerta').erro('Este grupo já existe');
      return;
    }

    let grupo = this.get('store').createRecord('grupo-compartilhamento', {
      nome: 'SOS Vida',
      principal: true,
      usuario: this.get('usuario').usuario
    });

    grupo.get('listaUsuarios').pushObject(this.get('carol'));

    let self = this;
    grupo.save().then(function() {
      self.get('alerta').sucesso('Grupo SOS Vida Criado com sucesso!');
    }).catch(function() {
      self.get('alerta').erro('Ocorreu um erro ao criar o grupo!');
    })
  },

});
