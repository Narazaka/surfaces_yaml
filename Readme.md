# surfaces_yaml

*Yet another surfaces.txt - surfaces.yaml*

## Installation

this requires [js-yaml](https://github.com/nodeca/js-yaml)

    npm install -g surfaces_yaml

## Usage

    surfaces_yaml surfaces.yaml surfaces.txt

or use this on your program ...

    var fs = require('fs');
    var SurfacesYaml = require('surfaces_yaml');
    var yaml_str = fs.readFileSync('surfaces.yaml', 'utf8');
    var txt = SurfacesYaml.yaml_to_txt(yaml_str);
    fs.writeFileSync('surfaces.txt', txt, 'utf8');

or use this on the browsers ...

    <script src="js-yaml.min.js"></script>
    <script src="surfaces_yaml.js"></script>
    ...
    var txt = SurfacesYaml.yaml_to_txt(yaml_str);

surfaces\_yaml command currently supports only utf-8 output (because shift\_jis support requires [iconv](https://github.com/bnoordhuis/node-iconv), but sometimes problems will occur when installing it to Windows under some environments).

## surfaces.yaml

surfaces.yaml is a structured replacement of the "surfaces.txt", component of 伺か(Ukagaka) ghost.

surfaces.yaml is YAML but surfaces\_yaml allows tabs.

### Synopsis

examples/surfaces.yaml

this will be converted to examples/surfaces.txt

    charset : UTF-8

    descript :
        # SERIKO/2.0
        version : 1
        maxwidth : 300
        collision-sort : ascend
        animation-sort : ascend

    surfaces :
        # 継承のためidで管理
        素 :
            # isの番号がsurface*に記述される
            # isがある場合のみエントリは記述される(is無しは継承元としてのみ機能)
            is : 0
            # trueのキャラクターにaliasを作る
            characters :
                # sakura.surface.aliasに追加
                sakura : true
            # point.*
            points :
                centerx : 0
                centery : 0
                kinoko :
                    centerx : 0
                    centery : 0
                basepos :
                    x : 0
                    y : 0
            # balloon.*
            balloons :
                sakura :
                    # sakura.balloon.*
                    offsetx : 0
                    offsety : 0
                # balloon.*
                offsetx : 0
                offsety : 0
            # element*
            elements :
                # 継承のためidで管理
                ベース :
                    # isの番号がelement*に記述される
                    # isがある場合のみエントリは記述される(is無しは継承元としてのみ機能)
                    is : 0
                    # element*,type,file,x,y
                    type : overlay
                    file : surface0.png
                    x : 0
                    y : 0
                表情 :
                    is : 1
                    type : overlayfast
                    file : surface1000.png
                    x : 30
                    y : 50
            # collision*
            regions :
                # 継承のためidで管理
                胸 :
                    # isの番号がcollision*に記述される
                    # isがある場合のみエントリは記述される(is無しは継承元としてのみ機能)
                    is : 0
                    # 領域のID
                    name : bust
                    # type=rectならcollision、それ以外ならcollisionexとして出力
                    type : rect
                    # collision*,left,top,right,bottom,ID
                    left : 20
                    top : 110
                    right : 100
                    bottom : 130
                顔 :
                    is : 1
                    name : face
                    type : polygon
                    # collisionex*,ID,polygon,coordinates[0].x,coordinates[0].y,...
                    coordinates :
                        - {x : 30, y : 50}
                        - {x : 80, y : 55}
                        - {x : 80, y : 85}
                        - {x : 30, y : 85}
                肩 :
                    is : 2
                    name : kata
                    type : ellipse
                    # collisionex*,ID,ellipse,top,right,bottom
                    left : 80
                    top : 100
                    right : 90
                    bottom : 110
            # animation*
            animations :
                # 継承のためidで管理
                目パチ :
                    # isの番号がanimation*に記述される
                    # isがある場合のみエントリは記述される(is無しは継承元としてのみ機能)
                    is : 0
                    # animation*.interval
                    interval : random,10
                    # animation*.option
                    option : exclusive
                    # animation*.pattern*
                    patterns :
                        # 配列インデックスがpattern*に記述される
                        -
                            # animation*,pattern*,type,surface,wait,x,y
                            # うち場合によって後半必要でないものは記述しなくてよい
                            type : overlay
                            # surface番号(-1,-2等含む)かsurfacesでの定義id
                            surface : 1001
                            wait : 125
                            x : 40
                            y : 55
                        - {type : overlay, surface : 1002, wait : 125, x : 40, y : 55}
                        - {type : overlay, surface : -1}
                    # animation*.collision*
                    regions :
                        # regionsの定義と同一
                        まぶた :
                            is : 0
                            name : mabuta
                            type : rect
                            left : 40
                            top : 55
                            right : 75
                            bottom : 70
        エロ面 :
            is : 1
            # 継承元id
            base : 素
            elements :
                表情 :
                    # 継承元から変更する属性のみを記述する
                    file : surface1010.png
            animations :
                サンプル1 :
                    is : 1
                    interval : never
                    patterns :
                        # start, stop, insertはanimation_idのみを指定
                        - {type : start, animation_id : 目パチ}
                サンプル2 :
                    is : 2
                    interval : never
                    patterns :
                        # alternativestart, alternativestopはanimation_idsのみを指定
                        - {type : alternativestart, animation_ids : [目パチ,サンプル1]}
        驚き :
            is : 2
            base : 素
            elements :
                表情 :
                    file : surface1020.png
            regions :
                # deleteキーワードで継承元のエントリを無効にする
                胸 : delete
        笑顔1 :
            is : 5
            base : 素
            elements :
                表情 :
                    file : surface1050.png
        笑顔2 :
            is : 50
            # 多重継承可能 先に書いたほうの属性が優先される
            base : [驚き, 素]
            elements :
                表情 :
                    file : surface1500.png

    aliases :
        #sakura.surface.alias
        sakura :
            # 笑顔,[...]
            笑顔 :
                # surface番号かsurfacesでの定義id
                - 笑顔1
                - 笑顔2

    regions :
        # *.cursorと*.tooltipsの定義
        sakura :
            # 領域ID
            bust :
                # sakura.tooltips
                # bust,むねだよ
                tooltip : むねだよ
                # sakura.cursor
                cursor :
                    # mouseup*,bust,system:hand
                    mouseup : system:hand
                    mousedown : system:grip
