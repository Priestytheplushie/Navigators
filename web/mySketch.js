class JSAudio {
	constructor(filename, poolSize = 6) {
		this.pool = []
		this.index = 0
		for (let i = 0; i < poolSize; i++) {
			let a = new Audio(filename)
			a.volume = filename.includes("shoot") ? 0.12 : 0.35
			this.pool.push(a)
		}
	}
	play() {
		let sound = this.pool[this.index]
		sound.currentTime = 0
		sound.play().catch(() => {})
		this.index = (this.index + 1) % this.pool.length
	}
	loop() {
		let sound = this.pool[0]
		sound.loop = true
		sound.play().catch(() => {})
	}
	stop() {
		for (let a of this.pool) {
			a.pause()
			a.currentTime = 0
		}
	}
	setVolume(v) {
		for (let a of this.pool) {
			a.volume = v
		}
	}
}

function loadSound(filename) {
	return new JSAudio(filename)
}

let shipSpeed = 0
let friendlyBullets = []
let badBullets = []
let enemies = []
let gameName = "  Navigators"
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
let isPaused = false

let buttonStart = null
let playAgainButton = null

let highScore = 0
let highWave = 1
let highKills = 0

function preload() {
	shipImage = loadImage("ship.png")
	shipDamaged = loadImage("ship-damaged.png")
	shipSlightlyDamaged = loadImage("ship-slight-damage.png")
	shipDestroyed = loadImage("ship-very-damaged.png")

	enemy1 = loadImage("Enemy1.png")
	enemy2 = loadImage("Enemy2.png")
	enemy3 = loadImage("Enemy3.png")
	enemy4 = loadImage("Enemy4.png")
	enemy5 = loadImage("Enemy5.png")
	enemy6 = loadImage("Enemy6.png")
	enemy7 = loadImage("Enemy7.png")
	enemy8 = loadImage("Enemy8.png")

	shooter1 = loadImage("shooter1.png")
	shooter2 = loadImage("shooter2.png")
	shooter3 = loadImage("shooter3.png")
	shooter4 = loadImage("shooter4.png")

	bossImage = loadImage('boss.png')
	healthPackImage = loadImage("healthpack.png")

	shoot1 = loadSound("shoot1.wav")
	shoot2 = loadSound("shoot2.wav")
	shoot3 = loadSound("shoot3.wav")
	shoot4 = loadSound("shoot4.wav")

	deathSound = loadSound("death.wav")
	damagedSound = loadSound("damaged.wav")

	bossLazerChargingSound = loadSound("bossLazer.wav")
	bossDeathSFX = loadSound("bossDeath.wav")

	reloadSound = loadSound("reload.mp3")
	healSFX = loadSound("heal.wav")

	music = loadSound("music.wav")
	menuLoop = loadSound("menuLoop.mp3")
	backgroundImage = loadImage("space.png")

	gameOverSound = loadSound("gameover.wav")

	enemySprites = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8]
	shooterSprites = [shooter1, shooter2, shooter3, shooter4]
	shootSFX = [shoot1, shoot2, shoot3, shoot4]
}

function setup() {
	document.body.style.margin = "0"
	document.body.style.overflow = "hidden"

	pixelDensity(1)
	frameRate(60)

	createCanvas(windowWidth, windowHeight)
	background(backgroundImage)

	highScore = parseInt(localStorage.getItem("navigators_highScore")) || 0
	highWave = parseInt(localStorage.getItem("navigators_highWave")) || 1
	highKills = parseInt(localStorage.getItem("navigators_highKills")) || 0

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

	window.setWave = function(w) {
		waves = w - 1
		kills = killGoal
		checkWaves()
		console.log("Dev: Jumped to wave " + w)
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	if (typeof buttonStart !== 'undefined' && buttonStart) {
		buttonStart.position(windowWidth / 2 - 25, windowHeight / 2)
	}
	if (typeof playAgainButton !== 'undefined' && playAgainButton) {
		playAgainButton.position(windowWidth / 2 - 35, windowHeight / 2 + 35)
	}
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
		fill(255, 215, 0)
		text("High Score: " + highScore + " | High Wave: " + highWave + " | Most Kills: " + highKills, width / 2, height / 2 - 20)
		fill(255)
		text("     Arrow Up / Down or W / S to move", width / 2, height / 2 + 50)
		text("     x / space to shoot, r to reload, ESC to pause", width / 2, height / 2 + 65)
		text("     Run into enemies, to destroy them, but you take damage", width / 2, height / 2 + 80)
		text("     Red Enemies = Normal, no attacks", width / 2, height / 2 + 120)
		text("     Green Enemies = Shooter, Fires randomly, doesn't move up or down", width / 2, height / 2 + 140)
		text("     Blue enemy = Good luck...", width / 2, height / 2 + 160)
		text("     Defend the line, don't let them move off screen!", width / 2, height / 2 + 180)
		return
	}

	if (isPaused) {
		fill(0, 0, 0, 150)
		rect(0, 0, width, height)
		fill(255)
		textSize(40)
		textAlign(CENTER, CENTER)
		text("PAUSED", width / 2, height / 2)
		textSize(18)
		text("Press ESC or P to Resume", width / 2, height / 2 + 40)
		return
	}

	menuLoop.stop()
	for (let x = 0; x < healths.length; x++) {
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

	let shipMoveSpeed = 0
	if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
		shipMoveSpeed = -ship.shipSpeed
	} else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
		shipMoveSpeed = ship.shipSpeed
	}
	ship.draw(shipMoveSpeed)

	for (let i = 0; i < friendlyBullets.length; i++) {
		friendlyBullets[i].update()
	}
	for (let b = 0; b < enemies.length; b++) {
		enemies[b].update()
		if (enemies[b].type == "shooter" && enemies[b].shoot == 1) {
			enemies[b].shoot = 0
			let GetX = enemies[b].enemyX
			let GetY = enemies[b].enemyY
			if (GetX >= width / margin) {
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
	for (let q = 0; q < badBullets.length; q++) {
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

	if (boss) {
		boss.update()
	}
	checkWaves()
}

function keyPressed() {
	if (key === "Escape" || key === "p" || key === "P") {
		isPaused = !isPaused
		return
	}
	if (isPaused) return

	if ((key === "x" || key === "X" || key === " ") && !ship.reloading && !ship.dead && gameStarted) {
		if (ship.ammo > 0) {
			ship.ammo -= 1
			sound = random(shootSFX)
			sound.play()
			friendlyBullets[friendlyBullets.length] = new PlayerBullet()
			variation = min(variation + variationAmount, 3.0)

			if (ship.ammo === 0) {
				ship.startReload()
			}
		}
	}
	if ((key === "r" || key === "R") && !ship.reloading && gameStarted) {
		ship.startReload()
	}
}

function startGame() {
	gameStarted = true
	if (buttonStart) buttonStart.hide()
	music.loop()
}

function gameOver() {
	noStroke()
	healths = []
	recentHealthPack = []

	if (score > highScore) {
		highScore = score
		localStorage.setItem("navigators_highScore", highScore)
	}
	if (waves > highWave) {
		highWave = waves
		localStorage.setItem("navigators_highWave", highWave)
	}
	if (kills > highKills) {
		highKills = kills
		localStorage.setItem("navigators_highKills", highKills)
	}

	gameOverSound.play()
	music.stop()
	ship.dead = true
	if (health === 0) {
		image(shipDestroyed, ship.x, ship.y)
	}
	noLoop()
	fill(255, 0, 0)
	textSize(50)
	textAlign(CENTER)
	text("GAME OVER", windowWidth / 2, windowHeight / 2)
	playAgainButton = createButton("Play Again")
	playAgainButton.position(windowWidth / 2 - 35, windowHeight / 2 + 35)
	playAgainButton.mousePressed(playAgain)
}

function playAgain() {
	gameOverSound.stop()
	boss = null
	recentHealthPack = []
	enemies = []
	badBullets = []
	friendlyBullets = []
	healths = []
	health = 5
	ship.ammo = 36
	ship.reloading = false
	ship.maxAmmo = 36
	score = 0
	kills = 0
	waves = 1
	enemiesAllowed = 3
	Enemies.healthBuff = 0
	if (typeof playAgainButton !== 'undefined' && playAgainButton) playAgainButton.hide()
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

		if (waves > highWave) {
			highWave = waves
			localStorage.setItem("navigators_highWave", highWave)
		}

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
		} else if (waves % 5 === 0) {
			let bossLevel = waves / 5
			boss = new Boss(bossLevel)
			killGoal = kills + 1
			if (waves === 10) {
				enemiesAllowed = 0
			} else {
				enemiesAllowed = min(4, floor(waves / 5))
			}
			if (health < 5) {
				health += 1
			}
			ship.ammo = ship.maxAmmo
			ship.reloading = false
		} else {
			boss = null
			killGoal = kills + 10 + floor(waves * 1.5)
			enemiesAllowed = min(6, 3 + floor((waves - 10) / 3))
			Enemies.healthBuff = floor((waves - 8) / 2)
			Enemies.types = ["normal", "normal", "shooter", "shooter"]
		}
	}
}