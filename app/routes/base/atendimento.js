import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  usuario: service(),

  dicionarioMeses: {
    0: "Janeiro",
    1: "Fevereiro",
    2: "Março",
    3: "Abril",
    4: "Maio",
    5: "Junho",
    6: "Julho",
    7: "Agosto",
    8: "Setembro",
    9: "Outubro",
    10: "Novembro",
    11: "Dezembro"
  },

  model() {
    return this.store.query('atendimento', {
      orderBy: 'usuario',
      equalTo: this.get('usuario').usuario.get('id')
    })
    //return this.store.findAll('atendimento');
  },

  setupController(controller, model) {
    var hoje = new Date;
    controller.set('mes', this.get('dicionarioMeses')[hoje.getMonth()]);
    controller.set('ano', hoje.getYear());
    controller.set('atendimentos', model);
  },

});
