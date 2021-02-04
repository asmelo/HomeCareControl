import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import $ from 'jquery';

export default Controller.extend({

  usuario: service(),
  alerta: service(),
  util: service(),

  atendimentosFiltrados: computed('atendimentosDoMes.[]', 'nmPaciente', 'tipoAtendimento', function() {    
    if (this.get('atendimentosDoMes')) {
      return this.get('atendimentosDoMes').filter(this.filtrarPacienteETipo, this);
    } else {
      return [];
    }
  }),

  consultarAtendimentosDoMes: function() {  
    $('loading').css('display', '');  
    let usuarioAnoMes = this.get('util').formataUsuarioAnoEmesPorExtenso(this.get('usuario').usuario.id, this.get('ano'), this.get('mes'));
    this.store.query('atendimento', {
      orderBy: 'usuarioAnoMes',
      equalTo: usuarioAnoMes
    }).then(atendimentos => {
      this.set('atendimentosDoMes', atendimentos);
      $('loading').css('display', 'none');
    });
  },

  filtrarPacienteETipo: function(atendimento) {
    return this.filtrarPaciente(atendimento) && this.filtrarTipoAtendimento(atendimento);
  },

  filtrarPaciente: function(atendimento) {
    if (this.get('nmPaciente') != 'Todos') {
      let nmPaciente = atendimento.get('paciente.nome');
      if (nmPaciente == this.get('nmPaciente')) {                
        return true;        
      }
      return false;      
    }
    return true;          
  },

  filtrarTipoAtendimento: function(atendimento) {
    if (this.get('tipoAtendimento') != 'Todos') {
      let tipoAtendimento = atendimento.get('tipo');
      if (tipoAtendimento == this.get('tipoAtendimento')) {
        return true;
      }
      return false;      
    }
    return true;    
  },

  exibirFiltro: $('body').width() >= 992,

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

  listaPacientes: computed('atendimentosDoMes', function() {
    let listaPacientes = [];
    for (let i = 0; i < this.get('atendimentosDoMes').length; i++) {
      if (this.get('atendimentosDoMes').objectAt(i).get('paciente.nome')) {
        if (!listaPacientes.includes(this.get('atendimentosDoMes').objectAt(i).get('paciente.nome'))) {
          listaPacientes.pushObject(this.get('atendimentosDoMes').objectAt(i).get('paciente.nome'));
        }
      }
    }

    listaPacientes.sort();
    listaPacientes.insertAt(0, 'Todos');

    return listaPacientes;
  }),

  nmPaciente: 'Todos',

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
    },

    selecionaMes(mes) {
      this.set('mes', mes);   
      this.consultarAtendimentosDoMes();   
    },

    selecionaAno(ano) {
      this.set('ano', ano);
      this.consultarAtendimentosDoMes();
    },

    selecionaPaciente(nmPaciente) {
      this.set('nmPaciente', nmPaciente);
    },

    selecionaTipoAntedimento(tipoAtendimento) {
      this.set('tipoAtendimento', tipoAtendimento)
    },

    exibirFiltroAction() {
      this.set('exibirFiltro', !this.get('exibirFiltro'));
    }

  }
});
