fs = require 'fs'
yaml = require 'js-yaml'
surfaces_yaml = require 'surfaces_yaml'
Descript = surfaces_yaml.Descript
Regions = surfaces_yaml.Regions
Surfaces = surfaces_yaml.Surfaces
Aliases = surfaces_yaml.Aliases

totxt = (file, file_out) ->
	yaml_str = fs.readFileSync file, 'utf8'
	try
		data = yaml.safeLoad yaml_str.replace /\t/g, '  '
	catch e
		throw e
	descript = new Descript data.descript
	regions = new Regions data.regions
	surfaces = new Surfaces data.surfaces
	aliases = new Aliases data.aliases
	txt = ''
	txt += descript.to_string()
	txt += regions.to_string()
	txt += surfaces.to_string(regions.get())
	txt += aliases.to_string(surfaces.get())
	fs.writeFileSync file_out, txt, 'utf8'

if process.argv.length != 4
	console.log 'Usage : surface_yaml surfaces.yaml surfaces.txt'
else
	totxt process.argv[2], process.argv[3]
