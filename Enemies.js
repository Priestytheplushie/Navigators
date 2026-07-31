class Enemies {
	static types = ["normal"]
	static healthBuff = 0

	constructor() {
		this.enemyX = width
		this.enemyY = random(height - height / 10)
		this.enemy
		this.enemyWidth = windowWidth / 30
		this.enemyHeight = windowHeight / 10
		this.enemyHealth = 2 + Enemies.healthBuff
		this.framesRed = 0
		this.dead = false
		this.speed = random(windowWidth / 600, windowWidth / 450)
		this.first = 0
		this.hitShipAlready = false
		this.type = random(Enemies.types)
		if (this.type == "normal") {
			this.sprite = random(enemySprites)
		} else if (this.type == "shooter") {
			this.sprite = random(shooterSprites)
		}
		if (this.type == "shooter") {
			this.shootCooldown = random([60, 90, 120])
			this.shoot = 0
			this.enemyHealth = 1 + Enemies.healthBuff
		}
	}
	update() {
		if (this.type == "shooter" && this.shootCooldown > 0) {
			this.shootCooldown--
			if (this.shootCooldown === 0) {
				this.shoot = 1
			}
		}
		this.enemyX = this.enemyX - this.speed
		fill(255, 255, 255)
		for (i = 0; i < friendlyBullets.length; i++) {
			if ((this.enemyX <= friendlyBullets[i].bulletX + width / 30 && this.enemyX + this.enemyWidth >= friendlyBullets[i].bulletX) && (this.enemyY <= friendlyBullets[i].bulletY + height / 80 && this.enemyY + this.enemyHeight >= friendlyBullets[i].bulletY) && friendlyBullets[i].active && this.dead == false) {
				this.enemyHealth = this.enemyHealth - 1
				damagedSound.play()
				if (this.enemyHealth > 0) {
					if (friendlyBullets[i].variationSubtracted == false) {
						variation = variation - variationAmount
						friendlyBullets[i].variationSubtracted = true
					}
					friendlyBullets[i].active = false
					friendlyBullets[i].stroke = noStroke()
					friendlyBullets[i].bulletX=width+width/30
				}
				this.framesRed = 3
				if (this.type === "shooter"){
					score+= 1
				}
				score = score + 1
			}
			if (this.enemyHealth == 0) {
				if (this.first == 0) {
					if (friendlyBullets[i].variationSubtracted == false) {
						variation = variation - variationAmount
						friendlyBullets[i].variationSubtracted = true
					}
					friendlyBullets[i].active = false
					friendlyBullets[i].stroke = noStroke()
					friendlyBullets[i].bulletX= width+width/30
					this.first = 1
					kills += 1
					deathSound.play()

					if (kills % 10 === 0 && kills !== 0) {
						healths.push(new HealthPower(this.enemyX, this.enemyY))
					}
				}

				if (this.dead != null) {
					this.dead = true

				}
				this.enemyY = height + height
				this.enemyX = width + width
				noStroke()
				fill(255, 255, 255, 0)
			}
		}
		if (this.framesRed != 0) {
			fill(255, 0, 0)
			this.framesRed = this.framesRed - 1
		}
		if (this.enemyX <= ship.x + 100 && this.enemyX + this.enemyWidth >= ship.x && this.enemyY <= ship.y + 100 && this.enemyY + this.enemyHeight >= ship.y && this.dead == false) {
			health = health - 1
			damagedSound.play()
			if (this.dead != null) {
				this.dead = true
			}
			if (this.hitShipAlready == false) {
				this.hitShipAlready = true
				kills = kills + 1
			}
			this.first = 0
			this.enemyHealth = 0
			this.enemyX = width
			noStroke()
			fill(255, 255, 255, 0)
			if (health == 0) {
				gameOver()
			}
		}
		if (this.enemyHealth == 0) {
			fill(255, 255, 255, 0)
		}

		if (this.sprite !== null) {
			noFill();
			stroke("cyan")
			if (this.enemyHealth > 1){
				circle(this.enemyX+this.enemyWidth/2, this.enemyY + this.enemyHeight/2, this.enemyHeight/1.6)
				noStroke()
			}
			this.enemy = image(this.sprite, this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight)
		} else {
			this.enemy = rect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight)
		}
		if (this.enemyX < 0) {
			gameOver()
		}
	}
}