import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  usuario: service(),

  model() {
    return RSVP.hash({
      atendimentos: this.store.query('atendimento', {
        orderBy: 'dtAtendimento',
        startAt: '2020'
      })
    });
  },

  setupController(controller, model) {

    let ultimosAtendimentos = model.atendimentos.filter(function(atendimento) {
      let mes = atendimento.get('dtAtendimento').getMonth();
      let ano = atendimento.get('dtAtendimento').getFullYear();
      if (ano == 2020 && (mes == 6 || mes == 7 || mes == 8)) {
        return true;
      } else {
        return false;
      }
    }, this);

    controller.set('atendimentos', ultimosAtendimentos);    

    let totalAtendimentos = ultimosAtendimentos.length;

    controller.set('totalAtendimentos', totalAtendimentos);
  
    let totalAtendimentos38 = ultimosAtendimentos.filter(function(atendimento) {
        return atendimento.get('valor') == "R$ 38,00"
      }, this).length;

    controller.set('totalAtendimentos38', totalAtendimentos38);
  
    let totalAtendimentos40 = ultimosAtendimentos.filter(function(atendimento) {
        return atendimento.get('valor') == "R$ 40,00"
      }, this).length;

    controller.set('totalAtendimentos40', totalAtendimentos40);  
  
    let totalAtendimentosOutros = ultimosAtendimentos.filter(function(atendimento) {
        return (atendimento.get('valor') != "R$ 38,00" && atendimento.get('valor') != "R$ 40,00") 
      }, this).length;

    controller.set('totalAtendimentosOutros', totalAtendimentosOutros);  
  }

});
