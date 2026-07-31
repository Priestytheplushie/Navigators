class Ship {
	constructor() {
		this.x = 10
		this.y = windowHeight / 2
		this.shipSpeed = windowHeight / 128
		this.reloadSpeedPenalty = 0.5
		this.ammo = 36
		this.reloadTime = 0;
		this.reloadMaxTime = 1.5
		this.reloading = false
		this.maxAmmo = this.ammo
		this.dead = false

	}
	draw(speed) {
		let currentSpeed = speed
		if (this.reloading) {
			currentSpeed = speed * 0.4
		}
		this.y = constrain(this.y + currentSpeed, -20, windowHeight - 80)
		if (health == 5) {
			noFill();
			stroke("cyan")
			circle(this.x + 100 / 2, this.y + 100 / 2, 100 / 1.6)
			noStroke()
			image(shipImage, this.x, this.y)
			this.maxAmmo = 36
		}
		if (health == 4) {
			noFill();
			stroke("red")
			circle(this.x + 100 / 2, this.y + 100 / 2, 100 / 1.6)
			noStroke()
			image(shipImage, this.x, this.y)
			this.maxAmmo = 32
		} else if (health == 3) {
			image(shipImage, this.x, this.y)
			this.maxAmmo = 24
		} else if (health == 2) {
			image(shipSlightlyDamaged, this.x, this.y)
			this.maxAmmo = 20
		} else if (health == 1) {
			image(shipDamaged, this.x, this.y)
			this.maxAmmo = 16
		}
		noStroke()
		if (this.ammo > this.maxAmmo) {
			this.ammo = this.maxAmmo
		}
	}

	updateReloadTimer() {
		this.reloadTime -= deltaTime / 1000
		if (this.reloadTime <= 0) {
			this.ammo = this.maxAmmo
			this.reloading = false
		}
	}

	startReload() {
		if (!this.reloading && this.ammo < 24) {
			this.reloading = true
			this.reloadTime = this.reloadMaxTime
			reloadSound.play()
		}
	}
}