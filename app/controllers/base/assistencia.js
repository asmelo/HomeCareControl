import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';
import $ from 'jquery';

export default Controller.extend({

    usuario: service(),
    alerta: service(),

    assistenciasDoMes: computed('assistencias.[]', 'mes', 'ano', function() {
        //Aplica os filtros obrigatórios Ano e Mês
        if (this.get('assistencias')) {
        return this.get('assistencias').filter(function(assistencia) {
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

    assistenciasFiltradas: computed('assistenciasDoMes', 'nmSetor', 'nmGrupoCompartilhamento', 'turno', function() {
        //Aplica o filtro do Setor e do Grupo de Compartilhamento caso o valor seja diferente de 'Todos'
        if (this.get('assistenciasDoMes')) {
        return this.get('assistenciasDoMes').filter(function(assistencia) {
            if (this.get('nmSetor') != 'Todos') {
            let nmSetor = assistencia.get('setor.nome');
            if (nmSetor == this.get('nmSetor')) {
                if (this.get('nmGrupoCompartilhamento') != 'Todos') {
                let nmGrupoCompartilhamento = assistencia.get('nmGrupoCompartilhamento');
                if (nmGrupoCompartilhamento == this.get('nmGrupoCompartilhamento')) {
                    if (this.get('turno') != 'Todos') {
                        let turno = assistencia.get('turno');
                    if (turno == this.get('turno')) {
                        return true;
                    }else{
                        return false;
                    }
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
                } else {
                if (this.get('turno') != 'Todos') {
                    let turno = assistencia.get('turno');
                    if (turno == this.get('turno')) {
                        return true;
                    }else{
                        return false;
                    }
                } else {
                    return true;
                }
                }
            } else {
                return false;
            }
            } else {
            if (this.get('nmGrupoCompartilhamento') != 'Todos') {
                let nmGrupoCompartilhamento = assistencia.get('nmGrupoCompartilhamento');
                if (nmGrupoCompartilhamento == this.get('nmGrupoCompartilhamento')) {
                if (this.get('turno') != 'Todos') {
                    let turno = assistencia.get('turno');
                    if (turno == this.get('turno')) {
                        return true;
                    }else{
                        return false;
                    }
                } else {
                    return true;
                }
                }else{
                    return false;
                }
            } else {
                if (this.get('turno') != 'Todos') {
                let turno = assistencia.get('turno');
                if (turno == this.get('turno')) {
                    return true;
                }else{
                    return false;
                }
                } else {
                return true;
                }
            }
            }
        }, this);
        } else {
        return [];
        }
    }),

    exibirFiltro: $('body').width() >= 992,

    sentidoOrdenacao: 'asc',

    ordenacao: 'dtAssistencia',

    ordenacaoESentido: computed('ordenacao', 'sentidoOrdenacao', function() {
        return this.get('ordenacao') + ':' + this.get('sentidoOrdenacao');
    }),

    funcaoOrdenacao: computed('ordenacaoESentido', function() {
        let ordenacao = Object.freeze([this.get('ordenacaoESentido')])
        return ordenacao;
    }),

    assistenciasOrdenadas: sort('assistenciasFiltradas', 'funcaoOrdenacao'),

    listaSetores: computed('assistenciasDoMes', function() {
        let listaSetores = [];
        for (let i = 0; i < this.get('assistenciasDoMes').length; i++) {
        if (this.get('assistenciasDoMes').objectAt(i).get('setor.nome')) {
            if (!listaSetores.includes(this.get('assistenciasDoMes').objectAt(i).get('setor.nome'))) {
                listaSetores.pushObject(this.get('assistenciasDoMes').objectAt(i).get('setor.nome'));
            }
        }
        }

        listaSetores.sort();
        listaSetores.insertAt(0, 'Todos');

        return listaSetores;
    }),

    nmSetor: 'Todos',

    actions: {

        editarAssistencia(assistencia) {
            this.transitionToRoute('base.assistencia.edicao', assistencia.get('id'));
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

        selecionaSetor(nmSetor) {
            this.set('nmSetor', nmSetor);
        },

        selecionaCompartilhamento(nmGrupoCompartilhamento) {
            this.set('nmGrupoCompartilhamento', nmGrupoCompartilhamento)
        },

        selecionaTurno(turno) {
            this.set('turno', turno)
        },

        exibirFiltroAction() {
            this.set('exibirFiltro', !this.get('exibirFiltro'));
        }
    }

});
