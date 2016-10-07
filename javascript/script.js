    $(document).ready(function () {

        document.getElementById('vol').addEventListener("click", function () {
            vo()
        }, true);

        function vo() {
            if (!voltoggle) {
                theme.volume = 0;
                intro.volume = 0;
                voltoggle = true;
                $('#vol').css('opacity', '0.6')
            } else {
                theme.volume = 0.8;
                intro.volume = 0.8;
                voltoggle = false;
                $('#vol').css('opacity', '1')
            }
        }

        intro = document.createElement('audio');
        intro.setAttribute('src', 'sound/intro.wav');
        $.get();
        intro.addEventListener("load", function () {
            intro.play();
        }, true);

        intro.play();

        theme = document.createElement('audio');
        theme.setAttribute('src', 'sound/theme.wav');
        $.get();
        theme.addEventListener("load", function () {
            theme.play();
        }, true);

        intro.addEventListener('ended', function () {
            this.currentTime = 0;
            theme.play();
        }, false);

        theme.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);

        theme.volume = 0.8;
        intro.volume = 0.8;

        //        document.addEventListener("keydown", doKeyDown);
        //        document.addEventListener("keyup", doKeyUp);
        //        var frames = setInterval(move, 16);
        //        var drones = setInterval(spawndrones, 500);
        //        var dronesright = setInterval(spawndronesright, 500);
        //        var bombs = setInterval(spawnbombs, 200);
        //        var bombsright = setInterval(spawnbombsright, 200);
        //        var spawndelays = setInterval(delay, 15000)



        var ar = new Array(33, 34, 35, 36, 37, 38, 39, 40);

        $(document).keydown(function (e) {
            var key = e.which;
            //console.log(key);
            //if(key==35 || key == 36 || key == 37 || key == 39)
            if ($.inArray(key, ar) > -1) {
                e.preventDefault();
                return false;
            }
            return true;
        });
    })

    var theme;
    var intro;

    var frames;
    var drones;
    var dronesright;
    var bombs;
    var bombsright;
    var spawndelays;


    var voltoggle = false;
    var goingleft = false;
    var goingright = false;
    var attacking = false;
    var attackenabled = true;
    var plectrumspeed = 8;
    var isflipped;
    var bellamy = document.getElementById('bellamy')
    var bellamyoffset = 0;
    var bellamyspeed = 6;
    var reloadmeterpercentage = 90;
    var dronespawnenabled = true;
    var dronespawnenabled2 = true;
    var maxdronespeed = 7;
    var mindronespeed = 15;
    var dronespawnchance = 0.1;
    var bombspawnchance = 0.03;
    var attackspeed = 1450;
    var score = 0;
    var highscore = localStorage['myKey'] || '0';
    var hp = 3;
    var invincible = false;
    var morganmeter = 0;
    var isplaying = false;

    var keypress = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32
    }


    function stop() {

        theme.pause();
        intro.play();
        intro.currentTime = 0;
        theme.currentTime = 0;

        clearInterval(frames);
        clearInterval(drones);
        clearInterval(dronesright);
        clearInterval(bombs);
        clearInterval(bombsright);
        clearInterval(spawndelays);
        isplaying = false;
        document.removeEventListener("keydown", doKeyDown);
        document.removeEventListener("keyup", doKeyUp);

        if (score > parseInt(highscore)) {
            localStorage['myKey'] = score;
            highscore = score;
        }
        $('#overlay').fadeIn();
        $('#info2').fadeIn();
        $('#scoreafter').html('score ' + score);
        $('#highscoreafter').html('local highscore ' + highscore);
        $('#killed').html('KILLED BY DRONES');

        $('.d').each(function (i, obj) {
                explode($(this));
            }

        );
        $('.plectrum').each(function (i, obj) {

            $(this).remove();

        });


        $('#hp').html('<img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt="">')
        morganmeter = 0;
        $('#morganbar').css('height', morganmeter + '%')

    }

    function play() {
        if (!isplaying) {
            isplaying = true;
            $('#hp').html('<img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt="">');
            frames = setInterval(move, 16);
            drones = setInterval(spawndrones, 500);
            dronesright = setInterval(spawndronesright, 500);
            bombs = setInterval(spawnbombs, 200);
            bombsright = setInterval(spawnbombsright, 200);
            spawndelays = setInterval(delay, 15000);

            document.addEventListener("keydown", doKeyDown);
            document.addEventListener("keyup", doKeyUp);

            window.setTimeout(function () {
                maxdronespeed = 7;
                dronespawnchance = 0.2;
                bombspawnchance = 0.03;
            }, 10000)

            window.setTimeout(function () {
                maxdronespeed = 6;
                dronespawnchance = 0.25;
                bombspawnchance = 0.035;
            }, 20000)

            window.setTimeout(function () {
                maxdronespeed = 5;
                dronespawnchance = 0.35;
                bombspawnchance = 0.04;
            }, 40000)

            window.setTimeout(function () {
                maxdronespeed = 4;
                dronespawnchance = 0.5;
                bombspawnchance = 0.05;
            }, 60000)

            $('#overlay').fadeOut();
            $('#info2').fadeOut();
            score = 0;
            hp = 3;
        }

    }

    function delay() {
        dronespawnenabled = false;
        dronespawnenabled2 = false;

        window.setTimeout(function () {
            dronespawnenabled = true;
            dronespawnenabled2 = true;
        }, 5000)
    }

    function move() {
        if (goingleft && bellamyoffset >= 0) {
            bellamyoffset -= bellamyspeed;
            $('#bellamy').css('left', bellamyoffset);
        } else if (goingright && bellamyoffset <= 1240) {
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

            if (parseInt($(this).css('left').replace(/[^-\d\.]/g, '')) > 1400) {
                $(this).remove();
            }

            if ($(".plectrum")[0]) {
                if (collision($(this), $('.plectrum'))) {
                    explode($(this));
                    if (!$(this).hasClass('dead')) {
                        score++;
                        $('#scorenumber').html(score);
                        $(this).addClass('dead');
                        if (morganmeter < 120) {
                            morganmeter += 10;
                            $('#morganbar').css('height', morganmeter + '%')
                        }
                        if (morganmeter >= 100) {
                            $('#infomorgan').css('animation-name', 'pulsate');
                        }
                    }
                }
            }

        });

        $('.droneright').each(function (i, obj) {

            if (parseInt($(this).css('left').replace(/[^-\d\.]/g, '')) < -120) {
                $(this).remove();
            }

            if ($(".plectrum")[0]) {
                if (collision($(this), $('.plectrum'))) {
                    explode($(this));
                    if (!$(this).hasClass('dead')) {
                        score++;
                        $('#scorenumber').html(score);
                        $(this).addClass('dead');
                        if (morganmeter < 120) {
                            morganmeter += 10;
                            $('#morganbar').css('height', morganmeter + '%')
                        }
                        if (morganmeter >= 100) {
                            $('#infomorgan').css('animation-name', 'pulsate');
                        }
                    }
                }
            }

            console.log($("img").length)

        });

        $('.bomb').each(function (i, obj) {
            if (parseInt($(this).css('top').replace(/[^-\d\.]/g, '')) >= 720) {
                explode($(this));
            }
            if (collision($(this), $('#bellamy'))) {

                explode($(this));

                if (!$(this).hasClass('dead') && !invincible) {
                    $('#bellamy').css('height', '270px')
                    $(this).addClass('dead')
                    invincible = true;
                    window.setTimeout(function () {
                        $('#bellamy').css('height', 'auto');
                        $('#bellamy').css('opacity', '0.3');
                    }, 80)

                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '1')
                    }, 160)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '0.3')
                    }, 240)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '1')
                    }, 320)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '0.3')
                    }, 400)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '1')
                    }, 480)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '0.3')
                    }, 640)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '1')
                    }, 720)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '0.3')
                    }, 800)
                    window.setTimeout(function () {
                        $('#bellamy').css('opacity', '1')
                        invincible = false;
                    }, 880)
                    if (hp > 1) {
                        hp--;
                        switch (hp) {
                        case 0:

                            $('#hp').html('')

                            break;

                        case 1:

                            $('#hp').html('<img class="hp" src="images/hp.png" alt="">')

                            break;

                        case 2:

                            $('#hp').html('<img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt="">')

                            break;

                        case 3:

                            $('#hp').html('<img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt=""><img class="hp" src="images/hp.png" alt="">')


                            break;

                        }
                    } else {
                        window.setTimeout(function () {
                            $('#hp').html('')
                            stop();
                        }, 1000)
                    }
                }
            }

        })


        //
    }

    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    function spawndrones() {
        var drone = $('<img />', {
            class: 'drone d',
            src: 'images/drone.png',
        });
        var height = Math.floor(Math.random() * (50 - 0 + 1) + 0);
        var chance = Math.random() < dronespawnchance ? true : false;
        if (chance && dronespawnenabled) {
            var speed = Math.floor(Math.random() * (maxdronespeed - mindronespeed + 1) + mindronespeed);
            $(drone).css('animation-duration', speed + 's');
            $(drone).css('top', height + 'px')
            dronespawnenabled = false;
            $("#canvas").append(drone);
            window.setTimeout(function () {
                dronespawnenabled = true;
            }, 1000)
        }
    }

    function spawndronesright() {
        var drone = $('<img />', {
            class: 'droneright d',
            src: 'images/droneright.png',
        });
        var height = Math.floor(Math.random() * (50 - 0 + 1) + 0);
        var chance = Math.random() < dronespawnchance ? true : false;
        if (chance && dronespawnenabled2) {
            $("#canvas").append(drone);
            var speed = Math.floor(Math.random() * (maxdronespeed - mindronespeed + 1) + mindronespeed);
            $(drone).css('animation-duration', speed + 's');
            $(drone).css('top', height + 'px')
            dronespawnenabled2 = false;
            window.setTimeout(function () {
                dronespawnenabled2 = true;
            }, 1000)
        }
    }

    function explode(ob) {
        $(ob).css('transform', 'rotate(0)');
        $(ob).css('width', '80px');
        $(ob).css('height', '80px');
        $(ob).attr("src", 'images/0.gif');
        window.setTimeout(function () {
            $(ob).css('animation-play-state', 'paused');
        }, 270)
        window.setTimeout(function () {
            $(ob).attr("src", 'images/1.gif');
        }, 70)
        window.setTimeout(function () {
            $(ob).attr("src", 'images/2.gif');
        }, 140)
        window.setTimeout(function () {
            $(ob).attr("src", 'images/3.gif');
        }, 210)
        window.setTimeout(function () {
            $(ob).remove();
        }, 270)
    }

    function spawnbombs() {
        $('.drone').each(function (i, obj) {
            var bomb = $('<img />', {
                class: 'bomb d',
                src: 'images/bomb.png',
            });
            var chance2 = Math.random() < bombspawnchance ? true : false;
            $(bomb).css('left', $(this).css('left'));
            $(bomb).css('position', 'absolute');
            $(bomb).css('top', '35px');
            $(bomb).css('width', '20px');
            $(bomb).css('animation-name', 'bombdrop');
            $(bomb).css('animation-iteration-count', '1');
            $(bomb).css('animation-timing-function', 'ease-in');
            $(bomb).css('animation-duration', '2s');
            $(bomb).css('animation-fill-mode', 'forwards');
            if (chance2) {
                $("#canvas").append(bomb);
            }
        })
    }

    function spawnbombsright() {
        $('.droneright').each(function (i, obj) {
            var bomb = $('<img />', {
                class: 'bomb d',
                src: 'images/bomb.png',
            });
            var chance2 = Math.random() < bombspawnchance ? true : false;
            $(bomb).css('left', $(this).css('left'));
            $(bomb).css('position', 'absolute');
            $(bomb).css('top', '35px');
            $(bomb).css('width', '20px');
            $(bomb).css('animation-name', 'bombdropright');
            $(bomb).css('animation-iteration-count', '1');
            $(bomb).css('animation-timing-function', 'ease-in');
            $(bomb).css('animation-duration', '2s');
            $(bomb).css('animation-fill-mode', 'forwards');
            if (chance2) {
                $("#canvas").append(bomb);
            }
        })
    }


    function doKeyDown(e) {
        switch (e.keyCode) {
        case keypress.UP:
            attack();
            attacking = true;
            break;

        case keypress.DOWN:
            if (morganmeter >= 100) {
                morgan();
                morganmeter = 0;
                $('#morganbar').css('height', morganmeter + '%');
            }
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
            //
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
                var plecpos = bellamyoffset + 10;
                $(plectrum).css('animation-name', "spin, plectrumleft");
            } else {
                var plecpos = bellamyoffset + 130;
                $(plectrum).css('animation-name', "spin, plectrumright");
            }
            $(plectrum).css('left', plecpos);

            $("#canvas").append(plectrum);
            attackenabled = false;
            window.setTimeout(function () {
                attackenabled = true;
            }, attackspeed)

            $('#reloadanimationbar').addClass("reloadanimation")
            setTimeout(function () {
                $('#reloadanimationbar').removeClass("reloadanimation")
            }, attackspeed);

        }

    }

    function morgan() {
        dronespawnenabled = false;
        dronespawnenabled2 = false;
        score += 5;

        window.setTimeout(function () {
            $('#spl').attr("src", 'images/0.gif');

            window.setTimeout(function () {
                $('#spl').attr("src", 'images/1.gif');
            }, 150)
            window.setTimeout(function () {
                $('#spl').attr("src", 'images/2.gif');
            }, 300)
            window.setTimeout(function () {
                $('#spl').attr("src", 'images/3.gif');
            }, 500)
            window.setTimeout(function () {
                $('#spl').attr("src", 'images/blank.png');
            }, 800)
        }, 500)


        window.setTimeout(function () {
            dronespawnenabled = true;
            dronespawnenabled2 = true;
        }, 3000)

        window.setTimeout(function () {
            $('.d').each(function (i, obj) {
                    explode($(this));
                }

            );
        }, 700)

        $('#morgan').css('bottom', '25px');
        $('#morgan').css('left', '250px')
        window.setTimeout(function () {
            $('#morgan').css('bottom', '-90px');
            $('#morgan').css('left', '210px');
            $('#infomorgan').css('animation-name', '');
        }, 2000)
    }