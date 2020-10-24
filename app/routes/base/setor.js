import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

    usuario: service(),

    model() {
        return this.store.findAll('setor')
    },

    setupController(controller, model) {
        controller.set('setores', model);
        controller.set('listaSituacao', ['Todos', 'Ativo', 'Inativo']);
    },

});
