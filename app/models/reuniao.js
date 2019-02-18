import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  dtReuniao:                DS.attr('date'),
  descricao:                DS.attr('string'),
  duracao:                  DS.attr('string'),
  valor:                    DS.attr('moeda'),
  usuario:                  DS.belongsTo('usuario', { inverse: false }),
  grupoCompartilhamento:    DS.belongsTo('grupo-compartilhamento', { inverse: false }),

  valorNumber: computed('valor', function() {
    return Number(this.get('valor').replace('R$', '').replace('.', '').replace(',', '.').trim());
  }),

  nmGrupoCompartilhamento: computed('grupoCompartilhamento.nome', function() {
    if (this.get('grupoCompartilhamento.nome')) {
      return this.get('grupoCompartilhamento.nome');
    } else {
      return 'Nenhum';
    }
  }),

});
