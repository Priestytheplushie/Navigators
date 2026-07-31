class PlayerBullet {
	constructor() {
		this.bulletX = ship.x + 50
		this.bulletY = ship.y + 50
		this.bulletSpeed = 10
		this.active = true
		this.bulletColor = "red"
		this.stroke = stroke("black")
		this.bloom = random(-variation, variation)
		this.angle = random(this.bloom)
		this.variationAdded = false
		this.variationSubtracted = false
	}
	update() {
		if (!(this.variationAdded)) {
			variation = variation + variationAmount
			this.variationAdded = true
		}

		this.stroke
		fill(this.bulletColor)
		this.bulletX = this.bulletX + this.bulletSpeed
		if (this.bulletX > width && !(this.variationSubtracted)) {
			variation = this.bloom - variationAmount
			this.variationSubtracted = true
		} else if (this.bulletY > height && !(this.variationSubtracted)) {
			variation = this.bloom - variationAmount
			this.variationSubtracted = true
		} else if (this.bulletY < 0 && !(this.variationSubtracted)) {
			variation = this.bloom - variationAmount
			this.variationSubtracted = true
		}
		this.bulletY = this.bulletY + this.angle
		rect(this.bulletX, this.bulletY, width / 30, height / 80)
	}
}