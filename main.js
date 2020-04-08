const Ray = function() {
  return {
    length: 0,

    push: function(value) {
      this[this.length++] = value;
      return this.length;
    },

    pop: function() {
      const tmp = this[this.length - 1];
      delete this[--this.length];
      return tmp;
    },
    
    unshift: function(value) {
      for(let i = this.length++; i > 0; i--) {
        this[i] = this[i - 1];
      }
      this[0] = value;
    },

    shift: function() {
      tmp = this[0];
      for(let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
      }
      delete this[--this.length];
      return tmp;
    }
  };
}


module.exports = {
  Ray,
}
