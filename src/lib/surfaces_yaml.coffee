if require?
	jsyaml = require 'js-yaml'

SurfacesYaml = {}

class SurfacesYaml.Charset
	constructor : (@charset) ->
		
	get : -> @charset
	to_string : -> if @charset? then "charset,#{@charset}\r\n" else ""

class SurfacesYaml.Descript
	constructor : (@descript) ->
		
	get : -> @descript
	to_string : ->
		str = "descript\r\n"
		str += "{\r\n"
		for key, value of @descript
			str += key + ',' + value + '\r\n'
		str += "}\r\n"

class SurfacesYaml.Regions
	constructor : (@regions) ->
		
	get : -> @regions
	to_string : ->
		entry_mouseup = {}
		entry_mousedown = {}
		entry_tooltip = {}
		for character, regions of @regions
			for name, setting of regions
				if setting.tooltip?
					unless entry_tooltip[character]?
						entry_tooltip[character] = []
					entry_tooltip[character].push "#{name},#{setting.tooltip}"
				if setting.cursor?
					if setting.cursor.mouseup?
						unless entry_mouseup[character]?
							entry_mouseup[character] = []
						entry_mouseup[character].push "#{name},#{setting.cursor.mouseup}"
					if setting.cursor.mousedown?
						unless entry_mousedown[character]?
							entry_mousedown[character] = []
						entry_mousedown[character].push "#{name},#{setting.cursor.mousedown}"
		str = ''
		for character of @regions
			str += "#{character}.cursor\r\n"
			str += "{\r\n"
			if entry_mouseup[character]?
				for entry, index in entry_mouseup[character]
					str += "mouseup#{index},#{entry}\r\n"
			if entry_mousedown[character]?
				for entry, index in entry_mousedown[character]
					str += "mousedown#{index},#{entry}\r\n"
			str += "}\r\n"
			str += "#{character}.tooltips\r\n"
			str += "{\r\n"
			if entry_tooltip[character]?
				for entry in entry_tooltip[character]
					str += entry + "\r\n"
			str += "}\r\n"
		str

class SurfacesYaml.Surfaces
	constructor : (@surfaces) ->
		@surfaces_finalized = {}
		for id, surface of @surfaces
			@finalize_surface id
	get : -> @surfaces_finalized
	finalize_surface : (id) ->
		# already finalized
		if @surfaces_finalized[id]?
			return
		# copy the surface
		surface = clone @surfaces[id]
		# inherits base
		if surface.base?
			unless surface.base instanceof Array
				surface.base = [surface.base]
			for base in surface.base
				if @surfaces[base]?
					@finalize_surface base
#					console.log '-- surface'
#					console.log surface
#					console.log '-- base'
#					console.log @surfaces_finalized[base]
#					console.log '-- diff'
#					console.log parent_only_elements surface, @surfaces_finalized[base]
					extend surface, @surfaces_finalized[base]
				else
					throw "surface's base entry not found in surface #{id}"
		# store
		@surfaces_finalized[id] = surface
		# validate
		try
			#@validate surface
		catch e
			console.log e
			exit # ?
#		console.log 'end ',id,@surfaces_finalized[id]
	validate : (surface) ->
		
	get_surface_id : (surface_id) ->
		if isNaN(surface_id)
			# not number
			if @surfaces_finalized[surface_id]? and @surfaces_finalized[surface_id].is?
				return @surfaces_finalized[surface_id].is
			else
				throw "non-number surface target not found : #{surface_id}"
		else
			return surface_id
	get_animation_id : (animations, animation_id) ->
		if isNaN(animation_id)
			# not number
			if animations[animation_id]? and animations[animation_id].is?
				return animations[animation_id].is
			else
				throw "non-number surface animation target not found : #{animation_id}"
		else
			return animation_id
	to_string : (regions) ->
		str = ''
		for id, surface of @surfaces_finalized
			if surface.is?
				str += @to_string_surface(surface, regions)
		str
	to_string_surface : (surface) ->
		str = "surface#{surface.is}\r\n"
		str += "{\r\n"
		if surface.points?
			str += @to_string_from_entries @to_string_surface_points surface.points, 'point'
		if surface.balloons?
			str += @to_string_from_entries @to_string_surface_balloons surface.balloons
		if surface.elements?
			str += @to_string_from_entries @to_string_surface_elements surface.elements
		if surface.animations?
			str += @to_string_from_entries @to_string_surface_animations surface.animations
		if surface.regions?
			str += @to_string_from_entries @to_string_surface_regions surface.regions
		str += "}\r\n"
		str
	to_string_from_entries : (entries) ->
		str = ''
		for entry in entries
			str += entry + "\r\n"
		str
	to_string_surface_points : (points, name) ->
		result = []
		if points instanceof Object
			for child_name, child of points
				result = result.concat @to_string_surface_points child, name + '.' + child_name
		else
			result.push name + ',' + points
		result
	to_string_surface_balloons : (balloons) ->
		result = []
		for name, entry of balloons
			if entry instanceof Object
				for name_2, entry_2 of entry
					result.push name + '.balloon.' + name_2 + ',' + entry_2
			else
				result.push 'balloon.' + name + ',' + entry
		result
	to_string_surface_elements : (elements) ->
		order = []
		for id, element of elements
			if element.is?
				order[element.is] = id
		result = []
		for id in order when id?
			element = elements[id]
			result.push "element#{element.is},#{element.type},#{element.file},#{element.x || 0},#{element.y || 0}"
		result
	to_string_surface_animations : (animations) ->
		order = []
		for id, animation of animations
			if animation.is?
				order[animation.is] = id
		result = []
		for id in order when id?
			animation = animations[id]
			if animation.interval?
				result.push "animation#{animation.is}.interval,#{animation.interval}"
			if animation.option?
				result.push "animation#{animation.is}.option,#{animation.option}"
			if animation.patterns?
				for pattern, index in animation.patterns
					options = @to_string_pattern_arguments animations, pattern
					result.push "animation#{animation.is}.pattern#{index},#{pattern.type}," + (o for o in options when o?).join(',')
			if animation.regions?
				region_entries = @to_string_surface_regions animation.regions
				for region_entry in region_entries
					result.push "animation#{animation.is}.#{region_entry}"
		result
	to_string_pattern_arguments : (animations, pattern) ->
		surface = null
		options = null
		switch pattern.type
			when 'overlay', 'overlayfast', 'reduce', 'replace', 'interpolate', 'asis', 'bind', 'add', 'reduce'
				surface = @get_surface_id pattern.surface
				options = [surface, pattern.wait, pattern.x, pattern.y]
			when 'base'
				surface = @get_surface_id pattern.surface
				options = [surface, pattern.wait]
			when 'move'
				options = [0, pattern.wait, pattern.x, pattern.y]
			when 'insert', 'start', 'stop'
				animation_id = @get_animation_id animations, pattern.animation_id
				options = [animation_id]
			when 'alternativestart', 'alternativestop'
				options = []
				for animation_id in pattern.animation_ids
					options.push @get_animation_id animations, animation_id
		options
	to_string_surface_regions : (regions) ->
		order = []
		for id, region of regions
			if region.is?
				order[region.is] = id
		result = []
		for id in order when id?
			region = regions[id]
			if (not region.type?) or (region.type == 'rect')
				result.push "collision#{region.is},#{region.left},#{region.top},#{region.right},#{region.bottom},#{region.name}"
			else if region.type == 'ellipse'
				result.push "collisionex#{region.is},#{region.name},#{region.type},#{region.left},#{region.top},#{region.right},#{region.bottom}"
			else if region.type == 'polygon'
				result.push "collisionex#{region.is},#{region.name},#{region.type}" + (",#{coordinate.x},#{coordinate.y}" for coordinate in region.coordinates).join('')
			else
				throw "unknown region(collision) type : #{region.type}"
		result
		

class SurfacesYaml.Aliases
	constructor : (@aliases) ->
		
	get : -> @aliases
	to_string : (surfaces) ->
		character_aliases = {}
		for id, surface of surfaces
			if surface.is? and surface.characters?
				for character, is_valid of surface.characters
					if is_valid
						unless character_aliases[character]? then character_aliases[character] = []
						character_aliases[character].push id + ',' + '[' + surface.is + ']'
		for character, aliases of @aliases
			for id, target_ids of aliases
				targets = []
				for target_id in target_ids
					if isNaN(target_id)
						# not number
						if surfaces[target_id]? and surfaces[target_id].is?
							targets.push surfaces[target_id].is
						else
							throw "non-number alias target not found : #{id} -> #{target_id}"
					else
						targets.push target_id
				unless character_aliases[character]? then character_aliases[character] = []
				character_aliases[character].push id + ',' + '[' + targets.join(',') + ']'
		str = ''
		for character, entries of character_aliases
			str += "#{character}.surface.alias\r\n"
			str += "{\r\n"
			for entry in entries
				str += entry + "\r\n"
			str += "}\r\n"
		str

SurfacesYaml.to_txt = (data) ->
	charset = new SurfacesYaml.Charset data.charset
	descript = new SurfacesYaml.Descript data.descript
	regions = new SurfacesYaml.Regions data.regions
	surfaces = new SurfacesYaml.Surfaces data.surfaces
	aliases = new SurfacesYaml.Aliases data.aliases
	txt = ''
	txt += charset.to_string()
	txt += descript.to_string()
	txt += regions.to_string()
	txt += surfaces.to_string()
	txt += aliases.to_string(surfaces.get())
	txt

SurfacesYaml.yaml_to_txt = (yaml_str) ->
	try
		data = jsyaml.safeLoad yaml_str.replace /\t/g, '  '
	catch e
		throw e
	SurfacesYaml.to_txt data

if exports?
	exports.Descript = SurfacesYaml.Descript
	exports.Regions = SurfacesYaml.Regions
	exports.Surfaces = SurfacesYaml.Surfaces
	exports.Aliases = SurfacesYaml.Aliases
	exports.to_txt = SurfacesYaml.to_txt
	exports.yaml_to_txt = SurfacesYaml.yaml_to_txt
