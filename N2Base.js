/*
    NAME:   "N2Base.js"
    AUTH:   Ibrahim Sardar
    DESC:   Base functionality of Nickel2.js

    TODO:   upgrade from legacy keyCode to modern key/code
            implement debugging feature, enabled by: "Nickel.DEBUG=true;"
            add comments to QuadTree
*/



////////////////////////////////////////////
///   NICKEL   /////////////////////////////
////////////////////////////////////////////
var Nickel = {

    /* Static
    *  - states (unused)
    *  - a debugging option       ***NOT YET IMPLEMENTED***TODO***HERE***
    *  - browser detection
    *  - key mappings
    */
    DEBUG     : false,
    STATES    : {
        FREE        : 1000,
        BLOCKED     : 1001
    },
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
    *  - player's score (unused)
    *  - global id counter
    */
    SCORE     : 0,
    ID        : 1000,

    /* Utility Functions
    *   - randomizing functions
    *   - rounding
    *   - 2D vector functions
    *   - determining-object-type functions
    *   - ID assigning
    *   - angle (in degrees) manipulations
    */
    UTILITY   : {
        random_element : function(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
        random_number : function(start,end) { return Math.floor(Math.random() * (end+1-start)) + (start); },
        round : function(num,decimals) { return Number(Math.round(num+'e'+decimals)+'e-'+decimals); },
        determine_destination : function(g, d) { return d instanceof Array ? g.map[d[0]][d[1]] : d; },
        is_array : function(o) { return o instanceof Array },
        assign_id : function() { return Nickel.ID++; },
        magnitude_of_vector : function(v) { return Math.sqrt(v[0]*v[0] + v[1]*v[1]); },
        normalize_vector : function(v) { var mag=Math.sqrt(v[0]*v[0] + v[1]*v[1]); return [v[0]/mag, v[1]/mag]; },
        vector_product : function(v1,v2) { return [v1[0]*v2[0] + v1[0]*v2[1], v1[1]*v2[0] + v1[1]*v2[1]]; },
        cross_product : function(v1,v2) { return v1[0]*v2[1] - v1[1]*v2[0]; },
        dot_product : function(v1,v2) { return v1[0]*v2[0] + v1[1]*v2[1]; },
        trim_angle : function(angle) { return angle % 360; }
    },

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
// ------- UTILITY OBJECTS -----------------------------------
// --



////////////////////////////////////////////
///   COLLIDER   ///////////////////////////
////////////////////////////////////////////
var Collider = {

    collides_spr_spr    : function (me, you) {
        //--    Collision detection for sprite on sprite
        //--    via separating axis theorem for rectangles
        //--

        // this is for the list of normal angles
        var norms = [];

        // this is for the list of my corner vectors
        var my_v_corners = [me.get_topleft(),
                            me.get_topright(),
                            me.get_bottomright(),
                            me.get_bottomleft()];

        // this is for the list of ur corner vectors
        var ur_v_corners = [you.get_topleft(),
                            you.get_topright(),
                            you.get_bottomright(),
                            you.get_bottomleft()];

        // Normal Angles Chart:
        // -----------------------------------
        //  my right    0   +  me.get_rot()
        //  my top      90  +  me.get_rot()
        //  my left     180 +  me.get_rot()
        //  my bottom   270 +  me.get_rot()
        //
        //  ur right    0   +  you.get_rot()
        //  ur top      90  +  you.get_rot()
        //  ur left     180 +  you.get_rot()
        //  ur bottom   270 +  you.get_rot()
        // -----------------------------------

        // append normal angles to list
        norms.push.apply(norms,
                        [me.get_rot(),         // my right
                         you.get_rot(),        // ur right
                         me.get_rot()  + 90,   // my top
                         you.get_rot() + 90]); // ur top

        // for each axis along a normal
        for (var i in norms) {

            // to radians
            norms[i] *= Math.PI / 180;

            // get unit normal vector
            var unit_normal_vec = [Math.cos(norms[i]), -1 * Math.sin(norms[i])];

            // this is for the list of components (magnitude of projection)
            var my_comps = [];
            var ur_comps = [];

            // 4 corners per rect
            for (var j=0; j<4; j++) {

                // prepare
                var my_corner_vec = my_v_corners[j];
                var ur_corner_vec = ur_v_corners[j];

                // get components (scalar)
                var my_comp = my_corner_vec[0]*unit_normal_vec[0] + my_corner_vec[1]*unit_normal_vec[1];
                var ur_comp = ur_corner_vec[0]*unit_normal_vec[0] + ur_corner_vec[1]*unit_normal_vec[1];
                my_comps.push(my_comp);
                ur_comps.push(ur_comp);
            }

            // get max/min of components for each rect
            var my_extreme = [ Math.min.apply(null,my_comps), Math.max.apply(null,my_comps) ];
            var ur_extreme = [ Math.min.apply(null,ur_comps), Math.max.apply(null,ur_comps) ];

            // check collision
            if (my_extreme[1] < ur_extreme[0] ||
                my_extreme[0] > ur_extreme[1]) {

                // gap found
                return false;
            }
        }

        // collision is certain (worst case time complexity)
        return true;
    }

    ,

    collides_spr_line   : function (me, you) {
        //--    Collision detection via separating axis
        //--    theorem for rectangles
        //--

        // this is for the list of normal angles
        var norms = [];

        // this is for the list of my corner vectors
        var my_v_corners = [me.get_topleft(),
                            me.get_topright(),
                            me.get_bottomright(),
                            me.get_bottomleft()];

        // Normal Angles Chart:
        // -----------------------------------
        //  my right    0   +  me.get_rot()
        //  my top      90  +  me.get_rot()
        //  my left     180 +  me.get_rot()
        //  my bottom   270 +  me.get_rot()
        //
        //  ur right    -90 +  you.get_rot()
        //  my top      0   +  you.get_rot()
        //  ur left     90  +  you.get_rot()
        //  my bottom   180 +  you.get_rot()
        // -----------------------------------

        // append normal angles to list
        norms.push.apply(norms,
                        [me.get_rot(),        // my right
                         me.get_rot() + 90],  // my top
                         you.get_rot())       // your top

        // for each axis along a normal
        for (var i in norms) {

            // to radians
            norms[i] *= Math.PI / 180;

            // get unit normal vector
            var unit_normal_vec = [Math.cos(norms[i]), -1 * Math.sin(norms[i])];

            // this is for the list of components (magnitude of projection)
            var my_comps = [];
            var ur_comps = [];

            // 4 corners for rect
            for (var j=0; j<4; j++) {

                // prepare
                var my_corner_vec = my_v_corners[j];

                // get components (scalar)
                var my_comp = my_corner_vec[0]*unit_normal_vec[0] + my_corner_vec[1]*unit_normal_vec[1];
                my_comps.push(my_comp);
            }

            // 2 end points for line
            // get components (scalar)
            ur_comps.push( you.x*unit_normal_vec[0]    + you.y*unit_normal_vec[1]    );
            ur_comps.push( you.xend*unit_normal_vec[0] + you.yend*unit_normal_vec[1] );

            // get max/min of components for each rect
            var my_extreme = [ Math.min.apply(null,my_comps), Math.max.apply(null,my_comps) ];
            var ur_extreme = [ Math.min.apply(null,ur_comps), Math.max.apply(null,ur_comps) ];

            // check collision
            if (my_extreme[1] < ur_extreme[0] ||
                my_extreme[0] > ur_extreme[1]) {

                // gap found
                return false;
            }
        }

        // collision is certain (worst case time complexity)
        return true;

    }

    ,

    collides_spr_point  : function (me, you) {
        //--    Collision detection via separating axis
        //--    theorem for rectangles
        //--

        // this is for the list of normal angles
        var norms = [];

        // this is for the list of my corner vectors
        var my_v_corners = [];

        // get my corner vectors
        my_v_corners.push.apply(my_v_corners,
                               [me.get_topleft(),
                                me.get_topright(),
                                me.get_bottomright(),
                                me.get_bottomleft()]);

        // Normal Angles Chart:
        // -----------------------------------
        //  my right    0   +  this.get_rot()
        //  my top      90  +  this.get_rot()
        //  my left     180 +  this.get_rot()
        //  my bottom   270 +  this.get_rot()
        // -----------------------------------

        // append normal angles to list
        norms.push.apply(norms,
                        [me.get_rot(),        // my right
                         me.get_rot() + 90])  // my top

        // for each axis along a normal
        for (var i in norms) {

            // to radians
            norms[i] *= Math.PI / 180;

            // get unit normal vector
            var unit_normal_vec = [Math.cos(norms[i]), -1 * Math.sin(norms[i])];

            // this is for the list of components (magnitude of projection)
            var my_comps = [];

            // 4 corners for my rect
            for (var j=0; j<4; j++) {

                // prepare
                var my_corner_vec = my_v_corners[j];

                // get components (scalar)
                var my_comp = my_corner_vec[0]*unit_normal_vec[0] + my_corner_vec[1]*unit_normal_vec[1];
                my_comps.push(my_comp);
            }

            // only 1 projection for the intersecting point
            var ur_comp = you[0]*unit_normal_vec[0] + you[1]*unit_normal_vec[1];

            // get max/min of components for my rect
            var my_extreme = [ Math.min.apply(null,my_comps), Math.max.apply(null,my_comps) ];

            // check collision
            if (my_extreme[1] < ur_comp ||
                my_extreme[0] > ur_comp) {

                // gap found
                return false;
            }
        }

        // collision is certain (worst case time complexity)
        return true;
    }

    ,

    collides_line_line  : function (me, you) {
        // reference: "https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect"

        // cross product of the difference vectors
        var me_you_diff_cross = Nickel.UTILITY.cross_product(me.get_diff(), you.get_diff());

        // if the cross is the 0 vector:
        if (me_you_diff_cross == 0) {

            // cross product of start difference and my difference
            var mid_cross = Nickel.UTILITY.cross_product([me.x - you.x, me.y - you.y], me.get_diff());

            // if the formula: (my start - your start) cross my diff = 0 satisfies:
            if ( mid_cross == 0) {

                // then we are collinear:
                // check overlap by expressing your endpoints by using my line segment's equation:
                var my_diff_cross = Nickel.UTILITY.dot_product(me.get_diff(),me.get_diff());
                var t0 = (you.x-me.x)*me.dx + (you.y-me.y)*me.dy;
                t0 /= my_diff_cross;
                var t1 = Nickel.UTILITY.dot_product(you.get_diff(),me.get_diff()) / my_diff_cross;
                t1 += t0;

                // if your line touches my line
                if ( (t0 >= 0 && t0 <= 1) ||
                     (t1 >= 0 && t1 <= 1) ) {

                    // collinear and overlap
                    return true;
                } else {

                    // collinear and disjoint
                    return false;
                }

            // if the formula does not satisfy:
            } else {

                // we are parallel but not intersecting
                return false;
            }

        // if we are not parallel:
        } else {

            // solve for parameterization of line segments

            // cross product of start difference and your difference
            var mid_cross = Nickel.UTILITY.cross_product([you.x - me.x, you.y - me.y], you.get_diff())

            // parameter for me
            var t = mid_cross / me_you_diff_cross;

            // cross product of start difference and my difference
            mid_cross = Nickel.UTILITY.cross_product([me.x - you.x, me.y - you.y], me.get_diff());

            // parameter for you
            var u = mid_cross / Nickel.UTILITY.cross_product(you.get_diff(), me.get_diff());

            // if your line intersects my line
            if ( (t >= 0 && t <= 1) ||
                 (u >= 0 && u <= 1) ) {

                // intersection
                return true;
            } else {

                // no intersection
                return false;
            }
        }
    }

    ,

    collides_line_point : function (me, you) {

        // components of my start to you
        var me_to_you_dx = you[0]-me.x;
        var me_to_you_dy = you[1]-me.y;

        // if you are along me (slopes are same)
        if (me.dy/me.dx == me_to_you_dy/me_to_you_dx) {

            // if component direction matches start
            if (Math.sign(me.dx) == Math.sign(me_to_you_dx) &&
                Math.sign(me.dy) == Math.sign(me_to_you_dy)) {

                // if component direction matches end
                if (Math.sign(-me.dx) == Math.sign(you[0]-me.xend) &&
                    Math.sign(-me.dy) == Math.sign(you[1]-me.yend)) {

                    // then point is intersecting the line
                    return true;
                }
            }
        }

        // if you are my start or end
        if ((you[0]==me.x    && you[1]==me.y   ) ||
            (you[0]==me.xend && you[1]==me.yend))
            return true;

        // else, point is either along the line
        //  but beyond or slopes do not match
        return false;
    }

    ,

    collides_point_point : function (me, you) {

        return (me[0] == you[0] && me[1] == you[1]);
    }

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
    this.paused   = true;

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

        // view is not paused anymore
        this.paused = false;

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

            self.mouse_x = (ev.pageX - p.left);
            self.mouse_y = (ev.pageY - p.top);
        });

        // update moved scroll values(s)
        self.canvas.addEventListener('wheel',function(ev){
            ev.preventDefault();
            //console.log(ev);
            var dir = ev.deltaY > 0 ? -1 : 1 ;
            var power = 150;
            self.wheel_impulse = (dir * power);
            self.wheel_delta += (dir * power);
            //console.log('Scroll (impulse, delta): ' + self.wheel_impulse + " , " + self.wheel_delta);
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

        this.paused = true;
        clearInterval(this.timer_id);
    }

    this.is_paused = function() {
        //--    True if game is paused
        //--

        return this.paused;
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

    this.reset_key_upped = function() {
        //--    Clears key upped indicator.
        //--    Useful if you want key_upped to not
        //--    remember past key ups
        //--

        this.key_upped = null;
    }

    this.reset_mouse_upped = function() {
        //--    Clears mouse upped indicator.
        //--    Useful if you want mouse_upped to not
        //--    remember past mouse ups
        //--

        this.mouse_upped = null;
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

    this.get_center = function() {
        //--    Returns canvas center
        //--

        return [this.get_w()/2,this.get_h()/2];
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
///   SIMPLE POLY   ////////////////////////
////////////////////////////////////////////
function SimplePoly(scene, vertices) {

    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'SimplePoly';
    this.scene = scene;
    this.canvas = scene.canvas;
    this.context = this.canvas.getContext("2d");

    // style
    this.stroke_width = 1;
    this.stroke_dash_length = 0;
    this.stroke_gap_length = 0;
    this.stroke_fill = null;
    this.stroke_color = null;

    // pos of first vertex
    this.x = vertices[0][0];
    this.y = vertices[0][1];

    // pos of each vertex
    this.vertices = vertices;

    // other
    this.dead = false;
    this.visibility = true;

    this.update = function() {
        //--    Called every frame.
        //--    Updates changing parameters.
        //--

        // skip if marked for deletion
        if (this.dead == true) {
            return;
        }

        // user custom update
        this.update_more();

        // render graphics
        this.draw();
    }

    this.draw = function() {
        //--    Called every frame. Processes graphics
        //--    based on current parameters.
        //--

        // skip if marked for invisibility
        if (this.visibility == false || this.dead == true) {
            return;
        }

        // skip if no stroke color
        if (!this.stroke_color) {
            return;
        }

        // draw
        var ctx = this.context;
        ctx.save();

        // stroke properties
        ctx.lineWidth = this.stroke_width;
        ctx.setLineDash([this.stroke_dash_length, this.stroke_gap_length]);
        ctx.fillStyle = this.stroke_fill;
        ctx.strokeStyle = this.stroke_color;

        // draw polygon
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (var i=1; i<this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i][0], this.vertices[i][1]);
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        if (this.stroke_fill)
            ctx.fill();

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

    this.is_visible = function() {
        //--    Returns if self is visible
        //--

        return this.visibility;
    }

    this.update_more = function() {
        //--    Called in update. Meant to be over-ridden.
        //--

    }
}//end SimplePoly



////////////////////////////////////////////
///   SIMPLE ELLIPSE   /////////////////////
////////////////////////////////////////////
function SimpleEllipse(scene, radius_h, radius_v) {

    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'SimpleEllipse';
    this.scene = scene;
    this.canvas = scene.canvas;
    this.context = this.canvas.getContext("2d");

    // style
    this.stroke_width = 1;
    this.stroke_dash_length = 0;
    this.stroke_gap_length = 0;
    this.stroke_fill = null;
    this.stroke_color = null;

    // size
    this.radius_h = radius_h;
    this.radius_v = radius_v;

    // pos (initially hide the ellipse)
    this.cx = -radius_h;
    this.cy = -radius_v;

    // other
    this.dead = false;
    this.visibility = true;

    this.update = function() {
        //--    Called every frame.
        //--    Updates changing parameters.
        //--

        // skip if marked for deletion
        if (this.dead == true) {
            return;
        }

        // user custom update
        this.update_more();

        // render graphics
        this.draw();
    }

    this.draw = function() {
        //--    Called every frame. Processes graphics
        //--    based on current parameters.
        //--

        // skip if marked for invisibility
        if (this.visibility == false || this.dead == true) {
            return;
        }

        // skip if no stroke color
        if (!this.stroke_color) {
            return;
        }

        // draw
        var ctx = this.context;
        ctx.save();

        // stroke properties
        ctx.lineWidth = this.stroke_width;
        ctx.setLineDash([this.stroke_dash_length, this.stroke_gap_length]);
        ctx.fillStyle = this.stroke_fill;
        ctx.strokeStyle = this.stroke_color;

        // draw ellipse
        ctx.beginPath();
        // (params: cx,cy,rad_h,rad_v,rot,strt_angle,end_angle,anticlockwise)
        ctx.ellipse( this.cx,this.cy,this.radius_h,this.radius_v,0,0,2*Math.PI );
        ctx.stroke();
        if (this.stroke_fill)
            ctx.fill();

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

    this.is_visible = function() {
        //--    Returns if self is visible
        //--

        return this.visibility;
    }

    this.update_more = function() {
        //--    Called in update. Meant to be over-ridden.
        //--

    }
}//end SimpleEllipse



////////////////////////////////////////////
///   SIMPLE LINE   ////////////////////////
////////////////////////////////////////////
function SimpleLine(scene, startpoint, endpoint) {

    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'SimpleLine';
    this.scene = scene;
    this.canvas = scene.canvas;
    this.context = this.canvas.getContext("2d");

    // style
    this.stroke_width = 1;
    this.stroke_dash_length = 0;
    this.stroke_gap_length = 0;
    this.stroke_color = null;

    // pos
    this.x = startpoint[0];
    this.y = startpoint[1];
    this.xend = endpoint[0];
    this.yend = endpoint[1];

    // other
    this.dead = false;
    this.visibility = true;

    this.update = function() {
        //--    Called every frame.
        //--    Updates changing parameters.
        //--

        // skip if marked for deletion
        if (this.dead == true) {
            return;
        }

        // user custom update
        this.update_more();

        // render graphics
        this.draw();
    }

    this.draw = function() {
        //--    Called every frame. Processes graphics
        //--    based on current parameters.
        //--

        // skip if marked for invisibility
        if (this.visibility == false || this.dead == true) {
            return;
        }

        // skip if no stroke color
        if (!this.stroke_color) {
            return;
        }

        // draw
        var ctx = this.context;
        ctx.save();

        // stroke properties
        ctx.lineWidth = this.stroke_width;
        ctx.setLineDash([this.stroke_dash_length, this.stroke_gap_length]);
        ctx.strokeStyle = this.stroke_color;

        // draw line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.xend, this.yend);
        ctx.stroke();

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

    this.is_visible = function() {
        //--    Returns if self is visible
        //--

        return this.visibility;
    }

    this.update_more = function() {
        //--    Called in update. Meant to be over-ridden.
        //--

    }
}//end SimpleLine


////////////////////////////////////////////
///   LINE SEGMENT   ///////////////////////
////////////////////////////////////////////
function LineSegment(startpoint, endpoint=[0,0]) {

    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'LineSegment';

    // pos
    this.x = startpoint[0];
    this.y = startpoint[1];
    this.xend = endpoint[0];
    this.yend = endpoint[1];

    // dir
    this.dx = this.xend - this.x;
    this.dy = this.yend - this.y;

    this.get_pos = function() {
        //--    returns the start position
        //--

        return [this.x, this.y];
    }

    this.get_end = function() {
        //--    returns the end position
        //--

        return [this.xend, this.yend];
    }

    this.get_diff = function() {
        //--    returns the difference vector from start position
        //--

        return [this.dx, this.dy];
    }

    this.get_rot = function() {
        //--    Returns angle from start to end
        //--

        return Math.atan2(-this.dy, this.dx);
    }

    this.set_diff = function(diff) {
        //--    Sets the difference of the start and end points,
        //--    ultimately changing the end point
        //--

        this.dx = diff[0];
        this.dy = diff[1];
        this.xend = this.x + diff[0];
        this.yend = this.y + diff[1];
    }

    this.set_end = function(endpoint) {
        //--    Sets the end point, ultimately changing the
        //--    difference vector
        //--

        this.dx = endpoint[0] - this.x;
        this.dy = endpoint[1] - this.y;
        this.xend = endpoint[0];
        this.yend = endpoint[1];

    }
}//end LineSegment



////////////////////////////////////////////
///   BOUNDING BOX   ///////////////////////
////////////////////////////////////////////
function BoundingBox(sprite) {


    // --
    // ------- PROPERTIES ----------------------------------------
    // --


    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'BoundingBox';

    // pos
    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;

    // size
    this.w = 0;
    this.h = 0;

    // parent
    this.target = sprite;


    // --
    // ------- METHODS -------------------------------------------
    // --


    this.update = function() {
        //--    Main update function
        //--

        this.bound(this.target);
    }

    this.bound = function(spr) {
        //--    Bounds self around a target sprite
        //--

        // corners of sprite
        var tl = spr.get_topleft();
        var tr = spr.get_topright();
        var bl = spr.get_bottomleft();
        var br = spr.get_bottomright();

        // top left of bbox
        var AXnew = Math.min(tl[0], tr[0], bl[0], br[0]);
        var AYnew = Math.min(tl[1], tr[1], bl[1], br[1]);

        // dimensions of bbox
        var Wnew = Math.max(tl[0], tr[0], bl[0], br[0]) - AXnew;
        var Hnew = Math.max(tl[1], tr[1], bl[1], br[1]) - AYnew;

        // apply
        this.left   = AXnew;
        this.right  = AXnew + Wnew;
        this.top    = AYnew;
        this.bottom = AYnew + Hnew;
        this.w      = Wnew;
        this.h      = Hnew;
    }

    this.get_cx = function() {
        //--    Returns the center x pos of the bbox
        //--

        return this.left + this.w / 2;
    }

    this.get_cy = function() {
        //--    Returns the center y pos of the bbox
        //--

        return this.top + this.h / 2;
    }

    this.get_center = function() {
        //--    Returns the center pos of the bbox
        //--

        return [this.get_cx(),this.get_cy()];
    }

}//end BoundingBox



////////////////////////////////////////////
///   SPRITE   /////////////////////////////
////////////////////////////////////////////
function Sprite(scene, image_data, has_bbox=true) {


    // --
    // ------- PROPERTIES ----------------------------------------
    // --


    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'Sprite';   // hash this string into an int for efficiency ***HERE***
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

    // bounding box
    if (has_bbox) {
        this.bbox = new BoundingBox(this);
    }

    // size
    this.width = image_data.w;
    this.height = image_data.h;

    // scale
    this.scale_global = 1;
    this.scale_x = 1;
    this.scale_y = 1;

    // pos (initially hide the sprite)
    this.x = -this.width;
    this.y = -this.height;

    // vel
    this.speed = 0;
    this.dx = 0;
    this.dy = 0;

    // force
    this.forces = [];

    // acc
    this.accel = 0;

    // rot
    this.dir = 0; // angle of sprite's image
    this.rot = 0; // angle of sprite's movement
    this.dr = 0;
    this.max_rot = 0;
    this.last_rot = 0; // last turn displacement
    this.origin = [0,0]; // default topleft

    // debug
    this.is_debug = false
    this.d_delay = 0
    this.d_timer = 0

    // other
    this.dead = false;
    this.visibility = true;
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

        // re-fixate bounding box
        if (this.bbox) this.bbox.update();

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
            return;
        }

        // degs to radians
        var rot = this.rot * Math.PI / 180
        rot = rot * -1

        // draw
        var ctx = this.context;
        ctx.save();
        //ctx.translate(this.x, this.y);//old version
        ctx.translate(this.x+this.origin[0], this.y+this.origin[1]); // new update to draw function
        ctx.rotate(rot);
        ctx.translate(-this.origin[0], -this.origin[1]); // new update to draw function
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
        if (this.bbox) this.bbox = null;
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

    this.is_visible = function() {
        //--    Returns if self is visible
        //--

        return this.visibility;
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
        var tmp_dx = Math.cos(theta) * this.speed * this.scale_global;
        var tmp_dy = Math.sin(theta) * this.speed * this.scale_global;
        // apply forces
        for (var f in this.forces) {
            this.dx += this.forces[f][0];
            this.dy += this.forces[f][1];
        }
        // update difference in x and y position
        this.x = this.x + this.dx + tmp_dx;
        this.y = this.y + this.dy + tmp_dy;

        // reset
        //this.dx = this.dy = 0;
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

    this.get_w_bound = function() {
        //--    Returns width of bounding box
        //--

        if (this.bbox) return this.bbox.w;
        return null;
    }

    this.get_h_bound = function() {
        //--    Returns height of bounding box
        //--

        if (this.bbox) return this.bbox.h;
        return null;
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

        return [this.get_x(), this.get_y()];
    }

    this.get_pos2 = function() {
        //--    Returns accurate position (includes origin offset)
        //--

        return [this.get_x()+this.origin[0], this.get_y()+this.origin[1]];
    }

    this.get_cx = function() {
        //--    Returns accurate center x position
        //--

        if (this.bbox) return this.bbox.get_cx();
        return this.x + (this.get_w() / 2);
    }

    this.get_cy = function() {
        //--    Returns accurate center y position
        //--

        if (this.bbox) return this.bbox.get_cy();
        return this.y + (this.get_h() / 2);
    }

    this.get_center = function() {
        //--    Returns accurate center position
        //--

        if (this.bbox) return this.bbox.get_center();
        return [this.get_cx(), this.get_cy()];
    }

    this.get_right = function() {
        //--    Returns accurate right x position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) return this.bbox.right;
        return this.x + this.get_w();
    }

    this.get_top = function() {
        //--    Returns accurate top y position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) return this.bbox.top;
        return this.y;
    }

    this.get_left = function() {
        //--    Returns accurate left x position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) return this.bbox.left;
        return this.x;
    }

    this.get_bottom = function() {
        //--    Returns accurate bottom y position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) return this.bbox.bottom;
        return this.y + this.get_h();
    }


    this.get_topleft = function() {
        //--    Returns accurate topleft coordinates
        //--

        var ox = this.origin[0];
        var oy = this.origin[1];
        var radius = Math.sqrt(ox * ox + oy * oy);
        var theta  = this.rot * Math.PI / 180;

        // angle to topleft corner (cannot have -0 as parameter in atan2)
        var ox2 = ox;
        var oy2 = oy;
        if (ox != 0) ox2 = -ox;
        if (oy != 0) oy2 = -oy;
        var theta_topleft = -Math.atan2(oy2,ox2) + theta;

        // components of vector to topleft from origin
        var vx = Math.cos(theta_topleft) * radius;
        var vy = -Math.sin(theta_topleft) * radius;

        // coordinates of topleft in viewport
        var px = this.x + ox + vx;
        var py = this.y + oy + vy;

        return [px,py];
    }

    this.get_topright = function() {
        //--    Returns accurate topright coordinates
        //--

        var tl = this.get_topleft();
        var theta = Nickel.UTILITY.trim_angle(this.get_rot());
        theta = theta * Math.PI / 180;
        return [tl[0] + (Math.cos(theta) * this.get_w()),
                tl[1] - (Math.sin(theta) * this.get_w())];
    }

    this.get_bottomleft = function() {
        //--    Returns accurate bottomleft coordinates
        //--

        var tl = this.get_topleft();
        var theta = Nickel.UTILITY.trim_angle(this.get_rot());
        theta = theta * Math.PI / 180;
        return [tl[0] + (Math.sin(theta) * this.get_h()),
                tl[1] + (Math.cos(theta) * this.get_h())];
    }

    this.get_bottomright = function() {
        //--    Returns accurate bottomright coordinates
        //--

        var tl = this.get_topleft();
        var theta = Nickel.UTILITY.trim_angle(this.get_rot());
        theta = theta * Math.PI / 180;
        return [tl[0] + (Math.cos(theta) * this.get_w()) + (Math.sin(theta) * this.get_h()),
                tl[1] - (Math.sin(theta) * this.get_w()) + (Math.cos(theta) * this.get_h())];
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


    // +++  DELETE THIS GARBAGE MAN (CAREFULLY) ~~~~~~~~~~~
    // +++ > force-related:


    this.get_force = function(index) {
        //--    Returns a specific force
        //--

        return this.forces[i];
    }

    this.get_forces = function() {
        //--    Returns all forces currently applied
        //--

        return this.forces;
    }

    this.get_velocity = function() {
        //--    Returns the accurate velecity vector
        //--

        // radians
        var theta = this.dir * Math.PI / 180;
        theta = theta * -1;

        // speed vector
        var dx = this.dx + Math.cos(theta) * this.speed * this.scale_global;
        var dy = this.dy + Math.sin(theta) * this.speed * this.scale_global;

        return [dx, dy];
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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
        //--

        return this.dr;
    }

    this.get_rot_max = function() {
        //--    Returns the maximum turn amount the
        //--    sprite can do in one frame
        //--

        return this.max_rot;
    }

    this.get_last_rot = function() {
        //--    Returns the last turn displacement made by any
        //--    of the following functions:
        //--    turn_to, offset_turn, or offset_rotation
        //--

        return this.last_rot;
    }

    this.get_origin = function() {
        //--    Returns the origin of rotation (pivot)
        //--    relative to the default topleft corner
        //--

        return this.origin;
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
        //--

        return this.layer;
    }

    this.get_id = function() {
        //--    Returns global Nickel identifier
        //--

        return this.id;
    }

    this.get_type = function() {
        //--    Returns sprite type identifier
        //--

        return this.type;
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

    this.set_pos2 = function(x,y) {
        //--    Sets position (top left) (includes origin offset)
        //--

        this.x = x - this.origin[0];
        this.y = y - this.origin[0];
    }

    this.set_cx = function(cx) {
        //--    Sets center x position
        //--

        if (this.bbox) this.x += cx - this.bbox.get_cx();
        else this.x = cx - (this.get_w() / 2);
    }

    this.set_cy = function(cy) {
        //--    Sets center y position
        //--

        if (this.bbox) this.y += cy - this.bbox.get_cy();
        else this.y = cy - (this.get_h() / 2);
    }

    this.set_center = function(cx,cy) {
        //--    Sets center position
        //--

        this.set_cx(cx);
        this.set_cy(cy);
    }

    this.set_right = function(rx) {
        //--    Sets right x position.
        //--    (works best with bbox)
        //--

        if (this.bbox) this.x += rx - this.bbox.left - this.bbox.w;
        else this.x = rx - this.get_w();
    }

    this.set_left = function(lx) {
        //--    Sets left x position.
        //--    (works best with bbox)
        //--

        if (this.bbox) this.x += lx - this.bbox.left;
        else this.x = lx;
    }

    this.set_top = function(ty) {
        //--    Sets top y position.
        //--    (works best with bbox)
        //--

        if (this.bbox) this.y += ty - this.bbox.top;
        else this.y = ty;
    }

    this.set_bottom = function(by) {
        //--    Sets bottom y position.
        //--    (works best with bbox)
        //--

        if (this.bbox) this.y += by - this.bbox.top - this.bbox.h;
        else this.y = by - this.get_h();
    }


    // +++
    // +++ > speed-related:


    this.set_speed = function(spd) {
        //--    Sets the accurate speed
        //--

        this.speed = spd;
    }


    // +++
    // +++ > force-related:

    this.set_force = function(index, force) {
        //--    Sets a specific force
        //--

        this.forces[index] = force;
    }

    this.set_forces = function(force_list) {
        //--    Resets the force list to a new list
        //--

        this.forces = force_list;
    }

    this.add_force = function(force) {
        //--    Adds a new force to the list of forces
        //--

        this.forces.push(force);
    }

    this.add_velocity = function(vec) {
        //--    Adds a velocity vector directly to the current
        //--    velocity vector
        //--

        this.dx += vec[0];
        this.dy += vec[1];
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

    this.set_rot_max = function(degs) {
        //--    Set the maximum turn amount the
        //--    sprite can do in one frame
        //--

        return this.max_rot = degs;
    }

    this.set_origin = function(offset) {
        //--    Set the origin of rotation (pivot)
        //--    relative to the default topleft corner
        //--

        this.origin[0] = offset[0];
        this.origin[1] = offset[1];
    }

    this.set_origin_centered = function() {
        //--    Set the origin of rotation (pivot)
        //--    in the center of the image
        //--

        this.origin[0] = this.get_w() / 2;
        this.origin[1] = this.get_h() / 2;
    }


    // +++
    // +++ > other:


    this.set_layer = function(level) {
        //--    Returns sprite's collision layer
        //--    (not meant for visual layers)

        this.layer = level;
    }

    this.set_type = function(type) {
        //--    Sets sprite type identifier
        //--

        this.type = type;
    }


    // --
    // ------- OTHER methods -------------------------------------
    // --



    this.colliding_with = function(target, layer_check=true) {
        //--    Returns true if target is colliding
        //--    with self (and in same layer if specified)
        //--

        // if target is a point
        if (Nickel.UTILITY.is_array(target)) {

            // collision check
            return Collider.collides_spr_point(this, target);
        }

        // if target is a sprite
        else if (target.type == 'Sprite') {

            // layer check
            if (layer_check && this.get_layer() == target.get_layer() ||
                !layer_check) {

                // collision check
                return Collider.collides_spr_spr(this, target);
            }
        }

        // if target is a line segment
        else if (target.type == 'LineSegment') {

            // collision check
            return Collider.collides_spr_line(this, target);
        }

        // if target is some unexpected object, default to no collision
        return false;
    }

    this.copy_base = function() {
        //--    Returns a base copy of self
        //--

        var _has_bbox = false;
        if (this.bbox)
            _has_bbox = true;

        if (this.image)
            var _img_data = {img:this.image.src, w:this.get_w_orig(), h:this.get_h_orig()};
        else
            var _img_data = {w:this.get_w_orig(), h:this.get_h_orig()};

        var spr = new Sprite(this.scene, _img_data, _has_bbox);
        spr.update();
        return spr;
    }

    this.copy_frozen = function() {
        //--    Returns a frozen copy of self
        //--

        var spr = this.copy_base();

        // pos
        spr.x = this.x;
        spr.y = this.y;

        // scale
        spr.scale_global = this.scale_global;
        spr.scale_x = this.scale_x;
        spr.scale_y = this.scale_y;

        // rot
        spr.dir = this.dir;
        spr.rot = this.rot;
        spr.max_rot = this.max_rot;
        spr.origin = [this.origin[0],this.origin[1]];

        // other
        spr.dead = this.dead;
        spr.visibility = this.visibility;
        spr.layer = this.layer;

        spr.update();
        return spr;
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

        if (origin)
            this.rotate_around(angle,origin);
        this.dir += angle;
    }

    this.offset_rotation = function(angle,origin) {
        //--    Offsets rotation via rotation matrix
        //--    calculations
        //--

        if (origin)
            this.rotate_around(angle,origin);
        this.rot += angle;

        // also record the turn
        this.last_rot = angle;
    }

    this.offset_turn = function(angle,origin) {
        //--    Offsets rotation and direction
        //--

        if (origin)
            this.rotate_around(angle,origin);
        this.rot += angle;
        this.dir += angle;

        // also record the turn
        this.last_rot = angle;
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

        if (!origin)
            origin = this.get_pos2();

        var x0 = origin[0];
        var y0 = origin[1];
        var x  = this.get_x();
        var y  = this.get_y();
        this.set_x(scale*(x-x0) + x0);
        this.set_y(scale*(y-y0) + y0);

        this.scale_global *= scale;
    }

    this.turn = function(angle,is_offset=true,instant=true,buffer=0) {
        //--    Rotates self as many degrees of angle as possible.
        //--    Can be specified turn immediatly as well. (ignoring max_rot)
        //--    A buffer option is also available if a sprite
        //--    should want to stop turning early
        //--

        // if I don't have a bbox:
        if (!this.bbox) return;

        // figure out offset angle if specified
        if (!is_offset) {

            // angles must be between 0 and 359 (inclusive)
            this.set_rot( Nickel.UTILITY.trim_angle(this.get_rot()) );
            angle = Nickel.UTILITY.trim_angle(angle);

            // stop here if no turning needed
            if (angle == this.get_rot()) return;

            // how much do i need to turn
            angle = angle - this.get_rot();
        }

        // if gradual
        var ang = 0;
        if (!instant) {

            // avoid negative rotations
            if (this.get_rot() < 0) {
                this.set_rot(this.get_rot() + 360);
            }

            // pick the quicker turn
            if (angle > 180) {
                angle = 360 - angle;
                angle = -1  * angle;
            } else
            if (angle < -180) {
                angle = 360 + angle;
            }

            // restrict from turning immediately, add to move angle
            var max = this.get_rot_max();

            if (Math.abs(angle) > max) {
                if      (angle>buffer) ang += max;
                else if (angle<buffer) ang -= max;
            } else if (Math.abs(angle) <= max) {
                ang += angle;
            }

        // if instant
        } else {
            ang = angle;
        }

        // turn and record angle displacement to last_rot
        this.set_turn(this.get_rot() + ang);
        this.last_rot = ang;
    }

    this.turn_to = function(item,instant=true,buffer=0) {
        //--    Rotates self to target coordinates or sprite.
        //--    Can be specified to gradually turn as well.
        //--    A buffer option is also available if a sprite
        //--    should want to stop turning early
        //--

        // if I don't have a bbox:
        if (!this.bbox) return;

        // determine target position
        if (Nickel.UTILITY.is_array(item))
            var target = item;
        else
            var target = item.get_center();

        // get angle and how much to turn
        var dx = this.get_cx() - target[0];
        var dy = this.get_cy() - target[1];
        var incline = Math.atan2(-dy, dx) * 180 / Math.PI;
        incline += 180;

        // angles must be between 0 and 359 (inclusive)
        this.set_rot( Nickel.UTILITY.trim_angle(this.get_rot()) );

        // stop here if no turning needed
        if (incline == this.get_rot()) return;

        // how much do i need to turn
        var turn = incline - this.get_rot();

        // if gradual
        var ang = 0;
        if (!instant) {

            // pick the quicker turn
            if (turn > 180) {
                turn = 360 - turn;
                turn = -1  * turn;
            } else
            if (turn < -180) {
                turn = 360 + turn;
            }

            //restrict from turning immediately, add to move angle
            var max = this.get_rot_max();

            if (Math.abs(turn) > max) {
                if      (turn>buffer) ang += max;
                else if (turn<buffer) ang -= max;
            } else if (Math.abs(turn) <= max) {
                ang += turn;
            }

        // if instant
        } else {
            ang = turn;
        }

        // turn and record angle displacement to last_rot
        this.set_turn(this.get_rot() + ang);
        this.last_rot = ang;
    }

}//end Sprite



////////////////////////////////////////////
///   SPRITESELECTOR   /////////////////////
////////////////////////////////////////////
function SpriteSelector(scene) {



    // --
    // ------- PROPERTIES ----------------------------------------
    // --



    // Game object
    this.scene = scene;

    // selector box that is used to select multiple objects on screen
    this.selector = null;

    // Holds selection history
    // Dictionary Format:
    //      {selection type:{sprite type:{id:sprite ...} ...} ...}
    this.selection_dictionary = {
        right : {},
        middle : {},
        left : {}
    };



    // --
    // ------- ESSENTIAL methods ---------------------------------
    // --



    this.update_selector = function() {
        //--    Manages a selector box sprite that is used
        //--    for selecting multiple sprites
        //--

        // get cursor position
        var mx = this.scene.mouse_x;
        var my = this.scene.mouse_y;

        // start
        if (this.scene.mouse_curr == this.selector.starter &&
            !this.selector.is_visible()) {

            this.selector.show();
            this.selector.set_size(0,0);
            this.selector.set_pos(mx,my);
            this.selector.startx = mx;
            this.selector.starty = my;
        }

        // drag
        if (this.scene.mouse_curr == this.selector.starter &&
            this.selector.is_visible()) {

            var sw = mx - this.selector.startx;
            var sh = my - this.selector.starty;
            this.selector.set_size(sw,sh);
        }

        // finish
        if (this.scene.mouse_upped == this.selector.starter &&
            this.selector.is_visible()) {

            this.selector.hide();
            this.scene.reset_mouse_upped();
        }

        this.selector.update();
    }

    this.update_borders = function() {
        //--    Manages visibility of border graphics
        //--    of the box selector
        //--

        if (this.selector.border &&
            this.selector.is_visible()) {
            var ctx = this.scene.context;

            ctx.strokeStyle = this.selector.border;
            ctx.lineWidth   = this.selector.border_str;
            ctx.fillStyle   = "none";

            ctx.save();
            ctx.beginPath();

            ctx.rect(this.selector.get_x(), this.selector.get_y(),
                     this.selector.get_w(), this.selector.get_h());

            ctx.stroke();
            ctx.restore();
        }
    }

    this.update_corners = function() {
        //--    Manages visibility of corner graphics
        //--    of the box selector
        //--

        if (this.selector.cornerA &&
            this.selector.is_visible()) {

            if (Math.abs(this.selector.get_w()) >= this.selector.corner_limit.w &&
                Math.abs(this.selector.get_h()) >= this.selector.corner_limit.h) {

                this.selector.cornerA.show();
                this.selector.cornerB.show();
                this.selector.cornerC.show();
                this.selector.cornerD.show();

                var Aco = this.selector.get_topleft();
                var Bco = this.selector.get_topright();
                var Cco = this.selector.get_bottomright();
                var Dco = this.selector.get_bottomleft();

                if (this.selector.corner_persist) {
                    var l = Math.min(Aco[0],Bco[0],Cco[0],Dco[0]);
                    var r = Math.max(Aco[0],Bco[0],Cco[0],Dco[0]);
                    var t = Math.min(Aco[1],Bco[1],Cco[1],Dco[1]);
                    var b = Math.max(Aco[1],Bco[1],Cco[1],Dco[1]);

                    this.selector.cornerA.set_center(l,t); //tl
                    this.selector.cornerB.set_center(r,t); //tr
                    this.selector.cornerC.set_center(r,b); //br
                    this.selector.cornerD.set_center(l,b); //bl

                } else {
                    this.selector.cornerA.set_center(Aco[0],Aco[1]); //tl
                    this.selector.cornerB.set_center(Bco[0],Bco[1]); //tr
                    this.selector.cornerC.set_center(Cco[0],Cco[1]); //br
                    this.selector.cornerD.set_center(Dco[0],Dco[1]); //bl

                }

                this.selector.cornerA.update();
                this.selector.cornerB.update();
                this.selector.cornerC.update();
                this.selector.cornerD.update();
            }

        }
    }

    this.update = function() {
        //--    Called every frame.
        //--    Updates changing parameters.
        //--

        if (this.selector) {
            this.update_selector();
            this.update_borders();
            this.update_corners();
        }
    }

    this.select = function(sel_type, spr) {
        //--    Adds a sprite to the selection dictionary
        //--

        var id = String(spr.get_id());
        this.selection_dictionary[sel_type][spr.get_type()][id] = spr;
    }

    this.unselect = function(sel_type, spr) {
        //--    Removes a sprite from the selection dictionary
        //--

        var id = spr.get_id();
        this.selection_dictionary[sel_type][spr.get_type()][id] = null;
        //delete this.selection_dictionary[sel_type][spr.get_type()][id];    //// MIGHT IMPACT PERFORMANCE BADLY <HERE>  MAY NOT NEED !!!
    }

    this.unselect_all = function() {
        //--    Unselects all by removing all IDs from the
        //--    selection dictionary
        //--

        for (var s in this.selection_dictionary) {
            var sel = this.selection_dictionary[s];
            for (var t in sel) {
                sel[t] = {};
            }
        }
    }

    this.unselect_all_spr = function(type) {
        //--    Unselects all of a certain type from
        //--    every type of selection
        //--

        for (var s in this.selection_dictionary) {
            this.selection_dictionary[s][type] = {};
        }
    }

    this.unselect_all_sel = function(sel_type) {
        //--    Unselects all of a certain selection
        //--    from every type of sprite
        //--

        for (var t in this.selection_dictionary[sel_type]) {
            this.selection_dictionary[sel_type][t] = {};
        }
    }

    this.add_sprite_type = function(type) {
        //--    Adds a new sprite type to the selection
        //--    dictionary
        //--

        this.selection_dictionary.right[type]  = {};
        this.selection_dictionary.middle[type] = {};
        this.selection_dictionary.left[type]   = {};
    }



    // --
    // ------- GETTERS -------------------------------------------
    // --



    this.get_selected_all = function() {
        //--    Returns all selections
        //--

        //return this.selection_dictionary; <- old
        var selection = [];
        for (var s in this.selection_dictionary) {
            var sel = this.selection_dictionary[s];
            for (var t in sel) {
                var type = sel[t];
                for (var spr_id in type) {
                    var spr = type[spr_id];
                    if (spr) {
                        selection.push(spr);
                    }
                }
            }
        }
        return selection;
    }

    this.get_selected_all_spr = function(sel_type, spr_type) {
        //--    Returns all selected sprites of a certain sprite
        //--    type under a certain selection type
        //--

        //return this.selection_dictionary[sel_type][spr_type]; <- old
        var selection = [];
        var type = this.selection_dictionary[sel_type][spr_type];
        for (var spr_id in type) {
            var spr = type[spr_id];
            if (spr) {
                selection.push(spr);
            }
        }
        return selection;
    }

    this.get_selected_all_sel = function(sel_type) {
        //--    Returns all selected sprites that were selected
        //--    in a certain way (1 of 3 mouse clicks)
        //--

        //return this.selection_dictionary[sel_type]; <- old
        var selection = [];
        var sel = this.selection_dictionary[sel_type];
        for (var t in sel) {
            var type = sel[t];
            for (var spr_id in type) {
                var spr = type[spr_id];
                if (spr) {
                    selection.push(spr);
                }
            }
        }
        return selection;
    }

    this.get_under_point = function(sprites, x, y, sorted=true) {
        //--    Returns ordered list (first element is top) of
        //--    sprites that are underneath a point
        //--    (ordered by collision layer)
        //--

        if (sorted) {
            var heap = new Heap('max');
            for (var i in sprites) {
                if (sprites[i].intersects_point(x,y)) {
                    var sort_by = this.selector.sort_by(sprites[i]);
                    heap.in(sprites[i],sort_by);
                }
            }
            return heap.sort();

        } else {
            var over = [];
            for (var i in sprites) {
                if (sprites[i].intersects_point(x,y)) {
                    over.push(sprites[i]);
                }
            }
            return over;
        }

    }

    this.get_under_mouse = function(sprites, sorted=true) {
        //--    Returns ordered list (first element is top) of
        //--    sprites that are underneath the mouse cursor
        //--    (ordered by collision layer)
        //--

        var mx = this.scene.mouse_x;
        var my = this.scene.mouse_y;
        return this.get_under_point(sprites,mx,my,sorted);
    }

    this.get_under_box = function(sprites, sorted=true) {
        //--    Returns ordered list (first element is top) of
        //--    sprites that are underneath the box selector
        //--    (ordered by collision layer)
        //--

        if (!this.selector.is_visible()) return false;

        if (sorted) {
            var heap = new Heap('max');
            for (var i in sprites) {
                if (this.selector.colliding(sprites[i], false)) {
                    var sort_by = this.selector.sort_by(sprites[i]);
                    heap.in(sprites[i],sort_by);
                }
            }
            return heap.sort();

        } else {
            var under = [];
            for (var i in sprites) {
                if (this.selector.colliding(sprites[i], false)) {
                    under.push(sprites[i]);
                }
            }
            return under;
        }
    }



    // --
    // ------- SETTERS -------------------------------------------
    // --



    this.set_selector = function(sel_data) {
        //--    Sets properties of the selector box
        //--

        this.selector = sel_data.sprite;
        this.selector.sort_by = sel_data.sort_by;
        this.selector.border = sel_data.border_color;
        this.selector.border_str = sel_data.border_thickness;
        this.selector.cornerA = sel_data.corner_topleft;
        this.selector.cornerB = sel_data.corner_topright;
        this.selector.cornerC = sel_data.corner_bottomright;
        this.selector.cornerD = sel_data.corner_bottomleft;
        this.selector.corner_limit = sel_data.corner_start_size;
        this.selector.corner_persist = sel_data.corner_persistence;
        if (sel_data.click_type == 'left')   this.selector.starter = 0;
        if (sel_data.click_type == 'middle') this.selector.starter = 1;
        if (sel_data.click_type == 'right')  this.selector.starter = 2;
        this.selector.hide();
    }



}//end SpriteSelector



// --
// ------- DATA STRUCTURES -----------------------------------
// --



////////////////////////////////////////////
///   STACK  ///////////////////////////////
////////////////////////////////////////////
function Stack() {

    // holds stack data
    var list = [];

    this.push = function(obj) {
        //--    pushes object on top of stack
        //--

        list.push(obj);
    }

    this.pop = function() {
        //--    pops and returns object from top of stack
        //--

        return list.pop();
    }

    this.top = function() {
        //--    returns top object on stack
        //--

        return list[list.length-1];
    }

    this.is_empty = function() {
        //--    returns if stack is empty
        //--

        return !list.length;
    }

    this.count = function() {
        //--    returns size of stack
        //--

        return list.length;
    }

    this.clear = function() {
        //--    removes all objects from stack
        //--

        list = [];
    }

    this.data = function() {
        //--    returns raw stack data
        //--

        return list;
    }

    this.dump = function() {
        //--    pops all objects into an array
        //--    then returns it
        //--

        var out = [];
        while(!this.is_empty()) {
            out.push(list.pop());
        }
        return out;
    }
}//end Stack



////////////////////////////////////////////
///   QUEUE  ///////////////////////////////
////////////////////////////////////////////
function Queue() {

    // holds queue data
    var list = [];

    // number of elements the end of the queue
    // is from the 1st element of 'list'
    var off = 0;

    this.in = function(obj) {
        //--    enqueues object into the end of 'list'
        //--

        list.push(obj);
    }

    this.next = function() {
        //--    returns object next in line in
        //--    to be dequeued
        //--

        return list[off];
    }

    this.out = function() {
        //--    dequeues object at 'off' index from 'list'
        //--    i.e. the head of the queue
        //--

        if (off+1 < list.length)
            return list[off++];
        if (off+1 == list.length) {
            var last = list[off];
            this.clear();
            return last;
        }
    }

    this.is_empty = function() {
        //--    returns if queue is empty
        //--

        return !list.length;
    }

    this.count = function() {
        //--    returns size of queue
        //--

        return list.length-off;
    }

    this.clear = function() {
        //--    removes all object from queue
        //--

        list = [];
        off = 0;
    }

    this.dump = function() {
        //--    slices all objects from queue into
        //--    an array, then returns it
        //--

        var out = list.slice(off,list.length);
        this.clear();
        return out;
    }
}//end Queue



////////////////////////////////////////////
///   HEAP  ////////////////////////////////
////////////////////////////////////////////
function HeapNode() {

    // the priority of a node determines how much
    // it should "heapify" in the heap once inserted
    this.priority = -1;

    // holds the data object to be sorted
    this.obj      = null;

}//end HeapNode

function Heap(_type='max') {

    // holds binary tree data
    var list = [];

    // 2 types of heap:
    //   max:  highest priority node is the root
    //   min:  lowest priority node is the root
    var type = _type;

    this.len = function() {
        //--    returns number of nodes in heap
        //--

        return list.length;
    }

    this.is_empty = function() {
        //--    returns if heap is empty
        //--

        return !list.length;
    }

    this.last = function() {
        //--    returns the last node in the heap
        //--
        //--    note: this is quite useless
        //--

        return list[this.len()-1];
    }

    this.first = function() {
        //--    returns the root node of the heap
        //--

        return list[0];
    }

    this.print = function() {
        //--    prints the heap in terms of the data
        //--    held within the nodes as well as their
        //--    priority
        //--

        var str = '';
        for (var i in list) {
            str = str.concat('[' + list[i].obj);
            str = str.concat(' ' + list[i].priority);
            str = str.concat('] ');
        }
        console.log(str);
    }

    this.printp = function() {
        //--    prints the heap in terms of the
        //--    priority of its nodes
        //--

        var str = '';
        for (var i in list) {
            str = str.concat(list[i].priority);
            str = str.concat(' ');
        }
        console.log(str);
    }

    this.printo = function() {
        //--    prints the heap in terms of the data
        //--    held within the nodes
        //--

        var str = '';
        for (var i in list) {
            str = str.concat(list[i].obj);
            str = str.concat(' ');
        }
        console.log(str);
    }

    this.in = function(o,v) {
        //--    adds a new node to the heap with object
        //--    data of 'o' and a priority of 'v'
        //--

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
        //--    removes and returns the heap's root node
        //--

        // swap first and last
        this.swap(0,this.len()-1);

        // pop last
        var node = list.pop();

        // adjust based on priority
        this.pour(0);

        return node;
    }

    this.swap = function(i,j) {
        //--    swaps two heap nodes (i & j) positions
        //--    within the heap
        //--

        // edge case
        if (i == j) return;

        // swaps nodes' locations in list
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }

    this.climb = function(inode) {
        //--    uses the index of a node to make it
        //--    climb as high as possible in the heap
        //--

        // get index
        if (inode % 2 == 0) {
            var ipar = (inode - 2) / 2;
        } else {
            var ipar = (inode - 1) / 2;
        }

        // get nodes
        var node = list[inode];
        var par  = list[ipar];

        // edge cases
        if (inode == 0) return;
        if (!par) return;

        // general case
        if ( (type == 'max' && par.priority < node.priority) ||
             (type == 'min' && par.priority > node.priority) ){
            this.swap(inode,ipar);
            this.climb(ipar);
        }
    }

    this.pour = function(ipar) {
        //--    uses the index of a parent to make it
        //--    climb as low as possible in the heap
        //--

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
            if (type == 'max')
                var pright = pleft - 1;
            else
                var pright = pleft + 1;

        }

        // get max/min child
        if (type == 'max' && pleft >= pright ||
            type == 'min' && pleft <= pright) {
            var inode = ileft;
            var node = left;
        } else {
            var inode = iright;
            var node = right;
        }

        // cancel if nothing needs to swap
        if (!node) return;

        // general case
        if ( (type == 'max' && par.priority < node.priority) ||
             (type == 'min' && par.priority > node.priority) ){
            this.swap(inode,ipar);
            this.pour(inode);
        }
    }

    this.sort = function() {
        //--    pops all objects from the heap
        //--    by the order of their priority,
        //--    stored in an array that is returned
        //--

        var objects = [];
        while (this.len()) {
            objects.push(this.out().obj);
        }
        return objects;
    }

    this.find = function(o,same) {
        //--    searches for a node with the object 'o'
        //--    using a compare function 'same'
        //--
        //--    note: if no 'same' function is specified,
        //--    a default comparer function is set
        //--
        //--    note: worst case time complexity:  logN
        //--

        // default comparer
        if (!same) same = function(a,b) {return a==b;}

        function recur(i) {

            // not found
            if (!list[i]) return false;

            // found
            list[i].index = i;
            if (same(list[i].obj,o)) return (list[i]);

            // get indices
            var ileft  = 2 * i + 1;
            var iright = 2 * i + 2;

            // check children
            var left = recur(ileft);
            if (left) return left;
            else return recur(iright);
        }

        return recur(0);
    }

    this.tweak = function(o,p,same) {
        //--    searches for a node with the object 'o'
        //--    using a compare function 'same' and changes
        //--    its priority to 'p'
        //--
        //--    note: if no 'same' function is specified,
        //--    a default comparer function is set
        //--
        //--    note: worst case time complexity:  2logN
        //--

        // get node
        var obj = this.find(o,same);

        // edge case
        if (!obj) return false;

        // edge case
        if (obj.priority == p) return true;

        // tweak priority & adjust node's position in tree
        if (type == 'max' && obj.priority > p ||
            type == 'min' && obj.priority < p) {
            obj.priority = p;
            this.pour(obj.index);
        } else {
            obj.priority = p;
            this.climb(obj.index);
        }

        return true;
    }

}//end Heap



////////////////////////////////////////////
///   QUADTREE  ////////////////////////////
////////////////////////////////////////////
function QuadTreeObj(obj,overlap,bounds) {

    // actual object to check collision for
    this.entity = obj;

    // actual bounds of the collision object
    this.bounds = bounds;

    // indicates if overlapping onto one or
    // more other quadtree cells.
    // affects debug colors
    this.overlapping = overlap;

    // mainly for debugging purposes.
    // affects debug colors
    this.selected = false;
}//end QuadTreeObj

function QuadTreeNode() {

    // a list of children QuadTreeNodes
    // (separated into 4 (hence "quad") equal squares)
    this.children = [];

    // bounds of the cell this node represents
    this.bounds = null;

    // indicates how deep into the quadtree this node is
    // (0 is the root level, so 1 would be given to the
    //  4 equal cells that make up the root, and so on...)
    this.level = 0;

    // list of QuadTreeObjs in this cell that
    // don't overlap onto any other cells
    this.objs = [];
}//end QuadTreeNode

// --------------------
// Quadrant Reference:
// --------------------
//  -1      BORDER  N/A
//  0       NW      A
//  1       NE      B
//  2       SE      C
//  3       SW      D
// --------------------
function QuadTree(max_objs, max_depth, bounds) {

    // root of quadtree
    this.root = new QuadTreeNode();

    // bounds of entire quadtree (and of the root node)
    this.root.bounds = bounds;

    // maximum number of objects in a cell until the
    // cell splits into 4 more pieces
    var MAX_OBJS = max_objs;

    // maximum number of levels allowed in any particular
    // cell unitl 4-way splits stop occurring
    var MAX_DPTH = max_depth;

    this.in = function(obj,pos,size,node=this.root) {
        //--    adds a new object into the quadtree
        //--    and applies any neccessary splits.
        //--    returns 0 if obj lies outside of the quadtree.
        //--    returns 1 if obj is overlapping at least 1 boundary.
        //--    returns 2 if obj is within a cell, not overlapping any boundary
        //--

        if (!obj) return false;
        var curr = node;
        var o = new QuadTreeObj(obj, false, { x:pos[0], w:size[0],
                                              y:pos[1], h:size[1] });

        // mimics recursion
        while (curr) {

            if (curr.level >= MAX_DPTH) {
                curr.objs.push(o);
                return 2;
            }

            if (curr.objs.length < MAX_OBJS && !curr.children.length) {
                curr.objs.push(o);
                return 2;
            }

            else if (curr.children.length) {
                var quadrant = this.quad(curr.bounds, o.bounds);
                if (quadrant != -1) {
                    curr = curr.children[quadrant];
                } else {
                    curr.objs.push(o);
                    o.overlapping = true;
                    return 1;
                }
            }

            else if (curr.objs.length >= MAX_OBJS) {
                var quadrant = -1;
                var tmp_objs = curr.objs;

                curr.objs = [];
                this.chop(curr);

                for (var i in tmp_objs) {
                    quadrant = this.quad(curr.bounds, tmp_objs[i].bounds);
                    if (quadrant != -1) {
                        this.in(tmp_objs[i].entity,
                                [tmp_objs[i].bounds.x, tmp_objs[i].bounds.y],
                                [tmp_objs[i].bounds.w, tmp_objs[i].bounds.h],
                                curr.children[quadrant]);
                    } else {
                        curr.objs.push(tmp_objs[i]);
                        tmp_objs[i].overlapping = true;
                    }
                }

                quadrant = this.quad(curr.bounds, o.bounds);
                if (quadrant != -1) {
                    curr = curr.children[quadrant];
                } else {
                    curr.objs.push(o);
                    o.overlapping = true;
                    return 1;
                }
            }
        }// end loop

        return 0;
    }

    this.quad = function(space_bounds, obj_bounds) {
        //--    returns which quadrant obj_bounds' center lies within
        //--    if space_bounds is split into 4 equal squares
        //--    returns -1 if center is out of bounds
        //--    returns 0 if center lies in the North West
        //--    returns 1 if center lies in the North East
        //--    returns 2 if center lies in the South East
        //--    returns 3 if center lies in the South West
        //--

        var cx = space_bounds.x + space_bounds.w / 2;
        var cy = space_bounds.y + space_bounds.h / 2;
        var otop = obj_bounds.y;
        var oleft = obj_bounds.x;
        var oright = obj_bounds.x + obj_bounds.w;
        var obottom = obj_bounds.y + obj_bounds.h;

        // left
        if (oright < cx) {
            // top
            if (obottom < cy) {
                return 0;
            // bottom
            } else if (otop > cy) {
                return 3;
            }
        // right
        } else if (oleft > cx) {
            // top
            if (obottom < cy) {
                return 1;
            // bottom
            } else if (otop > cy) {
                return 2;
            }
        }

        return -1;
    }

    this.chop = function(node) {
        //--    populates input node with children
        //--    representing a 4-way split
        //--

        var A = new QuadTreeNode();
        var B = new QuadTreeNode();
        var C = new QuadTreeNode();
        var D = new QuadTreeNode();

        A.level = node.level + 1;
        B.level = node.level + 1;
        C.level = node.level + 1;
        D.level = node.level + 1;

        A.bounds = {
            x:node.bounds.x,
            y:node.bounds.y,
            w:node.bounds.w / 2,
            h:node.bounds.h / 2
        }
        B.bounds = {
            x:node.bounds.x + node.bounds.w / 2,
            y:node.bounds.y,
            w:node.bounds.w / 2,
            h:node.bounds.h / 2
        }
        C.bounds = {
            x:node.bounds.x + node.bounds.w / 2,
            y:node.bounds.y + node.bounds.h / 2,
            w:node.bounds.w / 2,
            h:node.bounds.h / 2
        }
        D.bounds = {
            x:node.bounds.x,
            y:node.bounds.y + node.bounds.h / 2,
            w:node.bounds.w / 2,
            h:node.bounds.h / 2
        }

        node.children.push(A);
        node.children.push(B);
        node.children.push(C);
        node.children.push(D);
    }

    this.get = function(pos,size) {
        //--    returns a list of objects in the cell of the
        //--    center of the input arguments
        //--

        var bounds = { x:pos[0], w:size[0], y:pos[1], h:size[1] };
        var objs = [];
        this._get(this.root, bounds, objs);
        return objs;
    }

    this._get = function(node,bounds,objs) {
        //--    recursively searches through the quadtree for
        //--    all the nodes in the cell intersecting with the
        //--    center of 'bounds', starting from 'node'; 'objs'
        //--    is filled up with all the objects found and marks
        //--    them as 'selected' (for debugging purposes)
        //--

        var quadrant = this.quad(node.bounds, bounds);
        for (var i in node.objs) {
            node.objs[i].selected = true;
        }
        objs.push.apply(objs, node.objs);
        if (quadrant != -1) {
            if (node.children.length) {
                this._get(node.children[quadrant], bounds, objs);
            } else {
                return;
            }
        } else {
            return;
        }
    }

    this.clear = function() {
        //--    clears and resets root node, ultimately
        //--    clearing the entire quadtree
        //--

        this.root.children = [];
        this.root.level = 0;
        this.root.objs = [];
    }

    this.viz = function(context) {
        //--    uses the given HTML Canvas context object to draw
        //--    out the quadtree ONCE (for debugging purposes).
        //--    - boundaries are colored BLACK.
        //--    - overlapping nodes are colored GREEN.
        //--    - selected nodes are colored ORANGE.
        //--    - all other nodes are colored RED
        //--

        var help_me_draw = function(curr) {

            // print quad tree
            function draw_tree() {
                context.strokeStyle="black";
                context.beginPath();
                context.rect(curr.bounds.x, curr.bounds.y,
                                  curr.bounds.w, curr.bounds.h);
                context.stroke();
            }

            // print obj points
            function draw_objs() {
                for (var i in curr.objs) {
                    var o = curr.objs[i];
                    if (o.overlapping) {
                        context.strokeStyle="green";
                    } else {
                        context.strokeStyle="red";
                    }
                    if (o.selected) {
                        context.strokeStyle="orange";
                    }
                    context.beginPath();
                    context.rect(o.bounds.x, o.bounds.y,
                                      o.bounds.w, o.bounds.h);
                    context.stroke();
                }
            }

            // save settings of context
            context.save();

            // thin brush
            context.lineWidth = 1;

            // draw
            draw_objs();
            draw_tree();

            // restore context settings
            context.restore();

            // traverse to next nodes
            for (var i in curr.children) {
                help_me_draw(curr.children[i]);
            }
        }

        help_me_draw(this.root);

    }

    this.print = function(node=this.root) {
        //--    prints out the quadtree from the given node in
        //--    terms of node level, children, and objs
        //--    (for debugging purposes)
        //--

        var str = "";
        for (var i=0;i<node.level;i++) {
            str += "> ";
        }
        str += "{ ";
        str += "lvl : " + node.level;
        str += "  ,  childs : " + node.children.length;
        str += "  ,  objs : " + node.objs.length;
        str += " }";
        console.log(str);
        for (var i in node.children) {
            this.print(node.children[i]);
        }
    }

}//end QuadTree
