
window.onload = function() {

    // This example uses the Phaser 2.0.4 framework

    // Copyright © 2014 John Watson
    // Licensed under the terms of the MIT License

    var GameState = function(game) {
    };

    // Load images and sounds
    GameState.prototype.preload = function() {
        this.game.load.image('ground', '/assets/gfx/ground.png');
        this.game.load.image('player', '/assets/gfx/player.png');
    };

    // Setup the example
    GameState.prototype.create = function() {
        // Set stage background to something sky colored
        this.game.stage.backgroundColor = 0x4488cc;
        this.game.world.setBounds(-1000, -1000, 2000, 2000);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Define movement constants
        this.MAX_SPEED = 500; // pixels/second

        // Create a player sprite
        this.player = this.game.add.sprite(this.game.width/2, this.game.height - 64, 'player');

        // Enable physics on the player
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        // Make player collide with world boundaries so he doesn't leave the stage
        this.player.body.collideWorldBounds = true;

        // Capture certain keys to prevent their default actions in the browser.
        // This is only necessary because this is an HTML5 game. Games on other
        // platforms may not need code like this.
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        // Create some ground for the player to walk on
        this.ground = this.game.add.group();
        for(var x = 0; x < this.game.width; x += 32) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }

        // Show FPS
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(
            20, 20, '', { font: '16px Arial', fill: '#ffffff' }
        );

        this.game.camera.follow(this.player)
    };

    // The update() method is called every frame
    GameState.prototype.update = function() {
        if (this.game.time.fps !== 0) {
            this.fpsText.setText(this.game.time.fps + ' FPS');
        }

        // Collide the player with the ground
        this.game.physics.arcade.collide(this.player, this.ground);

        if (this.leftInputIsActive()) {
            // If the LEFT key is down, set the player velocity to move left
            this.player.body.velocity.x = -this.MAX_SPEED;
        } else if (this.rightInputIsActive()) {
            // If the RIGHT key is down, set the player velocity to move right
            this.player.body.velocity.x = this.MAX_SPEED;
        } else {
            // Stop the player from moving horizontally
            this.player.body.velocity.x = 0;
        }
    };

    // This function should return true when the player activates the "go left" control
    // In this case, either holding the right arrow or tapping or clicking on the left
    // side of the screen.
    GameState.prototype.leftInputIsActive = function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        isActive |= (this.game.input.activePointer.isDown &&
                     this.game.input.activePointer.x < this.game.width/4);

        return isActive;
    };

    // This function should return true when the player activates the "go right" control
    // In this case, either holding the right arrow or tapping or clicking on the right
    // side of the screen.
    GameState.prototype.rightInputIsActive = function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
        isActive |= (this.game.input.activePointer.isDown &&
                     this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

        return isActive;
    };

    var game = new Phaser.Game(848, 450, Phaser.AUTO);
    game.state.add('game', GameState, true);
    game.state.start('game');

};

