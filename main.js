/* Custom array implementation by Denis Savgir
 * A bunch of extra features have been added that replicate the behavior of real arrays.
 *
 * FEATURES:
 * - All goals and stretch goals of assignment.
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
 * 
 */

// Set up internal array object to be handled by proxy
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
      const methods = ['length', 'push', 'pop', 'unshift', 'shift'];
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
      if(!isNaN(property)) {
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
