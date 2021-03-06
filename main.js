/* Custom array implementation by Denis Savgir
 * A bunch of extra features have been added that replicate the behavior of real arrays.
 *
 * FEATURES:
 * - All goals and stretch goals of assignment.
 * - Array can be initialized by providing an array or object to Ray().
 * - .length is automatically updated when new elements are added to array in .push()
 *   and .unshift().  The functions don't have to manage .length themselves.
 * - .length is automatically updated if you add new elements with bracket notation.
 *   For example, if you have a blank array and give a value to [20], .length automatically
 *   becomes 21.
 * - If you delete non-numeric members, .length is decremented.  If you delete numeric
 *   members, .length stays the same, just like in real arrays.
 * - Array is automatically truncated if you change .length attribute.
 * - New .keys attribute that contains a list of array's indices.  The indices are sorted
 *   as numerically-sorted numerics followed by alphabetically-sorted non-numerics.
 * - Object.keys() returns only array indices, excludes methods.
 * - .Array() returns the contents as an Array object.
 * - Iterator implemented so that array can be traversed using for-of
 * - Can be expressed as a primitive.
 * 
 */


const Ray = function(arr = []) {
  return new Proxy({
    ...arr,

    length: arr.length,
  
    push: function(value) {
      this[this.length] = value; // Adding new element automatically updates .length
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
  
    // .keys is always set to a list of array keys.
    // Length of list isn't always equal to .length.  Deleted elements stay
    // as undefined and are part of the overall .length,
    // but aren't listed here.  This copies real array behavior.
    get keys() {
      const methods = ['length', 'push', 'pop', 'unshift', 'shift', 'Array', 'includes', 'indexOf', 'reverse', 'slice', 'map', 'filter', 'forEach', 'concat', 'find', 'findIndex', 'every', 'some'];

      return Object.keys(this).filter(item => (!methods.includes(item) && item != "keys")).sort(function(a, b) {
        // Sort by numeric vs alphabetic
        let out = isNaN(a) - isNaN(b);
        if(out != 0) {
          return out;
        }
  
        // Subsort by either lexicographical or numerical
        if(a < b) {
          return -1;
        } else if(b < a) {
          return 1;
        } else {
          return 0;
        }
      });
    },
  
    // Returns contents as an Array object
    Array: function() {
      const out = new Array();
  
      for(key in this) {
        out.push(this[key]);
      }
  
      return out;
    },
  
    // Stretch goals below
  
    includes: function(item) {
      for(member of this.keys) {
        if(this[member] == item) {
          return true;
        }
      }
      return false;
    },
  
    indexOf: function(item) {
      for(member of this.keys) {
        if(this[member] == item) {
          return member;
        }
      }
      return -1;
    },
  
    reverse: function() {
      console.log("Keys: " + this.keys);
      for(let i = 0, j = this.length - 1; i < j; i++, j--) {
        const tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
      }
    },
  
    slice: function(from = 0, to = this.length) {
      const out = Ray();
      if(to < 1) {
        to = this.length + to;
      }
  
      for(let i = from; i < to; i++) {
        out.push(this[i]);
      }
      return out;
    },
  
    map: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        out[i] = func(this[i], i, this, thisValue);
      }
      console.log(typeof out);
      return out;
    },
  
    filter: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        if(func(this[i], i, this, thisValue)) {
          out.push(this[i]);
        }
      }
      return out;
    },
  
    forEach: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        if(this[i] != undefined) {
          func(this[i], i, this, thisValue);
        }
      }
    },
  
    concat: function(array2) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        out.push(this[i]);
      }
  
      for(let i = 0; i < array2.length; i++) {
        out.push(array2[i]);
      }
  
      return out;
    },
  
    find: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        if(this[i] != undefined) {
          if(func(this[i], i, this, thisValue)) {
            return this[i];
          }
        }
      }
  
      return undefined;
    },
  
    findIndex: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        if(this[i] != undefined) {
          if(func(this[i], i, this, thisValue)) {
            return i;
          }
        }
      }
  
      return -1;
    },
  
    every: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        if(this[i] != undefined) {
          if(!func(this[i], i, this, thisValue)) {
            return false;
          }
        }
      }
  
      return true;
    },
  
    some: function(func, thisValue = undefined) {
      const out = Ray();
  
      for(let i = 0; i < this.length; i++) {
        if(this[i] != undefined) {
          if(func(this[i], i, this, thisValue)) {
            return true;
          }
        }
      }
  
      return false;
    },

    /*
    *[Symbol.iterator] () {}
      yield this[0];
      yield this[1];
      yield this[2];
    } */

    [Symbol.iterator] () {
      let step = 0;

      iterate = this;

      return {
        next() {
          if(step < iterate.length) {
            return {done: false, value: iterate[step++]};
          } else {
            return {done: true};
          }
        }
      }
    },

    valueOf: function() {
      let out = "[ ";
      for(element of this) {
        if(typeof element == 'string') {
          out += "'" + element + "', ";
        } else {
          out += element + ", ";
        }
      }
      return out.slice(0, -2) + " ]";
    },

/* - Same as valueOf()
    [Symbol.toPrimitive] () {
      let out = "[ ";
      for(element of this) {
        if(typeof element == 'string') {
          out += "'" + element + "', ";
        } else {
          out += element + ", ";
        }
      }
      return out.slice(0, -2) + " ]";
    }*/
  }, {
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
      if(!isNaN(property)) {
        // If deleting a numeric property, set to undefined and keep it,
        // behaving like real arrays do
        target[property] = undefined;
      } else {
        delete target[property];
        return true;
      }
    },

    // Hide all keys other than what an array would show (numerics and members)
    ownKeys: function(target) {
      return target.keys;
    }
  });
}


module.exports = {
  Ray,
}
