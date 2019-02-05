import DS from 'ember-data';

export default DS.Model.extend({

  nome:       DS.attr('string'),
  usuario:    DS.belongsTo('usuario', { inverse: false })

});
