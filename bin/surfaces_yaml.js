#!/usr/bin/env node
// Generated by CoffeeScript 1.8.0
(function() {
  var SurfacesYaml, fs, totxt;

  fs = require('fs');

  SurfacesYaml = require('surfaces_yaml');

  totxt = function(file, file_out) {
    var txt, yaml_str;
    yaml_str = fs.readFileSync(file, 'utf8');
    txt = SurfacesYaml.yaml_to_txt(yaml_str);
    return fs.writeFileSync(file_out, txt, 'utf8');
  };

  if (process.argv.length !== 4) {
    console.log('Usage : surface_yaml surfaces.yaml surfaces.txt');
  } else {
    totxt(process.argv[2], process.argv[3]);
  }

}).call(this);
