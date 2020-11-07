import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { isPresent, isEmpty } from '@ember/utils';
import { later } from '@ember/runloop';
import config from 'homecarecontrol/config/environment';
import $ from 'jquery';

export default Controller.extend({

  usuario: service(),
  alerta: service(),
  util: service(),
  
  steps: computed('assistenciasFiltradas', 'ordenaListaAssist', 'funcaoOrdenacaoAssistencias', function() {    
    let steps = [];

    let pagina = 1;
    steps.push({setFontSize: 25});
    steps.push({text: [105, 25, 'Relatório de Assistências', {align: 'center'}]});

    steps.push({setFontSize: 10});
    
    let periodo = 'Período: ' +  this.get('mes') + ' de ' +  this.get('ano');
    steps.push({text: [10, 40, periodo]});    

    steps.push({setFontSize: 15});
    steps.push({text: [10, 55, 'Assistências']});

    let largura = 190;
    let x1 = 10;
    let y2 = 61;
    let y1 = y2 + 12;
    let x2 = x1 + largura;    

    steps.push({setFontSize: 8});
    steps.push({setFontStyle: 'bold'});
    steps.push({text: [3 + x1, y2 + 5, 'Fisioterapeuta']});
    steps.push({text: [3 + x1 + 75, y2 + 5, 'Total']});

    var y = y2 + 12;
    steps.push({setFontStyle: 'normal'});    

    let usuarioSelecionado = this.get('usuarioFiltro');
    let nmGrupoCompartilhamento = this.get('nmGrupoCompartilhamento');

    var houveQuebraPagina = false;
    let totalGeral = 0;
    for(let i = 0; i < this.get('listaUsuarios').length; i++) {
        this.send('selecionaUsuario', this.get('listaUsuarios').objectAt(i));

        let total = 0;
        for(let i = 0; i < this.get('assistenciasOrdenadas').length; i++) {
            total += this.get('assistenciasOrdenadas').objectAt(i).valorNumber;            
        }
        totalGeral += total;

        let totalFormatado = this.get('util').tratarValor(total);

        steps.push({text: [3 + x1, y, this.get('usuarioFiltro').get('nome')]});        
        steps.push({text: [3 + x1 + 75, y, totalFormatado]});   
        y += 5;
        y1 += 5;
        if (y1 > 284) {
            houveQuebraPagina = true;
            y1 = 285;
            steps.push({line: [x1, y1, x1, y2]});
            steps.push({line: [x1, y2, x2, y2]});
            steps.push({line: [x2, y2, x2, y1]});
            steps.push({addPage: []});
            pagina += 1;
            steps.push({setFontSize: 6});        
            steps.push({text: [200, 5, 'Página: ' + pagina, { align: 'right' }]});
            steps.push({setFontSize: 8});
            y2 = 10;
            y1 = 15;
        }     
    }

    steps.push({line: [x1, y1, x1, y2]});
    if (!houveQuebraPagina) {
      steps.push({line: [x1, y2, x2, y2]});
    }
    steps.push({line: [x2, y2, x2, y1]});
    steps.push({line: [x2, y1, x1, y1]});
        
    let totalGeralFormatado = 'Total Geral: ' + this.get('util').tratarValor(totalGeral);    
    steps.splice(4, 0, {text: [200, 40, totalGeralFormatado, {align: 'right'}]});    

    this.send('selecionaUsuario', usuarioSelecionado);
    this.send('selecionaCompartilhamento', nmGrupoCompartilhamento);

    return steps;
  }),  

  //ASSISTENCIAS

  assistenciasDoMes: computed('listaAssistencias.[]', 'mes', 'ano', function() {
    //Aplica os filtros obrigatórios Ano e Mês
    if (isPresent(this.get('listaAssistencias'))) {
      return this.get('listaAssistencias').filter(function(assistencia) {
        let mesPorExtenso = this.get('dicionarioMeses')[assistencia.get('dtAssistencia').getMonth()]
        let ano = assistencia.get('dtAssistencia').getFullYear();
        if (mesPorExtenso == this.get('mes') && ano == this.get('ano')) {
          return true;
        } else {
          return false;
        }
      }, this);
    }

    return [];

  }),

  assistenciasFiltradas: computed('assistenciasDoMes', 'usuarioFiltro', 'nmGrupoCompartilhamento', function() {
    //Aplica o filtro do Grupo de Compartilhamento caso o valor seja diferente de 'Todos'
    if (isPresent(this.get('assistenciasDoMes'))) {
      return this.get('assistenciasDoMes').filter(function(assistencia) {
        let idUsuario = assistencia.get('usuario.id');
        if (idUsuario == this.get('usuarioFiltro.id')) {
          if (this.get('nmGrupoCompartilhamento') != 'Todos') {
            let nmGrupoCompartilhamento = assistencia.get('nmGrupoCompartilhamento');
            if (nmGrupoCompartilhamento == this.get('nmGrupoCompartilhamento')) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      }, this);
    } else {
      return [];
    }
  }),

  totalAssistenciasFiltradas: computed('assistenciasFiltradas', function() {
    let total = 0;
    this.get('assistenciasFiltradas').forEach(assistencia => {
      total += assistencia.get('valorNumber');
    });
    return this.get('util').tratarValor(total)
  }),

  exibirFiltro: $('body').width() >= 992,

  sentidoOrdenacaoAssistencias: 'asc',

  ordenacaoAssistencias: 'dtAssistencia',

  ordenacaoESentidoAssistencias: computed('ordenacaoAssistencias', 'sentidoOrdenacaoAssistencias', function() {
    return this.get('ordenacaoAssistencias') + ':' + this.get('sentidoOrdenacaoAssistencias');
  }),

  funcaoOrdenacaoAssistencias: computed('ordenacaoESentidoAssistencias', function() {
    let ordenacao = Object.freeze([this.get('ordenacaoESentidoAssistencias')])
    return ordenacao;
  }),

  assistenciasOrdenadas: sort('assistenciasFiltradas', 'funcaoOrdenacaoAssistencias'),  

  isAssistenciaDoUsuario: computed('usuarioFiltro', function() {
    if (this.get('usuarioFiltro.id') == this.get('usuario').usuario.get('id')) {
        return true;
    } else {
      return false;
    }
  }),

  listaResumo: computed('assistenciasFiltradas', function() {    
    let listaResumo = [];
    let turnos = config.APP.turnos;

    turnos.forEach(turno => {
        let assistencias = this.get('assistenciasFiltradas').filter( function( assistencia ) {
            return assistencia.get('turno') == turno;
        } );
    
        let qtdAssistencias = assistencias.length;
        let totalAssistencias = 0;
        assistencias.forEach(assistencia => {
            totalAssistencias += assistencia.get('valorNumber');
        })
        let assistencia = {}
        assistencia.descricao = turno;
        assistencia.quantidade = qtdAssistencias;
        assistencia.total = totalAssistencias;
        assistencia.totalFormatado = this.get('util').tratarValor(totalAssistencias);
        listaResumo.push(assistencia);
    });    

    return listaResumo;
  }),  

  ordenaListaAssist: false,

  listaAssistenciasPorSetor: computed('assistenciasFiltradas', 'ordenaListaAssist', function() {
    let listaObjSetores = [];
    let setoresAssist = {};

    this.get('assistenciasFiltradas').forEach(assistencia => {
      if (isEmpty(setoresAssist[assistencia.get('setor.id')])) {    
        setoresAssist.id = assistencia.get('setor.id');    
        setoresAssist[assistencia.get('setor.id')] = 0;
        listaObjSetores.push(assistencia.get('setor'));
      }
      let novoTotal = setoresAssist[assistencia.get('setor.id')] + 1;
      setoresAssist[assistencia.get('setor.id')] = novoTotal;
    });

    let listaSetores = [];    
    this.get('setores').forEach(setor => {
      if (!setor.get('inativo')) {
        let setorObj = {}
        setorObj.setor = setor;
        setorObj.total = 0;
        if (setoresAssist[setor.id]) {                
          setorObj.total = setoresAssist[setor.id];
        }           
        listaSetores.push(setorObj);
      }
    })

    return listaSetores;

  }),

  listaAssistenciasPorSetorOrdenada: sort('listaAssistenciasPorSetor', function(a, b){
      if (a.setor.get('nome') > b.setor.get('nome')) {
        return 1;
      } else if (a.setor.get('nome') < b.setor.get('nome')) {
        return -1;
      }

      return 0;
  }),

  actions: {

    scrollUp() {
      window.scrollTo(0,0);
    },

    selecionaUsuario(usuarioFiltro) {
      this.set('usuarioFiltro', usuarioFiltro);
      if (!this.get('isAssistenciaDoUsuario')) {
        this.set('nmGrupoCompartilhamento', 'Todos');
      } else {
        this.set('nmGrupoCompartilhamento', this.get('nmGrupoCompartilhamentoUsuario'));
      }

      let listaSetor = this.get('listaAssistenciasPorSetor');
      if (listaSetor.length > 0 && isEmpty(listaSetor[0].setor.get('nome'))) {
        later(this, function() {
          this.send('ordernarAssistenciaPorSetor');
        }, 2000);
      }
    },

    ordernarAssistenciaPorSetor() {
      this.set('ordenaListaAssist', !this.get('ordenaListaAssist'));
    },

    selecionaMes(mes) {
      this.set('mes', mes)
    },

    selecionaAno(ano) {
      this.set('ano', ano)
    },

    selecionaCompartilhamento(nmGrupoCompartilhamento) {
      this.set('nmGrupoCompartilhamento', nmGrupoCompartilhamento);
      if (this.get('usuarioFiltro.id') == this.get('usuario').usuario.get('id')) {
        this.set('nmGrupoCompartilhamentoUsuario', nmGrupoCompartilhamento);
      }
    },

    ordenarAssistencias(campo) {
      if (this.get('ordenacaoAssistencias') == campo) {
        if (this.get('sentidoOrdenacaoAssistencias') == 'asc') {
          this.set('sentidoOrdenacaoAssistencias', 'desc');
        }else{
          this.set('sentidoOrdenacaoAssistencias', 'asc');
        }
      } else {
        this.set('ordenacaoAssistencias', campo);
      }
    }

  }

});
