import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  usuario: service(),

  model() {
    return RSVP.hash({
      atendimentos: this.store.query('atendimento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      })
    });
  },

  setupController(controller, model) {

    controller.set('atendimentos', model.atendimentos);

    let dicionarioMeses = {
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
    };

    var hoje = new Date;

    //Preenche filtro de Anos
    let listaAnos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1];
    controller.set('listaAnos', listaAnos);
    controller.set('ano', hoje.getFullYear());

    //Preenche filtro de Meses
    let listaMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    controller.set('listaMeses', listaMeses);
    controller.set('mes', dicionarioMeses[hoje.getMonth()]);
    controller.set('dicionarioMeses', dicionarioMeses);    

    //Preeche filtro de Tipo de Atendimento (Para Fisio)
    controller.set('tiposAtendimento', ['Todos', 'Atendimento', 'Intercorrência', 'Remoção']);
    controller.set('tipoAtendimento', 'Todos');    
  },



});
