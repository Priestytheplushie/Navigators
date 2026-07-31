class Boss {
	constructor(bossLevel = 1) {
		this.bossLevel = bossLevel
		this.width = 150
		this.height = 150
		this.x = width - this.width - 20
		this.y = height / 2 - this.height / 2
		this.maxHp = 50 + (bossLevel - 1) * 25
		this.hp = this.maxHp
		this.state = "SHOOTING"
		this.speed = 4 + (bossLevel - 1) * 0.5
		this.chargeSpeed = 20 + (bossLevel - 1) * 2
		this.shootTimer = 0
		this.stateTimer = 0
		this.targetX = 0
		this.targetY = 0
		this.startX = width - this.width - 20
		this.startY = height / 2 - this.height / 2
		this.dead = false
		this.active = true
		this.yDir = 1 
	}

	drawHealthBar() {
		let barWidth = this.width
		let barHeight = 10
		let barX = this.x
		let barY = this.y - 20

		fill(50)
		stroke(255)
		strokeWeight(1)
		rect(barX, barY, barWidth, barHeight, 3)

		noStroke()
		let currentWidth = map(this.hp, 0, this.maxHp, 0, barWidth)
		fill(255, 0, 0)
		rect(barX, barY, max(0, currentWidth), barHeight, 3)

		fill(255)
		textSize(12)
		textAlign(CENTER, BOTTOM)
		text("BOSS LVL " + this.bossLevel, this.x + this.width / 2, barY - 2)
	}

	update() {
		if (this.state === "SHOOTING") {
			this.active = true

			// Vertical floating movement during shooting
			this.y += this.yDir * (this.speed * 0.7)
			if (this.y <= 10) {
				this.y = 10
				this.yDir = 1
			} else if (this.y >= height - this.height - 10) {
				this.y = height - this.height - 10
				this.yDir = -1
			}

			this.shootTimer++
			if (this.shootTimer > max(20, 40 - (this.bossLevel - 1) * 3)) {
				sound = random(shootSFX)
				sound.play()
				badBullets.push(new EnemyBullets(this.x, this.y + this.height / 3.2))
				this.shootTimer = 0
			}
			this.stateTimer++
			if (this.stateTimer > 240) {
				bossLazerChargingSound.play()
				this.state = "LOCKING"
				this.stateTimer = 0
			}
		} else if (this.state === "LOCKING") {
			let bossCenterY = this.y + this.height / 2
			let shipCenterY = ship.y + 50
			if (Math.abs(bossCenterY - shipCenterY) > 5) {
				this.y += (shipCenterY - bossCenterY) * 0.05
			}

			this.targetX = ship.x
			this.targetY = ship.y
			stroke(255, 0, 0)
			strokeWeight(3)
			line(this.x + this.width / 9, this.y + this.height / 2.1, ship.x + 50, ship.y + 50)
			noStroke()
			this.stateTimer++
			if (this.stateTimer > 60) {
				this.state = "CHARGING"
				this.stateTimer = 0
			}
		} else if (this.state === "CHARGING") {
			this.moveTowards(this.targetX, this.targetY, this.chargeSpeed)
			let xDiff = this.targetX - this.x
			let yDiff = this.targetY - this.y
			let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
			if (dist < 15) {
				this.startX = width - this.width - 20
				this.startY = random(height - this.height)
				this.state = "RETURNING"
			}
		} else if (this.state === "RETURNING") {
			this.moveTowards(this.startX, this.startY, this.speed * 2)
			let xDiff = this.startX - this.x
			let yDiff = this.startY - this.y
			let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
			if (dist < 10) {
				this.state = "SHOOTING"
				this.stateTimer = 0
			}
		}

		// Friendly bullet collisions
		for (let i = 0; i < friendlyBullets.length; i++) {
			let bullet = friendlyBullets[i]
			if (bullet.active && bullet.bulletX >= this.x && bullet.bulletX <= this.x + this.width &&
				bullet.bulletY >= this.y && bullet.bulletY <= this.y + this.height) {
				this.hp--
				bullet.active = false
				bullet.bulletX = width + width / 30
				bullet.stroke = noStroke()
				damagedSound.play()
				score += 5
				if (this.hp <= 0) {
					this.dead = true
					kills++
					score += 100 + (this.bossLevel * 50)
					bossDeathSFX.play()
					boss = null
					checkWaves()
					return
				}
			}
		}

		// Player ship collision
		if (this.x <= ship.x + 80 && this.x + this.width >= ship.x &&
			this.y <= ship.y + 80 && this.y + this.height / 1.3 >= ship.y && this.active) {
			health--
			this.active = false
			damagedSound.play()
			if (this.state === "CHARGING") {
				this.startX = width - this.width - 20
				this.state = "RETURNING"
			}
			if (health <= 0) {
				gameOver()
			}
		}

		image(bossImage, this.x, this.y, this.width, this.height)
		this.drawHealthBar()
	}

	moveTowards(goalX, goalY, moveSpeed) {
		let xDiff = goalX - this.x
		let yDiff = goalY - this.y
		let d = Math.sqrt(xDiff * xDiff + yDiff * yDiff)

		if (d > 0) {
			this.x += (moveSpeed * xDiff) / d
			this.y += (moveSpeed * yDiff) / d
		}
	}
}