<div align="center">

  <img src="boss.png" width="120" alt="Navigators Boss Icon">

  # Navigators (Legacy Version)

  > ⚠️ **Note:** You are currently viewing the **`legacy`** branch containing the original 10-hour class submission. For the updated version with Endless Mode, Boss tweaks, a loading screen, and desktop executables, check out the **[`main` branch](https://github.com/Priestytheplushie/Navigators/tree/main)**!

  Welcome to **Navigators**, a simple 2D space shooter built with [p5.js](https://p5js.org/).

</div>

---

## About the Legacy Version

This branch contains the original state of the game as submitted for class:
- **10 Waves** with a final Boss fight on Wave 10.
- **3 Enemy Types** (Normal, Shooter, and Boss).
- **Health Pickups & Score Tracking**.

---

## How to Play

Use `W` / `S` or the **Arrow Keys** to maneuver your ship up and down, press `X` or `Space` to shoot, and `R` to reload. Do not let enemies move off screen!

- **5 HP**: 36 max ammo, Full HP, Cyan Shield
- **4 HP**: 32 max ammo, Red Shield
- **3 HP**: 24 max ammo, No Shield
- **2 HP**: 20 max ammo, Slightly damaged icon
- **1 HP**: 16 max ammo, Very damaged icon

---

## Running the Legacy Version

Since all files are located directly in the root directory, you can serve them locally with Python:

```bash
git clone https://github.com/Priestytheplushie/Navigators.git
cd Navigators
git checkout legacy
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

---

## Credits 

- **Code**: Created by me and Hirschc
- **Space Background**: [ansimuz](https://ansimuz.itch.io)
- **Enemy Sprites**: [Gustavo Vituri](https://gvituri.itch.io)
- **Player Sprites**: [Frostwindz](https://frostwindz.itch.io)
- **Audio & SFX**: Sound assets from [freesound.org](https://freesound.org) (CC0 License)

---

## License 

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
