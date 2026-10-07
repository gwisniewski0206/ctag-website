---
title: "Space Game Visualization Engine"
order: 29
year: 2016
legacyPaths:
  - "/space-game-visualization-engine/"
---

The SpaceGame is a collaborative project of the [Creative Technologies](/) group at the [FH-Kiel – University of Applied Sciences](https://www.fh-kiel.de/) in Germany. The aim is to create a multiplayer game, in which the players take control of spaceships, interacting with each other or discovering the galaxy. Interaction among each other can be in a hostile or in a friendly manner. There will be an auction house system, computer controlled NPCs and more. The amount of future features and complexity will be determined by the participating students. Any ideas to extend the game are welcome and can be discussed during the Creative Technologies meetings.

The game can be played with any modern browser without installation or use of special plugins. It is written in JavaScript and uses the WebGL library [three.js](http://threejs.org/).

/uploads/2016/05/v5.mov

## Contributors

### Programming

-   Torben Hartmann
-   Gero Baron
-   Andre Rother

### 3D SpaceShip Model

-   Ole Wagenknecht

## About this Documentation

This documentation consists of a global description of the game, the used techniques/libraries and its structure.

The whole project is structured in modules. The main modules and classes of this project are listed in the full documentation on the FH-Kiel GitLab. Every public method is visible and documented. Private members and methods are documented in the source code as inline comments. If information about private methods and attributes are needed, please look at the inline comments. A reference to the code is given in each module definition.

## Objectives

The aim was to build a foundation for other students who will follow up and expand the game. We developed a modular basis, so that further students can easily create additions to the game without the hassle to build a complete game from scratch. The current demo gives a first impression of the game and serves as inspiration for future projects. In addition, project supervisors are able to show interested students a running game, in which they can be part of.

This is a list of our in game goals:

-   Create a solar system, where any number and form of planets can easily be added by a simple data format (which could be created by a procedural generator)
    -   Planet hierarchy with parent-child relationships (sun-planets/planet-moons)
    -   Implementation of a light system (sun is the source of light for the whole solar system)
-   Development and implementation of a custom shader (for a planet surface)
-   Handling the import of a 3d spaceship model (which represents the player) into the created solar system
-   Implementation of a basic keyboard/mouse control to fly a spaceship through the solar system
-   Collision detection of the spaceship and planets
-   Planet hover effects (MouseIn/MouseMove/MouseOut) to show planet information (name/distance) and prepare the implementation of further features
-   Start screen

#gallery-1 { margin: auto; } #gallery-1 .gallery-item { float: left; margin-top: 10px; text-align: center; width: 50%; } #gallery-1 img { border: 2px solid #cfcfcf; } #gallery-1 .gallery-caption { margin-left: 0; } /\* see gallery\_shortcode() in wp-includes/media.php \*/

![](/uploads/2016/05/sp.png)

![](/uploads/2016/05/sp2.png)



## Libraries used

### Three.js

Three.js is a library used to create, display and animate 3D components in a web browser via WebGL without the need of additional plugins. It provides a simplified syntax to use WebGL.

### Require.js

Require.js is a JavaScript file and module loader. It is possible to specify a JavaScript file as a module, to load specific elements of a JavaScript file into another or to use it to define a specific order, in which the files are loaded. By specifying modules, methods and variables are bound to its namespace. require.js also provides an optimizer and minimizer tool.

### amd-three.js

This is a best practice template, how to use require.js in conjunction with Three.js in an asynchronous module structure.

### Bootstrap

Boostrap is a HTML, CSS and JavaScript framework to create modern responsive projects. It is used to create the start screen.

### jQuery

jQuery is a JavaScript library, to navigate and to manipulate the document object model (DOM).

## Best practice structure – amd-three.js

### General Information

amd-three.js is an example of how to structure an [three.js](http://threejs.org/) application, with functionality split into different [Require.js](http://requirejs.org/) modules.

It is meant as a starting point for more involved projects involving three.js, where having all the code in one file can quickly get unwieldy.

It is also useful for prototyping, as a lot of the boilerplate is moved out of your way.

### Structure

The structure of the file is as per the recommendations in the docs for Require.js. Namely, all the Javascript lives in the **js** folder, with the Three.js library and extension code in **js/lib**, while the app specific code is in **js/app**. The idea is that you shouldn’t ever need to modify the files in **js/lib**, only add third party code.

The common three.js constructs, e.g. camera, renderer are all put into their own modules within the **js/app** directory, and are injected into the **js/app/app.js** file where they are brought together. They sometimes include each other, e.g. the light module needs to know about the scene. By splitting these object into modules, we are in essence creating singletons, which means we don’t have to worry about which order we create them in, as Require.js will figure out the dependencies fo us.

### Shaders

Custom shaders are put in **/js/shaders** and are saved as .vert or .frag files, for ease of editing. Shaders are loaded into the app using a Require.js plugin which can be found at **js/lib/shader**. This allow you to get the shader code in a module like so:

`define( ["three", "shader!simple.frag"], function ( THREE, simpleFrag ) {   // Value of shader is now in simpleFrag.value   // The shader object also supports redefinition of #define statements   simpleFrag.define( "faceColor", "vec3(1.0, 0, 0)" );   ...`

![sp3](/uploads/2016/05/sp3.png)

[Source](https://github.com/felixpalmer/amd-three.js)

## The File Structure

The game can be started by accessing the index.html file on a webserver (ides like webstorm start a local webserver automatically). The file is located in the root directory of this project. It loads the require.js file, which loads all .js files in an optimized order, based on the defined module structure.

-   **/css** – style definitions
-   **/docs** – documentation
-   **/gfx** – images for menu and player hud
-   **/js** – game logic
    -   **/app** – developed game modules
    -   **/data** – templates for planets, solar system structure, spaceship models
    -   **/lib** – third party libraries
    -   **/shaders** – developed shaders for planets
    -   **main.js** – starting point (first file loaded to start the game)
    -   **config.js** – configuration file for require.js containing paths to modules and libraries
-   **/textures** – textures (images) used in game
-   **index.html** – html container for the game

## The game format: Creation of the galaxy

The idea of the game format is a map representing any number of galaxies where every galaxy consists of any number of solar systems. The galaxy.js file represents a single solar system. All elements of solar system are organized in child-parent relationships, where the center of the solar system (usually the sun) is the main parent object.

`// parent object   {   implements: [],   children : [   // child object   {   implements: [],   children: [   // child of child object   {   ...   }   ]   },   // child object   {   implements: []   },   ...   ]   }`

Single planets within this solar system are created by using templates, defined in the templates.js file. Based on this structure it is possible to create different solar systems without a single line of THREE.js code. To create a planet one can implement templates by using the ‘implements’ attribute.

`implements: [   ['sphere', {   name: 'Earth'   // radius of the planet   , radius: 6371   // position related to parentobject (in this case: distance earth to sun)   // [x,y,z] coordinates   , position: [0, 0, -1495970]   // speed/axis of planets own rotation and rotation of child objects around planet (e.g. moon of earth)   , rotation: [0, 0.0005, 0]   }],   'surface_earth',   ['clouds', {rotation: [0.0001, 0.001, 0]}]   ]`

Any planet consists of a sphere or bufferedsphere object which represents the planet body. Every template has its own default settings which can be overridden by using arguments as seen in the example above. Every planet can receive a second template to create a special surface. **Note:** For normal texture based surfaces use sphere (e.g. surface\_earth), for shader based surfaces use a bufferedsphere (e.g surface\_lava).
In addition a third template can be added to implement effects like clouds. Templates can be used multiple times and a single planet can implement any number of templates.

## Helpful ressources

-   [three.js Homepage](http://threejs.org)
-   [Example for planets and shaders](https://stars.chromeexperiments.com/)
-   [RequireJS Homepage](http://requirejs.org)
-   [Example of how to structure a three.js project with AMD, using Require.js](https://felixpalmer.github.io/amd-three.js/)
