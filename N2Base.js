/*
    NAME:   "N2Base.js"
    AUTH:   Ibrahim Sardar
    DESC:   Base functionality of Nickel2.js

    TODO:   upgrade from legacy keyCode to modern key/code
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
    DEBUG     : false,
    KEYCODES  : {
        BACKSPACE   : 8,
        TAB         : 9,
        ENTER       : 13,
        SHIFT       : 16,
        CTRL        : 17,
        ALT         : 18,
        PAUSE       : 19,
        CAPSLOCK    : 20,
        ESCAPE      : 27,
        SPACE       : 32,
        PAGEUP      : 33,
        PAGEDOWN    : 34,
        END         : 35,
        HOME        : 36,
        LEFTARROW   : 37,
        UPARROW     : 38,
        RIGHTARROW  : 39,
        DOWNARROW   : 40,
        INSERT      : 45,
        DELETE      : 46,
        K_0         : 48,
        K_1         : 49,
        K_2         : 50,
        K_3         : 51,
        K_4         : 52,
        K_5         : 53,
        K_6         : 54,
        K_7         : 55,
        K_8         : 56,
        K_9         : 57,
        K_A         : 65,
        K_B         : 66,
        K_C         : 67,
        K_D         : 68,
        K_E         : 69,
        K_F         : 70,
        K_G         : 71,
        K_H         : 72,
        K_I         : 73,
        K_J         : 74,
        K_K         : 75,
        K_L         : 76,
        K_M         : 77,
        K_N         : 78,
        K_O         : 79,
        K_P         : 80,
        K_Q         : 81,
        K_R         : 82,
        K_S         : 83,
        K_T         : 84,
        K_U         : 85,
        K_V         : 86,
        K_W         : 87,
        K_X         : 88,
        K_Y         : 89,
        K_Z         : 90,
        LEFTWIN     : 91,
        RIGHTWIN    : 92,
        SELECT      : 93,
        NUMPAD_0    : 96,
        NUMPAD_1    : 97,
        NUMPAD_2    : 98,
        NUMPAD_3    : 99,
        NUMPAD_4    : 100,
        NUMPAD_5    : 101,
        NUMPAD_6    : 102,
        NUMPAD_7    : 103,
        NUMPAD_8    : 104,
        NUMPAD_9    : 105,
        MULTIPLY    : 106,
        ADD         : 107,
        SUBTRACT    : 109,
        DECIMALPT   : 110,
        DIVIDE      : 111,
        F1          : 112,
        F2          : 113,
        F3          : 114,
        F4          : 115,
        F5          : 116,
        F6          : 117,
        F7          : 118,
        F8          : 119,
        F9          : 120,
        F10         : 121,
        F11         : 122,
        F12         : 123,
        NUMLOCK     : 144,
        SCROLLLOCK  : 145,
        SEMICOLON   : 186,
        EQUALS      : 187,
        COMMA       : 188,
        DASH        : 189,
        PERIOD      : 190,
        FRONTSLASH  : 191,
        ACCENT      : 192,
        OBRACKET    : 219,
        BACKSLASH   : 220,
        CBRACKET    : 221,
        SINGLEQUOTE : 222
    },
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
        return  isOpera ? 'Opera' :
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

}//end Nickel



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



// --
// ------- GLOBAL OBJECTS ------------------------------------
// --



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
    this.fps      = 30;

    // cursor pos
    this.mouse_x = this.canvas.width/2;
    this.mouse_y = this.canvas.height/2;

    // scroll
    this.wheel_impulse = 0; // value of last scroll impulse
    this.wheel_delta   = 0; // value of net scroll

    // mouse buttons (0=left, 1=middle, 2=right)
    this.mouse_downs = Array(3);
    this.mouse_curr  = null;
    this.mouse_upped = null;

    // keys  (for reference: http://keycode.info/)
    this.key_downs = Array(256);
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
        //--    Also listens for and updates any hardware events
        //--

        // fps
        var seconds = 1 / this.fps;
        var milliseconds = seconds * 1000;
        this.timer_id = setInterval(__main,milliseconds);

        // reset key, mouse, & wheel values
        this.reset_keys();
        this.reset_mouse();
        this.reset_wheel();

        // globalize 'this' for use below
        self = this;

        // update moved mouse value(s)
        self.canvas.addEventListener('mousemove',function(ev){
            var c = $(self.canvas);
            var p = c.position();
            self.mouse_x = ev.clientX - p.left;
            self.mouse_y = ev.clientY - p.top;
        });

        // update moved scroll values(s)
        self.canvas.addEventListener('wheel',function(ev){
            ev.preventDefault();
            //console.log(ev);
            var dir = ev.deltaY > 0 ? -1 : 1 ;
            var power = 150;
            self.wheel_impulse = (dir * power);
            self.wheel_delta += (dir * power);
            console.log('Scroll (impulse, delta): ' + self.wheel_impulse + " , " + self.wheel_delta);
            return false;
        });

        // update pressed key value(s)
        document.onkeydown = function(ev) {
            //console.log(ev.key);
            //function keys default action will not be ignored:
            if (ev.key != 'F1'  && ev.key != 'F2'  && ev.key != 'F3' &&
                ev.key != 'F4'  && ev.key != 'F5'  && ev.key != 'F6' &&
                ev.key != 'F7'  && ev.key != 'F8'  && ev.key != 'F9' &&
                ev.key != 'F10' && ev.key != 'F11' && ev.key != 'F12') {
                ev.preventDefault();
            }
            self.key_downs[ev.keyCode] = true;
            self.key_curr = ev.keyCode;
        }

        // update released key value(s)
        document.onkeyup = function(ev) {
            //console.log(ev.key);
            ev.preventDefault();
            self.key_downs[ev.keyCode] = false;
            self.key_upped = ev.keyCode;
            if (ev.keyCode == self.key_curr) {
                self.key_curr = null;
            }
        }

        // update pressed mouse value(s)
        self.canvas.addEventListener('mousedown',function(ev){
            //console.log(ev.button);
            self.mouse_downs[ev.button] = true;
            self.mouse_curr = ev.button;
        });

        // update released mouse value(s)
        self.canvas.addEventListener('mouseup',function(ev){
            //console.log(ev.button);
            self.mouse_downs[ev.button] = false;
            self.mouse_upped = ev.button;
            if (ev.button == self.mouse_curr) {
                self.mouse_curr = null;
            }
        });
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

    this.reset_wheel = function() {
        //--    Resets mouse wheel tracking variables
        //--

        this.wheel_impulse = 0;
        this.wheel_delta   = 0;
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

}//end Viewport



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
    if (image_data.img) {
        this.image = new Image();
        this.image.src = image_data.img;
    } else {
        this.image = null;
    }

    // size
    this.width = image_data.w;
    this.height = image_data.h;

    // scale
    this.scale_global = 1;
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
    this.origin = [0,0]; // default topleft


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
        this.image && this.draw();
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
        var rot = this.rot * Math.PI / 180
        rot = rot * -1

        // draw
        var ctx = this.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rot);
        // (params: img,x,y,w,h)
        ctx.drawImage( this.image,
                       0,
                       0,
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
        var theta = this.dir * Math.PI / 180;
        theta = theta * -1;
        // speed vector
        this.dx = Math.cos(theta) * this.speed * this.scale_global;
        this.dy = Math.sin(theta) * this.speed * this.scale_global;
        // update difference in x and y position
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }

    this.bound = function() {
        //--    Called in update. Default destroy
        //--    on leave screen +/-50 pixels.
        //--    Meant to be over-ridden.
        //--

        var offset = 50;

        var w = this.scene.get_w();
        var h = this.scene.get_h();
        var r = this.get_right() + offset;
        var t = this.get_top() - offset;
        var l = this.get_left() - offset;
        var b = this.get_bottom() + offset;

        if (r < 0 ||
            t > h ||
            l > w ||
            b < 0) {

            this.destroy();
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

        if (this.image && this.image.complete) {
            return this.image.naturalWidth * this.scale_x * this.scale_global;
        } else {
            return this.width * this.scale_x * this.scale_global;
        }
    }

    this.get_h = function() {
        //--    Returns width of sprite
        //--

        if (this.image && this.image.complete) {
            return this.image.naturalHeight * this.scale_y * this.scale_global;
        } else {
            return this.height * this.scale_y * this.scale_global;
        }
    }

    this.get_w_orig = function() {
        //--    Returns width of sprite
        //--

        if (this.image && this.image.complete) {
            return this.image.naturalWidth;
        } else {
            return this.width;
        }
    }

    this.get_h_orig = function() {
        //--    Returns width of sprite
        //--

        if (this.image && this.image.complete) {
            return this.image.naturalHeight;
        } else {
            return this.height;
        }
    }

    this.get_pic = function() {
        //--    Returns the image object of the sprite
        //--

        return this.image;
    }

    this.get_scaleg = function() {
        //--    Returns global scale of sprite
        //--

        return this.scale_global;
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

        return this.y + (this.get_h() / 2);
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

    this.get_topleft = function() {
        //--    Returns accurate topleft coordinates
        //--

        return [this.x,this.y];
    }

    this.get_topright = function() {
        //--    Returns accurate topright coordinates
        //--

        var theta = this.trim_angle(this.get_rot())
        theta = theta * Math.PI / 180;
        return [this.x + (Math.cos(theta) * this.get_w()),
                this.y - (Math.sin(theta) * this.get_w())];
    }

    this.get_bottomleft = function() {
        //--    Returns accurate bottomleft coordinates
        //--

        var theta = this.trim_angle(this.get_rot())
        theta = theta * Math.PI / 180;
        return [this.x + (Math.sin(theta) * this.get_h()),
                this.y + (Math.cos(theta) * this.get_h())];
    }

    this.get_bottomright = function() {
        //--    Returns accurate bottomright coordinates
        //--

        var theta = this.trim_angle(this.get_rot())
        theta = theta * Math.PI / 180;
        return [this.x + (Math.cos(theta) * this.get_w()) + (Math.sin(theta) * this.get_h()),
                this.y - (Math.sin(theta) * this.get_w()) + (Math.cos(theta) * this.get_h())];
    }


    // +++
    // +++ > speed-related:


    this.get_speedx = function() {
        //--    Returns accurate speed in
        //--    x direction
        //--

        var rads = this.dir * Math.PI / 180;
        return Math.cos(rads) * this.speed;
    }

    this.get_speedy = function() {
        //--    Returns accurate speed in
        //--    y direction
        //--

        var rads = this.dir * Math.PI / 180;
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

        var rads = this.dir * Math.PI / 180;
        return Math.cos(rads) * this.accel;
    }

    this.get_accely = function() {
        //--    Returns the accurate acceleration
        //--    in the y direction.
        //--

        var rads = this.dir * Math.PI / 180;
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
    this.set_pic = function(img_data) {
        //--    Inits sprite graphics. "img_data" is
        //--    the object containing the 'src', 'w',
        //--    & 'h' of the image
        //--

        // pic
        if (img_data.img) {
            this.image = new Image();
            this.image.src = img_data.img;
        } else {
            this.image = null;
        }

        // size
        this.width = img_data.w;
        this.height = img_data.h;
    }

    this.set_w = function(w) {
        //--    Set width by resizing the scale_x
        //--

        this.scale_x = w / this.width / this.scale_global;
    }

    this.set_h = function(h) {
        //--    Set height by resizing the scale_y
        //--

        this.scale_y = h / this.height / this.scale_global;
    }

    this.set_size = function(w,h) {
        //--    Set size by resizing the scale
        //--

        this.set_w(w);
        this.set_h(h);
    }

    this.set_scale = function(n) {
        //--    Scale sprite by n
        //--

        this.scale_x = n;
        this.scale_y = n;
    }

    this.set_scalex = function(n) {
        //--    Scale sprite's width by n
        //--

        this.scale_x = n;
    }

    this.set_scaley = function(n) {
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
        //--    Sets position (top left)
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

    this.set_left = function(lx) {
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
        var urr = spr.get_right();
        var urt = spr.get_top();
        var url = spr.get_left();
        var urb = spr.get_bottom();
        // me
        var myr = this.get_right();
        var myt = this.get_top();
        var myl = this.get_left();
        var myb = this.get_bottom();

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

    this.mimic = function(spr, pos=true, ang=true, spd=true, acc=true, sca=true ) {
        //--    Mimics another sprites attributes
        //--    depending on special arguments
        //--

        // pos : mimic x,y position
        if (pos) {
            this.set_pos(spr.get_x(),spr.get_y());
        }

        // ang : mimic dir, rot
        if (ang) {
            this.set_dir(spr.get_dir());
            this.set_rot(spr.get_rot());
        }

        // spd : mimic speed, dr
        if (spd) {
            this.set_speed(spr.get_speed());
            this.set_ang_speed(spr.get_ang_speed());
        }

        // acc : mimic accel
        if (acc) {
            this.set_accel(spr.get_accel());
        }

        // sca : mimic scale x,y
        if (sca) {
            this.set_scalex(spr.get_scalex());
            this.set_scaley(spr.get_scaley());
        }
    }

    this.trim_angle = function(angle) {
        //--    Trims degrees to be 0 to 359
        //--

        if (angle >= 360) {
            return this.trim_angle(angle - 360);
        } else if (angle < 0) {
            return this.trim_angle(angle + 360);
        } else {
            return angle
        }
    }

    this.bound_around = function(spr) {
        //--    Resizes and repositions self to act as a
        //--    bounding box around another sprite
        //--

        // corners of sprite
        var tl = spr.get_topleft();
        var tr = spr.get_topright();
        var bl = spr.get_bottomleft();
        var br = spr.get_bottomright();

        // top left of b.box
        var AXnew = Math.min(tl[0], tr[0], bl[0], br[0]);
        var AYnew = Math.min(tl[1], tr[1], bl[1], br[1]);

        // dimensions of b.box
        var Wnew = Math.max(tl[0], tr[0], bl[0], br[0]) - AXnew;
        var Hnew = Math.max(tl[1], tr[1], bl[1], br[1]) - AYnew;

        // apply
        this.set_rot(0);
        this.set_size(Wnew,Hnew);
        this.set_pos(AXnew,AYnew);
    }

    this.offset_position = function(x,y) {
        //--    Offsets position via adding to
        //--    x and y coordinates
        //--

        this.x += x;
        this.y += y;
    }

    this.offset_direction = function(angle,origin) {
        //--    Offsets direction via rotation matrix
        //--    calculations
        //--

        this.rotate_around(angle,origin);
        this.dir += angle;
    }

    this.offset_rotation = function(angle,origin) {
        //--    Offsets rotation via rotation matrix
        //--    calculations
        //--

        this.rotate_around(angle,origin);
        this.rot += angle;
    }

    this.offset_turn = function(angle,origin) {
        //--    Offsets rotation and direction
        //--

        this.rotate_around(angle,origin);
        this.rot += angle;
        this.dir += angle;
    }

    this.rotate_around = function(angle,origin) {
        //--    Applies rotation matrix to current position.
        //--    New position based on current position
        //--

        this.x -= origin[0];
        this.y -= origin[1];

        var theta = angle*Math.PI/180*-1;

        var x = this.get_x()*Math.cos(theta) - this.get_y()*Math.sin(theta);
        var y = this.get_x()*Math.sin(theta) + this.get_y()*Math.cos(theta);
        this.set_pos(x + origin[0],y + origin[1]);
    }

    this.offset_scale = function(scale,origin) {
        //--    Offsets scale via scaling matrix calculations.
        //--    New global scale based on current global scale
        //--

        var x0 = origin[0];
        var y0 = origin[1];
        var x  = this.get_x();
        var y  = this.get_y();
        this.set_x(scale*(x-x0) + x0);
        this.set_y(scale*(y-y0) + y0);

        this.scale_global *= scale;
    }

}//end Sprite



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

    this.clear = function() {
        list = [];
    }
}



////////////////////////////////////////////
///   HEAP  ////////////////////////////////
////////////////////////////////////////////
function HeapNode() {

    this.priority = -1;
    this.obj      = null;
}

function Heap(_type='max') {

    var list = [];
    var type = _type;

    this.len = function() {
        return list.length;
    }

    this.last = function() {
        return list[this.len()-1];
    }

    this.first = function() {
        return list[0];
    }

    this.print = function() {
        var str = '';
        for (var i in list) {
            str = str.concat(list[i].priority);
            str = str.concat(' ');
        }
        console.log(str);
    }

    this.in = function(o,v) {

        // make
        var node = new HeapNode();
        node.priority = v;
        node.obj = o;

        // if empty
        if (!this.first()) {
            list.push(node);
            return;
        }

        // if not empty
        list.push(node);

        // adjust based on priority
        this.climb(this.len()-1);
    }

    this.out = function() {

        // swap first and last
        this.swap(0,this.len()-1);

        // pop last
        var node = list.pop();

        // adjust based on priority
        this.pour(0);

        return node;
    }

    this.swap = function(i,j) {

        // edge case
        if (i == j) return;

        // swaps nodes' locations in list
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }

    this.climb = function(inode) {

        // get index
        if (inode % 2 == 0) {
            var ipar = (inode - 2) / 2;
        } else {
            var ipar = (inode - 1) / 2;
        }

        // get nodes
        var node = list[inode];
        var par  = list[ipar];

        // edge case
        if (inode == 0) return;

        // general case
        if ( (type == 'max' && par.priority < node.priority) ||
             (type == 'min' && par.priority > node.priority) ){
            this.swap(inode,ipar);
            this.climb(ipar);
        }
    }

    this.pour = function(ipar) {

        // get indices
        var ileft  = 2 * ipar + 1;
        var iright = 2 * ipar + 2;

        // get nodes
        var left  = list[ileft];
        var right = list[iright];
        var par   = list[ipar];

        // get priorities
        if (left) {
            var pleft = left.priority;
        } else {
            // edge case
            return;
        }
        if (right) {
            var pright = right.priority;
        } else {
            var pright = pleft - 1;
        }

        // get max child
        if (pleft >= pright) {
            var inode = ileft;
            var node = left;
        } else {
            var inode = iright;
            var node = right;
        }

        // general case
        if ( (type == 'max' && par.priority < node.priority) ||
             (type == 'min' && par.priority > node.priority) ){
            this.swap(inode,ipar);
            this.pour(inode);
        }
    }
}//end Heap
