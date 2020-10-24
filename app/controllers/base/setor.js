import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default Controller.extend({

  usuario: service(),
  alerta: service(),

  exibirFiltro: $('body').width() >= 992,

  situacao: 'Ativo',

  setoresFiltrados: computed('setores.@each.inativo', 'nome', 'situacao', function() {
    if(this.get('setores')) {
      let setores = this.get('setores').filter(setor => {
        if (isEmpty(this.get('nome')) || setor.get('nome').toLowerCase().includes(this.get('nome').toLowerCase())) {
          if ((this.get('situacao') == 'Todos') || (setor.situacao == this.get('situacao'))) {
            return true;
          }
        }
        return false;
      });

      return setores;
    }else{
      return null;
    }

  }),

  setoresOrdenados: computed('setoresFiltrados', function() {
    if (this.get('setoresFiltrados')) {
        return this.get('setoresFiltrados').sortBy('nome');
    } else {
      return null;
    }
  }),

  actions: {

    editarSetor(setor) {
      this.transitionToRoute('base.setor.edicao', setor.get('id'));
      window.scrollTo(0,0);
    },

    selecionaSituacao(situacao) {
      this.set('situacao', situacao);
    },

    scrollUp() {
      window.scrollTo(0,0);
    },

    exibirFiltroAction() {
      this.set('exibirFiltro', !this.get('exibirFiltro'));
    }

  }
});

