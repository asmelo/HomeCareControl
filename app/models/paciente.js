import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  nome:                DS.attr('string'),
  nomeLowerCase:       DS.attr('string'),
  usuario:             DS.belongsTo('usuario', { inverse: false }),
  inativo:             DS.attr('boolean'),

  situacao: computed('inativo', function() {
    if (this.get('inativo')) {
      return 'Inativo';
    } else {
      return 'Ativo';
    }
  })

});
