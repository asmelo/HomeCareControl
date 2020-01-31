import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  actions: {

    criarConta() {
      let nome = this.get('nome').trim();
      let profissao = this.get('profissao');
      let registro = this.get('registro').trim();
      let email = this.get('email').trim();
      let senha = this.get('senha');
      let senhaConfirm = this.get('senhaConfirm');

      if (profissao == undefined) {
        this.get('alerta').erro('Selecione a profissão');
        return;
      }

      if (senha != senhaConfirm) {
        this.set('senhaConfirm', null);
        this.get('alerta').erro('As senhas não são iguais');
        return;
      }

      this.get('usuario').criarConta(nome, profissao, registro, email, senha)
    },

    selecionaProfissao(profissao) {
      this.set('profissao', profissao);
    }

  }

});
