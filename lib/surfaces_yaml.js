// Generated by CoffeeScript 1.8.0
var SurfacesYaml, clone, extend, jsyaml;

clone = function(src) {
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

extend = function(child, parent) {
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

if (typeof exports !== "undefined" && exports !== null) {
  exports.clone = clone;
  exports.extend = extend;
}

if (typeof require !== "undefined" && require !== null) {
  jsyaml = require('js-yaml');
}

SurfacesYaml = {};

SurfacesYaml.Charset = (function() {
  function Charset(charset) {
    this.charset = charset;
  }

  Charset.prototype.get = function() {
    return this.charset;
  };

  Charset.prototype.to_string = function() {
    if (this.charset != null) {
      return "charset," + this.charset + "\r\n";
    } else {
      return "";
    }
  };

  return Charset;

})();

SurfacesYaml.Descript = (function() {
  function Descript(descript) {
    this.descript = descript;
  }

  Descript.prototype.get = function() {
    return this.descript;
  };

  Descript.prototype.to_string = function() {
    var key, str, value, _ref;
    str = "descript\r\n";
    str += "{\r\n";
    _ref = this.descript;
    for (key in _ref) {
      value = _ref[key];
      str += key + ',' + value + '\r\n';
    }
    return str += "}\r\n";
  };

  return Descript;

})();

SurfacesYaml.Regions = (function() {
  function Regions(regions) {
    this.regions = regions;
  }

  Regions.prototype.get = function() {
    return this.regions;
  };

  Regions.prototype.to_string = function() {
    var character, entry, entry_mousedown, entry_mouseup, entry_tooltip, index, name, regions, setting, str, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    entry_mouseup = {};
    entry_mousedown = {};
    entry_tooltip = {};
    _ref = this.regions;
    for (character in _ref) {
      regions = _ref[character];
      for (name in regions) {
        setting = regions[name];
        if (setting.tooltip != null) {
          if (entry_tooltip[character] == null) {
            entry_tooltip[character] = [];
          }
          entry_tooltip[character].push("" + name + "," + setting.tooltip);
        }
        if (setting.cursor != null) {
          if (setting.cursor.mouseup != null) {
            if (entry_mouseup[character] == null) {
              entry_mouseup[character] = [];
            }
            entry_mouseup[character].push("" + name + "," + setting.cursor.mouseup);
          }
          if (setting.cursor.mousedown != null) {
            if (entry_mousedown[character] == null) {
              entry_mousedown[character] = [];
            }
            entry_mousedown[character].push("" + name + "," + setting.cursor.mousedown);
          }
        }
      }
    }
    str = '';
    for (character in this.regions) {
      str += "" + character + ".cursor\r\n";
      str += "{\r\n";
      if (entry_mouseup[character] != null) {
        _ref1 = entry_mouseup[character];
        for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
          entry = _ref1[index];
          str += "mouseup" + index + "," + entry + "\r\n";
        }
      }
      if (entry_mousedown[character] != null) {
        _ref2 = entry_mousedown[character];
        for (index = _j = 0, _len1 = _ref2.length; _j < _len1; index = ++_j) {
          entry = _ref2[index];
          str += "mousedown" + index + "," + entry + "\r\n";
        }
      }
      str += "}\r\n";
      str += "" + character + ".tooltips\r\n";
      str += "{\r\n";
      if (entry_tooltip[character] != null) {
        _ref3 = entry_tooltip[character];
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          entry = _ref3[_k];
          str += entry + "\r\n";
        }
      }
      str += "}\r\n";
    }
    return str;
  };

  return Regions;

})();

SurfacesYaml.Surfaces = (function() {
  function Surfaces(surfaces) {
    var id, surface, _ref;
    this.surfaces = surfaces;
    this.surfaces_finalized = {};
    _ref = this.surfaces;
    for (id in _ref) {
      surface = _ref[id];
      this.finalize_surface(id);
    }
  }

  Surfaces.prototype.get = function() {
    return this.surfaces_finalized;
  };

  Surfaces.prototype.finalize_surface = function(id) {
    var base, e, surface, _i, _len, _ref;
    if (this.surfaces_finalized[id] != null) {
      return;
    }
    surface = clone(this.surfaces[id]);
    if (surface.base != null) {
      if (!(surface.base instanceof Array)) {
        surface.base = [surface.base];
      }
      _ref = surface.base.slice().reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        base = _ref[_i];
        if (this.surfaces[base] != null) {
          this.finalize_surface(base);
          extend(surface, this.surfaces_finalized[base]);
        } else {
          throw "surface's base entry not found in surface " + id;
        }
      }
    }
    this.surfaces_finalized[id] = surface;
    try {

    } catch (_error) {
      e = _error;
      console.log(e);
      return exit;
    }
  };

  Surfaces.prototype.validate = function(surface) {};

  Surfaces.prototype.get_surface_id = function(surface_id) {
    if (isNaN(surface_id)) {
      if ((this.surfaces_finalized[surface_id] != null) && (this.surfaces_finalized[surface_id].is != null)) {
        return this.surfaces_finalized[surface_id].is;
      } else {
        throw "non-number surface target not found : " + surface_id;
      }
    } else {
      return surface_id;
    }
  };

  Surfaces.prototype.get_animation_id = function(animations, animation_id) {
    if (isNaN(animation_id)) {
      if ((animations[animation_id] != null) && (animations[animation_id].is != null)) {
        return animations[animation_id].is;
      } else {
        throw "non-number surface animation target not found : " + animation_id;
      }
    } else {
      return animation_id;
    }
  };

  Surfaces.prototype.to_string = function(regions) {
    var id, str, surface, _ref;
    str = '';
    _ref = this.surfaces_finalized;
    for (id in _ref) {
      surface = _ref[id];
      if (surface.is != null) {
        str += this.to_string_surface(surface, regions);
      }
    }
    return str;
  };

  Surfaces.prototype.to_string_surface = function(surface) {
    var str;
    str = "surface" + surface.is + "\r\n";
    str += "{\r\n";
    if (surface.points != null) {
      str += this.to_string_from_entries(this.to_string_surface_points(surface.points, 'point'));
    }
    if (surface.balloons != null) {
      str += this.to_string_from_entries(this.to_string_surface_balloons(surface.balloons));
    }
    if (surface.elements != null) {
      str += this.to_string_from_entries(this.to_string_surface_elements(surface.elements));
    }
    if (surface.animations != null) {
      str += this.to_string_from_entries(this.to_string_surface_animations(surface.animations));
    }
    if (surface.regions != null) {
      str += this.to_string_from_entries(this.to_string_surface_regions(surface.regions));
    }
    str += "}\r\n";
    return str;
  };

  Surfaces.prototype.to_string_from_entries = function(entries) {
    var entry, str, _i, _len;
    str = '';
    for (_i = 0, _len = entries.length; _i < _len; _i++) {
      entry = entries[_i];
      str += entry + "\r\n";
    }
    return str;
  };

  Surfaces.prototype.to_string_surface_points = function(points, name) {
    var child, child_name, result;
    result = [];
    if (points instanceof Object) {
      for (child_name in points) {
        child = points[child_name];
        result = result.concat(this.to_string_surface_points(child, name + '.' + child_name));
      }
    } else {
      result.push(name + ',' + points);
    }
    return result;
  };

  Surfaces.prototype.to_string_surface_balloons = function(balloons) {
    var entry, entry_2, name, name_2, result;
    result = [];
    for (name in balloons) {
      entry = balloons[name];
      if (entry instanceof Object) {
        for (name_2 in entry) {
          entry_2 = entry[name_2];
          result.push(name + '.balloon.' + name_2 + ',' + entry_2);
        }
      } else {
        result.push('balloon.' + name + ',' + entry);
      }
    }
    return result;
  };

  Surfaces.prototype.to_string_surface_elements = function(elements) {
    var element, id, order, result, _i, _len;
    order = [];
    for (id in elements) {
      element = elements[id];
      if (element.is != null) {
        order[element.is] = id;
      }
    }
    result = [];
    for (_i = 0, _len = order.length; _i < _len; _i++) {
      id = order[_i];
      if (!(id != null)) {
        continue;
      }
      element = elements[id];
      result.push("element" + element.is + "," + element.type + "," + element.file + "," + (element.x || 0) + "," + (element.y || 0));
    }
    return result;
  };

  Surfaces.prototype.to_string_surface_animations = function(animations) {
    var animation, id, index, o, options, order, pattern, region_entries, region_entry, result, _i, _j, _k, _len, _len1, _len2, _ref;
    order = [];
    for (id in animations) {
      animation = animations[id];
      if (animation.is != null) {
        order[animation.is] = id;
      }
    }
    result = [];
    for (_i = 0, _len = order.length; _i < _len; _i++) {
      id = order[_i];
      if (!(id != null)) {
        continue;
      }
      animation = animations[id];
      if (animation.interval != null) {
        result.push("animation" + animation.is + ".interval," + animation.interval);
      }
      if (animation.option != null) {
        result.push("animation" + animation.is + ".option," + animation.option);
      }
      if (animation.patterns != null) {
        _ref = animation.patterns;
        for (index = _j = 0, _len1 = _ref.length; _j < _len1; index = ++_j) {
          pattern = _ref[index];
          options = this.to_string_pattern_arguments(animations, pattern);
          result.push(("animation" + animation.is + ".pattern" + index + "," + pattern.type + ",") + ((function() {
            var _k, _len2, _results;
            _results = [];
            for (_k = 0, _len2 = options.length; _k < _len2; _k++) {
              o = options[_k];
              if (o != null) {
                _results.push(o);
              }
            }
            return _results;
          })()).join(','));
        }
      }
      if (animation.regions != null) {
        region_entries = this.to_string_surface_regions(animation.regions);
        for (_k = 0, _len2 = region_entries.length; _k < _len2; _k++) {
          region_entry = region_entries[_k];
          result.push("animation" + animation.is + "." + region_entry);
        }
      }
    }
    return result;
  };

  Surfaces.prototype.to_string_pattern_arguments = function(animations, pattern) {
    var animation_id, options, surface, _i, _len, _ref;
    surface = null;
    options = null;
    switch (pattern.type) {
      case 'overlay':
      case 'overlayfast':
      case 'reduce':
      case 'replace':
      case 'interpolate':
      case 'asis':
      case 'bind':
      case 'add':
      case 'reduce':
        surface = this.get_surface_id(pattern.surface);
        options = [surface, pattern.wait, pattern.x, pattern.y];
        break;
      case 'base':
        surface = this.get_surface_id(pattern.surface);
        options = [surface, pattern.wait];
        break;
      case 'move':
        options = [0, pattern.wait, pattern.x, pattern.y];
        break;
      case 'insert':
      case 'start':
      case 'stop':
        animation_id = this.get_animation_id(animations, pattern.animation_id);
        options = [animation_id];
        break;
      case 'alternativestart':
      case 'alternativestop':
        options = [];
        _ref = pattern.animation_ids;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          animation_id = _ref[_i];
          options.push(this.get_animation_id(animations, animation_id));
        }
    }
    return options;
  };

  Surfaces.prototype.to_string_surface_regions = function(regions) {
    var coordinate, id, order, region, result, _i, _len;
    order = [];
    for (id in regions) {
      region = regions[id];
      if (region.is != null) {
        order[region.is] = id;
      }
    }
    result = [];
    for (_i = 0, _len = order.length; _i < _len; _i++) {
      id = order[_i];
      if (!(id != null)) {
        continue;
      }
      region = regions[id];
      if ((region.type == null) || (region.type === 'rect')) {
        result.push("collision" + region.is + "," + region.left + "," + region.top + "," + region.right + "," + region.bottom + "," + region.name);
      } else if (region.type === 'ellipse') {
        result.push("collisionex" + region.is + "," + region.name + "," + region.type + "," + region.left + "," + region.top + "," + region.right + "," + region.bottom);
      } else if (region.type === 'polygon') {
        result.push(("collisionex" + region.is + "," + region.name + "," + region.type) + ((function() {
          var _j, _len1, _ref, _results;
          _ref = region.coordinates;
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            coordinate = _ref[_j];
            _results.push("," + coordinate.x + "," + coordinate.y);
          }
          return _results;
        })()).join(''));
      } else {
        throw "unknown region(collision) type : " + region.type;
      }
    }
    return result;
  };

  return Surfaces;

})();

SurfacesYaml.Aliases = (function() {
  function Aliases(aliases) {
    this.aliases = aliases;
  }

  Aliases.prototype.get = function() {
    return this.aliases;
  };

  Aliases.prototype.to_string = function(surfaces) {
    var aliases, character, character_aliases, entries, entry, id, is_valid, str, surface, target_id, target_ids, targets, _i, _j, _len, _len1, _ref, _ref1;
    character_aliases = {};
    for (id in surfaces) {
      surface = surfaces[id];
      if ((surface.is != null) && (surface.characters != null)) {
        _ref = surface.characters;
        for (character in _ref) {
          is_valid = _ref[character];
          if (is_valid) {
            if (character_aliases[character] == null) {
              character_aliases[character] = [];
            }
            character_aliases[character].push(id + ',' + '[' + surface.is + ']');
          }
        }
      }
    }
    _ref1 = this.aliases;
    for (character in _ref1) {
      aliases = _ref1[character];
      for (id in aliases) {
        target_ids = aliases[id];
        targets = [];
        for (_i = 0, _len = target_ids.length; _i < _len; _i++) {
          target_id = target_ids[_i];
          if (isNaN(target_id)) {
            if ((surfaces[target_id] != null) && (surfaces[target_id].is != null)) {
              targets.push(surfaces[target_id].is);
            } else {
              throw "non-number alias target not found : " + id + " -> " + target_id;
            }
          } else {
            targets.push(target_id);
          }
        }
        if (character_aliases[character] == null) {
          character_aliases[character] = [];
        }
        character_aliases[character].push(id + ',' + '[' + targets.join(',') + ']');
      }
    }
    str = '';
    for (character in character_aliases) {
      entries = character_aliases[character];
      str += "" + character + ".surface.alias\r\n";
      str += "{\r\n";
      for (_j = 0, _len1 = entries.length; _j < _len1; _j++) {
        entry = entries[_j];
        str += entry + "\r\n";
      }
      str += "}\r\n";
    }
    return str;
  };

  return Aliases;

})();

SurfacesYaml.to_txt = function(data) {
  var aliases, charset, descript, regions, surfaces, txt;
  charset = new SurfacesYaml.Charset(data.charset);
  descript = new SurfacesYaml.Descript(data.descript);
  regions = new SurfacesYaml.Regions(data.regions);
  surfaces = new SurfacesYaml.Surfaces(data.surfaces);
  aliases = new SurfacesYaml.Aliases(data.aliases);
  txt = '';
  txt += charset.to_string();
  txt += descript.to_string();
  txt += regions.to_string();
  txt += surfaces.to_string();
  txt += aliases.to_string(surfaces.get());
  return txt;
};

SurfacesYaml.yaml_to_txt = function(yaml_str) {
  var data, e;
  try {
    data = jsyaml.safeLoad(yaml_str.replace(/\t/g, '  '));
  } catch (_error) {
    e = _error;
    throw e;
  }
  return SurfacesYaml.to_txt(data);
};

if (typeof exports !== "undefined" && exports !== null) {
  exports.Descript = SurfacesYaml.Descript;
  exports.Regions = SurfacesYaml.Regions;
  exports.Surfaces = SurfacesYaml.Surfaces;
  exports.Aliases = SurfacesYaml.Aliases;
  exports.to_txt = SurfacesYaml.to_txt;
  exports.yaml_to_txt = SurfacesYaml.yaml_to_txt;
}
