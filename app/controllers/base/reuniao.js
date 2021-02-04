import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import $ from 'jquery';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  reunioesFiltradas: computed('reunioes.[]', 'mes', 'ano', function() {
    //Aplica os filtros obrigatórios Ano e Mês
    if (this.get('reunioes')) {
      return this.get('reunioes').filter(function(reuniao) {
        let mesPorExtenso = this.get('dicionarioMeses')[reuniao.get('dtReuniao').getMonth()]
        let ano = reuniao.get('dtReuniao').getFullYear();
        if (mesPorExtenso == this.get('mes') && ano == this.get('ano')) {
          return true;
        } else {
          return false;
        }
      }, this);
    }

    return [];

  }),  

  exibirFiltro: $('body').width() >= 992,

  sentidoOrdenacao: 'asc',

  ordenacao: 'dtReuniao',

  ordenacaoESentido: computed('ordenacao', 'sentidoOrdenacao', function() {
    return this.get('ordenacao') + ':' + this.get('sentidoOrdenacao');
  }),

  funcaoOrdenacao: computed('ordenacaoESentido', function() {
    let ordenacao = Object.freeze([this.get('ordenacaoESentido')])
    return ordenacao;
  }),

  reunioesOrdenadas: sort('reunioesFiltradas', 'funcaoOrdenacao'),


  actions: {

    editarReuniao(reuniao) {
      this.transitionToRoute('base.reuniao.edicao', reuniao.get('id'));
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
    },

    selecionaMes(mes) {
      this.set('mes', mes)
    },

    selecionaAno(ano) {
      this.set('ano', ano)
    },

    exibirFiltroAction() {
      this.set('exibirFiltro', !this.get('exibirFiltro'));
    }

  }
});
