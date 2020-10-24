import DS from 'ember-data';
import { computed } from '@ember/object';
import config from 'homecarecontrol/config/environment';

export default DS.Model.extend({

  nome:       DS.attr('string'),
  registro:   DS.attr('string'),
  email:      DS.attr('string'),
  foto:       DS.attr('string'),
  profissao:  DS.attr('string'),

  userFirebase: null,

  isFisioHealth: computed('profissao', function() {
    return this.get('profissao') == config.APP.fisiohealth;
  }),

});
