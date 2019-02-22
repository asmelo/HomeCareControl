import DS from 'ember-data';

export default DS.Model.extend({

  nome:           DS.attr('string'),
  principal:      DS.attr('boolean'),
  usuario:        DS.belongsTo('usuario'),
  listaUsuarios:  DS.hasMany('usuario')

});
