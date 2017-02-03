<pad>

    <div class="pad-container" onmousemove={ move } onmouseleave={ leave } onmouseup={ leave }>
        <div class="pad">
            <div class="pad-lever" onmousedown={ down }></div>
        </div>
    </div>



    <script>

        var dragged = undefined;
        var x_size = 0;
        var y_size = 0;

        var baseX = 90;
        var baseY = 90;

        this.entity = opts.entity;
        var self = this;

        this.leave = function(e){
            if(dragged){
                dragged.style.top = "90px";
                dragged.style.left = "90px";
                moveRobot(0, 0);
                dragged = undefined;
            }
        };

        this.down = function(e){
            dragged = e.currentTarget;
            x_size = dragged.offsetParent.offsetLeft + document.getElementById("robots-list").clientWidth + 25;
            y_size = dragged.offsetParent.offsetTop + document.getElementById("menu-bar").clientHeight + 13;
        };

        this.move = function(e){
            if(dragged){
                var posX = e.pageX - x_size;
                var posY = e.pageY - y_size;
                if((posX > 180 || posX < 0) || (posY > 180 || posY < 0)){
                    adjust(posX, posY);
                }else{
                    dragged.style.left = posX + "px";
                    dragged.style.top = posY + "px";
                    moveRobot(parseInt((posX-baseX)/10), parseInt((posY-baseY)/10));
                }
            }
        };

        function adjust(x, y){
            if(x > 180) x = 180;
            if(x < 0) x = 0;
            if(y > 180) y = 180;
            if(y < 0) y = 0;
        }

        function moveRobot(x, y){
            self.entity.executeCommand({command:"dx", value:x*4}, true);
            self.entity.executeCommand({command:"dy", value:y*4}, true);
        }

        this.on('update', function(e){
            self.entity = opts.entity;
        });

    </script>

    <style>

        .pad-container{
            width: 200px;
            height: 200px;

        }

        .pad{
            width:100%;
            height:100%;
            background: lightslategray;
            -webkit-border-radius: 100px;
        }

        .pad-lever{
            position:relative;

            width:20px;
            height:20px;
            -webkit-border-radius: 10px;
            background-color:red;

            top:90px;
            left:90px;
        }

    </style>
</pad>