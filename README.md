# Nickel2.js
🔶 **Note:**

*OK so if you looked at the code, don't panic... I just wanted to make a simple update that was a tad bit better than the original Nickel.js, turns out there is a ton more to game engines than I realized! So I kind of offshooted from my original plan, with the focus on implementing certain algorithms so I could learn some advanced techniques instead of software design and cleanliness. If you like clanky, 2D, RTS-focused game engines with a lot of random features, you've found your engine!*

🔶

A complete overhaul of the original Real Time Strategy (RTS) Game Engine, 'Nickel.js'.

Currently in the making, very experimental and crazy!

Will no longer require simpleGame.js.

[Check Out the Latest Developement!](http://ibrahimsardar.rf.gd/)

-----
### Updates:

##### 5/10/2019:

This update was after the AI & Collision Demo was finilaized. Major changes, fixes, and improvements on Behavior AI and Particle Effects in Nickel2.js as well as some additions to the N2Base.js Collision and Physics systems. Added SimpleText object to N2Base.js as well.

- Particle Effects are now completely customizable down to the particle. Each particle has knowledge of it's emitter as well as a new optional parent paramter.

- Behavior AI now has new and improved behavior functions. BOIDS performance has improved greatly. Avoid obstacle behavior has also been added. Other behaviors like seek, wander, etc have also been improved and new versions of those functions have been added, resulting in old behavior functions to become obsolete.

- SimpleText is a simple text object where users can customize color, weight, and other properties as well as dynamically change them; great for UI and UX in games.

##### 1/16/2018:

Bulk of particle system has been completed. Only a few touch-ups left. In the meantime, some fire:

![F I R E !](https://github.com/Ibsardar/Nickel2.js/blob/master/screenshots/ParticleSystem%20-%20Fire.jpg?raw=true)

-----

### Main Features So Far:

 - Basic Sprite engine with full transformation support
 
 - Basic Map transformation support (translate, rotate, scale)
 
 - Tiled Map creation (no editor yet)
 
   - Basic sprite placement implemented
   
   - Basic accessibility of placed objects
 
 - Bounding Box and other simple shapes
 
 - Collision support with multiple variants and optional QuadTree optimizations
 
 - Simplified Game Loop
 
 - Viewport object supports simplifying access to the following events:
  
   - Scroll
   
   - Mouse
   
   - Keyboard
   
 - AI Agent Motor/Behavior Capabilities with basic 2D physics
 
 - Pathfinding for multiple applications (un-optimized)
 
 - Simple Line-Of-Sight function (un-optimized)
   
 -----
   
### Main Objects So Far:
 
 - Viewport
   
 - Sprite
   
 - Grid
 
 - SpriteSelector
 
 - Locomotive
 
### Static Utility Objects:

 - Nickel
 
 - Pathfinder
 
 - Collider

### Data Structures:

 - Heap (min or max)
 
 - Stack
 
 - Queue
 
 - QuadTree
   
### Other Global Objects/Functions/Variables:

 - SimplePoly
 
 - SimpleEllipse
 
 - SimpleLine
 
 - LineSegment
 
 - BoundingBox

 - Tile
 
 - NavNode
 
 - HeapNode
 
 - QuadTreeNode
 
 - QuadTreeObj
 
 - TileBuilder
 
 - NavBuilder
 
 - NavNodeBuilder
 
 - GridBuilder
 
 - GUIBuilder
 
 - LocomotiveBuilder
 
 - __main (hidden function used by Viewport)
 
*some objects not listed - I will hopefully create a much better resource for documentation later because that's important* **:)**
 
