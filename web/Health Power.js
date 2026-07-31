class HealthPower {
	constructor(x, y) {
		this.healthX = x
		this.healthY = y
		this.healthSpeed = 3
		this.collected = false
	}
	update() {
		this.healthX = this.healthX - this.healthSpeed
		if (this.healthX <= ship.x + 100 && this.healthX + 50 >= ship.x && this.healthY <= ship.y + 100 && this.healthY + 50 >= ship.y && this.collected == false) {
			if (health < 5) {
				health += int(random(1, 2))
				healSFX.play()
				this.collected = true
				this.healthX = -width
			}
		}
		image(healthPackImage, this.healthX, this.healthY)
	}
}