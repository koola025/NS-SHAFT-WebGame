var leftWall;
var rightWall;
var ceiling;
var a;
var d;
var playerChoose1 = 1;
var playerChoose2 = 2;
var groundVelocity = 0;
var groundVelocity2 = 0;
var dead = 0;
var dead2 = 0;

var playState2 = { 
    preload: function() {}, 
    create: function() {
        game.global.score = 0;
        this.cursor = game.input.keyboard.createCursorKeys();
        game.stage.backgroundColor = '#cdebe3'; 
        game.physics.startSystem(Phaser.Physics.ARCADE); 
        game.renderer.renderSession.roundPixels = true;
        a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.addSound();
        this.newPlatform();
        this.initPlatform();
        game.time.events.loop(600, this.addPlatform, this);
        game.time.events.loop(2700, this.addScore, this);
        this.createPlayer();
        this.createPlayer2();
        this.createWall();
        this.addEmitter();
        
        var pauseLabel = game.add.text(510, 270,'a',{ font: '85px Arial', fill: '#1fb18a' }); 
        pauseLabel.inputEnabled = true;
        pauseLabel.events.onInputUp.add(this.pauseUp, this);

        var abortLabel = game.add.text(510, 330,'a',{ font: '85px Arial', fill: '#1fb18a' }); 
        abortLabel.inputEnabled = true;
        abortLabel.events.onInputUp.add(this.abortUp, this);
        
        game.add.sprite(0, 0, 'bgBlack');
        game.add.sprite(22, 18, 'score2');
        this.bar = game.add.sprite(342, 34, 'bar');
        this.bar2 = game.add.sprite(22, 34, 'bar');

        this.bgm.play();
        this.bgm.loop = true;
        //this.bgm.fadeIn(0.1);
        superman = 0;

    },
    update: function() {
        //this.updatePlatforms();
        //this.createPlatform();
        //this.checkTouchCeiling(this.player);
        //game.physics.arcade.collide(this.player, platforms, this.effect);
        game.physics.arcade.collide([this.player, this.player2], [leftWall, rightWall]);
        game.physics.arcade.collide([this.player, this.player2], ceiling, this.touchCeiling);
        game.physics.arcade.collide([this.player, this.player2], this.normals, this.effect);
        game.physics.arcade.collide([this.player, this.player2], this.nails, this.effect);
        game.physics.arcade.collide([this.player, this.player2], this.conveyorLefts, this.effect);
        game.physics.arcade.collide([this.player, this.player2], this.conveyorRights, this.effect);
        game.physics.arcade.collide([this.player, this.player2], this.trampolines, this.effect);
        game.physics.arcade.collide([this.player, this.player2], this.fakes, this.effect);
        game.physics.arcade.collide([this.player, this.player2], this.goldens, this.effect);
        this.movePlayer();
        this.movePlayer2();
        //this.setPlayerAnimate(this.player2);
        
        if (this.player.life >= 0)
        cropRect = new Phaser.Rectangle(0, 0, this.player.life * 8, this.bar.height);
        else cropRect = new Phaser.Rectangle(0, 0, 0, this.bar.height);

        if (this.player2.life >= 0)
        cropRect2 = new Phaser.Rectangle(0, 0, this.player2.life * 8, this.bar2.height);
        else cropRect2 = new Phaser.Rectangle(0, 0, 0, this.bar2.height);


        
        this.bar.crop(cropRect);
        this.bar2.crop(cropRect2);


        if (this.player.y > 420) {
            if(this.player.alive)
            this.dieSound.play();
            this.player.kill();
            this.emitterEffect(this.player);
            this.player.life = 0;
        }
        if (this.player2.y > 420) {
            if(this.player2.alive)
            this.dieSound.play();
            this.player2.kill();
            this.emitterEffect(this.player2);
            this.player2.life = 0;
        }
        if (this.player.life <= 0) this.player.kill();
        if (this.player2.life <= 0) this.player2.kill();
        if (this.player.life <= 0 && this.player2.life <= 0) {
            this.bgm.pause();
            game.time.events.add(1500, function() {game.state.start('gameover');}); 
        }
        
        if (superman) game.camera.flash(0xfff58a, 150);
       
    },
    addEmitter: function() {
        this.emitter = game.add.emitter(0, 0, 15); 
        this.emitter.makeParticles('pixel'); 
        this.emitter.setYSpeed(-150, 150); 
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setScale(2, 0, 2, 0, 800);
        this.emitter.gravity = 0;
    },
    emitterEffect: function(player){
        this.emitter.x = player.x; 
        this.emitter.y = player.y; 
        this.emitter.start(true, 1500, null, 15); 
    },
    pauseUp: function() {
        if (!game.paused){
            game.paused = true;
        }
        else {
            game.paused = false;
            
        }
    },
    abortUp: function() {
        game.state.start('menu');
        this.bgm.pause();
    },
    addSound: function() {
        this.bgm = game.add.audio('bgm');
        this.trampolineSound = game.add.audio('trampolineSound');
        this.conveyorSound = game.add.audio('conveyorSound');
        this.fakeSound = game.add.audio('fakeSound');
        this.injuredSound = game.add.audio('injuredSound');
        this.normalSound = game.add.audio('normalSound');
        this.dieSound = game.add.audio('dieSound');
        
    },
    newPlatform: function() {
        this.normals = game.add.group(); 
        this.normals.enableBody = true;
        this.normals.createMultiple(10, 'normal');
        this.nails = game.add.group(); 
        this.nails.enableBody = true;
        this.nails.createMultiple(10, 'nails');
        this.conveyorLefts = game.add.group(); 
        this.conveyorLefts.enableBody = true;
        this.conveyorLefts.createMultiple(10, 'conveyorLeft');
        this.conveyorRights = game.add.group(); 
        this.conveyorRights.enableBody = true;
        this.conveyorRights.createMultiple(10, 'conveyorRight');
        this.trampolines = game.add.group(); 
        this.trampolines.enableBody = true;
        this.trampolines.createMultiple(10, 'trampoline');
        this.fakes = game.add.group(); 
        this.fakes.enableBody = true;
        this.fakes.createMultiple(10, 'fake');
        this.goldens = game.add.group(); 
        this.goldens.enableBody = true;
        this.goldens.createMultiple(10, 'golden');
        
        
    },
    initPlatform: function() {
        var i;
        for(i = 0; i < 6; i++) {
            var x = Math.random()*(400 - 96 - 40) + 44;
            var y = 460 - 70 * (5-i);
            var rand = Math.random() * 100;
            var platform;
            if (i == 4) {
                platform = this.normals.getFirstDead();
                x = 235 - 48;
                //platform.anchor.setTo(0.5, 0); 
            }
            else if(rand < 20) {
                platform = this.normals.getFirstDead();
            } else if (rand < 40) {
                platform = this.nails.getFirstDead();
                game.physics.arcade.enable(platform);
                platform.body.setSize(96, 15, 0, 15);
            } else if (rand < 50) {
                platform = this.conveyorLefts.getFirstDead();
                platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
                platform.play('scroll');
            } else if (rand < 60) {
                platform = this.conveyorRights.getFirstDead();
                platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
                platform.play('scroll');
            } else if (rand < 80) {
                platform = this.trampolines.getFirstDead();
                platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
                platform.frame = 3;
                game.physics.arcade.enable(platform);
                platform.body.setSize(96,16, 0,6);
                
            } else {
                platform = this.fakes.getFirstDead();
                platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
                game.physics.arcade.enable(platform);
                platform.body.setSize(96,16,0,10);
            }

            if (!platform) { return;}
            platform.reset(x, y);
            
            platform.checkWorldBounds = true; 
            platform.outOfBoundsKill = true;

            game.physics.arcade.enable(platform);
            platform.body.velocity.y = -100;
            platform.body.immovable = true;
        
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
        }
    },
    addPlatform: function() {
        var x = Math.random()*(388-97) + 34;
        var y = 420;
        var rand = Math.random() * 100;
        var platform;
        console.log("x = " + x);
        if(rand < 20) {
            platform = this.normals.getFirstDead();
        } else if (rand < 23) {
            platform = this.goldens.getFirstDead();
            platform.animations.add('shine', [0, 1, 2], 16, true);
            platform.play('shine');
            //platform.frame = 3;
            game.physics.arcade.enable(platform);
            platform.body.setSize(97,16, 0,17);
        } else if (rand < 40) {
            platform = this.nails.getFirstDead();
            game.physics.arcade.enable(platform);
            platform.body.setSize(96, 15, 0, 15);
        } else if (rand < 50) {
            platform = this.conveyorLefts.getFirstDead();
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.play('scroll');
        } else if (rand < 60) {
            platform = this.conveyorRights.getFirstDead();
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.play('scroll');
        } else if (rand < 80) {
            platform = this.trampolines.getFirstDead();
            platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
            platform.frame = 3;
            game.physics.arcade.enable(platform);
            platform.body.setSize(96,16, 0,6);
            
        } else {
            platform = this.fakes.getFirstDead();
            platform.body.checkCollision.up = true;
            platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
            game.physics.arcade.enable(platform);
            platform.body.setSize(96,16,0,10);
        }

        if (!platform) { return;}
        platform.reset(x, y);
        
        platform.checkWorldBounds = true; 
        platform.outOfBoundsKill = true;

        game.physics.arcade.enable(platform);
        platform.body.velocity.y = -100;
        platform.body.immovable = true;
    
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
    },
    addScore: function() {
        game.global.score++;
        var show;
        if (game.global.score < 10) show = "00";
        else if (game.global.score < 100) show = "0";
        else show = "";
        text = game.add.bitmapText(200, 54.5, 'scoreFont', show + game.global.score, 32);
        text.angle += 180;
        text.scale.setTo(0.94,0.94);
        text.anchor.setTo(1, 1);
        
        
    },
    createPlayer: function() {
        if (playerChoose1 == 2) this.player = game.add.sprite(32,32,'player2');
        else if (playerChoose1 == 3) this.player = game.add.sprite(32,32,'player3');
        else if (playerChoose1 == 4) this.player = game.add.sprite(32,32,'player4');
        else this.player = game.add.sprite(32,32,'player');
        
        this.player.anchor.setTo(0.5, 0.5);
        this.player.y = 360;
        this.player.x = 250;
        //this.player.scale.setTo(0.2, 0.2);
        game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);
        this.player.enableBody = true; 
        this.player.body.gravity.y = 1100;
        this.player.unbeatableTime = 0;
        this.player.touchOn = undefined;
        //this.player.animations.add('walk', [8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15], 4, true);
        this.player.life = 12;
        //this.player.play('walk');
        //this.player.body.setSize(132,162,71,39);
        this.player.animations.add('left', [0, 1, 2, 3], 24);
        this.player.animations.add('left_injured', [4, 5, 6, 7], 24);
        this.player.animations.add('right', [9, 10, 11, 12], 24);
        this.player.animations.add('right_injured', [13, 14, 15, 16], 24);
        this.player.animations.add('flyLeft', [18, 19, 20, 21], 24);
        this.player.animations.add('left_fly_injured', [22, 23, 24, 25], 24);
        this.player.animations.add('flyRight', [27, 28, 29, 30], 24);
        this.player.animations.add('right_fly_injured', [31, 32, 33, 34], 24);
        this.player.animations.add('fly', [36, 37, 38, 39], 24);
        this.player.animations.add('fly_injured', [40, 41, 42, 43], 24);
        this.player.animations.add('idle', [8], 1, false);
        this.player.animations.add('idle_injured', [8, 17], 24, true);
    },
    createPlayer2: function() {
        if (playerChoose2 == 1) this.player2 = game.add.sprite(32,32,'player');
        else if (playerChoose2 == 3) this.player2 = game.add.sprite(32,32,'player3');
        else if (playerChoose2 == 4) this.player2 = game.add.sprite(32,32,'player4');
        else this.player2 = game.add.sprite(32,32,'player2');
        this.player2.anchor.setTo(0.5, 0.5);
        this.player2.y = 360;
        this.player2.x = 220;
        //this.player2.scale.setTo(0.2, 0.2);
        game.physics.arcade.enable(this.player2, Phaser.Physics.ARCADE);
        this.player2.enableBody = true; 
        this.player2.body.gravity.y = 1100;
        this.player2.unbeatableTime = 0;
        this.player2.touchOn = undefined;
        //this.player2.animations.add('walk', [8,9,10,11,12,13,14,15,8,9,10,11,12,13,14,15], 4, true);
        this.player2.life = 12;
        this.player2.animations.add('left', [0, 1, 2, 3], 24);
        this.player2.animations.add('left_injured', [4, 5, 6, 7], 24);
        this.player2.animations.add('right', [9, 10, 11, 12], 24);
        this.player2.animations.add('right_injured', [13, 14, 15, 16], 24);
        this.player2.animations.add('flyLeft', [18, 19, 20, 21], 24);
        this.player2.animations.add('left_fly_injured', [22, 23, 24, 25], 24);
        this.player2.animations.add('flyRight', [27, 28, 29, 30], 24);
        this.player2.animations.add('right_fly_injured', [31, 32, 33, 34], 24);
        this.player2.animations.add('fly', [36, 37, 38, 39], 24);
        this.player2.animations.add('fly_injured', [40, 41, 42, 43], 24);
        this.player2.animations.add('idle', [8], 1, false);
        this.player2.animations.add('idle_injured', [8, 17], 24, true);
        //this.player2.play('walk');
        //this.player2.body.setSize(132,162,71,39);
    },
    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200 + groundVelocity;
            // if (this.player.scale.x == -0.2)
            // this.player.scale.x *= -1;
            this.player.animations.play('left');
            
        }   
        else if(this.cursor.right.isDown) {
            this.player.body.velocity.x = 200 + groundVelocity;
            // if (this.player.scale.x == 0.2)
            // this.player.scale.x *= -1;
            this.player.animations.play('right');
        }  
        else {
            this.player.body.velocity.x = 0 + groundVelocity;
            if(this.player.body.onFloor() || this.player.body.touching.down){
                this.player.animations.play('idle');
            }else{
                this.player.animations.play('fly');
            }
        }
            
        if (!this.player.body.touching.down) {
            groundVelocity = 0;
            this.player.touchOn = undefined;
        }
    },
    movePlayer2: function() {
        if (a.isDown) {
            this.player2.body.velocity.x = -200 + groundVelocity2;
            /*if (this.player2.scale.x == -1)
            this.player2.scale.x *= -1;*/
            this.player2.animations.play('left');
        }   
        else if(d.isDown) {
            this.player2.body.velocity.x = 200 + groundVelocity2;
            /*if (this.player2.scale.x == 1)
            this.player2.scale.x *= -1;*/
            this.player2.animations.play('right');
        }  
        else {
            this.player2.body.velocity.x = 0 + groundVelocity2;
            if(this.player2.body.onFloor() || this.player2.body.touching.down){
                this.player2.animations.play('idle');
            }else{
                this.player2.animations.play('fly');
            }
        }
            
        if (!this.player2.body.touching.down) {
            groundVelocity2 = 0;
            this.player2.touchOn = undefined;
        }
    },
    createWall: function() {
        ceiling = game.add.sprite(25, 64, 'ceiling');
        game.physics.arcade.enable(ceiling, Phaser.Physics.ARCADE);
        // ceiling.enableBody = true; 
        ceiling.body.immovable = true;

        leftWall = game.add.sprite(24, 64, 'wall');
        game.physics.arcade.enable(leftWall, Phaser.Physics.ARCADE);
        // leftWall.enableBody = true; 
        leftWall.body.immovable = true;

        rightWall = game.add.sprite(423, 64, 'wall');
        game.physics.arcade.enable(rightWall, Phaser.Physics.ARCADE);
        // rightWall.enableBody = true; 
        rightWall.body.immovable = true;

        
        
    },
    effect: function(player, platform) {
        if(!player.body.touching.down)return;
        if(platform.key == 'nails') {
            playState2.nailsEffect(player, platform);
        }else{
            
        }
        if(platform.key == 'conveyorRight') {
            playState2.conveyorRightEffect(player, platform);
        }
        if(platform.key == 'conveyorLeft') {
            playState2.conveyorLeftEffect(player, platform);
        }
        if(platform.key == 'trampoline') {
            playState2.trampolineEffect(player, platform);
        }
        if(platform.key == 'normal') {
            playState2.basicEffect(player, platform);
        }
        if(platform.key == 'fake') {
            playState2.fakeEffect(player, platform);
        }
        if(platform.key == 'golden') {
            playState2.goldenEffect(player, platform);
        }
    },
    conveyorRightEffect: function(player, platform) {
        groundVelocity = 100;
        if (player.touchOn !== platform) { 
            this.conveyorSound.play();
            player.touchOn = platform;
            if (player.life < 12) player.life++;
        }
    },
    conveyorLeftEffect: function(player, platform) {
        groundVelocity = -100;
        
        if (player.touchOn !== platform) { 
            this.conveyorSound.play();
            player.touchOn = platform;
            if (player.life < 12) player.life++;
        }
    },
    trampolineEffect: function(player, platform) {
        platform.animations.play('jump');
        player.body.velocity.y = -350;
        this.trampolineSound.play();
        if (player.life < 12) player.life++;
    },
    nailsEffect: function(player, platform) {
        if (player.touchOn !== platform && !superman) {
            player.life -= 3;
            player.touchOn = platform;
            game.camera.flash(0xff0000, 100);
            this.injuredSound.play();
        }else if (player.touchOn !== platform && superman) {
            this.normalSound.play();
            player.touchOn = platform;
        }
    },
    basicEffect: function(player, platform) {
        if (player.touchOn !== platform) {
            player.touchOn = platform;
            this.normalSound.play();
            if (player.life < 12) player.life++;
        }
    },
    fakeEffect: function(player, platform) {
        if(player.touchOn !== platform) {
            platform.animations.play('turn');
            setTimeout(function() {
                platform.body.checkCollision.up = false;
            }, 100);
            player.touchOn = platform;
            this.fakeSound.play();
            if (player.life < 12) player.life++;
            
        }

    },
    goldenEffect: function(player, platform) {
        if(player.touchOn !== platform) {
            superman = 1;
            game.time.events.add(
                5000, 
                function() {superman = 0;}
            ); 
            player.touchOn = platform;
            this.normalSound.play();
            if (player.life < 12) player.life = 12;
            
        }

    },
    touchCeiling: function(player, ceiling) {
        player.y += 10;
        if(game.time.now > player.unbeatableTime && !superman) {
            playState2.injuredSound.play();
            player.life -= 3;
            game.camera.flash(0xff0000, 100);
            player.unbeatableTime = game.time.now + 200;
            
        }
        

    }
    /*checkTouchCeiling: function(player) {
        if(player.body.y < 40) {
            player.y += 10;
            if(player.body.velocity.y < 0) {
                player.body.velocity.y = 0;
            }
            if(game.time.now > player.unbeatableTime) {
                player.life -= 3;
                game.camera.flash(0xff0000, 100);
                player.unbeatableTime = game.time.now + 2000;
            }
        }
    }*/
};



var aa1 = 0;
var bb1 = 0;
var cc1 = 0;
var dd1 = 0;

var choosePlayer1 = {
    preload: function () {
        
    },
    create: function() {
        aa1 = 0;
        bb1 = 0;
        cc1 = 0; 
        dd1 = 0;
        var nameLabel = game.add.text(game.width/2, 80,'Choose Player1',{ font: '50px monospace', fill: '#1fb18a' }); 
        nameLabel.anchor.setTo(0.5, 0.5);

        this.p1 = game.add.sprite(32,32,'player');
        this.p1.x = game.width/2 - 150;
        this.p1.events.onInputDown.add(this.p1change, this);
        this.set(this.p1);


        this.p2 = game.add.sprite(32,32,'player2');
        this.p2.x = game.width/2 - 50;
        this.p2.events.onInputDown.add(this.p2change, this);
        this.set(this.p2);



        this.p3 = game.add.sprite(32,32,'player3');
        this.p3.x = game.width/2 + 50;
        this.p3.events.onInputDown.add(this.p3change, this);
        this.set(this.p3);

        this.p4 = game.add.sprite(32,32,'player4');
        this.p4.x = game.width/2 + 150;
        this.p4.events.onInputDown.add(this.p4change, this);
        this.set(this.p4);


        
    },
    update: function() {
        this.p1.animations.play('fly');
        this.p2.animations.play('fly');
        this.p3.animations.play('fly');
        this.p4.animations.play('fly');
        if (this.p1.input.pointerOver() && aa1 == 0) {
            aa1 = 1;
            this.tween(this.p1);
            game.time.events.add(500, function() {aa1 = 0}); 
        }
        if (this.p2.input.pointerOver() && bb1 == 0) {
            bb1 = 1;
            this.tween(this.p2);
            game.time.events.add(500, function() {bb1 = 0}); 
        }
        if (this.p3.input.pointerOver() && cc1 == 0) {
            cc1 = 1;
            this.tween(this.p3);
            game.time.events.add(500, function() {cc1 = 0}); 
        }
        if (this.p4.input.pointerOver() && dd1 == 0) {
            dd1 = 1;
            this.tween(this.p4);
            game.time.events.add(500, function() {dd1 = 0}); 
        }
    },
    p1change: function() {
        playerChoose1 = 1;
        game.state.start('choose2');
    },
    p2change: function() {
        playerChoose1 = 2;
        game.state.start('choose2');
    },
    p3change: function() {
        playerChoose1 = 3;
        game.state.start('choose2');
    },
    p4change: function() {
        playerChoose1 = 4;
        game.state.start('choose2');
    },
    tween: function(player) {
        var X = player.x;
        var Y = player.y;
        game.add.tween(player).to({y: Y - 35}, 150).yoyo(true).start();

    },
    set: function(player) {
        player.scale.setTo(1.5,1.5);
        player.y = 250;
        player.anchor.setTo(0.5, 0.5);
        player.inputEnabled = true;
        player.animations.add('fly', [36, 37, 38, 39], 24);
        
    }
}

var aa2 = 0;
var bb2 = 0;
var cc2 = 0;
var dd2 = 0;

var choosePlayer2 = {
    preload: function () {
        
    },
    create: function() {
        aa2 = 0;
        bb2 = 0;
        cc2 = 0; 
        dd2 = 0;
        var nameLabel = game.add.text(game.width/2, 80,'Choose Player2',{ font: '50px monospace', fill: '#1fb18a' }); 
        nameLabel.anchor.setTo(0.5, 0.5);

        this.p1 = game.add.sprite(32,32,'player',11);
        this.p1.x = game.width/2 - 150;
        if (playerChoose1 != 1) this.p1.events.onInputDown.add(this.p1change, this);
        this.set(this.p1);


        this.p2 = game.add.sprite(32,32,'player2',11);
        this.p2.x = game.width/2 - 50;
        if (playerChoose1 != 2) this.p2.events.onInputDown.add(this.p2change, this);
        this.set(this.p2);



        this.p3 = game.add.sprite(32,32,'player3',11);
        this.p3.x = game.width/2 + 50;
        if (playerChoose1 != 3) this.p3.events.onInputDown.add(this.p3change, this);
        this.set(this.p3);

        this.p4 = game.add.sprite(32,32,'player4',11);
        this.p4.x = game.width/2 + 150;
        if (playerChoose1 != 4) this.p4.events.onInputDown.add(this.p4change, this);
        this.set(this.p4);


        
    },
    update: function() {
        if (playerChoose1 != 1) this.p1.animations.play('fly');
        if (playerChoose1 != 2) this.p2.animations.play('fly');
        if (playerChoose1 != 3) this.p3.animations.play('fly');
        if (playerChoose1 != 4) this.p4.animations.play('fly');
        if (this.p1.input.pointerOver() && aa2 == 0 && playerChoose1 != 1) {
            aa2 = 1;
            this.tween(this.p1);
            game.time.events.add(500, function() {aa2 = 0}); 
        }
        if (this.p2.input.pointerOver() && bb2 == 0 && playerChoose1 != 2) {
            bb2 = 1;
            this.tween(this.p2);
            game.time.events.add(500, function() {bb2 = 0}); 
        }
        if (this.p3.input.pointerOver() && cc2 == 0 && playerChoose1 != 3) {
            cc2 = 1;
            this.tween(this.p3);
            game.time.events.add(500, function() {cc2 = 0}); 
        }
        if (this.p4.input.pointerOver() && dd2 == 0 && playerChoose1 != 4) {
            dd2 = 1;
            this.tween(this.p4);
            game.time.events.add(500, function() {dd2 = 0}); 
        }
    },
    p1change: function() {
        playerChoose2 = 1;
        game.state.start('play2');
    },
    p2change: function() {
        playerChoose2 = 2;
        game.state.start('play2');
    },
    p3change: function() {
        playerChoose2 = 3;
        game.state.start('play2');
    },
    p4change: function() {
        playerChoose2 = 4;
        game.state.start('play2');
    },
    tween: function(player) {
        var X = player.x;
        var Y = player.y;
        game.add.tween(player).to({y: Y - 35}, 150).yoyo(true).start();

    },
    set: function(player) {
        player.scale.setTo(1.5,1.5);
        player.y = 250;
        player.anchor.setTo(0.5, 0.5);
        player.inputEnabled = true;
        player.animations.add('fly', [36, 37, 38, 39], 24);
        
    }
}