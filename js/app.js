window.onload = function () {

    var game = new Phaser.Game(600, 400, Phaser.AUTO, '', { preload: preload, create: create, update: update }),
		platforms,
		stars,
		score = 0,
		scoreText,
		numOfEnemies = 10;
	function preload() {

		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.image('star', 'assets/star.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);

	}
	Enemy = function () {
		this.x = game.world.randomX;
		this.y = game.world.randomY;
		this.minSpeed = -75;
		this.maxSpeed = 75;
		this.vx = Math.random() * (this.maxSpeed - this.minSpeed + 1) - this.minSpeed;
		this.vy = Math.random() * (this.maxSpeed - this.minSpeed + 1) - this.minSpeed;

		this.enemySprite = game.add.sprite(this.x, this.y, "baddie");
//		console.log(this.enemySprite.body.collideWorldBounds = true);
		this.enemySprite.anchor.setTo(0.5, 0.5);
//			this.enemySprite.body.collideWorldBounds = true;
		this.enemySprite.body.bounce.setTo(1, 1);
		this.enemySprite.body.velocity.x = this.vx;
		this.enemySprite.body.velocity.y = this.vy;
		this.enemySprite.body.immovable = true;
	};

    

    function create() {
		// Enable physics by setting a physics engine
		var physics = game.physics.startSystem(Phaser.Physics.ARCADE),
			sky = game.add.sprite(0, 0, 'sky');

		// Will be used to hold the ground and the ledges we can interact with
		platforms = game.add.group();

		// Enables physics for the above group
		platforms.enableBody = true;

		// Create the ground using our platforms group and the preloaded image
		var ground = platforms.create(0, game.world.height - 64, 'ground');

		// Scale our ground to fit the view
		ground.scale.setTo(2, 2);

		// Stop the ground moving away when you jump on it
		ground.body.immovable = true;

		// Create two ledges
		var ledge = platforms.create(50, 150, 'ground');

		ledge.body.immovable = true;

		ledge = platforms.create(150, 250, 'ground');

		ledge.body.immovable = true;



		// Stuff on the player
		// Add the player's sprite
		player = game.add.sprite(32, game.world.height - 150, 'dude');

		// Enable physics on our player
		game.physics.arcade.enable(player);

		// Give the player some phyics properties - bounce, gravity and whether they can collide
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 200;
		player.body.collideWorldBounds = true;

		// Add some animations - for walking left and right
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);

		
		
		var enemies = [];
        for (var i=0; i<numOfEnemies; i++) {
			console.log(enemies);
            enemies.push( new Enemy() );
        }



		// Now let's allow some stuff to be collected
		stars = game.add.group();

		stars.enableBody = true;

		// Create 12 stars spread out evenly
		for (var i = 0; i < 12; i++) {
			// Create a star inside of the group
			var star = stars.create(i * 40, 0, 'star');
			
			// Give it a little gravity
			star.body.gravity.y = 100;

			// Give the start a random bounce
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}



		scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'} )
    };

    function update () {
		// Check for collisions between our platforms and the player and handle them
		game.physics.arcade.collide(player, platforms);
		
//		game.physics.arcade.collide(baddie, platforms);

		// Check for collisions between our stars the the platforms
		game.physics.arcade.collide(stars, platforms);

		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		
		for (var i=0; i<numOfEnemies; i++) {
            game.physics.collide(player, enemies[i].enemySprite, getHit, null, this)
        }

		// Create an instance of the built-in keyboard manager
		var cursors = game.input.keyboard.createCursorKeys();

		// Reset the player's velocity
		player.body.velocity.x = 0;

		if(cursors.left.isDown) {
			// Move to left
			player.body.velocity.x = -150;

			player.animations.play('left');
		}
		else if (cursors.right.isDown) {
			// Move right
			player.body.velocity.x = 150;
			
			player.animations.play('right');
		}
		else {
			// Stand still
			player.animations.stop();

			player.frame = 4;
		}

		// If the player is on the ground, then allow them to jump
		if(cursors.up.isDown && player.body.touching.down) {
			player.body.velocity.y = 1050;
		}
    };

    var collectStar = function (player, star) {
		// Kill/remove the star
		star.kill();

		// Add or update the score
		score += 10;
		scoreText.text = "Score: " + score;
    };
	
	 var getHit = function (player, baddie) {
		// Kill/remove the baddie
		baddie.kill();
		// Add or update the score
		score -= 10;
		scoreText.text = "Score: " + score;
    };

};