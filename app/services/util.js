import Service from '@ember/service';
import config from 'homecarecontrol/config/environment';


export default Service.extend({

  tratarValor(valorParam) {

    if (!valorParam) return null;

    let valor = String(valorParam.replace('R$', '').trim());

    if (valor.length == 1) {
      valor = valor + ',00';
    } else {
      if (!valor.includes(',')) {
        valor = valor + ',00';
      }
    }

    return 'R$ ' + valor;
  },

  calculaValorReuniao(duracao) {
    if (duracao) {
      let possuiDoisPontos = duracao.indexOf(':') != -1;
      if (possuiDoisPontos) {
        let horas = Number(duracao.split(':')[0]);
        let minutos = Number(duracao.split(':')[1]);
        let valorReuniao = config.APP.valorReuniao;
        let totalHoras = horas * valorReuniao;
        let totalMinutos = (minutos/60) * valorReuniao
        let total = totalHoras + totalMinutos;
        let totalStr = total.toFixed(2);
        return 'R$ ' + totalStr.replace('.', ',');
      }
    }
    return 'R$ 0,00';
  }


});
