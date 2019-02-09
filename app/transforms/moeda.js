import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    if(serialized == 0){
      return 'R$ 0,00'
    }
    if (serialized) {
      var v = serialized;
      if(String(v).charAt(String(v).length -2) == '.'){
        v = String(v) + '0'
      }
      if (!new String(v).includes(".")) {
        v = Number(v) * 100;
      }
      v = new String(v);
      v = v.replace(/\D/g, "");
      var len = v.length;
      if (1 == len)
        v = v.replace(/(\d)/, "0,0$1");
      else if (2 == len)
        v = v.replace(/(\d)/, "0,$1");
      else if (len > 2) {
        v = v.replace(/(\d{2})$/, ',$1');
        if (len > 5) {
          var x = len - 5,
            er = new RegExp('(\\d{' + x + '})(\\d)');
          v = v.replace(er, '$1.$2');
        }
        if (len > 8) {
            x = len - 8;
            er = new RegExp('(\\d{' + x + '})(\\d)');
          v = v.replace(er, '$1.$2');
        }
        if (len > 11) {
            x = len - 11;
            er = new RegExp('(\\d{' + x + '})(\\d)');
          v = v.replace(er, '$1.$2');
        }

        serialized = 'R$ ' + v;

      }
      return serialized;
    }
  },

  serialize(deserialized) {
    if (deserialized) {
      deserialized = deserialized.replace(/\./g, '');
      deserialized = deserialized.replace(/-/g, '');
      deserialized = deserialized.replace(/R/g, '');
      deserialized = deserialized.replace(/\$/g, '');
      deserialized = deserialized.replace(/,/g, '.');
      deserialized = deserialized.trim()
    }
    return Number(deserialized);
  }
});
