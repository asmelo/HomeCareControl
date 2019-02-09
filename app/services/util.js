import Service from '@ember/service';

export default Service.extend({

  tratarValor(valorParam) {
    let valor = String(valorParam.replace('R$', '').trim());

    if (valor.length == 1) {
      valor = valor + ',00';
    } else {
      if (!valor.includes(',')) {
        valor = valor + ',00';
      }
    }

    return 'R$ ' + valor;
  }


});
