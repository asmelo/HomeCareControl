import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  atendimentosFiltrados: computed('atendimentos.[]', 'mes', 'ano', function() {
    if (this.get('atendimentos')) {
      var this2 = this;
      return this.get('atendimentos').filter(function(value) {
        //Compara com o mês selecionado
        let mesPorExtenso = this2.get('dicionarioMeses')[value.get('dtAtendimento').getMonth()]
        if (mesPorExtenso == this2.get('mes')) {
          return true;
        }else{
          return false;
        }
      })
    }

    return [];

  }),

  sentidoOrdenacao: 'asc',

  ordenacao: 'dtAtendimento',

  ordenacaoESentido: computed('ordenacao', 'sentidoOrdenacao', function() {
    return this.get('ordenacao') + ':' + this.get('sentidoOrdenacao');
  }),

  funcaoOrdenacao: computed('ordenacaoESentido', function() {
    let ordenacao = Object.freeze([this.get('ordenacaoESentido')])
    return ordenacao;
  }),

  atendimentosOrdenados: sort('atendimentosFiltrados', 'funcaoOrdenacao'),

  actions: {

    editarAtendimento(atendimento) {
      this.transitionToRoute('base.atendimento.edicao', atendimento.get('id'));
      window.scrollTo(0,0);
    },

    scrollUp() {
      window.scrollTo(0,0);
    },

    ordenar(campo) {
      if (this.get('ordenacao') == campo) {
        if (this.get('sentidoOrdenacao') == 'asc') {
          this.set('sentidoOrdenacao', 'desc');
        }else{
          this.set('sentidoOrdenacao', 'asc');
        }
      } else {
        this.set('ordenacao', campo);
      }
    }

  }
});
