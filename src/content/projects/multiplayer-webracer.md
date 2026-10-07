---
title: "Multiplayer Webracer Game"
order: 34
year: 2015
legacyPaths:
  - "/multiplayer-webracer/"
---

##  Motivation

Second screen is conquering the video game scene. Big companies like Nintendo or Sony implemented such features in their latest consoles. Nintendo created the [*Wii U GamePad*](https://www.nintendo.co.uk/Wii-U/Hardware-Features/Wii-U-GamePad/Wii-U-GamePad-663028.html), which has an integrated display, while Sony uses the *[PS Vita](https://www.playstation.com/en-us/explore/psvita/)* to enable *Remote Play.*

The problem with both of the described systems is that you need special hardware to be able to use the second screen features. Nowadays nearly everybody possesses a smartphone, which has a multi core processor. So why don’t we use the hardware, that we are carrying around with us all the time, as a second screen device?

This project evaluates the use of a second screen game created with the HTML5 game engine *[Phaser](http://phaser.io/)*.

![inagme\_player\_smaller](/uploads/2015/09/inagme_player_smaller.gif)![ingame\_spectator\_smaller](/uploads/2015/09/ingame_spectator_smaller.gif)

## Gameplay

In this game the smartphone acts as the controller (Player), while an other device with ideally a big screen acts as the spectator.
The game proceeds in two different phases.

#### Game phase:

**The car![output\_Vt0xNR](/uploads/2015/09/output_Vt0xNR.gif)**

Every player controls a car. Each car has the abilities to ignite a nitro and to fire a blast, that is blasting the other cars in the area away.

**The ball ![output\_Acm2e2](/uploads/2015/09/output_Acm2e2.gif)** 

The ball as the key feature in the game needs to be hit by the cars. Each hit gives the player a point and a coin and increments the counter of the ball by one. The hundredth hit lets the ball explode and takes the cars nearby along. Exploded cars loose their points but keep their coins for the tuning phase.

**Trapdoors ![output\_DtcNKe](/uploads/2015/09/output_DtcNKe.gif)** 

The level of chaos is increased by trapdoors, that are spread over the map. The trapdoor open in irregular intervals. Players, that are falling into open trapdoors, loose their points but keep their coins for the tuning phase.

**Bumpers![output\_xJdotD](/uploads/2015/09/output_xJdotD.gif)**

The bumpers, that are located in the corners of the map, let the ball rebound and ensure, that the ball does not get stuck in the corners.

#### Tuning Phase:

After the ball is exploded or if any player but one is fallen into a trapdoor, the second game phase, the tuning phase begins. In the tuning phase each player can improve the following features of his car:

Speed: Tuning the speed  increases the top speed of the car.
Handling: Handling determines the turn speed and the acceleration of the car.
Armor: Increasing the armor value improves the behavior of a car, when it is hit by a blast.
Ammunition: Ammunition is the amount of blasts a player can shoot during one round.
Boost: The boost value is the amount of  nitro boost a player can use during one round.

After twenty seconds the next game phase starts automatically.

## Programming

![racer\_diagram](/uploads/2015/09/racer_diagram.png)The game was programmed using the JavaScript framework [Meteor](https://www.meteor.com/) and the HTML5 game engine [Phaser](http://phaser.io/). On the server meteor enables the use of [Node.js](https://nodejs.org/) and has integrated support for WebSocket communication between the server and the clients.

With HTML5 you have the possibility to use the hardware sensors of devices like smartphones. It is possible to get information of, for example, the accelerometer. In this project the accelerometer was used to detect a shake of the device. Another HTML5 feature, that was used was the *Vibration API* to give the user feedback for specific events. Unfortunately HTML5 is not supported equally by all browsers. The Virbations API, for example, is not working on the Safari Browser for iOS devices. This leads to an inconsistent game behavior on different devices and can only be solved by finding exceptions for not supported features. But it can be assumed that the support for HTML5 features will improve with every upcoming browser update.

Phaser is an open source framework to create Canvas or WebGL powered HTML5 browser games. The focus on mobile browsers ensures that every available feature works good on a mobile device. Because it is open source and comes as one single JavaScript file it is easily expandable or can be easily integrated in other frameworks. The three build-in physics engines ([Arcade](http://phaser.io/docs/2.3/Phaser.Physics.Arcade.html), [Ninja](http://phaser.io/docs/2.4.3/Phaser.Physics.Ninja.html) or [P2.JS](http://phaser.io/docs/2.4.3/Phaser.Physics.P2.html)) give the developer the freedom to choose the best fitting physics behavior. In this project P2.JS was used since it is the most complex of the three engines and gives the most freedom for the development.

## Art

The game is presented in a cartoon style and uses an [isometric projection](http://www3.ul.ie/~rynnet/keanea/isometri.htm) as the perspective. The isometric projection enables a visual representation of three dimensions where technically only two dimensions are possible.

The car was created with the 3D graphics and animation software [Blender](https://www.blender.org/). A turnaround was animated and exported as single frames. Those frame where combined to a sprite sheet with the tool [Texturepacker](https://www.codeandweb.com/texturepacker).
Since the game is playable with up to 30 players it is necessary to have 30 different colored cars. The car was exported in grayscale and later on tinted dynamically in the program code.

![car1\_spritesheet](/uploads/2015/09/car1_spritesheet.png)

Other game elements like the traps or bumpers where animated using [Adobe Flash](http://www.adobe.com/de/products/flash.html) and also packed to a sprite sheet with Texturepacker. To complete the cartoon look a font was created and could be used as [bitmap text](http://phaser.io/docs/2.3/Phaser.BitmapText.html) in the game.

## Team:

-   Programming: [Lars Engel](http://l-engel.de)
-   Art / Music: [Lukas Fritsch](http://lukaspilgrim.com/)

## Links:

-   [Github](https://github.com/larsengel/webracer) Repository
