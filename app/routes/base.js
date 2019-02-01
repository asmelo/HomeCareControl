import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  beforeModel() {
    return this.get('usuario').verificaUsuarioLogado();
  },

  afterModel(model, transition) {
    this.get('usuario').carregaUsuario();
  },


});
