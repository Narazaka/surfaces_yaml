# surfaces_yaml

*Yet another surfaces.txt - surfaces.yaml*

## Installation

    npm install -g surfaces_yaml

## Usage

    surfaces_yaml surfaces.yaml surfaces.txt

## surfaces.yaml

surfaces.yaml is a structed replacement of the "surfaces.txt", component of 伺か(Ukagaka) ghost.

### Synopsis

    descript :
        version : 1
        maxwidth : 540
        collision-sort : ascend
        animation-sort : descend
    
    # surface.aliasを必ず使用？
    surfaces :
        笑顔1 :
            is : 0
            # これがない場合実際のには書かれない(継承元としてのみ機能)
            characters :
                sakura : true
            # trueのcharにaliasの\s[笑顔1]を作る
            points :
                centerx : 0
                centery : 0
                kinoko :
                    centerx : 0
                    centery : 0
                basepos :
                    x : 0
                    y : 0
            balloons :
                sakura :
                    offsetx : 0
                offsetx : 0
            elements :
                ベース : {is : 1, type : overlay, file : a.png, x : 12, y : 7}
            regions :
                # collision
                胸 :
                    is : 1
                    # 優先順番 これがない場合実際のには書かれない(継承元としてのみ機能)
                    type : rect
                    # rectはexでないものとして出力か
                    top : 10
                    left : 70
                    bottom : 50
                    right : 95
                もも :
                    is : 2
                    # 優先順番
                    type : polygon
                    coordinates :
                        - {x : 12, y : 14}
                        - {x : 22, y : 14}
                        - {x : 22, y : 164}
                かた :
                    is : 3
                    # 優先順番
                    type : ellipse
                    top : 10
                    left : 70
                    bottom : 50
                    right : 95
            animations :
                動き1 :
                    # 継承のち削除とかの識別のためIDを付与する?
                    is : 1
                    # 優先順番
                    interval : sometimes
                動き2 :
                    # 継承のち削除とかの識別のためIDを付与する?
                    is : 2
                    # 優先順番
                    interval : sometimes
                    patterns :
                        -
                            type : overlay
                            surface : 笑顔2
                            # -1, -2 は無効。stop : true, allstop : trueなどで代替
                            # -1, -2含む番号か定義id
                            wait : 1-5
                            x : 10
                            y : 12
                    regions :
                        胸 :
                            is : 1
                            type : rect
                            top : 10
                            left : 70
                            bottom : 50
                            right : 95
                    option : exclusive,(1,2)
        笑顔2 :
            is : 1
            base : 笑顔1
            # 継承元的な
            elements :
                ベース :
                    is : 2
                何か : {is : 1, type : overlay, file : nanika.png, x : 12, y : 7}
                # delete キーワード
            regions :
                胸 : delete
    
    aliases :
        sakura :
            # aliasの仕様上何個もあってよいので
            笑顔 :
                - 笑顔1
                - 笑顔2
    
    regions :
        胸 :
            is : bust
            characters :
                sakura :
                    tooltip : むねだよ
                    cursor :
                        mouseup : system:hand
                        mousedown : system:grip
        もも :
            is : momo
        かた :
            is : kata