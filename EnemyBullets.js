class EnemyBullets {
	constructor(X, Y) {
		this.bulletX = X - 10
		this.bulletY = Y + 30
		this.badBulletSpeed = width / 60
		this.active = true
		this.bulletColor = "green"
		this.hit = false
		this.used = false
		this.shootAgain = false
		this.enemyUsed
		this.angle = random(-0.7, 0.7)
	}
	update() {
		fill(this.bulletColor)
		this.bulletX = this.bulletX - this.badBulletSpeed
		this.bulletY = this.bulletY + this.angle
		if (this.bulletX <= ship.x + 80 && this.bulletX + width / 30 >= ship.x && this.bulletY <= ship.y + 80 && this.bulletY + height / 80 >= ship.y + 10 && this.active) {
			this.hit = true
			this.active = false
			health = health - 1
			this.bulletX = -width
			noStroke()
			this.bulletX = width + width / 30
			if (health == 0) {
				gameOver()
			}
		}
		rect(this.bulletX, this.bulletY, width / 30, height / 80)
	}
}