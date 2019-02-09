import EmberObject from '@ember/object';
import moment from 'moment';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  initialize,

  name: 'setup-pikaday-i18n',
  initialize: function(application) {
    var i18n = EmberObject.extend({
      previousMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      months: moment.localeData()._months,
      weekdays: moment.localeData()._weekdays,
      weekdaysShort: moment.localeData()._weekdaysShort
    });

    application.register('pikaday-i18n:main', i18n, { singleton: true });
    application.inject('component:pikaday-input', 'i18n', 'pikaday-i18n:main');
  }
};
