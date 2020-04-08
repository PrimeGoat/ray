// Set up internal array object to be handled
const _Ray = function() {
    return {
    length: 0,

    push: function(value) {
      this[this.length] = value;
      return this.length;
    },

    pop: function() {
      const tmp = this[this.length - 1];
      this.length--; // Proxy will automatically truncate
      return tmp;
    },
    
    unshift: function(value) {
      for(let i = this.length; i > 0; i--) {
        this[i] = this[i - 1];
      }
      this[0] = value;
    },

    shift: function() {
      tmp = this[0];
      for(let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
      }
      this.length--; // Proxy will automatically truncate
      return tmp;
    },

    // .keys is always set to a list of numeric keys in the array.
    // Length of list isn't always equal to .length.  Deleted elements stay as undefined
    // but aren't listed here.  This copies real array behavior.
    get keys() {
      let out = [];
      for(key in this) {
        if(!isNaN(key) && this[key] != undefined) {
          out.push(key);
        }
      }
      return out;
    }
  };
}

// Create user-facing array object with proxy handler
const Ray = function() {
  return new Proxy(_Ray(), {
    // Getter
    get: function(object, property) {
      return object[property];
    },

    // Setter: watch the .length property for changes
    set: function(object, property, value, receiver) {
      if(property == "length") {
        // Truncate if new value is shorter than length.  Otherwise, length expands
        // New values are undefined, so do nothing if length expands.
        if(object.keys.length > value) {
          // Truncate
          let toDelete = object.keys.sort((a, b) => Number(a) - Number(b)).slice(value);
          for(index of toDelete) {
            delete object[index];
          }
        }
      } else {
        if(!(property in object) && !isNaN(property) && Number(property) + 1 >= object.length) {
          // If setting new numeric property, update length based on new index
          object.length = Number(property) + 1;
        }
      }
      object[property] = value;
      return true;
    },

    deleteProperty: function(target, property) {
      console.log("Deleter!");
      if(!isNaN(property)) {
        target[property] = undefined;
      } else {
        delete target[property];
        return true;
      }
    }
  });
}

const test = Ray();

test[2] = 3;
console.log(test);
console.log(test.keys);

module.exports = {
  Ray,
}
