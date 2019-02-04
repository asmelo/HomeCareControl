import DS from 'ember-data';

export default DS.Model.extend({

  nome:     DS.attr('string'),
  registro: DS.attr('string'),
  email:    DS.attr('string'),
  uid:      DS.attr('string'),

  userFirebase: null,

});
