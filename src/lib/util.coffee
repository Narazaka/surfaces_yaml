clone = (src) ->
	if not src? or typeof src isnt 'object'
		return src
	ret = new src.constructor()
	for key of src
		ret[key] = clone src[key]
	ret

extend = (child, parent) ->
	if (child instanceof Object) and (not (child instanceof Array)) and (parent?) and (parent instanceof Object) and (not (parent instanceof Array))
		for key of child
			if parent[key]?
				extend child[key], parent[key]
		for key of parent
			unless child[key]?
				child[key] = clone parent[key]

class entry
	constructor : (@name) ->
		@id = 0
		@entries = []
	add : (args...) ->
		@entries.push @name + @id + ',' + (args.join ',')
		@id++
	to_string : ->
		str = ''
		for entry in @entries
			str += entry + "\r\n"
		str

if exports?
	exports.clone = clone
	exports.extend = extend
	exports.entry = entry
