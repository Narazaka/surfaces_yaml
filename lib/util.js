// Generated by CoffeeScript 1.7.1
(function() {
  var clone, entry, extend,
    __slice = [].slice;

  exports.clone = clone = function(src) {
    var key, ret;
    if ((src == null) || typeof src !== 'object') {
      return src;
    }
    ret = new src.constructor();
    for (key in src) {
      ret[key] = clone(src[key]);
    }
    return ret;
  };

  exports.extend = extend = function(child, parent) {
    var key, _results;
    if ((child instanceof Object) && (!(child instanceof Array)) && (parent != null) && (parent instanceof Object) && (!(parent instanceof Array))) {
      for (key in child) {
        if (parent[key] != null) {
          extend(child[key], parent[key]);
        }
      }
      _results = [];
      for (key in parent) {
        if (child[key] == null) {
          _results.push(child[key] = clone(parent[key]));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  exports.entry = entry = (function() {
    function entry(name) {
      this.name = name;
      this.id = 0;
      this.entries = [];
    }

    entry.prototype.add = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.entries.push(this.name + this.id + ',' + (args.join(',')));
      return this.id++;
    };

    entry.prototype.to_string = function() {
      var str, _i, _len, _ref;
      str = '';
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        str += entry + "\r\n";
      }
      return str;
    };

    return entry;

  })();

}).call(this);