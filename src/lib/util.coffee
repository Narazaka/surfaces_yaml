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

if exports?
	exports.clone = clone
	exports.extend = extend
