import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { isPresent, isEmpty } from '@ember/utils';
import { later } from '@ember/runloop';

export default Controller.extend({

  usuario: service(),
  alerta: service(),
  util: service(),

  constroiPDF: function(usuarioFiltro, mes, ano, listaResumo, reunioesOrdenadas, listaAtendimentosPorPacienteOrdenada, atendimentosOrdenados) {
    let steps = [];

    let pagina = 1;
    steps.push({setFontSize: 25});
    steps.push({text: [105, 25, 'Relatório de Atendimentos e Reuniões', {align: 'center'}]})

    steps.push({setFontSize: 10});
    let profissional = 'Profissional: ' + usuarioFiltro.get('nome');
    steps.push({text: [10, 40, profissional]})

    let periodo = 'Período: ' + mes + ' de ' + ano;
    steps.push({text: [200, 40, periodo, {align: 'right'}]})


    //===============RESUMO=====================//

    steps.push({setFontSize: 15});
    steps.push({text: [10, 55, 'Resumo']});

    let largura = 64;
    let x1 = 10;
    let y2 = 61;
    let y1 = y2 + 9 + (listaResumo.length * 5);
    let x2 = x1 + largura;
    steps.push({line: [x1, y2, x2, y2]});
    steps.push({line: [x1, y2, x1, y1]});
    steps.push({line: [x1, y1, x2, y1]});
    steps.push({line: [x2, y1, x2, y2]});

    steps.push({setFontSize: 8});
    steps.push({setFontStyle: 'bold'});
    steps.push({text: [3 + x1, y2 + 5, 'Descrição']});
    steps.push({text: [3 + x1 + 22, y2 + 5, 'Quantidade']});
    steps.push({text: [3 + x1 + 42, y2 + 5, 'Total']});

    var y = y2 + 12;
    steps.push({setFontStyle: 'normal'});
    listaResumo.forEach(resumo => {
      steps.push({text: [3 + x1, y, resumo.descricao]});
      steps.push({text: [3 + x1 + 30, y, String(resumo.quantidade), {align: 'center'}]});
      steps.push({text: [3 + x1 + 42, y, resumo.totalFormatado]});
      y += 5;
    })

    let rodapeResumo = y;


    //===============REUNIÕES=====================//

    steps.push({setFontSize: 15});
    steps.push({text: [81, 55, 'Reuniões']});

    largura = 119;
    x1 = 81;
    y2 = 61;
    y1 = y2 + 12;
    x2 = x1 + largura;

    steps.push({setFontSize: 8});
    steps.push({setFontStyle: 'bold'});
    steps.push({text: [3 + x1, y2 + 5, 'Descrição']});
    steps.push({text: [3 + x1 + 60, y2 + 5, 'Duração']});
    steps.push({text: [3 + x1 + 78, y2 + 5, 'Valor']});
    steps.push({text: [3 + x1 + 98, y2 + 5, 'Grupo']});

    var houveQuebraPagina = false;

    steps.push({setFontStyle: 'normal'});

    reunioesOrdenadas.forEach(function(reuniao, index) {
      steps.push({text: [3 + x1, y1, reuniao.descricao, { maxWidth: '58'}]});
      steps.push({text: [3 + x1 + 60, y1, reuniao.duracao]});
      steps.push({text: [3 + x1 + 78, y1, reuniao.valor]});
      steps.push({text: [3 + x1 + 98, y1, reuniao.nmGrupoCompartilhamento]});
      y1 += 5;

      if (reuniao.descricao.length > 34) {
          y1 += 6;
      }

      if (y1 > 284 && index != (reunioesOrdenadas.length - 1)) {
        houveQuebraPagina = true;
        y1 = 285;
        steps.push({line: [x1, y1, x1, y2]});
        steps.push({line: [x1, y2, x2, y2]});
        steps.push({line: [x2, y2, x2, y1]});
        steps.push({addPage: []})
        pagina += 1;
        steps.push({setFontSize: 6});
        steps.push({text: [10, 5, 'Profissional: ' + usuarioFiltro.get('nome')]});
        steps.push({text: [200, 5, 'Página: ' + pagina, { align: 'right' }]});
        steps.push({setFontSize: 8});
        y2 = 10;
        y1 = 15;
      }
    })

    steps.push({line: [x1, y1, x1, y2]});
    if (!houveQuebraPagina) {
      steps.push({line: [x1, y2, x2, y2]});
    }
    steps.push({line: [x2, y2, x2, y1]});
    steps.push({line: [x2, y1, x1, y1]});



    //===============ATENDIMENTO POR PACIENTE=====================//

    if (rodapeResumo > y1) {
      y1 = rodapeResumo;
    }
    y1 += 15;

    if (y1 > 235) {
      steps.push({addPage: []});
      pagina += 1;
      steps.push({setFontSize: 6});
      steps.push({text: [10, 5, 'Profissional: ' + usuarioFiltro.get('nome')]});
      steps.push({text: [200, 5, 'Página: ' + pagina, { align: 'right' }]});
      steps.push({setFontSize: 8});
      y2 = 10;
      y1 = 15;
    }

    let topoAtendPorPacientes = y1;
    steps.push({setFontSize: 15});
    steps.push({text: [10, topoAtendPorPacientes, 'Atendimentos por Paciente']});

    largura = 71;
    x1 = 10;
    y2 = y1 + 6;
    y1 = y2 + 12;
    x2 = x1 + largura;

    steps.push({setFontSize: 8});
    steps.push({setFontStyle: 'bold'});
    steps.push({text: [3 + x1, y2 + 5, 'Paciente']});
    steps.push({text: [3 + x1 + 58, y2 + 5, 'Total']});

    houveQuebraPagina = false;

    steps.push({setFontStyle: 'normal'});

    let atendimentosPorPaciente = listaAtendimentosPorPacienteOrdenada;
    atendimentosPorPaciente.forEach(function(paciente, index) {
      steps.push({text: [3 + x1, y1, String(paciente.paciente.get('nome'))]});
      steps.push({text: [3 + x1 + 61, y1, String(paciente.total), { align: 'center' }]});
      y1 += 5;
      if (y1 > 284) {
        houveQuebraPagina = true;
        y1 = 285;
        steps.push({line: [x1, y1, x1, y2]});
        steps.push({line: [x1, y2, x2, y2]});
        steps.push({line: [x2, y2, x2, y1]});
        steps.push({addPage: []})
        pagina += 1;
        steps.push({setFontSize: 6});
        steps.push({text: [10, 5, 'Profissional: ' + usuarioFiltro.get('nome')]});
        steps.push({text: [200, 5, 'Página: ' + pagina, { align: 'right' }]});
        steps.push({setFontSize: 8});
        y2 = 10;
        y1 = 15;
      }
    });

    steps.push({line: [x1, y1, x1, y2]});
    if (!houveQuebraPagina) {
      steps.push({line: [x1, y2, x2, y2]});
    }
    steps.push({line: [x2, y2, x2, y1]});
    steps.push({line: [x2, y1, x1, y1]});


    //===============ATENDIMENTO=====================//

    x1 = 82;
    x2 = x1 + largura;
    y1 = topoAtendPorPacientes

    steps.push({setFontSize: 15});
    steps.push({text: [86, y1, 'Atendimentos']});

    largura = 116;
    x1 = 86;
    y2 = y1 + 6;
    y1 = y2 + 12;
    x2 = x1 + largura;

    steps.push({setFontSize: 8});
    steps.push({setFontStyle: 'bold'});
    steps.push({text: [3 + x1, y2 + 5, 'Data']});
    steps.push({text: [3 + x1 + 19, y2 + 5, 'Paciente']});
    steps.push({text: [3 + x1 + 76, y2 + 5, 'Valor']});
    steps.push({text: [3 + x1 + 94, y2 + 5, 'Grupo']});

    houveQuebraPagina = false;

    steps.push({setFontStyle: 'normal'});

    atendimentosOrdenados.forEach(function(atendimento, index) {
      let dia = atendimento.get('dtAtendimento').getDate();
      if (String(dia).length == 1) {
        dia = '0' + dia;
      }
      let mes = atendimento.get('dtAtendimento').getMonth() + 1;
      if (String(mes).length == 1) {
        mes = '0' + mes;
      }
      let ano = atendimento.get('dtAtendimento').getFullYear();
      let dataFormatada = dia + '/' + mes + '/' + ano;

      steps.push({text: [3 + x1, y1, dataFormatada]});
      steps.push({text: [3 + x1 + 19, y1, String(atendimento.nmPaciente)]});
      steps.push({text: [3 + x1 + 76, y1, atendimento.valor]});
      steps.push({text: [3 + x1 + 94, y1, atendimento.nmGrupoCompartilhamento]});
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
        steps.push({text: [10, 5, 'Profissional: ' + usuarioFiltro.get('nome')]});
        steps.push({text: [200, 5, 'Página: ' + pagina, { align: 'right' }]});
        steps.push({setFontSize: 8});
        y2 = 10;
        y1 = 15;
      }
    }, this);

    steps.push({line: [x1, y1, x1, y2]});
    if (!houveQuebraPagina) {
      steps.push({line: [x1, y2, x2, y2]});
    }
    steps.push({line: [x2, y2, x2, y1]});
    steps.push({line: [x2, y1, x1, y1]});

    return steps;
  },

  steps: computed('atendimentosFiltrados', 'reunioesFiltradas', 'ordenaListaAtd', 'funcaoOrdenacaoAtendimentos', 'funcaoOrdenacaoReunioes', function() {
    let steps = [];
    let stepsTodos = [];
    let stepsUsuario = [];

    let usuarioSelecionado = this.get('usuarioFiltro');
    let nmGrupoCompartilhamento = this.get('nmGrupoCompartilhamento');

    for(let i = 0; i < this.get('listaUsuarios').length; i++) {
        this.send('selecionaUsuario', this.get('listaUsuarios').objectAt(i));
        let internalSteps = this.constroiPDF(this.get('usuarioFiltro'), this.get('mes'),
                                             this.get('ano'), this.get('listaResumo'),
                                             this.get('reunioesOrdenadas'),
                                             this.get('listaAtendimentosPorPacienteOrdenada'),
                                             this.get('atendimentosOrdenados'));
        if ( i == 0 ) {
          stepsUsuario = internalSteps;
        }
        stepsTodos = stepsTodos.concat(internalSteps);
        if (i != (this.get('listaUsuarios').length - 1)) {
          stepsTodos.push({addPage: []});
        }
    }

    steps.push(stepsUsuario);
    steps.push(stepsTodos);

    this.send('selecionaUsuario', usuarioSelecionado);
    this.send('selecionaCompartilhamento', nmGrupoCompartilhamento);

    return steps;
  }),


  //ATENDIMENTOS

  atendimentosDoMes: computed('listaAtendimentos.[]', 'mes', 'ano', function() {
    //Aplica os filtros obrigatórios Ano e Mês
    if (isPresent(this.get('listaAtendimentos'))) {
      return this.get('listaAtendimentos').filter(function(atendimento) {
        let mesPorExtenso = this.get('dicionarioMeses')[atendimento.get('dtAtendimento').getMonth()]
        let ano = atendimento.get('dtAtendimento').getFullYear();
        if (mesPorExtenso == this.get('mes') && ano == this.get('ano')) {
          return true;
        } else {
          return false;
        }
      }, this);
    }

    return [];

  }),

  atendimentosFiltrados: computed('atendimentosDoMes', 'usuarioFiltro', 'nmGrupoCompartilhamento', function() {
    //Aplica o filtro do Paciente e do Grupo de Compartilhamento caso o valor seja diferente de 'Todos'
    if (isPresent(this.get('atendimentosDoMes'))) {
      return this.get('atendimentosDoMes').filter(function(atendimento) {
        let idUsuario = atendimento.get('usuario.id');
        if (idUsuario == this.get('usuarioFiltro.id')) {
          if (this.get('nmGrupoCompartilhamento') != 'Todos') {
            let nmGrupoCompartilhamento = atendimento.get('nmGrupoCompartilhamento');
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

  exibirFiltro: $('body').width() >= 992,

  sentidoOrdenacaoAtendimentos: 'asc',

  ordenacaoAtendimentos: 'dtAtendimento',

  ordenacaoESentidoAtendimentos: computed('ordenacaoAtendimentos', 'sentidoOrdenacaoAtendimentos', function() {
    return this.get('ordenacaoAtendimentos') + ':' + this.get('sentidoOrdenacaoAtendimentos');
  }),

  funcaoOrdenacaoAtendimentos: computed('ordenacaoESentidoAtendimentos', function() {
    let ordenacao = Object.freeze([this.get('ordenacaoESentidoAtendimentos')])
    return ordenacao;
  }),

  atendimentosOrdenados: sort('atendimentosFiltrados', 'funcaoOrdenacaoAtendimentos'),


  //REUNIÕES

  reunioesDoMes: computed('listaReunioes.[]', 'mes', 'ano', function() {
    //Aplica os filtros obrigatórios Ano e Mês
    if (isPresent(this.get('listaReunioes'))) {
      return this.get('listaReunioes').filter(function(reuniao) {
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

  reunioesFiltradas: computed('reunioesDoMes', 'usuarioFiltro', 'nmGrupoCompartilhamento', function() {
    //Aplica o filtro do Grupo de Compartilhamento caso o valor seja diferente de 'Todos'
    if (isPresent(this.get('reunioesDoMes'))) {
      return this.get('reunioesDoMes').filter(function(reuniao) {
        let idUsuario = reuniao.get('usuario.id');
        if (idUsuario == this.get('usuarioFiltro.id')) {
          if (this.get('nmGrupoCompartilhamento') != 'Todos') {
            let nmGrupoCompartilhamento = reuniao.get('nmGrupoCompartilhamento');
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

  sentidoOrdenacaoReunioes: 'asc',

  ordenacaoReunioes: 'dtReuniao',

  ordenacaoESentidoReunioes: computed('ordenacaoReunioes', 'sentidoOrdenacaoReunioes', function() {
    return this.get('ordenacaoReunioes') + ':' + this.get('sentidoOrdenacaoReunioes');
  }),

  funcaoOrdenacaoReunioes: computed('ordenacaoESentidoReunioes', function() {
    let ordenacao = Object.freeze([this.get('ordenacaoESentidoReunioes')])
    return ordenacao;
  }),

  reunioesOrdenadas: sort('reunioesFiltradas', 'funcaoOrdenacaoReunioes'),

  isAtendimentoDoUsuario: computed('usuarioFiltro', function() {
    if (this.get('usuarioFiltro.id') == this.get('usuario').usuario.get('id')) {
        return true;
    } else {
      return false;
    }
  }),

  listaResumo: computed('atendimentosFiltrados', 'reunioesFiltradas', function() {
    let listaResumo = [];

    let qtdAtendimentos = this.get('atendimentosFiltrados').length;
    let totalAtendimentos = 0;
    this.get('atendimentosFiltrados').forEach(atendimento => {
      totalAtendimentos += atendimento.get('valorNumber');
    })
    let atendimento = {}
    atendimento.descricao = 'Atendimentos';
    atendimento.quantidade = qtdAtendimentos;
    atendimento.total = totalAtendimentos;
    atendimento.totalFormatado = this.get('util').tratarValor(totalAtendimentos);
    listaResumo.push(atendimento);

    let qtdReunioes = this.get('reunioesFiltradas').length;
    let totalReunioes = 0;
    this.get('reunioesFiltradas').forEach(reuniao => {
      totalReunioes += reuniao.get('valorNumber');
    })
    let reuniao = {}
    reuniao.descricao = 'Reuniões';
    reuniao.quantidade = qtdReunioes;
    reuniao.total = totalReunioes;
    reuniao.totalFormatado = this.get('util').tratarValor(totalReunioes);
    listaResumo.push(reuniao);

    var totalSupervisao = 0;
    if (this.get('usuarioFiltro').get('email') == 'analusiqueira@hotmail.com') {
      let supervisao = {}
      supervisao.descricao = 'Supervisão';
      supervisao.quantidade = '-';
      supervisao.total = 800;
      supervisao.totalFormatado = 'R$ 800,00'
      listaResumo.push(supervisao);

      totalSupervisao = supervisao.total;
    }

    let total = {}
    let valorTotal = atendimento.total + reuniao.total + totalSupervisao
    total.descricao = 'Total';
    total.quantidade = '-';
    total.total = valorTotal;
    total.totalFormatado = this.get('util').tratarValor(valorTotal);
    total.formatacao = 'total-resumo'
    listaResumo.push(total);

    return listaResumo;

  }),

  ordenaListaAtd: false,

  listaAtendimentosPorPaciente: computed('atendimentosFiltrados', 'ordenaListaAtd', function() {
    let listaObjPacientes = [];
    let pacientesAtend = {};

    this.get('atendimentosFiltrados').forEach(atendimento => {
      if (isEmpty(pacientesAtend[atendimento.get('paciente.id')])) {
        pacientesAtend.id = atendimento.get('paciente.id');
        pacientesAtend[atendimento.get('paciente.id')] = 0;
        listaObjPacientes.push(atendimento.get('paciente'));
      }
      let novoTotal = pacientesAtend[atendimento.get('paciente.id')] + 1;
      pacientesAtend[atendimento.get('paciente.id')] = novoTotal;
    });

    let listaPacientes = [];
    listaObjPacientes.forEach(pacienteObj => {
      let paciente = {}
      paciente.paciente = pacienteObj;
      paciente.total = pacientesAtend[pacienteObj.get('id')];
      listaPacientes.push(paciente);
    })
/*
    if (listaPacientes.length > 0 && isPresent(listaPacientes[0].paciente.get('nome'))) {
      listaPacientes.sort(function(a, b) {
        a.paciente.then(pacienteA => {
          b.paciente.then(pacienteB => {
            if (a.paciente.get('nome') > b.paciente.get('nome')) {
              return 1;
            } else if (a.paciente.get('nome') < b.paciente.get('nome')) {
              return -1;
            }

            return 0;
          })
        })
      });
    }*/

    return listaPacientes;

  }),

  listaAtendimentosPorPacienteOrdenada: sort('listaAtendimentosPorPaciente', function(a, b){
      if (a.paciente.get('nome') > b.paciente.get('nome')) {
        return 1;
      } else if (a.paciente.get('nome') < b.paciente.get('nome')) {
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
      if (!this.get('isAtendimentoDoUsuario')) {
        this.set('nmGrupoCompartilhamento', 'Todos');
      } else {
        this.set('nmGrupoCompartilhamento', this.get('nmGrupoCompartilhamentoUsuario'));
      }

      let listaPaciente = this.get('listaAtendimentosPorPaciente');
      if (listaPaciente.length > 0 && isEmpty(listaPaciente[0].paciente.get('nome'))) {
        later(this, function() {
          this.send('ordernarAtendimentoPorPaciente');
        }, 2000);
      }
    },

    ordernarAtendimentoPorPaciente() {
      this.set('ordenaListaAtd', !this.get('ordenaListaAtd'));
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

    ordenarAtendimentos(campo) {
      if (this.get('ordenacaoAtendimentos') == campo) {
        if (this.get('sentidoOrdenacaoAtendimentos') == 'asc') {
          this.set('sentidoOrdenacaoAtendimentos', 'desc');
        }else{
          this.set('sentidoOrdenacaoAtendimentos', 'asc');
        }
      } else {
        this.set('ordenacaoAtendimentos', campo);
      }
    },

    ordenarReunioes(campo) {
      if (this.get('ordenacaoReunioes') == campo) {
        if (this.get('sentidoOrdenacaoReunioes') == 'asc') {
          this.set('sentidoOrdenacaoReunioes', 'desc');
        }else{
          this.set('sentidoOrdenacaoReunioes', 'asc');
        }
      } else {
        this.set('ordenacaoReunioes', campo);
      }
    }

  }

});
