/*
    NAME:   "Nickel2.js"
    AUTH:   Ibrahim Sardar
    DESC:   A major update from Nickel.js.
    NOTE:   Does not require simpleGame.js anymore.

            Please see this reference in determining
            which functions/vars are public/private:
            < http://javascript.crockford.com/private.html >
*/



////////////////////////////////////////////
///   NICKEL   /////////////////////////////
////////////////////////////////////////////
var Nickel = {

  /* Static
   *  - states ( 6 different )
   *  - a transparent, 8x8 image
   *  - a debugging option
   *  - browser detection
   */
  DNE       : 0,
  STOPPED   : 1,
  MOVING    : 2,
  DEAD      : 3,
  RECRUITED : 4,
  DEPLOYED  : 5,
  NOTHING   : "nothing.png",
  DEBUG     : false,
  BROWSER   : function() {

      //
      // Where this code was copied from:
      //    http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
      //

      // Opera 8.0+
      var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

      // Firefox 1.0+
      var isFirefox = typeof InstallTrigger !== 'undefined';

      // Safari 3.0+ "[object HTMLElementConstructor]"
      var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

      // Internet Explorer 6-11
      var isIE = /*@cc_on!@*/false || !!document.documentMode;

      // Edge 20+
      var isEdge = !isIE && !!window.StyleMedia;

      // Chrome 1+
      var isChrome = !!window.chrome && !!window.chrome.webstore;

      // Blink engine detection
      var isBlink = (isChrome || isOpera) && !!window.CSS;

      // return which browser
      return isOpera ? 'Opera' :
             isFirefox ? 'Firefox' :
             isSafari ? 'Safari' :
             isChrome ? 'Chrome' :
             isIE ? 'IE' :
             isEdge ? 'Edge' :
             "Unknown";
  }(),

  /* Dynamic
   *  - player's score
   *  - global id counter
   */
  SCORE     : 0,
  ID        : 1000000,

  /* Main Update Function - User Should Implement This
   */
  update    : null
}



// --
// ------- GLOBAL FUNCTIONS ----------------------------------
// --



function __main() {
    // User must override/implement this function
    // after importing Nickel.js in their
    // own HTML file
    // This function is called every frame
    Nickel.update();
}



////////////////////////////////////////////
///   VIEWPORT   ///////////////////////////
////////////////////////////////////////////
function Viewport(html_canvas_element_id) {



    // --
    // ------- PROPERTIES ----------------------------------------
    // --



    // canvas
    this.canvas = document.createElement('canvas');
    document.getElementById(html_canvas_element_id).appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    // background
    this.bg_color = null;

    // time
    this.timer_id = 0;
    this.fps = 20;

    // cursor pos
    this.mouse_x = 0;
    this.mouse_y = 0;

    // mouse buttons (0=left, 1=middle, 2=right)
    this.mouse_downs = new Array(3);
    this.mouse_curr  = null;
    this.mouse_upped = null;

    // keys  (for reference: http://keycode.info/)
    this.key_downs = new Array(256);
    this.key_curr  = null;
    this.key_upped = null;



    // --
    // ------- UTILITIES -----------------------------------------
    // --



    this.clear = function() {
        //--    Clears the canvas
        //--

        this.context.clearRect(0,0,this.get_w(),this.get_h());
    }

    this.run = function() {
        //--    Controls frames per second
        //--    Also listens for/updates any hardware events
        //--

        // fps
        seconds = 1 / this.fps;
        milliseconds = seconds * 1000;
        this.timer_id = setInterval(__main,milliseconds);

        // reset key and mouse values
        this.reset_keys();
        this.reset_mouse();

        // update moved mouse value(s)
        document.onmousemove = function(ev) {
            this.mouse_x = ev.pageX;
            this.mouse_y = ev.pageY;
        }

        // update pressed key value(s)
        document.onkeydown = function(ev) {
            this.key_downs[ev.key] = true;
            this.key_curr = ev.key;
        }

        // update released key value(s)
        document.onkeyup = function(ev) {
            this.key_downs[ev.key] = false;
            this.key_upped = ev.key;
            if (ev.key == this.key_curr) {
                this.key_curr = null;
            }
        }

        // update pressed mouse value(s)
        document.onmousedown = function(ev) {
            this.mouse_downs[ev.button] = true;
            this.mouse_curr = ev.button;
        }

        // update released mouse value(s)
        document.onmouseup = function(ev){
            this.mouse_downs[ev.button] = false;
            this.mouse_upped = ev.button;
            if (ev.button == this.mouse_curr) {
                this.mouse_curr = null;
            }
        }
    }

    this.pause = function() {
        //--    Stops updating the viewport
        //--

        clearInterval(this.timer_id);
    }

    this.set_fps = function(fps) {
        //--    Set the fps for which this
        //--    viewport should run at

        this.fps = fps;
    }

    this.get_fps = function() {
        //--    Get this veiwport's fps
        //--

        return this.fps;
    }

    this.reset_keys = function() {
        //--    Resets all key's values' to false
        //--    (256 keys)

        for (var key=0; key<256; key++) {
            this.key_downs[key] = false;
        }
    }

    this.reset_mouse = function() {
        //--    Resets all mouse button values to false
        //--    (3 mouse buttons)

        for (var btn=0; btn<3; btn++) {
            this.mouse_downs[btn] = false;
        }
    }

    this.get_w = function() {
        //--    Return canvas width
        //--

        return this.canvas.width;
    }

    this.get_h = function() {
        //--    Return canvas height
        //--

        return this.canvas.height;
    }

    this.set_size = function(w,h) {
      //-- Set width and height of canvas in pixels
      //--

      this.canvas.width = w;
      this.canvas.height = h;
    }

    this.get_bg_color = function() {
        //--    Returns background color
        //--

        return this.bg_color;
    }

    this.set_bg_color = function(color) {
        this.bg_color = color;
        this.canvas.style.backgroundColor = color;
    }

    this.toggle_cursor = function(bool=true){
        //--    if bool is true, shows cursor
        //--    else, hides it

        if (bool) {
            this.canvas.style.cursor = "block";
        } else {
            this.canvas.style.cursor = "none";
        }
    }

    this.toggle_visibility = function(bool=true){
        //--    if bool is true, shows viewport
        //--    else, hides it

        if (bool) {
            this.canvas.style.display = "block";
        } else {
            this.canvas.style.display = "none";
        }
    }

}



////////////////////////////////////////////
///   SPRITE   /////////////////////////////
////////////////////////////////////////////
function Sprite(scene, image_data) {


    // --
    // ------- PROPERTIES ----------------------------------------
    // --


    // general
    this.scene = scene;
    this.canvas = scene.canvas;
    this.context = this.canvas.getContext("2d");

    // pic
    this.image = new Image();
    this.image.src = image_data.img;

    // size ******************************************   MAY NOT NEED
    this.width = image_data.w;
    this.height = image_data.h;

    // scale
    this.scale_x = 1;
    this.scale_y = 1;

    // pos (initially hide the sprite)
    this.x = scene.width;
    this.y = scene.height;

    // vel
    this.speed = 0;
    this.dx = 0;
    this.dy = 0;

    // acc
    this.accel = 0;

    // rot
    this.dir = 0; // angle of sprite's image
    this.rot = 0; // angle of sprite's movement
    this.dr = 0;
    this.max_rot = 0;

    // debug
    this.is_debug = false
    this.d_delay = 0
    this.d_timer = 0

    // other
    this.dead = false;
    this.visible = true;
    this.layer = 0;


    // --
    // ------- ESSENTIAL methods ---------------------------------
    // --


    this.update = function() {
        //--    Called every frame.
        //--    Updates changing parameters.
        //--

        // skip if marked for deletion
        if (this.dead == true) {
            return;
        }

        // update all movement
        this.move();

        // bounds the sprite appropriately
        this.bound();

        // user custom update
        this.update_more();

        // render graphics
        this.draw()
    }

    this.draw = function() {
        //--    Called every frame. Processes graphics
        //--    based on current parameters.
        //--

        // skip if marked for invisibility
        if (this.visibility == false || this.dead == true) {
            return
        }

        // degs to radians
        rot = this.rot * Math.PI / 180
        rot = rot * -1

        // draw
        ctx = this.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rot);
        // (params: img,x,y,w,h)
        ctx.drawImage( this.image,
                       (this.get_w() / 2) * -1,
                       (this.get_h() / 2) * -1,
                       this.get_w(),
                       this.get_h() );
        ctx.restore();
    }

    this.destroy = function() {
        //--    Marks current instance for deletion
        //--

        this.dead = true;
        this.visibility = false;
    }

    this.hide = function() {
        //--    Marks current instance's visibility to hidden
        //--

        this.visibility = false;
    }

    this.show = function() {
        //--    Marks current instance's visibility to shown
        //--

        this.visibility = true;
    }


    // --
    // ------- SUB-ESSENTIAL methods -----------------------------
    // --


    this.move = function() {
        //--    Called in update. Updates position and
        //--    rotation.
        //--


        //   acceleration:
        //
        // linear
        this.speed = this.speed + this.accel;
        // angular
        this.rot = this.rot + this.dr;
        this.dir = this.dir + this.dr;


        //   speed:
        //
        // get radians
        theta = this.dir * Math.PI / 180;
        theta = theta * -1;
        // speed vector
        this.dx = Math.cos(theta) * this.speed;
        this.dy = Math.sin(theta) * this.speed;
        // update difference in x and y position
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }

    this.bound = function() {
        //--    Called in update. Default destroy
        //--    on leave screen +/-50 pixels.
        //--    Meant to be over-ridden.
        //--

        offset = 50;

        w = this.scene.get_w();
        h = this.scene.get_h();
        r = this.get_right() + offset;
        t = this.get_top() - offset;
        l = this.get_left() - offset;
        b = this.get_bottom() + offset;

        if (r < 0 ||
            t > h ||
            l > w ||
            b < 0) {

            this.destroy()
        }
    }

    this.update_more = function() {
        //--    Called in update. Meant to be over-ridden.
        //--

    }


    // --
    // ------- GET methods ---------------------------------------
    // --


    // +++
    // +++ > visual:


    this.get_w = function() {
        //--    Returns width of sprite
        //--

        return this.image.naturalWidth * this.scale_x;
    }

    this.get_h = function() {
        //--    Returns width of sprite
        //--

        return this.image.naturalHeight * this.scale_y;
    }

    this.get_w_orig = function() {
        //--    Returns width of sprite
        //--

        return this.image.naturalWidth;
    }

    this.get_h_orig = function() {
        //--    Returns width of sprite
        //--

        return this.image.naturalHeight;
    }

    this.get_pic = function() {
        //--    Returns the image object of the sprite
        //--

        return this.image;
    }

    this.get_scalex = function() {
        //--    Returns image scale in the x direction
        //--

        return this.scale_x;
    }

    this.get_scaley = function() {
        //--    Returns image scale in the y direction
        //--

        return this.scale_y;
    }


    // +++
    // +++ > positional:


    this.get_x = function() {
        //--    Returns accurate x position (left)
        //--

        return this.x;
    }

    this.get_y = function() {
        //--    Returns accurate y position (top)
        //--

        return this.y;
    }

    this.get_pos = function() {
        //--    Returns accurate position (top left)
        //--

        return [this.x, this.y];
    }

    this.get_cx = function() {
        //--    Returns accurate center x position
        //--

        return this.x + (this.get_w() / 2);
    }

    this.get_cy = function() {
        //--    Returns accurate center y position
        //--

        return this.y + (this.get_y() / 2);
    }

    this.get_center = function() {
        //--    Returns accurate center position
        //--

        return [this.get_cx(), this.get_cy()];
    }

    this.get_right = function() {
        //--    Returns accurate right x position
        //--

        return this.x + this.get_w();
    }

    this.get_top = function() {
        //--    Returns accurate top y position
        //--

        return this.y;
    }

    this.get_left = function() {
        //--    Returns accurate left x position
        //--

        return this.x;
    }

    this.get_bottom = function() {
        //--    Returns accurate bottom y position
        //--

        return this.y + this.get_h();
    }


    // +++
    // +++ > speed-related:


    this.get_speedx = function() {
        //--    Returns accurate speed in
        //--    x direction
        //--

        rads = this.dir * Math.PI / 180;
        return Math.cos(rads) * this.speed;
    }

    this.get_speedy = function() {
        //--    Returns accurate speed in
        //--    y direction
        //--

        rads = this.dir * Math.PI / 180;
        return Math.sin(rads) * this.speed * -1;
    }

    this.get_speed = function() {
        //--    Returns accurate speed
        //--

        return this.speed;
    }


    // +++
    // +++ > acceleration-related:


    this.get_accelx = function() {
        //--    Returns the accurate acceleration
        //--    in the x direction.
        //--

        rads = this.dir * Math.PI / 180;
        return Math.cos(rads) * this.accel;
    }

    this.get_accely = function() {
        //--    Returns the accurate acceleration
        //--    in the y direction.
        //--

        rads = this.dir * Math.PI / 180;
        return Math.sin(rads) * this.accel * -1;
    }

    this.get_accel = function() {
        //--    Returns the accurate acceleration.
        //--

        return this.accel;
    }


    // +++
    // +++ > angular:


    this.get_dir = function() {
        //--    Returns the accurate direction
        //--    (global deg)
        //--

        return this.dir;
    }

    this.get_rot = function() {
        //--    Returns the accurate rotation
        //--    (local deg)
        //--

        return this.rot;
    }

    this.get_ang_speed = function() {
        //--    Returns the accurate angular acceleration.
        //--    (angular difference per update -> deg)

        return this.dr;
    }


    // +++
    // +++ > other:


    this.is_destroyed = function() {
        //--    True if sprite is destroyed
        //--

        return this.dead;
    }

    this.get_layer = function() {
        //--    Returns sprite's collision layer
        //--    (not meant for visual layers)

        return this.layer;
    }


    // --
    // ------- SET methods ---------------------------------------
    // --


    // +++
    // +++ > visuals
    this.set_pic = function(src) {
        //--    Inits sprite graphics. "img" is
        //--    the path of the image file.

        this.image.src = src;
    }

    this.scale = function(n) {
        //--    Scale sprite by n
        //--

        this.scale_x = n;
        this.scale_y = n;
    }

    this.scale_width = function(n) {
        //--    Scale sprite's width by n
        //--

        this.scale_x = n;
    }

    this.scale_height = function(n) {
        //--    Scale sprite's height by n
        //--

        this.scale_y = n;
    }


    // +++
    // +++ > positional:


    this.set_x = function(x) {
        //--    Sets x position (left)
        //--

        this.x = x;
    }

    this.set_y = function(y) {
        //--    Sets y position (top)
        //--

        this.y = y;
    }

    this.set_pos = function(x,y) {
        //--    Sets position (topl left)
        //--

        this.x = x;
        this.y = y;
    }

    this.set_cx = function(cx) {
        //--    Sets center x position
        //--

        this.x = cx - (this.get_w() / 2);
    }

    this.set_cy = function(cy) {
        //--    Sets center y position
        //--

        this.y = cy - (this.get_h() / 2);
    }

    this.set_center = function(cx,cy) {
        //--    Sets center position
        //--

        this.set_cx(cx);
        this.set_cy(cy);
    }

    this.set_right = function(rx) {
        //--    Sets right x position.
        //--

        this.x = rx - this.get_w();
    }

    this.set_leftt = function(lx) {
        //--    Sets left x position.
        //--

        this.x = lx;
    }

    this.set_top = function(ty) {
        //--    Sets top y position.
        //--

        this.y = ty;
    }

    this.set_bottom = function(by) {
        //--    Sets bottom y position.
        //--

        this.y = by - this.get_h();
    }


    // +++
    // +++ > speed-related:


    this.set_speed = function(spd) {
        //--    Sets the accurate speed
        //--

        this.speed = spd;
    }


    // +++
    // +++ > acceleration-related:


    this.set_accel = function(acl) {
        //--    Sets the accurate acceleration
        //--

        this.accel = acl;
    }


    // +++
    // +++ > angular:


    this.set_dir = function(degs) {
        //--    Sets the accurate direction
        //--    of motion
        //--

        this.dir = degs;
    }

    this.set_rot = function(degs) {
        //--    Sets the accurate rotation
        //--    of the sprite

        this.rot = degs;
    }

    this.set_turn = function(degs) {
        //--    Turns the sprite as well as its
        //--    direction of motion
        //--

        this.set_dir(degs);
        this.set_rot(degs);
    }

    this.set_ang_speed = function(spd) {
        //--    Sets the acurate angular acceleration
        //--    (difference in degs per update)
        //--

        this.dr = -1 * spd;
    }


    // +++
    // +++ > other:


    this.set_layer = function(level) {
        //--    Returns sprite's collision layer
        //--    (not meant for visual layers)

        this.layer = level;
    }


    // --
    // ------- OTHER methods -------------------------------------
    // --


    this.colliding = function(spr) {
        //--    If input sprite is colliding and is in
        //--    the same layer as self, return true
        //--

        // you
        urr = spr.get_right();
        urt = spr.get_top();
        url = spr.get_left();
        urb = spr.get_bottom();
        // me
        myr = this.get_right();
        myt = this.get_top();
        myl = this.get_left();
        myb = this.get_bottom();

        // check layer
        if (spr.get_layer() == this.get_layer()) {
            // check collision
            if (myr > url &&
                myt < urb &&
                myl < urr &&
                myb > urt) {

                return true;
            }
        }

        return false;
    }

} // end of Sprite Class



// --
// ------- DATA STRUCTURES -----------------------------------
// --



////////////////////////////////////////////
///   STACK  ///////////////////////////////
////////////////////////////////////////////
function Stack() {

    var list = [];

    this.push = function(obj) {
        list.push(obj);
    }

    this.pop = function() {
        return list.pop();
    }

    this.top = function() {
        return list[list.length-1];
    }

    this.is_empty = function() {
        return !list.length;
    }

    this.count = function() {
        return list.length;
    }

    this.clear = function(){
        list = [];
    }
}



////////////////////////////////////////////
///   QUEUE  ///////////////////////////////
////////////////////////////////////////////
function Queue() {

    var list = [];

    this.in = function(obj) {
        list.push(obj);
    }

    this.next = function() {
        return list[list.length-1];
    }

    this.out = function() {
        return list.shift();
    }

    this.is_empty = function() {
        return !list.length;
    }

    this.count = function() {
        return list.length;
    }

    this.clear = function(){
        list = [];
    }
}
