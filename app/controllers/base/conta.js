import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),

  actions: {

    criarConta() {
      let nome = this.get('nome')
      let registro = this.get('registro')
      let email = this.get('email')
      let senha = this.get('senha')

      this.get('usuario').criarConta(nome, registro, email, senha)
    }

  }

});
