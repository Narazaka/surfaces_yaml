all:
	coffee -o ../bin -c bin/surfaces_yaml.coffee
	coffee -o ../lib -cbj surfaces_yaml.js lib/util.coffee lib/surfaces_yaml.coffee
	perl -i".old" -pe "$$.==1&&s@^@#!/usr/bin/env node\n@" ../bin/surfaces_yaml.js
	perl -e "unlink '../bin/surfaces_yaml.js.old'"
