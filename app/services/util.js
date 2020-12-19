import Service from '@ember/service';
import config from 'homecarecontrol/config/environment';


export default Service.extend({

  tratarValor(valorParam) {

    if (!valorParam) return 'R$ 0,00';

    if (typeof(valorParam) == 'number') {
      valorParam = valorParam.toFixed(2);
      valorParam = valorParam.replace('.', ',')
    }

    let valor = String(valorParam.replace('R$', '').trim());

    if (valor.length == 1) {
      valor = valor + ',00';
    } else {
      if (!valor.includes(',')) {
        valor = valor + ',00';
      }
    }

    //Coloca o ponto em valores como 99.999,99
    if (valor.length == 8) {
      valor = valor.slice(0, 2) + '.' + valor.slice(2);
    }

    //Coloca o ponto em valores como 9.999,99
    if (valor.length == 7) {
      valor = valor.slice(0, 1) + '.' + valor.slice(1);
    }

    return 'R$ ' + valor;
  },

  calculaValorReuniao(duracao, profissao) {
    if (duracao) {
      let possuiDoisPontos = duracao.indexOf(':') != -1;
      if (possuiDoisPontos) {
        let horas = Number(duracao.split(':')[0]);
        let minutos = Number(duracao.split(':')[1]);
        let valorReuniao = config.APP.valorReuniao;
        if (profissao == 'Fisioterapeuta') {
          valorReuniao = config.APP.valorReuniaoFisio;
        }
        let totalHoras = horas * valorReuniao;
        let totalMinutos = (minutos/60) * valorReuniao
        let total = totalHoras + totalMinutos;
        let totalStr = total.toFixed(2);
        return 'R$ ' + totalStr.replace('.', ',');
      }
    }
    return 'R$ 0,00';
  },

  isLocalhostOrControleDeAssistenciaHost() {
    let hostname = window.location.hostname;
      if (hostname == 'localhost' || hostname == 'controledeassistencias.firebaseapp.com') {
        return true;
      }
      return false;
  }

});
