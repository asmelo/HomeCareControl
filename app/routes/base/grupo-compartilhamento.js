import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.query('usuario', {
            orderBy: 'email',
            equalTo: 'analusiqueira@hotmail.com'
          })
  },

  setupController(controller, model) {
    controller.set('analu', model.objectAt(0));
  },

});
