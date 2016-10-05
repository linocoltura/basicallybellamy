    $(document).ready(function () {

        document.addEventListener("keydown", doKeyDown);
        document.addEventListener("keyup", doKeyUp);
        var frames = setInterval(move, 16);
        var drones = setInterval(spawndrones, 500);

    })

    var goingleft = false;
    var goingright = false;
    var attacking = false;
    var attackenabled = true;
    var plectrumspeed = 5;
    var isflipped;
    var bellamy = document.getElementById('bellamy')
    var bellamyoffset = 0;
    var bellamyspeed = 5;
    var reloadmeterpercentage = 90;
    var dronespeed = 3;
    var dronespawnenabled = true;
    var maxdronespeed = 5;
    var mindronespeed = 10;


    var keypress = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32
    }

    function move() {
        if (goingleft && bellamyoffset >= 0) {
            bellamyoffset -= bellamyspeed;
            $('#bellamy').css('left', bellamyoffset);
        } else if (goingright && bellamyoffset <= 1200) {
            bellamyoffset += bellamyspeed;
            $('#bellamy').css('left', bellamyoffset);
        }



        $('.plectrum').each(function (i, obj) {
            var amount = $(this).css('bottom').replace(/[^-\d\.]/g, '')
            $(this).css('bottom', parseInt($(this).css('bottom').replace(/[^-\d\.]/g, '')) + plectrumspeed + 'px')
            if (parseInt($(this).css('bottom').replace(/[^-\d\.]/g, '')) > 800) {
                $(this).remove();
            }
        });

        if (attacking) {
            $('#bellamy').attr("src", 'images/basicallybellamy2.png');
        }

        $('.drone').each(function (i, obj) {
            //            var amount = $(this).css('left').replace(/[^-\d\.]/g, '')
            //            $(this).css('left', parseInt($(this).css('left').replace(/[^-\d\.]/g, '')) + dronespeed + 'px')


            if (parseInt($(this).css('left').replace(/[^-\d\.]/g, '')) > 1500) {
                $(this).remove();
            }

        });
    }

    function spawndrones() {
        var drone = $('<img />', {
            class: 'drone',
            src: 'images/drone.png',
        });
        var chance = Math.random() < 0.2 ? true : false;
        console.log(chance);
        if (chance && dronespawnenabled) {
            $("#canvas").append(drone);
            var speed = Math.floor(Math.random() * (maxdronespeed - mindronespeed + 1) + mindronespeed);
            console.log(speed);
            $(drone).css('animation-duration', speed + 's')
            dronespawnenabled = false;
            window.setTimeout(function () {
                dronespawnenabled = true;
            }, 1000)
        }
    }

    function doKeyDown(e) {
        switch (e.keyCode) {
        case keypress.UP:
            attack();
            attacking = true;
            break;

        case keypress.DOWN:
            //
            break;

        case keypress.LEFT:
            goingleft = true;
            goingright = false;
            $('#bellamy').css('transform', 'scaleX(-1)');
            isflipped = true;
            break;

        case keypress.RIGHT:
            goingright = true;
            goingleft = false;
            $('#bellamy').css('transform', 'scaleX(1)')
            isflipped = false;

            break;

        case keypress.SPACE:
            morgan();
            break;

        }
    }

    function doKeyUp(e) {
        switch (e.keyCode) {

        case keypress.UP:
            $('#bellamy').attr("src", 'images/basicbellamy.png');
            attacking = false;
            break;

        case keypress.LEFT:
            goingleft = false;
            break;

        case keypress.RIGHT:
            goingright = false;
            break;

        }
    }


    function attack() {
        if (attackenabled) {
            var plectrum = $('<img />', {
                class: 'plectrum',
                src: 'images/plectrum.png',
            });
            if (isflipped) {
                var plecpos = bellamyoffset + 50;
            } else {
                var plecpos = bellamyoffset + 130;
            }
            $(plectrum).css('left', plecpos);

            $("#canvas").append(plectrum);
            attackenabled = false;
            window.setTimeout(function () {
                attackenabled = true;
            }, 800)

            $('#reloadanimationbar').addClass("reloadanimation")
            setTimeout(function () {
                $('#reloadanimationbar').removeClass("reloadanimation")
            }, 800);

        }

    }

    function morgan() {

    }