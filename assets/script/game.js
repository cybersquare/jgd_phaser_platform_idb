var loggedUser = "Guest"
if(localStorage.getItem("loggedUser")){
    loggedUser=localStorage.getItem("loggedUser")
}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    // Physics is used to add propterties like static, dynamic, collision and bounce, gravity etc
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload, // Load assets like background, characters etc. Runs single time
        create: create, // Create the game evironment - Define movement of characters, physics properties etc. Runs single time
        update: update // This is the game loop, Repeats execution, Game logic is written here
    }
};
// Phaser game object
var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('ground', 'assets/images/platform.png');
    this.load.image('star', 'assets/images/star.png');
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.spritesheet('dude', 
        'assets/images/dude.png',
        // size of single picture in sprite
        { frameWidth: 32, frameHeight: 48 } 
    );
}

var platforms;
var stars;
var score = 0;
var scoreText;

function create ()
{
    // Backgtound
    this.add.image(400, 300, 'sky');

    // Platforms are added as static object in physics
    platforms = this.physics.add.staticGroup();
    // Resizing objects
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    displayUser = this.add.text(300, 16, 'You are playig as: '+ loggedUser, { fontSize: '32px', fill: '#000' });

    // Add movig character
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Animation of moving character - move left
    this.anims.create({
        key: 'left',
        // Frames inside sprite - 0 to 3
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    // Animation of moving character - no movment
    this.anims.create({
        key: 'turn',
        // Frames inside sprite - 4
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    // Animation of moving character - move right
    this.anims.create({
        key: 'right',
        // Frames inside sprite - 5 to 8
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // Player can collide with platoform(physics)
    this.physics.add.collider(player, platforms);

    // Add stars - Create multiple objects of star
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    // Set different bounce propterties for each star
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    //Stars collide with platform
    this.physics.add.collider(stars, platforms);

    // Fucntion "collectStar" is called when dude meets star
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    // Display score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
  

    function collectStar (player, star)
    {
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
        // One flying bomb is added after collecting all the stars
        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb').setScale(0.5).refreshBody();;
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
        
    }

    // Add bomb
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    // Game is finished when dude hits bomb
    function hitBomb (player, bomb)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        // If you want to save score to database do it here.
        gameOver = true;
    }
}


// Game loop
function update ()
{
    //  Get input form keyboard
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    {
        // Move left
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        // Move right
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        // Stand still
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // Jump only if dude is on the platform
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}