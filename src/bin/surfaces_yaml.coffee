fs = require 'fs'
SurfacesYaml = require 'surfaces_yaml'

totxt = (file, file_out) ->
	yaml_str = fs.readFileSync file, 'utf8'
	txt = SurfacesYaml.yaml_to_txt yaml_str
	fs.writeFileSync file_out, txt, 'utf8'

if process.argv.length != 4
	console.log 'Usage : surface_yaml surfaces.yaml surfaces.txt'
else
	totxt process.argv[2], process.argv[3]
