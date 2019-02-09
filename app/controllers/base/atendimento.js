import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({

  usuario: service(),
  alerta: service(),


  atendimentosFiltrados: computed('atendimentos.[]', 'mes', 'ano', function() {
    if (this.get('atendimentos')) {
      var this2 = this;
      return this.get('atendimentos').filter(function(value) {
        //Compara com o mês selecionado
        if (value.get('dtAtendimento').getMonth() == this2.get('mes')) {
          return true;
        }else{
          return false;
        }
      })
    }

    return [];

  }),

  atendimentosOrdenados: computed('atendimentosFiltrados.[]', function() {
    if(this.get('atendimentosFiltrados')) {
      if (this.get('atendimentos')) {
        return this.get('atendimentos').sortBy('data');
      }
    }

    return null;

  }),

  actions: {

    editarAtendimento(atendimento) {
      this.transitionToRoute('base.atendimento.edicao', atendimento.get('id'));
      window.scrollTo(0,0);
    }

  }
});
