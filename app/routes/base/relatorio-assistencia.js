import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import config from 'homecarecontrol/config/environment';

export default Route.extend({

  usuario: service(),

  consultaListaUsuarios(this2) {
    return new Promise(function(resolve) {
      var promiseList = [];
      var this3 = this2;
      this2.store.findAll('grupo-compartilhamento', { reload: true }).then(grupos => {
        //Percorre todos os grupos
        for (let i = 0; i < grupos.length; i++) {
          var grupo = grupos.objectAt(i);
          for (let j = 0; j < grupo.listaUsuarios.length; j++) {
            var usuarioCompartilhamento = grupo.listaUsuarios.objectAt(j)

            //Caso o usuário logado esteja no grupo
            if (usuarioCompartilhamento.get('id') == this3.get('usuario').usuario.get('id')) {
              promiseList.push(grupo.get('usuario'));
            }
          }
        }
        Promise.all(promiseList).then(values => {
          var listaUsuarios = [];
          var i = 0;
          while(values[i]) {
            listaUsuarios.push(values[i]);
            i++;
          }
          resolve(listaUsuarios);
        })
      });

    });
  },

  consultaListaAssistencias(this2) {
    return new Promise(function(resolve) {
      var promiseListUsuario = [];
      var listaGrupos = [];
      var this3 = this2;
      this2.store.findAll('grupo-compartilhamento', { reload: true }).then(grupos => {
        //Percorre todos os grupos
        for (let i = 0; i < grupos.length; i++) {
          var grupo = grupos.objectAt(i);
          for (let j = 0; j < grupo.listaUsuarios.length; j++) {
            var usuarioCompartilhamento = grupo.listaUsuarios.objectAt(j);

            //Caso o usuário logado esteja no grupo
            if (usuarioCompartilhamento.get('id') == this3.get('usuario').usuario.get('id')) {
              listaGrupos.push(grupo.get('id'));
              promiseListUsuario.push(grupo.get('usuario'));
            }

          }
        }
        Promise.all(promiseListUsuario).then(values => {
          var promiseListAssist = [];
          var i = 0;

          promiseListAssist.push(this3.store.query('assistencia', {
            orderBy: 'usuario',
            equalTo: this3.get('usuario').usuario.get('id')
          }));

          while(values[i]) {
            //Caso o usuário logado esteja no grupo
            promiseListAssist.push(this3.store.query('assistencia', {
              orderBy: 'usuario',
              equalTo: values[i].get('id')
            }));
            i++;
          }

          Promise.all(promiseListAssist).then(assistencias => {
            var listaAssistencias = [];
            var i = 0;
            while(assistencias[i]) {
              for (let k = 0; k < assistencias[i].length; k++) {
                let grupoCompartilhamento = assistencias[i].objectAt(k).get('grupoCompartilhamento');
                if (assistencias[i].objectAt(k).get('usuario.id') == this3.get('usuario').usuario.get('id') ||
                    listaGrupos.includes(grupoCompartilhamento.get('id'))) {
                        listaAssistencias.push(assistencias[i].objectAt(k));
                }
              }
              i++;
            }
            resolve(listaAssistencias);
          })

        })
      });

    });
  },

  model() {
    return RSVP.hash({
      gruposUsuario: this.store.query('grupo-compartilhamento', {
        orderBy: 'usuario',
        equalTo: this.get('usuario').userId
      }),
      listaUsuarios: this.get('consultaListaUsuarios')(this),
      listaAssistencias: this.get('consultaListaAssistencias')(this),
      setores: this.store.findAll('setor')
    });
  },

  setupController(controller, model) {

    let dicionarioMeses = {
      0: "Janeiro",
      1: "Fevereiro",
      2: "Março",
      3: "Abril",
      4: "Maio",
      5: "Junho",
      6: "Julho",
      7: "Agosto",
      8: "Setembro",
      9: "Outubro",
      10: "Novembro",
      11: "Dezembro"
    };
    
    controller.set('setores', model.setores);
    controller.set('listaAssistencias', model.listaAssistencias);    

    let listaUsuarios = model.listaUsuarios.sortBy('nome');
    listaUsuarios.insertAt(0, this.get('usuario').usuario);
    controller.set('listaUsuarios', listaUsuarios);

    controller.set('usuarioFiltro', this.get('usuario').usuario);

    later(controller, function() {
      controller.send('ordernarAssistenciaPorSetor');
    }, 2000);

    var hoje = new Date;

    //Preenche filtro de Anos
    let listaAnos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1];
    controller.set('listaAnos', listaAnos);
    controller.set('ano', hoje.getFullYear());

    //Preenche filtro de Meses do Filtro
    let listaMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    controller.set('listaMeses', listaMeses);
    controller.set('mes', dicionarioMeses[hoje.getMonth()]);
    controller.set('dicionarioMeses', dicionarioMeses);

    //Preenche filtro de Meses das férias
    let listaMesesFerias = ['Não definido', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    controller.set('listaMesesFerias', listaMesesFerias);

    //Preenche filtro de Setores
    let listaSetores = model.setores.sortBy('nome').mapBy('nome');    
    listaSetores.insertAt(0, 'Todos');
    controller.set('listaSetores', listaSetores);
    controller.set('nmSetor', 'Todos');

    //Preeche filtro de Turnos        
    let turnos = ['Todos'].concat(config.APP.turnos);
    controller.set('listaTurnos', turnos);
    controller.set('turno', 'Todos');

    //Preenche filtro de Grupos de Compartilhamento
    let listaGruposCompartilhamento = model.gruposUsuario.mapBy('nome');
    listaGruposCompartilhamento.insertAt(0, 'Todos');
    listaGruposCompartilhamento.insertAt(1, 'Nenhum');
    controller.set('gruposCompartilhamento', listaGruposCompartilhamento);

    //Seleciona o grupo principal para o usuário logado
    let grupoPrincipal = model.gruposUsuario.filter(function(grupo) {
      return grupo.get('principal');
    });
    if (grupoPrincipal.length > 0) {
      controller.set('nmGrupoCompartilhamento', grupoPrincipal.objectAt(0).get('nome'));
      controller.set('nmGrupoCompartilhamentoUsuario', grupoPrincipal.objectAt(0).get('nome'));
    } else {
      controller.set('nmGrupoCompartilhamento', 'Todos');
      controller.set('nmGrupoCompartilhamentoUsuario', 'Todos');
    }

  }

});
