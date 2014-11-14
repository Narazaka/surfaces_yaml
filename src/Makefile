all:
	coffee -o ../bin -c bin/surfaces_yaml.coffee
	cat lib/util.coffee lib/surfaces_yaml.coffee | coffee -cb --stdio > ../lib/surfaces_yaml.js 
	node -e "fs=require('fs');c='#!/usr/bin/env node\n'+fs.readFileSync('../bin/surfaces_yaml.js');fs.writeFileSync('../bin/surfaces_yaml.js', c)"
