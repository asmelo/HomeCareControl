import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({

  dtAtendimento:      DS.attr('date'),
  paciente:           DS.belongsTo('paciente', { inverse: false }),
  valor:              DS.attr('moeda'),
  usuario:            DS.belongsTo('usuario', { inverse: false })

});
