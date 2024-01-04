# SGI 2023/2024 - TP3

## Group T01 G05

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Mariana Rocha    | 202004656 | up202004656@up.pt  |
| Matilde Silva    | 202007928 | up202007928@up.pt  |

----
## Project information

* Ready, set, go! Our group has decided to go with a retro theme for the racing game. It includes [powerups](./MyPowerUp.js), [obstacles](./MyObstacle.js) and a [billboard](./MyBillboard.js) that displays the car at all times.

* To receive a powerup, collide with the powerup box and randomly one of the following options will take effect:
	- Super speed for the player;
	- Slow speed for the opponent.
[Powerup Icon](./textures/powerup.png)

* Before the powerup takes effect, the user will be asked to choose an obstacle type and then place it somewhere on the track. The obstacle effects are:
	- Red Car - Super speed for the opponnent;
	[Red Car Icon](./textures/speed_obstacle.png)
	- Internet Explorer - Slow speed for the player;
	[Internet Explorer Icon](./textures/slow_obstacle.png)
	- Match - Switch A and D keys.
	[Match Icon](./textures/firecracker_obstacle.png)

* Additionally, everytime the player car collides with the opponent car, or leaves the track, a slow speed penalty is activated.

* Lastly, the user can change the [game.xml](./game.xml) file to import the desired route.

* Check out some pictures of the gameplay:

# METER FOTOS AQUI

----
## Issues/Problems

- The cars' starting points are hard-coded, meaning they will always start in the same position, regardless of the provided route.
