// Config
let shipSpeed = 0
let friendlyBullets = []
let badBullets = []
let enemies = []
let gameName = "  Navigators"
let keysPressed = 0
let enemiesSpawned = 0
let enemiesAllowed = 3
let score = 0
let variation = 0
let variationAmount = 0.4
let health = 5
let kills = 0
let killGoal = 5
let waves = 1
let enemySprites
let shooterSprites	
let margin = 4
let healths = []
let recentHealthPack = []
let gameStarted = false
let boss = null

function preload() {
	// Ship Sprites
	shipImage = loadImage("ship.png")
	shipDamaged = loadImage("ship-damaged.png")
	shipSlightlyDamaged = loadImage("ship-slight-damage.png")
	shipDestroyed = loadImage("ship-very-damaged.png")

	// Normal Enemy Sprites
	enemy1 = loadImage("Enemy1.png")
	enemy2 = loadImage("Enemy2.png")
	enemy3 = loadImage("Enemy3.png")
	enemy4 = loadImage("Enemy4.png")
	enemy5 = loadImage("Enemy5.png")
	enemy6 = loadImage("Enemy6.png")
	enemy7 = loadImage("Enemy7.png")
	enemy8 = loadImage("Enemy8.png")

	// Shooter Sprites
	shooter1 = loadImage("shooter1.png")
	shooter2 = loadImage("shooter2.png")
	shooter3 = loadImage("shooter3.png")
	shooter4 = loadImage("shooter4.png")

	bossImage = loadImage('boss.png')

	// HealthPack
	healthPackImage = loadImage("healthpack.png")

	// Shoot SFX
	shoot1 = loadSound("shoot1.wav")
	shoot2 = loadSound("shoot2.wav")
	shoot3 = loadSound("shoot3.wav")
	shoot4 = loadSound("shoot4.wav")

	// Hit SFX
	deathSound = loadSound("death.wav")
	damagedSound = loadSound("damaged.wav")

	// Boss SFX
	bossLazerChargingSound = loadSound("bossLazer.wav")
	bossDeathSFX = loadSound("bossDeath.wav")

	// Reload SFX
	reloadSound = loadSound("reload.mp3")

	healSFX = loadSound("heal.wav")

	// Background
	music = loadSound("music.wav")
	menuLoop = loadSound("menuLoop.mp3")
	backgroundImage = loadImage("space.png")

	// Game Over SFX
	gameOverSound = loadSound("gameover.wav")

	// Arrays
	enemySprites = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8]
	shooterSprites = [shooter1, shooter2, shooter3, shooter4]
	shootSFX = [shoot1, shoot2, shoot3, shoot4]
}

function setup() {
	document.body.style.margin = "0"
	document.body.style.overflow = "hidden"

	createCanvas(windowWidth, windowHeight)
	background(backgroundImage)

	shipImage.resize(100, 100)
	shipDamaged.resize(100, 100)
	shipSlightlyDamaged.resize(100, 100)
	shipDestroyed.resize(100, 100)

	healthPackImage.resize(50, 50)

	ship = new Ship()
	fill(255, 255, 255)
	textSize(50)
	textAlign(CENTER, CENTER)
	text(gameName, width / 2, height / 2 - 60)
	menuLoop.loop()
	buttonStart = createButton("Start")
	buttonStart.position(windowWidth / 2 - 25, windowHeight / 2)
	buttonStart.mousePressed(startGame)
}

function draw() {
	noStroke()
	background(backgroundImage)

	if (!gameStarted) {
		fill(255)
		textSize(40)
		textAlign(CENTER, CENTER)
		text(gameName, width / 2, height / 2 - 60)
		textSize(16)
		text("     Arrow Up and Arrow Down to move",width / 2, height / 2 + 50)
		text("     x to shoot, r to reload",width / 2, height / 2 + 65)
		text("     Run into enemies, to destroy them, but you take damage",width / 2, height / 2 + 80)
		text("     Red Enemies = Normal, no attacks",width / 2, height / 2 + 120)
		text("     Green Enemies = Shooter, Fires randomly, doesn't move up or down",width / 2, height / 2 + 140)
		text("     Blue enemy = Good luck...",width / 2, height / 2 + 160)
		text("     Defend the line, don't let them move off screen!",width / 2, height / 2 + 180)
		return
	}
	menuLoop.stop()
	for (x = 0; x < healths.length; x++) {
		healths[x].update()
	}
	if (enemiesSpawned < enemiesAllowed) {
		enemies[enemies.length] = new Enemies()
		enemiesSpawned = enemiesSpawned + 1
	}
	fill(255, 255, 255)
	noStroke()
	textSize(12)
	textAlign(LEFT)
	text("Score: " + score, windowWidth / 2, windowHeight / 40)
	text("Kills: " + kills, windowWidth / 2, windowHeight / 40 + 15)
	text("Kill Goal: " + killGoal, 5, 40)
	textSize(24)
	text("Wave: " + waves, 5, 25)
	if (ship.reloading) {
		fill(255, 0, 0)
		text("Reloading...", 5, windowHeight - 10)
	} else {
		text("Ammo: " + ship.ammo + "/" + ship.maxAmmo, 5, windowHeight - 10)
	}
	fill(0, 0, 0)
	ship.draw(shipSpeed)
	for (i = 0; i < friendlyBullets.length; i++) {
		friendlyBullets[i].update()
	}
	for (b = 0; b < enemies.length; b++) {
		enemies[b].update()
		if (enemies[b].type == "shooter" && enemies[b].shoot == 1) {
			enemies[b].shoot = 0
			GetX = enemies[b].enemyX
			GetY = enemies[b].enemyY
			if (GetX < width / margin) {

			} else {
				let bullet = new EnemyBullets(GetX, GetY)
				bullet.enemyUsed = b
				sound = random(shootSFX)
				sound.play()
				badBullets.push(bullet)
			}
		}
		if (enemies[b].dead == true) {
			enemies[b].dead = null
			enemiesSpawned = enemiesSpawned - 1
		}
	}
	for (q = 0; q < badBullets.length; q++) {
		badBullets[q].update()
		if ((badBullets[q].bulletX < 0 || badBullets[q].hit == true) &&
			badBullets[q].used == false &&
			enemies[badBullets[q].enemyUsed] &&
			enemies[badBullets[q].enemyUsed].dead == false) {

			badBullets[q].used = true
			enemies[badBullets[q].enemyUsed].shootCooldown = floor(random(90, 150))
		}
	}
	if (ship.reloading) {
		ship.updateReloadTimer()
	}
	if (variation > 0) {
		variation -= 0.05
		variation = max(0, variation)
	}

	if (waves == 10 && boss) {
		boss.update()
	}
	checkWaves()
}

function keyPressed() {
	keysPressed++
	if (keysPressed > 1) return

	// DEV KEYBIND
	if (key === '`') {
		waves = 9
		killGoal = 1
		kills = 0
	}
	if (key == "ArrowDown") {
		shipSpeed = ship.shipSpeed
	}
	if (key == "ArrowUp") {
		shipSpeed = -ship.shipSpeed
	}
	if (key == "x" && !ship.reloading && ship.dead === false) {
		if (ship.ammo > 0 && !ship.reloading) {
			ship.ammo -= 1
			sound = random(shootSFX)
			sound.play()
			friendlyBullets[friendlyBullets.length] = new PlayerBullet()
			variation = min(variation + variationAmount, 3.0);

			if (ship.ammo === 0) {
				ship.startReload()
			}
		}
	}
	if (key == "r" && !ship.reloading) {
		ship.startReload()
	}
}

function keyReleased() {
	keysPressed--
	if (keysPressed == 0) {
		shipSpeed = 0
	}
}

function startGame() {
	gameStarted = true
	buttonStart.hide()
	music.loop()
}

function gameOver(flags) {
	noStroke()
	healths = []
	recentHealthPack = []
	if (flags != "win") {
		gameOverSound.play()
		music.stop()
		ship.dead = true
		if (ship.health === 0) {
			image(shipDestroyed, ship.x, ship.y)
			kills = kills + 1
		}
		noLoop()
		fill(255, 0, 0)
		textSize(50)
		textAlign(CENTER)
		text("GAME OVER", windowWidth / 2, windowHeight / 2)
		playAgainButton = createButton("Play Again")
		playAgainButton.position(windowWidth / 2 - 35, windowHeight / 2 + 35)
		playAgainButton.mousePressed(playAgain)
	} else if (flags === "win") {
		music.stop()
		noLoop()
		fill(0, 255, 0)
		textSize(50)
		textAlign(CENTER)
		text("VICTORY", windowWidth / 2, windowHeight / 2)
		textSize(24)
		text("You defeated the boss!", windowWidth / 2, windowHeight / 2 + 30)
		friendlyBullets = []
		enemyBullets = []
	}
}

function playAgain() {
	gameOverSound.stop()
	// Reset all Variables
	boss = null
	recentHealthPack = []
	enemies = []
	badBullets = []
	health = 5
	ship.ammo = 24
	ship.reloading = false
	ship.maxAmmo = 24
	score = 0
	kills = 0
	waves = 1
	enemiesAllowed = 3
	playAgainButton.hide()
	ship.y = height / 2
	ship.dead = false
	enemiesSpawned = 0
	music.loop()
	Enemies.types = ["normal"]
	killGoal = 5
	loop()
}

function checkWaves() {
	if (kills >= killGoal) {
		waves += 1
		friendlyBullets = []
		badBullets = []
		enemies = []
		enemiesSpawned = 0
		if (waves < 10) {
			killGoal += 10
			if (waves === 2) {
				Enemies.types = ["normal", "normal", "normal", "shooter"]
			}
			if (waves === 3 || waves === 6 || waves === 8) {
				enemiesAllowed += 1
			}
			if (waves === 5) {
				Enemies.types = ["normal", "normal", "shooter"]
			}
			if (waves === 9) {
				Enemies.healthBuff = 1
			}
		} else if (waves === 10) {
			enemies = []
			enemiesAllowed = 0
			killGoal = killGoal + 1
			boss = new Boss()

			if (ship.health < 5) {
				ship.health += 1
			}
			ship.ammo = ship.maxAmmo
			ship.reloading = false
		}
	}
}