import Route from '@ember/routing/route';
import $ from 'jquery';

export default Route.extend({

  actions: {
    didTransition() {
      $('loading').css('display', 'none');
    }
  }

});
