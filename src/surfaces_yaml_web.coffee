window.onload = ->
	document.getElementById('to').onclick = ->
		yaml_str = document.getElementById('yaml').value
		txt = SurfacesYaml.yaml_to_txt yaml_str
		document.getElementById('txt').value = txt
