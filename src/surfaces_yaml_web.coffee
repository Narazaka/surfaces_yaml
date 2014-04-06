window.onload = ->
	document.getElementById('to').onclick = ->
		yaml_str = document.getElementById('yaml').value
		txt = SurfacesYaml.yaml_to_txt yaml_str
		document.getElementById('txt').value = txt
	document.getElementById('set_example').onclick = ->
		yaml_str = ajax.gets('examples/surfaces.yaml')
		document.getElementById('yaml').value = yaml_str
