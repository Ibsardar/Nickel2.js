/*
    NAME:   "N2Base.js"
    AUTH:   Ibrahim Sardar
    DESC:   Base functionality of Nickel2.js

    TODO:   upgrade from legacy keyCode to modern key/code
            implement debugging feature, enabled by: "Nickel.DEBUG=true;"
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
        round : function(num,dec=0){ var round = Number(Math.round(num+'e'+dec)+'e-'+dec); return isNaN(round) ? 0 : round; },
        determine_destination : function(g, d) { return d instanceof Array ? g.map[d[0]][d[1]] : d; },
        is_array : function(o) { return o instanceof Array },
        assign_id : function() { return Nickel.ID++; },
        magnitude_of_vector : function(v) { return Math.sqrt(v[0]*v[0] + v[1]*v[1]); },
        normalize_vector : function(v) { var mag=Math.sqrt(v[0]*v[0] + v[1]*v[1]); return !mag ? false : [v[0]/mag, v[1]/mag]; },
        vector_product : function(v1,v2) { return [v1[0]*v2[0] + v1[0]*v2[1], v1[1]*v2[0] + v1[1]*v2[1]]; },
        cross_product : function(v1,v2) { return v1[0]*v2[1] - v1[1]*v2[0]; },
        dot_product : function(v1,v2) { return v1[0]*v2[0] + v1[1]*v2[1]; },
        add_vector : function(v1,v2) { return [v1[0]+v2[0], v1[1]+v2[1]]; },
        subtract_vector : function(v1,v2) { return [v1[0]-v2[0], v1[1]-v2[1]]; },
        trim_angle : function(angle) { return angle % 360; },
        atan2 : function(a,b) { if (!a) a=0; if (!b) b=0; return Math.atan2(a,b); }
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
///   DETECTOR   ///////////////////////////
////////////////////////////////////////////
//
//  Collision Detection Functions (also includes resolution in some cases)
//
//      * does not include convex polygon-to-convex polygon  collision *
//      * does not include convex polygon-to-line segment  collision *
//      * does not include convex polygon-to-point  collision *
//
var Collision_Detector = {
    // TODO: CLEAN COMMENTS, PRINT STATEMENTS
    
    _closest_pt_on_ray_to_pt : function (ray, pt) {
        //--    Helper Function: returns the closest point
        //--    on the given line segment to the given point
        //--
        
        // get unit vector
        var u = ray.get_unit();
        
        // get normal of unit vector
        var n = [-u[1], u[0]];
        
        // dir * t + start = norm * s + pt
        // dx * t + sx = nx * s + px
        // dy * t + sy = ny * s + py
        // solve: t = (nx*((dy*t+sy-py)/ny) + px - sx) / dx
        //        ...
        //        t = (nx*(sy - py) + ny*(px - sx)) / (ny*dx - dy*nx)
        //
        // parameter of line: t (substitute s)
        var t = (n[0]*(ray.y - pt[1]) + n[1]*(pt[0] - ray.x)) / (n[1]*u[0] - u[1]*n[0]);
        
        // plug t back in to obtain points
        var nearest_x = u[0] * t + ray.x;
        var nearest_y = u[1] * t + ray.y;
        
        // check if point is within bounds of ray via
        // parametric equations:
        //
        // find where point starts relative to line segment:
        //   formula: pt = line-dir*t + line_start
        //   where pt = [nearest_x, nearest_y]
        //   solve:   t = (pt   - line_start)   / line_dir
        //   x-comp:  t = (pt_x - line_start_x) / line_dir_x
        //   y-comp:  t = (pt_y - line_start_y) / line_dir_y
        //
        // precedes bounds
        if (t < 0)
            return ray.get_pos();
        // within bounds
        return [nearest_x, nearest_y];
    }
    
    ,
    
    //TODO: FIX NaNs WHEN LINE IS VERTICAL
    _closest_pt_on_lineseg_to_pt : function (line, pt) {
        //--    Helper Function: returns the closest point
        //--    on the given line segment to the given point
        //--
        
        //junk
        /*
        if (!line.x || !pt) {
            console.error('===');
            console.error(line);
            console.error(pt);
        }
        */
        
        // find normal dir to dir of line
        var n = [-line.dy, line.dx];
        
        // dir * t + start = norm * s + pt
        // dx * t + sx = nx * s + px
        // dy * t + sy = ny * s + py
        // solve: t = (nx*((dy*t+sy-py)/ny) + px - sx) / dx
        //        ...
        //        t = (nx*(sy - py) + ny*(px - sx)) / (ny*dx - dy*nx)
        //
        // parameter of line: t (substitute s)
        var t = (n[0]*(line.y - pt[1]) + n[1]*(pt[0] - line.x)) / (n[1]*line.dx - line.dy*n[0]);
        
        /* /junk
        if (!t) {
            console.error(t);
            console.error(line);
            console.error(pt);
            err_fnd = true;
        }**/
        
        // plug t back in to obtain points
        var nearest_x = line.dx * t + line.x;
        var nearest_y = line.dy * t + line.y;
        
        // check if point is within bounds of line via
        // parametric equations:
        //
        // find where point starts relative to line segment:
        //   formula: pt = line-dir*t + line_start
        //   where pt = [nearest_x, nearest_y]
        //   solve:   t = (pt   - line_start)   / line_dir
        //   x-comp:  t = (pt_x - line_start_x) / line_dir_x
        //   y-comp:  t = (pt_y - line_start_y) / line_dir_y
        //
        // exceeds bounds
        if (t > 1)
            return line.get_end();
        // precedes bounds
        if (t < 0)
            return line.get_pos();
        // within bounds
        return [nearest_x, nearest_y];
    }
    
    ,
    
    collides_poly_poly  : function (me, you, resolve_me=false, resolve_you=false,
                                    my_heaviness=1, your_heaviness=1,
                                    my_velocity=null, your_velocity=null) {
        //--    Polygon-polygon collision detection via
        //--    separating axis theorem. Can also resolve
        //--    me or you completely or both of us
        //--    partially. Heaviness will determine how
        //--    much fast each poly moves. If resolution
        //--    is desired, return value will be a pair
        //--    of push vectors for both polys.
        //--
        
        // begin by temporarily shifting us by our velocities
        // (function makes this easier to use later)
        var velocity_shift = function(dir=1) {
            if (my_velocity)
                me.shift_pos(my_velocity[0] * dir, my_velocity[1] * dir);
            if (your_velocity)
                you.shift_pos(your_velocity[0] * dir, your_velocity[1] * dir);
        }
        velocity_shift();
        
        // begin by temporarily rotating us by our angles
        // (function makes this easier to use later)
        /*var angle_rotation = function(dir=1) {
            if (my_rotation)
                me.shift_pos(my_velocity[0] * dir, my_velocity[1] * dir);
                me.rotate_around(my_rotation * dir, )
            if (your_rotation)
                you.shift_pos(your_velocity[0] * dir, your_velocity[1] * dir);
        }
        angle_rotation();*/
        
        // this is for finding the minimum interval
        // distance along some normal in the case
        // of collision resolution:
        var min_interval = 99999999;
        
        // this is for finding the the axis in which
        // the minimum interval distance is found in
        // the case of collision resolution:
        var min_interval_axis = [0,0];
        
        // this is for the list of normal angles
        var norms = new Map();
        
        // (append only half of my normal angles if I'm
        //  equiangular and have even amount of vertices)
        var len = me.vertices.length;
        if (me.equiangular && !(me.vertices.length % 2))
            len /= 2;
        
        // append my normal angles to list
        for (var i=0, j=1; i<len; i++, j++) {
            
            // adjust next vertex indicator
            if (j >= me.vertices.length)
                j = 0;
            
            // calculate radian angle from vertex i to j
            var diff = Nickel.UTILITY.subtract_vector(me.vertices[i],me.vertices[j]);
            var theta = Nickel.UTILITY.atan2(diff[0], -diff[1]);
            
            // add normal angle
            norms.set(theta, null);
        }
        
        // (append only half of your normal angles if you're
        //  equiangular and have even amount of vertices)
        len = you.vertices.length;
        if (you.equiangular && !(you.vertices.length % 2))
            len /= 2;
        
        // append ur normal angles to list
        for (var i=0, j=1; i<len; i++, j++) {
            
            // adjust next vertex indicator
            if (j >= you.vertices.length)
                j = 0;
            
            // calculate radian angle from vertex i to j
            var diff = Nickel.UTILITY.subtract_vector(you.vertices[i],you.vertices[j]);
            var theta = Nickel.UTILITY.atan2(diff[0], -diff[1]);
            
            // add normal angle
            norms.set(theta, null);
        }
        
        // for each axis along a normal
        for (var n of norms.keys()) {

            // get unit normal vector
            var unit_normal_vec = [Math.cos(n), -1 * Math.sin(n)];

            // this is for the list of components (magnitude of projection)
            var my_comps = [];
            var ur_comps = [];
            
            // get my components
            for (var j in me.vertices) {
                
                // get component (scalar)
                // formula: comp b onto a = a dot b / mag(a)
                // simplified formula: comp b onto a = a dot b / 1(unit vec)
                my_comps.push(Nickel.UTILITY.dot_product(me.vertices[j], unit_normal_vec));
            }
            
            // get ur components
            for (var j in you.vertices) {
                
                // get component (scalar)
                // formula: comp b onto a = a dot b / mag(a)
                // simplified formula: comp b onto a = a dot b / 1(unit vec)
                ur_comps.push(Nickel.UTILITY.dot_product(you.vertices[j], unit_normal_vec));
            }

            // get max/min of components for each polygon
            var my_extreme = [ Math.min.apply(null,my_comps), Math.max.apply(null,my_comps) ];
            var ur_extreme = [ Math.min.apply(null,ur_comps), Math.max.apply(null,ur_comps) ];
            
            // check collision
            if (my_extreme[1] < ur_extreme[0] ||
                my_extreme[0] > ur_extreme[1]) {
            
                // shift back
                velocity_shift(-1);

                // gap found
                return false;
            }
            
            // COLLISION RESOLUTION
            if (resolve_me || resolve_you) {
                
                // get distance of collision interval on this axis
                var this_interval = Math.abs(my_extreme[0] - ur_extreme[1]);
                if (my_extreme[0] < ur_extreme[0]) {
                    this_interval = Math.abs(ur_extreme[0] - my_extreme[1]);
                }
                
                // record smallest interval yet
                if (this_interval < min_interval) {
                    min_interval = this_interval;
                    min_interval_axis[0] = unit_normal_vec[0];
                    min_interval_axis[1] = unit_normal_vec[1];
                    
                    // flip direction if general direction
                    // is other way from poly's center:
                    var center_diff = Nickel.UTILITY.subtract_vector(me.get_center(), you.get_center());
                    if (Nickel.UTILITY.dot_product(center_diff, min_interval_axis) < 0) {
                        min_interval_axis[0] = -min_interval_axis[0];
                        min_interval_axis[1] = -min_interval_axis[1];
                    }
                }
            }
        }
        
        // COLLISION RESOLUTION
        if (resolve_me || resolve_you) {
            
            // The minimum translation vector from you to me;
            // used to push polygons appart.
            var min_translation_vec = [min_interval_axis[0]*min_interval,
                                       min_interval_axis[1]*min_interval];
            
            // shift back
            velocity_shift(-1);
            
            // resolve me
            if (resolve_me && !resolve_you) {
                me.shift_pos(min_translation_vec[0], min_translation_vec[1]);
                
                // return a pair of push vectors for me and you
                return [min_translation_vec, [0,0]];

            // resolve you
            } else if (!resolve_me && resolve_you) {
                you.shift_pos(min_translation_vec[0] * -1, min_translation_vec[1] * -1);
                
                // return a pair of push vectors for me and you
                return [[0,0],min_translation_vec];

            // resolve both partially
            } else if (resolve_me && resolve_you) {
                
                // calculate heavyness percentage
                my_heaviness = my_heaviness / (my_heaviness + your_heaviness);
                your_heaviness = 1 - my_heaviness;
                
                // calculate how much me and you should be pushed away
                // (so smaller vector means heavier polygon and vice versa)
                var my_resolve   = [min_translation_vec[0] * your_heaviness,
                                    min_translation_vec[1] * your_heaviness];
                var your_resolve = [min_translation_vec[0] * my_heaviness * -1,
                                    min_translation_vec[1] * my_heaviness * -1];

                // push both of us
                me.shift_pos(my_resolve[0], my_resolve[1]);
                you.shift_pos(your_resolve[0], your_resolve[1]);
                
                // return a pair of push vectors for me and you
                return [my_resolve, your_resolve];
            }
        }
            
        // shift back
        velocity_shift(-1);

        // collision is certain (worst case time complexity)
        return true;
    }
    
    ,
    
    //TODO: OPTIMIZE
    collides_poly_circle : function (me, you, resolve_me=false, resolve_you=false,
                                     my_heaviness=1, your_heaviness=1,
                                     my_velocity=null, your_velocity=null) {
        //--    Polygon-circle collision detection by checking closest edge
        //--    point distance to circle center, then use a raycast to check
        //--    if circle is wholly consumed by polygon (center consumed for resolution).
        //--
        
        //junk
        if (isNaN(me.x))
            console.error('AAAH! (0)');
        if (isNaN(you.cx))
            console.error('AAAH! (0.5)');
        
        // begin by temporarily shifting us by our velocities
        // (function makes this easier to use later)
        var velocity_shift = function(dir=1) {
            if (my_velocity)
                me.shift_pos(my_velocity[0] * dir, my_velocity[1] * dir);
            if (your_velocity)
                you.shift_pos(your_velocity[0] * dir, your_velocity[1] * dir);
        }
        velocity_shift();
        
        // push vector from circle's center to mine
        var min_translation_vec = null;
        
        // min distance from circle to poly
        var min_distance = 999999;
        
        // closest point on polygon edges to circle's center
        var closest = null;
        
        // is circle's center within the poly?
        var within = Collision_Detector.collides_poly_point(me, you.get_center());
        
        // if no resolution, check if center is within
        if (within && !resolve_me && !resolve_you) {
            velocity_shift(-1);
            return true;
        }
        
        //junk
        var tmp_d = 123;
        var tmp_o = 456;
        
        // check every edge for the closest point to the
        // circle's center until a point collides
        var edge = null;
        for (var i=0, j=1; i<me.vertices.length; i++, j++) {
            if (j>=me.vertices.length)
                j = 0;
            
            // get closest point and other related information
            edge = new LineSegment(me.vertices[i], me.vertices[j]);
            var info = Collision_Detector.collides_circle_line(you, edge, true);
            
            // COLLISION RESOLUTION
            if (resolve_me || resolve_you) {
                if (info[2] < min_distance) {
                    
                    // record minimum distance to circle's center
                    min_distance = info[2];
                    
                    // record closest point
                    closest = info[1];
                    
                    // if collision
                    if (info[0] && !within) {
                            
                        // direction vector from you to me
                        var dir = Nickel.UTILITY.normalize_vector(
                                        Nickel.UTILITY.subtract_vector(closest, you.get_center()));
                        
                        // default if normalization not possible (probably zero-vector)
                        if (!dir)
                            var dir = [1,0];

                        // distance of circle's overlap over poly
                        var overlap_dist = you.radius - min_distance;

                        //junk
                        tmp_d = dir;
                        tmp_o = overlap_dist;
                        
                        // push vector from you to me
                        min_translation_vec = [dir[0] * overlap_dist, dir[1] * overlap_dist];
                    }
                }
            } else if (info[0]) {
                velocity_shift(-1);
                return true;
            }
        }
        
        // if circle center is within, we must create the
        // push vector a little bit differently:
        if (within) {
            
            // direction vector from me to you
            var dir = Nickel.UTILITY.normalize_vector(
                            Nickel.UTILITY.subtract_vector(you.get_center(), closest));

            // default if normalization not possible (probably zero-vector)
            if (!dir)
                var dir = [1,0];

            // distance of circle's overlap over poly
            var overlap_dist = you.radius + min_distance;
            
            // push vector from you to me
            min_translation_vec = [dir[0] * overlap_dist, dir[1] * overlap_dist];
        }
        /*
        if (err_fnd && min_translation_vec) {
            console.log(JSON.stringify(min_translation_vec));
            if (isNaN(min_translation_vec[0])) {
                console.log(within);
                console.log(JSON.stringify(tmp_d));
                console.log(JSON.stringify(you.get_center()));
                console.log(JSON.stringify(closest));
                console.log("---");
            }
        }//*/
        
        // if a resolution has been found, apply it
        // to both of us according to given parameters
        if (min_translation_vec) {
            
            // shift back
            velocity_shift(-1);
            
            // resolve me
            if (resolve_me && !resolve_you) {
                me.shift_pos(min_translation_vec[0], min_translation_vec[1]);
                
                // return a pair of push vectors for me and you
                return [min_translation_vec, [0,0]];

            // resolve you
            } else if (!resolve_me && resolve_you) {
                you.shift_pos(min_translation_vec[0] * -1, min_translation_vec[1] * -1);
                
                // return a pair of push vectors for me and you
                return [[0,0], min_translation_vec];

            // resolve both partially
            } else if (resolve_me && resolve_you) {
                
                // calculate heavyness percentage
                my_heaviness = my_heaviness / (my_heaviness + your_heaviness);
                your_heaviness = 1 - my_heaviness;
                
                // calculate how much me and you should be pushed away
                // (so smaller vector means heavier polygon and vice versa)
                var my_resolve   = [min_translation_vec[0] * your_heaviness,
                                    min_translation_vec[1] * your_heaviness];
                var your_resolve = [min_translation_vec[0] * my_heaviness * -1,
                                    min_translation_vec[1] * my_heaviness * -1];

                // push both of us
                me.shift_pos(my_resolve[0], my_resolve[1]);
                you.shift_pos(your_resolve[0], your_resolve[1]);
                
                // return a pair of push vectors for me and you
                return [my_resolve,your_resolve];
            }
        }
        
        // shift back
        velocity_shift(-1);

        // collision impossible by this point (worst case time complexity)
        return false;
    }
    
    ,
    
    collides_poly_line  : function (me, you) {
        //--    Polygon-line collision detection via
        //--    separating axis theorem
        //--
        
        // this is for the list of normal angles
        var norms = new Map();
        
        // (append only half of my normal angles if I'm
        //  equiangular and have even amount of vertices)
        var len = me.vertices.length;
        if (me.equiangular && !(me.vertices.length % 2))
            len /= 2;
        
        // append my normal angles to list
        for (var i=0, j=1; i<len; i++, j++) {
            
            // adjust next vertex indicator
            if (j >= me.vertices.length)
                j = 0;
            
            // calculate radian angle from vertex i to j
            var diff = Nickel.UTILITY.subtract_vector(me.vertices[i],me.vertices[j]);
            var theta = Nickel.UTILITY.atan2(diff[0], -diff[1]);
            
            // add normal angle
            norms.set(theta, null);
        }
        
        // append your normal angle to list
        var diff = Nickel.UTILITY.subtract_vector(you.get_pos(),you.get_end());
        var theta = Nickel.UTILITY.atan2(diff[0], -diff[1]);
        norms.set(theta, null);
        
        // for each axis along a normal
        for (var n of norms.keys()) {

            // get unit normal vector
            var unit_normal_vec = [Math.cos(n), -1 * Math.sin(n)];

            // this is for the list of components (magnitude of projection)
            var my_comps = [];
            var ur_comps = [];
            
            // get my components
            for (var j in me.vertices) {
                
                // get component (scalar)
                // formula: comp b onto a = a dot b / mag(a)
                // simplified formula: comp b onto a = a dot b / 1(unit vec)
                my_comps.push(Nickel.UTILITY.dot_product(me.vertices[j], unit_normal_vec));
            }
            
            // get ur components (scalar)
            // formula: comp b onto a = a dot b / mag(a)
            // simplified formula: comp b onto a = a dot b / 1(unit vec)
            ur_comps.push(Nickel.UTILITY.dot_product(you.get_pos(), unit_normal_vec));
            ur_comps.push(Nickel.UTILITY.dot_product(you.get_end(), unit_normal_vec));

            // get max/min of components for each polygon
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
    
    // TODO: POSSIBLY UPDATE RETURN VALUE
    collides_poly_ray   : function (me, you) {
        //--    Polygon-ray collision detection via
        //--    ray-edge collision checks
        
        // loop through each edge of polygon
        var edge = null;
        for (var i=0, j=1; i<me.vertices.length; i++, j++) {
            if (j>=me.vertices.length)
                j = 0;

            // get closest point and other related information
            edge = new LineSegment(me.vertices[i], me.vertices[j]);
            var info = Collision_Detector.collides_ray_line(you, edge);
            if (info) {
                // collision detected
                return info;
            }
        }
        
        // no collision (worst case time complexity)
        return false;
    }
    
    ,
    
    // TODO: OPTIMIZE
    collides_poly_point : function (me, you) {
        //--    Polygon-point collision detection via
        //--    separating axis theorem
        //--
        
        // make a ray cast pointing right (from point)
        var ray = new RayCast(you, 0);
            
        // check ray collision on all edges
        var collisions = 0;
        for (var i=0, j=1; i<me.vertices.length; i++, j++) {
            if (j>=me.vertices.length)
                j = 0;

            // adapt edge to a LineSegment object
            var edge = new LineSegment(me.vertices[i], me.vertices[j]);

            // check collision
            if (Collision_Detector.collides_ray_line(ray, edge)) {
                collisions++;
            }
        }

        // if odd number of collisions, point is contained within poly
        if (collisions % 2) {
            //console.log("point within polygon");
            return true;
        }

        // collision impossible by this point (worst case time complexity)
        return false;
    }

    ,
    
    collides_circle_circle : function (me, you, resolve_me=false, resolve_you=false,
                                       my_heaviness=1, your_heaviness=1,
                                       my_velocity=null, your_velocity=null) {
        //--    Circle-circle collision detection.
        //--    Can also resolve me or you completely
        //--    or both of us partially. Heaviness will
        //--    determine how much fast each circle moves.
        //--    If resolution is desired, return value
        //--    will be a pair of push vectors for both
        //--    circles.
        //--
        
        // begin by temporarily shifting us by our velocities
        // (function makes this easier to use later)
        var velocity_shift = function(dir=1) {
            if (my_velocity)
                me.shift_pos(my_velocity[0] * dir, my_velocity[1] * dir);
            if (your_velocity)
                you.shift_pos(your_velocity[0] * dir, your_velocity[1] * dir);
        }
        velocity_shift();
        
        // get difference between centers
        var diff = [me.cx - you.cx, me.cy - you.cy];
        
        // edge case:
        //   teporary solution:
        //     if there is exactly 0 difference, make a small difference to avoid NaN values for resolution
        if (diff[0]==0 && diff[1]==0) {
            diff[0] += 0.00001;
            me.cx += 0.00001;
        }
        
        // get distance between centers
        var dist = Nickel.UTILITY.magnitude_of_vector(diff);
        
        // sum of radii
        var sum = me.radius + you.radius;
        
        // collision if distance between centers
        // is LESS THAN sum of radii of me and you
        if (dist < sum) {
            
            //
            // Collision Resolution:
            //
            if (resolve_me || resolve_you) {
            
                // overlap distance
                var overlap = sum - dist;
                
                // unit direction vector from you to me
                var unit_dir_vec = Nickel.UTILITY.normalize_vector(diff);
                        
                // default if normalization not possible (probably zero-vector)
                if (!unit_dir_vec)
                    var unit_dir_vec = [1,0];
                
                // displacement vector from you to me
                //  > this is the vector that begins at the closest
                //  point in the overlap to your center, and stretches
                //  to the closest point in the overlap to my center.
                var overlap_vec = [unit_dir_vec[0] * overlap,unit_dir_vec[1] * overlap];

                // shift back
                velocity_shift(-1);
                
                // resolve me
                if (resolve_me && !resolve_you) {
                    me.shift_pos(overlap_vec[0], overlap_vec[1]);

                    // return a pair of push vectors for me and you
                    return [overlap_vec, [0,0]];

                // resolve you
                } else if (!resolve_me && resolve_you) {
                    you.shift_pos(-1 * overlap_vec[0], -1 * overlap_vec[1]);

                    // return a pair of push vectors for me and you
                    return [[0,0], overlap_vec];

                // resolve both partially
                } else if (resolve_me && resolve_you) {
                    
                    // calculate heavyness percentage
                    my_heaviness = my_heaviness / (my_heaviness + your_heaviness);
                    your_heaviness = 1 - my_heaviness;

                    // calculate how much me and you should be pushed away
                    // (so smaller vector means heavier circle and vice versa)
                    var my_resolve   = [overlap_vec[0] * your_heaviness,
                                        overlap_vec[1] * your_heaviness];
                    var your_resolve = [overlap_vec[0] * my_heaviness * -1,
                                        overlap_vec[1] * my_heaviness * -1];

                    // push both of us
                    me.shift_pos(my_resolve[0], my_resolve[1]);
                    you.shift_pos(your_resolve[0], your_resolve[1]);
                    
                    // return a pair of push vectors for me and you
                    return [my_resolve,your_resolve];
                }
            }
            
            // shift back
            velocity_shift(-1);
            
            // collision
            return true;
        }
            
        // shift back
        velocity_shift(-1);
        
        // no collision even if distance between centers
        // is EQUAL to sum of radii of me and you
        return false;
    }
    
    ,
    
    collides_circle_line : function (me, you, detailed=false) {
        //--    Circle-line collision detection.
        //--    Detailed flag returns a pair containing
        //--    the closest point on the line to the
        //--    circle's center and its distance to the
        //--    circle's center.
        //--
        
        // check if the closest point on the line to 
        // the center of the circle is inside the circle:
        var closest = Collision_Detector._closest_pt_on_lineseg_to_pt(you, me.get_center());
        var distance = Nickel.UTILITY.magnitude_of_vector([closest[0]-me.cx, closest[1]-me.cy]);
        if (detailed)
            return [(distance <= me.radius), closest, distance];
        else
            return (distance <= me.radius);
    }
    
    ,
    
    collides_circle_ray : function (me, you, detailed=false) {
        //--    Circle-ray collision detection.
        //--    Detailed flag returns a pair containing
        //--    the closest point on the ray to the
        //--    circle's center and its distance to the
        //--    circle's center.
        //--
        
        // check if the closest point on the line to 
        // the center of the circle is inside the circle:
        var closest = Collision_Detector._closest_pt_on_ray_to_pt(you, me.get_center());
        var distance = Nickel.UTILITY.magnitude_of_vector([closest[0]-me.cx, closest[1]-me.cy]);
        if (detailed)
            return [(distance <= me.radius), closest, distance];
        else
            return (distance <= me.radius);
    }
    
    ,
    
    collides_circle_point : function (me, you) {
        //--    Circle-point collision detection
        //--
        
        // get difference between centers
        var diff = [me.cx - you.x, me.cy - you.y];
        
        // get distance between centers
        var dist = Nickel.UTILITY.magnitude_of_vector(diff);
        
        // collision if distance is less than radius of me
        return dist <= me.radius ? true : false;
    }
    
    ,

    collides_line_line  : function (me, you) {
        //--    Line-line collision detection
        //--    reference: "https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect"
        //--
        
        // my line's direction vector
        var me_dir = me.get_dir();
        
        // your line's direction vector
        var you_dir = you.get_dir();
        
        // ignore if lines have no size (mag(dir) is the size)
        if ((!me_dir[0] && !me_dir[1])   ||
            (!you_dir[0] && !you_dir[1])) {
            //console.log("line-line collision warning: at least 1 vector is sizeless");
            return false;
        }
        
        // cross product of the direction vectors
        // (magnitude doesn't matter)
        var me_you_dir_cross = Nickel.UTILITY.round(Nickel.UTILITY.cross_product(me_dir, you_dir), 6);

        // if the cross is the 0 vector: (parallel)
        if (me_you_dir_cross == 0) {

            // cross product of <me-start> - <you-start> and <me-dir>
            var mid_cross = Nickel.UTILITY.round(Nickel.UTILITY.cross_product([me.x - you.x, me.y - you.y], me_dir), 6);

            // if collinear:
            if (mid_cross == 0) {

                // find where me starts relative to you:
                //   formula: <me-start> = <you-dir>*t + <you-start>
                //
                //   ...use only x component function to solve for t: (if NaN, then use y-component)
                //   simplify formula: x_me_strt = x_you_dir * t + x_you_strt
                //
                //   ...solve for the parameter 't0' and 't1' (t1 for me-end instead of me-start):
                //   solve: t0 = (x_me_strt - x_you_strt) / x_you_dir
                //
                //   ...lastly, preform a check (might be able to bail early)
                //   if t0 is between 0 and 1, it resides within your line segment -> return true
                //
                var t0 = 0;
                if (you_dir[0])
                    t0 = (me.x - you.x) / you_dir[0];
                else
                    t0 = (me.y - you.y) / you_dir[1];
                if (t0 >= 0 && t0 <= 1) {
                    //console.log("collinear & overlap");
                    return true;
                }
                
                var t1 = 0;
                if (you_dir[0])
                    t1 = (me.xend - you.x) / you_dir[0];
                else
                    t1 = (me.yend - you.y) / you_dir[1];
                if (t1 >= 0 && t1 <= 1) {
                    //console.log("collinear & overlap");
                    return true;
                }
                
                // ...and vice-versa:
                var s0 = 0;
                if (me_dir[0])
                    s0 = (you.x - me.x) / me_dir[0];
                else
                    s0 = (you.y - me.y) / me_dir[1];
                if (s0 >= 0 && s0 <= 1) {
                    //console.log("collinear & overlap");
                    return true;
                }
                
                var s1 = 0;
                if (me_dir[0])
                    s1 = (you.xend - me.x) / me_dir[0];
                else
                    s1 = (you.yend - me.y) / me_dir[1];
                if (s1 >= 0 && s1 <= 1) {
                    //console.log("collinear & overlap");
                    return true;
                }
                
                // collinear and disjoint
                //console.log("collinear and disjoint");
                return false;
                
            // if not collinear
            } else {

                // parallel but no intersection
                //console.log("parallel but no intersection");
                return false;
            }

        // if not parallel:
        } else {

            // Solve for parameterization of my line segment vs yours:
            //   formula:  <me_dir>*u + <me_start> = <you_dir>*v + <you_start>
            //             {where: 1 >= u >= 0, 1 >= v >= 0}
            //
            //   ...simplify after some math tricks:
            //   simplified formula: u = ((<you_start> − <me_start>) CROSS you_dir) / (you_dir CROSS me_dir)
            //   simplified formula: v = ((<me_start> − <you_start>) CROSS me_dir) / (you_dir CROSS me_dir)
            //
            //  dir_cross cannot be zero because then it would mean they are parallel
            //
            
            // cross product of direction vectors
            var dir_cross = Nickel.UTILITY.cross_product(you_dir, me_dir);
            
            // cross product of <you-start> - <me-start> and <you-dir>
            var mid_cross = Nickel.UTILITY.cross_product([you.x - me.x, you.y - me.y], you_dir);

            // parameter for my line segment
            var u = mid_cross / dir_cross;

            // cross product of <me-start> - <you-start> and <me-dir>
            mid_cross = Nickel.UTILITY.cross_product([me.x - you.x, me.y - you.y], me_dir);

            // parameter for your line segment
            var v = mid_cross / dir_cross;

            // if your line intersects my line
            if ((u >= -1 && u <= 0) &&
                (v >= 0 && v <= 1)) {
                
                // intersection
                //console.log("crossed (not parallel)");
                return true;
            } else {

                // no intersection
                //console.log("not parallel & no intersection");
                return false;
            }
        }
    }

    ,

    collides_line_point : function (me, you) {
        //--    Line-point collision detection
        //--
        
        // direction vector of line
        var me_dir = me.get_dir();
        
        // direction vector of point to line start
        var pt_to_line_start = [me.x - you[0], me.y - you[1]];
        
        // if cross is 0, then the 2 vectors must be parallel, and the point must be collinear
        var cross = Nickel.UTILITY.round(Nickel.UTILITY.cross_product(me_dir, pt_to_line_start), 6);
        if (cross == 0) {
        
            // find where point starts relative to line segment:
            //   formula: <you-start> = <me-dir>*t + <me-start>
            //   solve:   t = (<you-start> - <me-start>) / <me-dir>
            //   x-comp:  t = (you_strt_x - me_strt_x) / me_dir_x
            //   y-comp:  t = (you_strt_y - me_strt_y) / me_dir_y
            var t = 0;
            if (me_dir[0])
                t = (you[0] - me.x) / me_dir[0];
            else
                t = (you[1] - me.y) / me_dir[1];
            if (t >= 0 && t <= 1)
                return true;
        }

        // else, point is disjoint
        return false;
    }

    ,
    
    // TODO: ADD 'DETAILED' OPTION (INCLUDE POINT OF COLLISION AND OTHER RELATED INFO)
    collides_ray_line   : function (me, you) {
        //--    Ray-line collision detection
        //--    reference: "https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect"
        //--
        
        // ray's unit direction vector
        var me_dir = me.get_unit();
        
        // line's direction vector
        var you_dir = you.get_dir();
        
        // cross product of the direction vectors of ray and line segment
        // (magnitude doesn't matter)
        var me_you_dir_cross = Nickel.UTILITY.round(Nickel.UTILITY.cross_product(me_dir, you_dir), 6);

        // if the cross is the 0 vector: (parallel)
        if (me_you_dir_cross == 0) {

            // cross product of <ray-start> - <line-start> and <ray-direction>
            var mid_cross = Nickel.UTILITY.round(Nickel.UTILITY.cross_product([me.x - you.x, me.y - you.y], me_dir), 6);

            // if collinear:
            if (mid_cross == 0) {

                // find where ray starts relative to line segment:
                //   formula: <ray-start> = <line-direction>*t + <line-start>
                //
                //   ...use only x component function to solve for t: (if NaN, then use y-component)
                //   simplify formula: x_ray = x_line_dir * t + x_line_strt
                //
                //   ...solve for the parameter 't':
                //   solve: t = (x_ray - x_line_strt) / x_line_dir
                var t = 0;
                if (you_dir[0])
                    t = (me.x - you.x) / you_dir[0];
                else
                    t = (me.y - you.y) / you_dir[1];
                
                // Collinear and overlap if:
                // 1)   t < 0 & pointing same directions (me_dir DOT you_dir = POSITIVE)
                // 2)   t > 1 & pointing opposite directions (me_dir DOT you_dir = NEGATIVE)
                // 3)   1 >= t >= 0
                if (t >= 0 && t <= 1) {
                    //console.log("parallel & starting within");
                    return true;
                } else {
                    var same_dir = Nickel.UTILITY.dot_product(me_dir, you_dir);
                    if (t < 0 && same_dir > 0 ||
                        t > 1 && same_dir < 0) {
                        //console.log("parallel & starting outside, pointing towards");
                        return true;
                    }
                }
                
                // collinear and disjoint
                //console.log("collinear and disjoint");
                return false;
                
            // if not collinear
            } else {

                // parallel but no intersection
                //console.log("parallel but no intersection");
                return false;
            }

        // if not parallel:
        } else {

            // Solve for parameterization of ray vs line segment:
            //   formula:  <ray_dir>*u + <ray_start> = <line_dir>*v + <line_start>
            //             {where: u >= 0, 1 >= v >= 0}
            //
            //   ...simplify after some math tricks:
            //   simplified formula: u = ((<line_start> − <ray_start>) CROSS line_dir) / (line_dir CROSS ray_dir)
            //   simplified formula: v = ((<ray_start> − <line_start>) CROSS ray_dir) / (line_dir CROSS ray_dir)
            //
            //  dir_cross cannot be zero because then it would mean they are parallel
            //
            
            // cross product of direction vectors
            var dir_cross = Nickel.UTILITY.cross_product(you_dir, me_dir);
            
            // cross product of <line-start> - <ray-start> and <line-direction>
            var mid_cross = Nickel.UTILITY.cross_product([you.x - me.x, you.y - me.y], you_dir);

            // parameter for ray
            var u = mid_cross / dir_cross;

            // cross product of <ray-start> - <line-start> and <ray-direction>
            mid_cross = Nickel.UTILITY.cross_product([me.x - you.x, me.y - you.y], me_dir);

            // parameter for line
            var v = mid_cross / dir_cross;

            // if your line intersects my line
            if (v >= 0 && v <= 1 && u <= 0) {
                
                // intersection
                //console.log("crossed but not parallel");
                return true;
            } else {

                // no intersection
                //console.log("not parallel & no intersection");
                return false;
            }
        }
    }
    
    ,
    
    collision_ray_point : function (me, you) {
        //--    Ray-point collision detection
        //--
        
        // unit direction vector of ray
        var me_dir = me.get_unit();
        
        // direction vector of point to ray start
        var pt_to_ray_start = [me.x - you[0], me.y - you[1]];
        
        // if cross is 0, then the 2 vectors must be parallel, and the point must be collinear
        var cross = Nickel.UTILITY.round(Nickel.UTILITY.cross_product(me_dir, pt_to_ray_start), 6);
        if (cross == 0) {
        
            // find where point starts relative to ray unit direction-vector:
            //   formula: <you-start> = <me-dir>*t + <me-start>
            //   solve:   t = (<you-start> - <me-start>) / <me-dir>
            //   x-comp:  t = (you_strt_x - me_strt_x) / me_dir_x
            //   y-comp:  t = (you_strt_y - me_strt_y) / me_dir_y
            var t = 0;
            if (me_dir[0])
                t = (you[0] - me.x) / me_dir[0];
            else
                t = (you[1] - me.y) / me_dir[1];
            if (t >= 0)
                return true;
        }

        // else, point is disjoint
        return false;
    }
    
    ,

    collides_point_point : function (me, you) {
        //--    Point-point collision detection
        //--

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
    this.element = document.getElementById(html_canvas_element_id);
    this.element.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    // background
    this.bg_color = null;

    // time
    this.timer_id = 0;
    this.fps      = 30;
    this.paused   = true;
    
    // anti-aliasing
    this.antialias = -1;

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
        
        // default anti-aliasing is off
        // (only do this if antialias has -1 as its value)
        if (this.antialias == -1)
            this.toggle_image_blur();

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
            //console.log("Keydown! " + ev.key);
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
            //console.log("Keyup! " + ev.key);
            ev.preventDefault();
            self.key_downs[ev.keyCode] = false;
            self.key_upped = ev.keyCode;
            if (ev.keyCode == self.key_curr) {
                self.key_curr = null;
            }
        }

        // update pressed mouse value(s)
        self.canvas.addEventListener('mousedown',function(ev){
            //console.log("Mousedown! " + ev.button);
            self.mouse_downs[ev.button] = true;
            self.mouse_curr = ev.button;
        });

        // update released mouse value(s)
        self.canvas.addEventListener('mouseup',function(ev){
            //console.log("Mouseup! " + ev.button);
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
    
    this.get_bounds = function() {
        //--    Returns an object representing the
        //--    viewport's bounds
        //--
        
        return {x:0, y:0, w:this.get_w(), h:this.get_h()};
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

    this.toggle_cursor = function(){
        //--    if cursor is hidden, shows cursor,
        //--    else, hides it

        if (this.canvas.style.cursor = "none") {
            this.canvas.style.cursor = "block";
        } else {
            this.canvas.style.cursor = "none";
        }
    }

    this.toggle_visibility = function(){
        //--    if viewport is hidden, shows viewport,
        //--    else, hides it

        if (this.canvas.style.display == "none") {
            this.canvas.style.display = "block";
        } else {
            this.canvas.style.display = "none";
        }
    }
    
    this.toggle_image_blur = function() {
        //--    enables/disables image anti-aliasing for better
        //--    performance and higher quality images
        //--
        //--    This code snippet was copied and edited from:
        //--        https://stackoverflow.com/questions/14068103/disable-antialising-when-scaling-images
        //--
        
        if (this.antialias) {
            this.antialias = false;
            this.context.imageSmoothingEnabled = false;
            $(this.element).css({ 
                "image-rendering" : "optimizeSpeed",             /* STOP SMOOTHING, GIVE ME SPEED  */
                "image-rendering" : "-moz-crisp-edges",          /* Firefox                        */
                "image-rendering" : "-o-crisp-edges",            /* Opera                          */
                "image-rendering" : "-webkit-optimize-contrast", /* Chrome (and eventually Safari) */
                "image-rendering" : "pixelated",                 /* Chrome */
                "image-rendering" : "optimize-contrast",         /* CSS3 Proposed                  */
                "-ms-interpolation-mode" : "nearest-neighbor"    /* IE8+                           */
            });
            
        } else {
            this.antialias = true;
            this.context.imageSmoothingEnabled = true;
            $(this.element).css({ 
                "image-rendering" : "auto",       /* BROWSER'S DEFAULT IMAGE RENDERER */
                "-ms-interpolation-mode" : "auto" /* IE8+                             */
            });
        }     
    }
    
    this.is_image_blur_on = function() {
        //--    Returns if anti-aliasing is on
        //--
        
        return this.antialias;
    }

}//end Viewport



////////////////////////////////////////////
///   SIMPLE POLY   ////////////////////////
////////////////////////////////////////////
function SimplePoly(scene, vertices, is_equiangular=false, track_point=null) {

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
    
    // pos of extra point to be tracked
    // (helps with origin related computation)
    this.tracker = track_point;

    // other
    this.dead = false;
    this.visibility = true;
    this.equiangular = is_equiangular;

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
    
    this.get_tracker = function() {
        //--    Returns track point
        //--
        
        return this.tracker;
    }
    
    this.set_tracker = function(track_point) {
        //--    Sets a new track point
        //--
        
        this.tracker = track_point;
    }
    
    this.get_center = function() {
        //--    Returns average vertex position
        //--
        
        var avg = [0,0];
        for(var i in this.vertices) {
            avg[0] += this.vertices[i][0];
            avg[1] += this.vertices[i][1];
        }
        avg[0] /= this.vertices.length;
        avg[1] /= this.vertices.length;
        return avg;
    }
    
    this.set_center = function(new_center) {
        //--    Centers self onto a position (expensive)
        //--
        
        var center = this.get_center();
        this.shift_pos(new_center[0]-center[0], new_center[1]-center[1]);
    }
    
    this.shift_pos = function(shiftx, shifty) {
        //--    Shifts all vertices in the x and y dircections
        //--
        
        for (var i in this.vertices) {
            this.vertices[i][0] += shiftx;
            this.vertices[i][1] += shifty;
        }
        
        this.x = this.vertices[0][0];
        this.y = this.vertices[0][1];
        
        if (this.tracker) {
            this.tracker[0] += shiftx;
            this.tracker[1] += shifty;
        }
    }
    
    // TODO: TEST
    this.set_pos = function(point) {
        //--    Translates self where 1st vertex
        //--    is at the given point
        //--
        
        var diff = [point[0] - this.x, point[1] - this.y];
        
        for (var i in this.vertices) {
            this.vertices[i][0] += diff[0];
            this.vertices[i][1] += diff[1];
        }
        
        this.x = point[0];
        this.y = point[1];
        
        if (this.tracker) {
            this.tracker[0] += diff[0];
            this.tracker[1] += diff[1];
        }
    }
    
    this.scale_around = function(scale, point) {
        //--    Scales x,y position of vertices from/to a point
        //--
        
        this.scale_around2(scale, scale, point);
    }
    
    this.scale_around2 = function(scalex, scaley, point) {
        //--    Scales x,y position of vertices from/to a point
        //--
        
        for (var i in this.vertices) {
            this.vertices[i][0] = scalex * (this.vertices[i][0] - point[0]) + point[0];
            this.vertices[i][1] = scaley * (this.vertices[i][1] - point[1]) + point[1];
        }
        
        this.x = this.vertices[0][0];
        this.y = this.vertices[0][1];
        
        if (this.tracker) {
            this.tracker[0] = scalex * (this.tracker[0] - point[0]) + point[0];
            this.tracker[1] = scaley * (this.tracker[1] - point[1]) + point[1];
        }
    }
    
    this.rotate_around = function(degrees, point) {
        //--    Applies a rotation transformation to all
        //--    vertices of the polygon
        //--
        
        var radians = degrees*Math.PI/180*-1;
        
        for (i in this.vertices) {
            
            var tmpx = this.vertices[i][0] - point[0];
            var tmpy = this.vertices[i][1] - point[1];
            this.vertices[i][0] = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
            this.vertices[i][1] = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        }
        
        this.x = this.vertices[0][0];
        this.y = this.vertices[0][1];
        
        if (this.tracker) {
            
            var tmpx = this.tracker[0] - point[0];
            var tmpy = this.tracker[1] - point[1];
            this.tracker[0] = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
            this.tracker[1] = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        }
    }
    
    //
    // proxy functions:
    //
    
    this.offset_position = function(offx, offy) {
        //--    shift_pos proxy
        //--
        
        this.shift_pos(offx, offy);
    }
    
    this.offset_turn = function(angle, point) {
        //--    rotate_around proxy
        //--
        
        this.rotate_around(angle, point);
    }
    
    this.offset_scale = function(scale, point) {
        //--    scale_around proxy
        //--
        
        this.scale_around(scale, point);
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
    
    // rot (always in radians)
    this.rot = 0;

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
        ctx.ellipse(this.cx,this.cy,this.radius_h,this.radius_v,-1*this.rot,0,2*Math.PI);
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
    
    this.set_angle = function(degrees) {
        //--    Sets the rotation angle from degrees
        //--
        
        this.rot = degrees / 180 * Math.PI;
    }
    
    this.get_center = function() {
        //--    Returns center of ellipse
        //--
        
        return [this.cx, this.cy];
    }
    
    this.set_center = function(new_center) {
        //--    Centers self onto a position
        //--
        
        this.cx = new_center[0];
        this.cy = new_center[1];
    }
    
    this.shift_pos = function(shiftx, shifty) {
        //--    Shifts center position
        //--
        
        this.cx += shiftx;
        this.cy += shifty;
    }
    
    this.set_pos = function(point) {
        //--    Translates self where center point
        //--    is at the given point (proxy to 'set_center')
        //--
        
        this.cx = point[0];
        this.cy = point[1];
    }
    
    this.scale_around = function(scale, point) {
        //--    Scales x,y center position and h,v radius
        //--    of self from/to a point
        //--
        
        this.scale_around2(scale, scale, scale, scale, point);
    }
    
    this.scale_around2 = function(scalex, scaley, scalerh, scalerv, point) {
        //--    Scales x,y center position and h,v radius
        //--    of self from/to a point
        //--
        
        this.cx = scalex * (this.cx - point[0]) + point[0];
        this.cy = scaley * (this.cy - point[1]) + point[1];
        this.radius_h *= scalerh;
        this.radius_v *= scalerv;
    }
    
    this.rotate_around = function(degrees, point) {
        //--    Applies a rotation transformation to centerpoint
        //--
        
        var radians = degrees*Math.PI/180;
            
        var tmpx = this.cx - point[0];
        var tmpy = this.cy - point[1];
        this.cx = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
        this.cy = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        
        this.rot += radians;
    }
    
    //
    // proxy functions:
    //
    
    this.offset_position = function(offx, offy) {
        //--    shift_pos proxy
        //--
        
        this.shift_pos(offx, offy);
    }
    
    this.offset_turn = function(angle, point) {
        //--    rotate_around proxy
        //--
        
        this.rotate_around(angle, point);
    }
    
    this.offset_scale = function(scale, point) {
        //--    scale_around proxy
        //--
        
        this.scale_around(scale, point);
    }
}//end SimpleEllipse



////////////////////////////////////////////
///   SIMPLE CIRCLE   //////////////////////
////////////////////////////////////////////
function SimpleCircle(scene, radius, track_point=null) {

    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'SimpleCircle';
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
    this.radius = radius;

    // pos (initially hide the circle)
    this.cx = -radius;
    this.cy = -radius;
    
    // pos of extra point to be tracked
    // (helps with origin related computation)
    this.tracker = track_point;

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

        // draw circle
        ctx.beginPath();
        // (params: cx, cy, radius, start_angle, end_angle, anticlockwise?)
        ctx.arc(this.cx,this.cy,this.radius,0,2*Math.PI,false);
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
    
    this.get_tracker = function() {
        //--    Returns track point
        //--
        
        return this.tracker;
    }
    
    this.set_tracker = function(track_point) {
        //--    Sets a new track point
        //--
        
        this.tracker = track_point;
    }
    
    this.get_center = function() {
        //--    Returns center of circle
        //--
        
        return [this.cx, this.cy];
    }
    
    this.set_center = function(new_center) {
        //--    Centers self onto a position
        //--
        
        if (this.tracker) {
            this.tracker[0] += new_center[0] - this.cx;
            this.tracker[1] += new_center[1] - this.cy;
        }
        
        this.cx = new_center[0];
        this.cy = new_center[1];
    }
    
    this.shift_pos = function(shiftx, shifty) {
        //--    Shifts center position
        //--
        
        this.cx += shiftx;
        this.cy += shifty;
        
        if (this.tracker) {
            this.tracker[0] += shiftx;
            this.tracker[1] += shifty;
        }
    }
    
    this.set_pos = function(point) {
        //--    Translates self where center point
        //--    is at the given point (proxy to 'set_center')
        //--
        
        this.set_center(point);
    }
    
    this.scale_around = function(scale, point) {
        //--    Scales x,y center position and radius
        //--    of self from/to a point
        //--
        
        this.scale_around2(scale, scale, scale, point);
    }
    
    this.scale_around2 = function(scalex, scaley, scaler, point) {
        //--    Scales x,y center position and radius
        //--    of self from/to a point
        //--
        
        this.cx = scalex * (this.cx - point[0]) + point[0];
        this.cy = scaley * (this.cy - point[1]) + point[1];
        this.radius *= scaler;
        
        if (this.tracker) {
            this.tracker[0] = scalex * (this.tracker[0] - point[0]) + point[0];
            this.tracker[1] = scaley * (this.tracker[1] - point[1]) + point[1];
        }
    }
    
    this.rotate_around = function(degrees, point) {
        //--    Applies a rotation transformation to centerpoint
        //--
        
        var radians = degrees*Math.PI/180*-1;
            
        var tmpx = this.cx - point[0];
        var tmpy = this.cy - point[1];
        this.cx = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
        this.cy = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        
        if (this.tracker) {
            
            var tmpx = this.tracker[0] - point[0];
            var tmpy = this.tracker[1] - point[1];
            this.tracker[0] = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
            this.tracker[1] = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        }
    }
    
    //
    // proxy functions:
    //
    
    this.offset_position = function(offx, offy) {
        //--    shift_pos proxy
        //--
        
        this.shift_pos(offx, offy);
    }
    
    this.offset_turn = function(angle, point) {
        //--    rotate_around proxy
        //--
        
        this.rotate_around(angle, point);
    }
    
    this.offset_scale = function(scale, point) {
        //--    scale_around proxy
        //--
        
        this.scale_around(scale, point);
    }
}//end SimpleCircle



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

    // dir
    this.dx = this.xend - this.x;
    this.dy = this.yend - this.y;

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

    this.get_dir = function() {
        //--    returns the direction vector from start
        //--

        return [this.dx, this.dy];
    }

    this.get_rot = function() {
        //--    Returns angle (in radians) from start to end
        //--

        return Nickel.UTILITY.atan2(-this.dy, this.dx);
    }
    
    this.get_center = function() {
        //--    Returns midpoint of linesegment
        //--
        
        return [this.x + this.dx/2, this.y + this.dy/2];
        //return [this.x+(this.xend-this.x)/2, this.y+(this.yend-this.y)/2];
    }

    this.set_pos = function(startpoint) {
        //--    Sets the start point, ultimately changing the
        //--    direction vector
        //--

        this.x = startpoint[0];
        this.y = startpoint[1];
        this.dx = this.xend - this.x;
        this.dy = this.yend - this.y;
    }

    this.set_end = function(endpoint) {
        //--    Sets the end point, ultimately changing the
        //--    direction vector
        //--

        this.xend = endpoint[0];
        this.yend = endpoint[1];
        this.dx = this.xend - this.x;
        this.dy = this.yend - this.y;
    }

    this.set_dir = function(dir) {
        //--    Sets the direction vector from start,
        //--    ultimately changing the end point
        //--

        this.dx = dir[0];
        this.dy = dir[1];
        this.xend = this.x + dir[0];
        this.yend = this.y + dir[1];
    }
    
    this.set_center = function(new_center) {
        //--    Centers midpoint onto a position (expensive)
        //--
        
        var center = this.get_center();
        var difx = new_center[0] - center[0];
        var dify = new_center[1] - center[1];
        
        this.shift_pos(difx, dify);
    }
    
    this.shift_pos = function(shiftx, shifty) {
        //--    Shifts endpoints
        //--
        
        this.x += shiftx;
        this.y += shifty;
        this.xend += shiftx;
        this.yend += shifty;
        
        this.dx = this.xend - this.x;
        this.dy = this.yend - this.y;
    }
    
    this.scale_around = function(scale, point) {
        //--    Scales self's endpoints around a point
        //--
        
        this.scale_around(scale, scale, point);
    }
    
    this.scale_around2 = function(scalex, scaley, point) {
        //--    Scales self's endpoints around a point
        //--
        
        this.x = scalex * (this.x - point[0]) + point[0];
        this.y = scaley * (this.y - point[1]) + point[1];
        this.xend = scalex * (this.xend - point[0]) + point[0];
        this.yend = scaley * (this.yend - point[1]) + point[1];
    }
    
    this.rotate_around = function(degrees, point) {
        //--    Applies a rotation transformation to both endpoints
        //--
        
        var radians = degrees*Math.PI/180*-1;
        var tmpx, tmpy;
            
        tmpx = this.x - point[0];
        tmpy = this.y - point[1];
        this.x = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
        this.y = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        
        tmpx = this.xend - point[0];
        tmpy = this.yend - point[1];
        this.xend = tmpx * Math.cos(radians) - tmpy * Math.sin(radians) + point[0];
        this.yend = tmpx * Math.sin(radians) + tmpy * Math.cos(radians) + point[1];
        
        this.dx = this.xend - this.x;
        this.dy = this.yend - this.y;
    }
    
    //
    // proxy functions:
    //
    
    this.offset_position = function(offx, offy) {
        //--    shift_pos proxy
        //--
        
        this.shift_pos(offx, offy);
    }
    
    this.offset_turn = function(angle, point) {
        //--    rotate_around proxy
        //--
        
        this.rotate_around(angle, point);
    }
    
    this.offset_scale = function(scale, point) {
        //--    scale_around proxy
        //--
        
        this.scale_around(scale, point);
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

    this.get_dir = function() {
        //--    returns the direction vector from start
        //--

        return [this.dx, this.dy];
    }

    this.get_rot = function() {
        //--    Returns angle from start to end
        //--

        return Math.atan2(-this.dy, this.dx);
    }

    this.set_dir = function(dir) {
        //--    Sets the direction vector from start,
        //--    ultimately changing the end point
        //--

        this.dx = dir[0];
        this.dy = dir[1];
        this.xend = this.x + dir[0];
        this.yend = this.y + dir[1];
    }

    this.set_end = function(endpoint) {
        //--    Sets the end point, ultimately changing the
        //--    direction vector
        //--

        this.dx = endpoint[0] - this.x;
        this.dy = endpoint[1] - this.y;
        this.xend = endpoint[0];
        this.yend = endpoint[1];

    }
}//end LineSegment



////////////////////////////////////////////
///   RAY CAST   ///////////////////////////
////////////////////////////////////////////
function RayCast(startpoint, direction_degs=0) {

    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'RayCast';

    // pos
    this.x = startpoint[0];
    this.y = startpoint[1];

    // dir (convert to radians)
    if (direction_degs) this.rot = direction_degs / 180 * Math.PI;
    else this.rot = 0;

    this.get_pos = function() {
        //--    Returns the start position
        //--

        return [this.x, this.y];
    }
    
    this.set_angle = function(degrees) {
        //--    Sets the rotation angle from degrees
        //--
        
        this.rot = degrees / 180 * Math.PI;
    }
    
    this.get_unit = function() {
        //--    Returns a unit direction vector
        //--
        
        return [Math.cos(this.rot), Math.sin(this.rot) * -1];
    }
}//end RayCast



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
    
    // indicates if we have already bounded around the sprite
    this.updated = false;


    // --
    // ------- METHODS -------------------------------------------
    // --


    this.update = function() {
        //--    Main update function
        //--

        // indicate that we must bound self when needed
        this.updated = false;
    }

    this.bound = function(force_bound=false) {
        //--    Bounds self around a target sprite
        //--
        
        // ignore if this function if we already updated
        if (this.updated && !force_bound) return;
        
        // indicate that we have bounded self
        this.updated = true;

        // corners of sprite
        var tl = this.target.get_topleft();
        var tr = this.target.get_topright();
        var bl = this.target.get_bottomleft();
        var br = this.target.get_bottomright();

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
///   COLLIDER HULL   //////////////////////
////////////////////////////////////////////
function ColliderHull(sprite, approximate=true) {
    
    // TODO: TEST EXTENSIVELY
    // (this, simple shapes, and some collision_detection functions)
    
    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'ColliderHull';
    
    // parent/host sprite
    this.parent = sprite;
    
    // simple shape of hull
    if (approximate) {
        
        // get coordinates, dimensions (relative to sprite's origin)
        var tl = this.parent.get_topleft();
        var tr = this.parent.get_topright();
        var bl = this.parent.get_bottomleft();
        var br = this.parent.get_bottomright();
        
        // create rectangle matching the sprite's basic dimensions
        this.shape = new SimplePoly(this.parent.scene,
                                    [tl,tr,br,bl],
                                    true, this.parent.get_pos2());  // HERE: THE PARENT ORIGIN POINT MAY NOT BE THE TRUE ORIGIN (BIG PROBLEM EEK)
    }
    
    // keep track of how much shape has rotated and scaled
    this.rotated = this.parent.get_rot();
    this.scaledx = this.parent.get_scalex();
    this.scaledy = this.parent.get_scaley();
    
    // this limits the update function to be called once per frame
    this.updated = false;
    
    this.update = function() {
        //--    Main update function (called every frame)
        //--
        
        // indicate that the parent sprite and
        // hull are now out of sync
        this.updated = false;
    }
    
    this.update_transformations = function() {
        //--    Updates the hull's shape based on its parent
        //--    sprite's position, rotation, and horizontal scale
        //--    (not called every frame)
        //--
        
        // TODO: FIX ROTATION AND SCALING - THEY ARE A BIT OFF
        // only update tranformations if they have not been
        // updated this frame already: (also avoid update if
        // dimensions of parent don't make sense)
        if (!this.updated) {
            this.updated = true;
            var par_pos = this.parent.get_pos2();
            var hul_pos = this.shape.get_tracker();
            var diff = [par_pos[0] - hul_pos[0], par_pos[1] - hul_pos[1]];
            
            // translation
            this.shape.shift_pos(diff[0], diff[1]);
            
            // rotation
            this.shape.rotate_around(this.parent.get_rot() - this.rotated, par_pos);
            
            // scaling
            // (circle cannot scale differently on x and y axis, but polys can)
            // (just use x-axis scale if circle hull)
            // TODO: OPTIMIZE CHECKING TYPES HERE (AS WELL AS MANY OTHER PLACES IN THIS FILE)
            var sx = this.parent.get_scalex() * this.parent.get_scaleg();
            var sy = this.parent.get_scaley() * this.parent.get_scaleg();
            if (this.shape.type == "SimplePoly") {
                this.shape.scale_around2(sx / this.scaledx, sy / this.scaledy, par_pos);
            } else if (this.shape.type == "SimpleCircle") {
                this.shape.scale_around(sx / this.scaledx, par_pos);
            }
            
            // remember last updated values
            this.rotated = this.parent.get_rot();
            this.scaledx = sx;
            this.scaledy = sy;
            
            /***   HERE: ERROR - TRACKER POINT SHOULD BE CENTER OF LOCOMOTIVES (CENTER NOT EQUAL TO TRACKER PT!!!)
            if (this.parent.type == "Locomotive" &&
                (par_pos[0]!=this.shape.get_center()[0] || par_pos[1]!=this.shape.get_center()[1]))
                console.log(par_pos[0]==this.shape.get_center()[0] && par_pos[1]==this.shape.get_center()[1]);
            //**/
        }
    }
    
    this.approximate_shape = function() {
        //--    Approximates a shape to bound the sprite with
        //--
        
        // get coordinates, dimensions (relative to sprite's origin)
        var tl = this.parent.get_topleft();
        var tr = this.parent.get_topright();
        var bl = this.parent.get_bottomleft();
        var br = this.parent.get_bottomright();
        
        // create rectangle matching the sprite's basic dimensions
        this.shape = new SimplePoly(this.parent.scene,
                                    [tl,tr,br,bl],
                                    true, this.parent.get_pos2());
    }
    
    this.set_shape = function(simple_shape) {
        //--    Sets the shape of the hull
        //--    Parent's origin is default tracker if none is set
        //--
        
        this.shape = simple_shape;
        if (!simple_shape.get_tracker())
            simple_shape.set_tracker(this.parent.get_pos2());
        this.updated = false;
        this.update_transformations();
    }
    
    // TODO: OPTIMIZE
    this.detect_collision = function(obj) {
        //--    Returns if a collision was detected
        //--    with some object
        //--
        
        // OPTIMIZE: Use some Nickel mapping variable to make this type check efficient
        
        // first, make sure hull is up to date with parent sprite
        this.update_transformations();
        
        // me = circle
        if (this.shape.type == "SimpleCircle") {
        
            // you = point
            if (Nickel.UTILITY.is_array(obj)) {
             
                return Collision_Detector.collides_circle_point(this.shape, obj);
                
            // you = hull
            } else if (obj.type == "ColliderHull") {
                
                // also make sure obj is up to date with its parent sprite
                obj.update_transformations();
                
                // you = circle hull
                if (obj.shape.type == "SimpleCircle") {
                    
                    return Collision_Detector.collides_circle_circle(this.shape, obj.shape);
                
                // you = poly hull
                } else if (obj.shape.type == "SimplePoly") {
                
                    return Collision_Detector.collides_poly_circle(obj.shape, this.shape);
                }
                
            // you = poly
            } else if (obj.type == "SimplePoly") {

                return Collision_Detector.collides_poly_circle(obj, this.shape);
                
            // you = circle
            } else if (obj.type == "SimpleCircle") {
                
                return Collision_Detector.collides_circle_circle(obj, this.shape);
                
            // you = line
            } else if (obj.type == "SimpleLine" || obj.type == "LineSegment") {
                
                return Collision_Detector.collides_circle_line(this.shape, obj);
                
            // you = ray
            } else if (obj.type == "RayCast") {
                
                return Collision_Detector.collides_circle_ray(this.shape, obj);
            }
                
        // me = poly
        } else if (this.shape.type == "SimplePoly") {
            
            // you = point
            if (Nickel.UTILITY.is_array(obj)) {
                return Collision_Detector.collides_poly_point(this.shape, obj);
                
            // you = hull
            } else if (obj.type == "ColliderHull") {
                
                // also make sure obj is up to date with its parent sprite
                obj.update_transformations();
                
                // you = circle hull
                if (obj.shape.type == "SimpleCircle") {
                    
                    return Collision_Detector.collides_poly_circle(this.shape, obj.shape);
                
                // you = poly hull
                } else if (obj.shape.type == "SimplePoly") {
                
                    return Collision_Detector.collides_poly_poly(obj.shape, this.shape);
                }
                
            // you = poly
            } else if (obj.type == "SimplePoly") {

                return Collision_Detector.collides_poly_poly(this.shape, obj);
                
            // you = circle
            } else if (obj.type == "SimpleCircle") {
                
                return Collision_Detector.collides_poly_circle(this.shape, obj);
                
            // you = line
            } else if (obj.type == "SimpleLine" || obj.type == "LineSegment") {
                
                return Collision_Detector.collides_poly_line(this.shape, obj);
                
            // you = ray
            } else if (obj.type == "RayCast") {
                
                return Collision_Detector.collides_poly_ray(this.shape, obj);
            }
        }
        
        // me = unknown
        return false;
    }
    
    // TODO: OPTIMIZE
    this.resolve_collision = function(obj,resolve_me=true,resolve_you=true,my_heaviness=1,
                                      ur_heaviness=1,my_velocity=null,ur_velocity=null) {
        //--    Same as detect_collision but also resolves
        //--
        
        // OPTIMIZE: Use some Nickel mapping variable to make this type check efficient
        
        // first, make sure hull is up to date with parent sprite
        this.update_transformations();
        
        // me = circle
        if (this.shape.type == "SimpleCircle") {
        
            // you = point
            if (Nickel.UTILITY.is_array(obj)) {
                
                return Collision_Detector.collides_circle_point(this.shape, obj);
                
            // you = hull
            } else if (obj.type == "ColliderHull") {
                
                // also make sure obj is up to date with its parent sprite
                obj.update_transformations();
                
                // you = circle hull
                if (obj.shape.type == "SimpleCircle") {
                    
                    return Collision_Detector.collides_circle_circle(this.shape, obj.shape,
                                                                     resolve_me, resolve_you,
                                                                     my_heaviness, ur_heaviness,
                                                                     my_velocity, ur_velocity);
                
                // you = poly hull
                } else if (obj.shape.type == "SimplePoly") {
                
                    var res = Collision_Detector.collides_poly_circle(obj.shape, this.shape,
                                                                   resolve_you, resolve_me,
                                                                   ur_heaviness, my_heaviness,
                                                                   ur_velocity, my_velocity);
                    if (!res)
                        return res;
                    return [res[1], res[0]]; // order: me, you
                }
                
            // you = poly
            } else if (obj.type == "SimplePoly") {

                var res = Collision_Detector.collides_poly_circle(obj, this.shape,
                                                                  resolve_you, resolve_me,
                                                                  ur_heaviness, my_heaviness,
                                                                  ur_velocity, my_velocity);
                if (!res)
                    return res;
                return [res[1], res[0]]; // order: me, you
                
            // you = circle
            } else if (obj.type == "SimpleCircle") {
                
                return Collision_Detector.collides_circle_circle(this.shape, obj,
                                                                 resolve_me, resolve_you,
                                                                 my_heaviness, ur_heaviness,
                                                                 my_velocity, ur_velocity);
                
            // you = line
            } else if (obj.type == "SimpleLine" || obj.type == "LineSegment") {
                
                return Collision_Detector.collides_circle_line(this.shape, obj);
                
            // you = ray
            } else if (obj.type == "RayCast") {
                
                return Collision_Detector.collides_circle_ray(this.shape, obj);
            }
            
        // me = poly
        } else if (this.shape.type == "SimplePoly") {
            
            // you = point
            if (Nickel.UTILITY.is_array(obj)) {
                return Collision_Detector.collides_poly_point(this.shape, obj);
                
            // you = hull
            } else if (obj.type == "ColliderHull") {
                
                // also make sure obj is up to date with its parent sprite
                obj.update_transformations();
                
                // you = circle hull
                if (obj.shape.type == "SimpleCircle") {
                    
                    return Collision_Detector.collides_poly_circle(this.shape, obj.shape,
                                                                   resolve_me, resolve_you,
                                                                   my_heaviness, ur_heaviness,
                                                                   my_velocity, ur_velocity);
                
                // you = poly hull
                } else if (obj.shape.type == "SimplePoly") {
                
                    return Collision_Detector.collides_poly_poly(this.shape, obj.shape,
                                                                 resolve_me, resolve_you,
                                                                 my_heaviness, ur_heaviness,
                                                                 my_velocity, ur_velocity);
                }
                
            // you = poly
            } else if (obj.type == "SimplePoly") {

                return Collision_Detector.collides_poly_poly(this.shape, obj,
                                                             resolve_me, resolve_you,
                                                             my_heaviness, ur_heaviness,
                                                             my_velocity, ur_velocity);
                
            // you = circle
            } else if (obj.type == "SimpleCircle") {
                
                return Collision_Detector.collides_poly_circle(this.shape, obj,
                                                               resolve_me, resolve_you,
                                                               my_heaviness, ur_heaviness,
                                                               my_velocity, ur_velocity);
                
            // you = line
            } else if (obj.type == "SimpleLine" || obj.type == "LineSegment") {
                
                return Collision_Detector.collides_poly_line(this.shape, obj);
                
            // you = ray
            } else if (obj.type == "RayCast") {
                
                return Collision_Detector.collides_poly_ray(this.shape, obj);
            }
            
        }
        
        // me = unknown
        return false;
    }
}



////////////////////////////////////////////
///   SPRITE   /////////////////////////////    // TODO: CHANGE "GET_TOP" TO "GET_TOP_BOUND" AND SO ON...
////////////////////////////////////////////
                                             // TODO: REMOVE "(does not work if sprite rotates)" COMMENTS WHERE NECESSARY
function Sprite(scene, image_data, has_bbox=true,
                 collisiion_hull=null, approximate=true) {


    // --
    // ------- PROPERTIES ----------------------------------------
    // --


    // general
    this.id = Nickel.UTILITY.assign_id();
    this.type = 'Sprite';   // hash this string into an int for efficiency ***TODO HERE***
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
    
    // init collision hull
    this.hull = collisiion_hull;

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

    // acc
    this.accel = 0;

    // rot
    this.dir = 0; // angle of sprite's image
    this.rot = 0; // angle of sprite's movement
    this.dr = 0;
    this.max_rot = 0;
    this.origin = [0,0]; // default topleft
    
    // history
    this.curr_rot = 0; // current turn displacement
    this.last_rot = 0; // last turn displacement

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
        
        // updates collision hull
        if (this.hull) this.hull.update();
        
        // update history
        this.update_records();

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
        // update difference in x and y position
        this.x = this.x + this.dx + tmp_dx;
        this.y = this.y + this.dy + tmp_dy;
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
    
    this.update_records = function() {
        //--    Updates history variables from the
        //--    last update
        //--
        
        // rotation
        this.last_rot = this.curr_rot;
        this.curr_rot = this.dr;
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

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.w;
        }
        return null;
    }

    this.get_h_bound = function() {
        //--    Returns height of bounding box
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.h;
        }
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
    
    this.get_x2 = function() {
        //--    Returns accurate x position (left)
        //--    (includes origin offset)
        //--

        return this.get_x() + this.origin[0];
    }

    this.get_y2 = function() {
        //--    Returns accurate y position (top)
        //--    (includes origin offset)
        //--

        return this.get_y() + this.origin[1];
    }

    this.get_pos2 = function() {
        //--    Returns accurate position (includes origin offset)
        //--

        return [this.get_x2(), this.get_y2()];
    }

    this.get_cx = function() {
        //--    Returns accurate center x position
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.get_cx();
        }
        return this.x + (this.get_w() / 2);
    }

    this.get_cy = function() {
        //--    Returns accurate center y position
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.get_cy();
        }
        return this.y + (this.get_h() / 2);
    }

    this.get_center = function() {
        //--    Returns accurate center position
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.get_center();
        }
        return [this.get_cx(), this.get_cy()];
    }

    this.get_right = function() {
        //--    Returns accurate right x position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.right;
        }
        return this.x + this.get_w();
    }

    this.get_top = function() {
        //--    Returns accurate top y position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.top;
        }
        return this.y;
    }

    this.get_left = function() {
        //--    Returns accurate left x position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.left;
        }
        return this.x;
    }

    this.get_bottom = function() {
        //--    Returns accurate bottom y position
        //--    (does not work if sprite rotates)
        //--

        if (this.bbox) {
            this.bbox.bound();
            return this.bbox.bottom;
        }
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

    this.get_curr_rot = function() {
        //--    Returns the current turn displacement
        //--    applied thus far
        //--    (set methods do not count)
        //--

        return this.curr_rot;
    }

    this.get_last_rot = function() {
        //--    Returns the last turn displacement
        //--    (set methods do not count)
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
        
        this.set_scalex(n);
        this.set_scaley(n);
    }

    this.set_scalex = function(n) {
        //--    Scale sprite's width by n
        //--
        
        // get percent origin[0] within self
        // (<0 left of sprite, >1 right of sprite, else within)
        var ox_perc = this.origin[0] / this.get_w();
        
        var x2 = this.get_x2();
        this.set_x(n / this.scale_x * (this.get_x() - x2) + x2);
        this.scale_x = n;
        
        // restore origin[1] to new scale by maintaing the
        // same percent within the pre-scaled sprite
        this.origin[0] = ox_perc * this.get_w();
    }

    this.set_scaley = function(n) {
        //--    Scale sprite's height by n
        //--
        
        // get percent origin[1] within self
        // (<0 above sprite, >1 under sprite, else within)
        var oy_perc = this.origin[1] / this.get_h();
        
        var y2 = this.get_y2();
        this.set_y(n / this.scale_y * (this.get_y() - y2) + y2);
        this.scale_y = n;
        
        // restore origin[1] to new scale by maintaing the
        // same percent within the pre-scaled sprite
        this.origin[1] = oy_perc * this.get_h();
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

        if (this.bbox) {
            this.bbox.bound(true);
            this.x += cx - this.bbox.get_cx();
            this.bbox.update();
        } else
            this.x = cx - (this.get_w() / 2);
    }

    this.set_cy = function(cy) {
        //--    Sets center y position
        //--

        if (this.bbox) {
            this.bbox.bound(true);
            this.y += cy - this.bbox.get_cy();
            this.bbox.update();
        } else
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
        //--    (works best with bbox)
        //--

        if (this.bbox) {
            this.bbox.bound(true);
            this.x += rx - this.bbox.left - this.bbox.w;
            this.bbox.update();
        } else
            this.x = rx - this.get_w();
    }

    this.set_left = function(lx) {
        //--    Sets left x position.
        //--    (works best with bbox)
        //--

        if (this.bbox) {
            this.bbox.bound(true);
            this.x += lx - this.bbox.left;
            this.bbox.update();
        } else
            this.x = lx;
    }

    this.set_top = function(ty) {
        //--    Sets top y position.
        //--    (works best with bbox)
        //--

        if (this.bbox) {
            this.bbox.bound(true);
            this.y += ty - this.bbox.top;
            this.bbox.update();
        } else
            this.y = ty;
    }

    this.set_bottom = function(by) {
        //--    Sets bottom y position.
        //--    (works best with bbox)
        //--

        if (this.bbox) {
            this.bbox.bound(true);
            this.y += by - this.bbox.top - this.bbox.h;
            this.bbox.update();
        } else
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

    this.set_rot_max = function(degs) {
        //--    Set the maximum turn amount the
        //--    sprite can do in one frame
        //--

        return this.max_rot = degs;
    }

    this.set_origin = function(offset) {
        //--    Set the origin of rotation (pivot)
        //--    relative to the default topleft corner.
        //--    Also update the hull so it appears to 
        //--    not have changed
        //--
        
        if (this.hull)
            this.hull.shape.shift_pos(this.origin[0] - offset[0],
                                      this.origin[1] - offset[1]);

        this.origin[0] = offset[0];
        this.origin[1] = offset[1];
    }

    this.set_origin_centered = function() {
        //--    Set the origin of rotation (pivot)
        //--    in the center of the image.
        //--    Also update the hull so it appears to 
        //--    not have changed
        //--
        
        var old_origin = [this.origin[0], this.origin[1]];

        this.origin[0] = this.get_w() / 2;
        this.origin[1] = this.get_h() / 2;
        
        if (this.hull)
            this.hull.shape.shift_pos(old_origin[0] - this.origin[0],
                                      old_origin[1] - this.origin[1]);
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
    
    this.set_hull = function(hull) {
        //--    Resets the collision hull for the sprite
        //--
        
        this.hull = hull;
    }


    // --
    // ------- OTHER methods -------------------------------------
    // --

    
    // TODO: OPTIMIZE
    this.colliding_with = function(target, layer_check=true) {
        //--    Returns true if target is colliding
        //--    with self (and in same layer if specified)
        //--

        // OPTIMIZE: Use some Nickel mapping variable to make this type check efficient
        
        // if sprite, check layer if specified, then check their hulls
        if (target.type == "Sprite") {
                
            // no layer check
            if (!layer_check) {
                
                return this.hull.detect_collision(target.hull);
            // same layer check
            } else if (layer_check && (target.get_layer() == this.get_layer())) {
                
                return this.hull.detect_collision(target.hull);
            // different layer
            } else {
                return false;
            }
        }
        
        // target is not a sprite
        return this.hull.detect_collision(target);
    }
    
    // TODO: OPTIMIZE, ADD OPTION TO USE ROTATION FOR PREDICTION <--- HERE !!!
    this.resolve_with = function(target, layer_check=true, resolve_me=true, resolve_you=true,
                                 my_heaviness=1, ur_heaviness=1,
                                 my_velocity=null, ur_velocity=null) {
        //--    Same as Sprite.colliding_with but also
        //--    resolves collisions.
        //--

        // OPTIMIZE: Use some Nickel mapping variable to make this type check efficient
        
        // keeps track of shift amount of self and target, respectively
        // (ultimately also keeps track of if a collision occurred)
        var resolve = null;
        
        // if sprite, check layer if specified, then check their hulls
        if (target.type == "Sprite") {
                
            // no layer check
            if (!layer_check) {
                
                resolve = this.hull.resolve_collision(target.hull,
                                                   resolve_me, resolve_you,
                                                   my_heaviness, ur_heaviness,
                                                   my_velocity, ur_velocity);
            // same layer check
            } else if (layer_check && (target.get_layer() == this.get_layer())) {
                
                resolve = this.hull.resolve_collision(target.hull,
                                                   resolve_me, resolve_you,
                                                   my_heaviness, ur_heaviness,
                                                   my_velocity, ur_velocity);
            // different layer
            } else {
                return false;
            }
            
            // sync resolution with target as well as
            // return false if no collision occurred
            if (resolve)
                target.sync_with_hull(resolve[1]);
            else
                return false;
            
        // target is not a sprite
        } else {
        
            resolve = this.hull.resolve_collision(target,
                                               resolve_me, resolve_you,
                                               my_heaviness, ur_heaviness,
                                               my_velocity, ur_velocity);
        }
        
        // sync resolution with self as well
        // as return if collision occurred
        if (resolve) {
            if (Nickel.UTILITY.is_array(resolve))
                this.sync_with_hull(resolve[0]);
            return true;
        } else
            return false;
    }
    
    this.sync_with_hull = function(shift_vector) {
        //--    Syncs/applies hull's transformations to self.
        //--    (currently, hull can only translate as a
        //--    result of a resolution)
        //--    
        
        // shift self
        this.offset_position(shift_vector[0], shift_vector[1]);
    }

    this.copy_base = function() {
        //--    Returns a base copy of self
        //--

        if (this.image)
            var _img_data = {img:this.image.src, w:this.get_w_orig(), h:this.get_h_orig()};
        else
            var _img_data = {w:this.get_w_orig(), h:this.get_h_orig()};

        var spr = new Sprite(this.scene, _img_data, !!this.bbox, null, !!this.hull);
        
        spr.bound = this.bound;
        
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
        this.curr_rot += angle;
    }

    this.offset_turn = function(angle,origin) {
        //--    Offsets rotation and direction
        //--

        if (origin)
            this.rotate_around(angle,origin);
        this.rot += angle;
        this.dir += angle;

        // also record the turn
        this.curr_rot += angle;
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
        
        var ox_perc = this.origin[0] / this.get_w();
        var oy_perc = this.origin[1] / this.get_h();

        this.set_x(scale*(this.get_x()-origin[0]) + origin[0]);
        this.set_y(scale*(this.get_y()-origin[1]) + origin[1]);

        this.scale_global *= scale;
        
        this.origin[0] = ox_perc * this.get_w();
        this.origin[1] = oy_perc * this.get_h();
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
        this.curr_rot += ang;
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
        this.curr_rot += ang;
    }

    
    // --
    // ------- POST-CREATION INIT actions ------------------------
    // --
    
    
    // init default hull if hull is null
    if (!this.hull && approximate) this.hull = new ColliderHull(this);
    
}//end Sprite



////////////////////////////////////////////
///   SPRITESELECTOR   /////////////////////
////////////////////////////////////////////
function SpriteSelector(scene) {


    // --
    // ------- PROPERTIES ----------------------------------------
    // --


    // general
    this.id = Nickel.UTILITY.assign_id();
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
                if (sprites[i].colliding_with([x,y], false)) {
                    var sort_by = this.selector.sort_by(sprites[i]);
                    heap.in(sprites[i],sort_by);
                }
            }
            return heap.sort();

        } else {
            var over = [];
            for (var i in sprites) {
                if (sprites[i].colliding_with([x,y], false)) {
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

        // ignore if invisible
        if (!this.selector.is_visible()) return false;
        
        // ignore if dimensions don't make sense
        if (!this.selector.get_w() || !this.selector.get_h()) return false;

        if (sorted) {
            var heap = new Heap('max');
            for (var i in sprites) {
                if (this.selector.colliding_with(sprites[i], false)) {
                    var sort_by = this.selector.sort_by(sprites[i]);
                    heap.in(sprites[i],sort_by);
                }
            }
            return heap.sort();

        } else {
            var under = [];
            for (var i in sprites) {
                if (this.selector.colliding_with(sprites[i], false)) {
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

    this.data = function() {
        //--    returns raw queue data
        //--

        return list.slice(off,list.length);
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
///   QUADTREE  ////////////////////////////        // TODO: REMOVE OVERLAP FEATURE (NOT RELIABLE ANYMORE)
////////////////////////////////////////////
function QuadTreeObj(obj,overlap,bounds) {

    // actual object to check collision for
    this.entity = obj;

    // actual bounds of the collision object
    // format: {x:_,y:_,w:_,h:_}
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
    
    // 1 parent QuadTreeNode (utilized to allow more
    // neighbors to be returned in the get function)
    this.parent = null;

    // a list of children QuadTreeNodes
    // (separated into 4 (hence "quad") equal squares)
    this.children = [];

    // bounds of the cell this node represents
    // format: {x:_,y:_,w:_,h:_}
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

    this.in = function(obj,pos,size,exclude_outliers=true,node=this.root) {
        //--    adds a new object into the quadtree
        //--    and applies any neccessary splits.
        //--    returns 0 if obj lies outside of the quadtree.
        //--    returns 1 if obj is overlapping at least 1 boundary.
        //--    returns 2 if obj is within a cell, not overlapping any boundary
        //--

        if (!obj) return false;
        var curr = node;
        var past = node.parent;
        if (!past) past = node;
        var o = new QuadTreeObj(obj, false, { x:pos[0], w:size[0],
                                              y:pos[1], h:size[1] });
        
        // (can help with performance when there are lots
        //  of objects beyond entire quadtree space.)
        // before anything, exclude any outliers if desired (~10 ops)
        if (exclude_outliers) {
            if (o.bounds.x + o.bounds.w    < curr.bounds.x ||
                o.bounds.x > curr.bounds.x + curr.bounds.w ||
                o.bounds.y + o.bounds.h    < curr.bounds.y ||
                o.bounds.y > curr.bounds.y + curr.bounds.h) {
                return 0;
            }
        }
        
        // mimics recursion
        while (curr) {

            // if the current node's level has reached max depth
            if (curr.level >= MAX_DPTH) {
                curr.objs.push(o);
                return 2;
            }

            // if the current node has not reached max # of objects yet and
            // it has no children yet
            if (curr.objs.length < MAX_OBJS && !curr.children.length) {
                curr.objs.push(o);
                return 2;
            }

            // if the current node has some children
            else if (curr.children.length) {
                var quadrant = this.quad(curr.bounds, o.bounds);
                switch (quadrant) {
                    // should never happen except maybe on the 1st iteration
                    case -2:
                        past.objs.push(o);
                        o.overlapping = true;
                        return 1;

                    // if obj in bounds but overlaps into at least 1 next quadrant
                    case -1:
                        curr.objs.push(o);
                        o.overlapping = true;
                        return 1;
                        
                    // if obj in bounds and is bounded by some next quadrant
                    default:
                        past = curr;
                        curr = curr.children[quadrant];
                }
            }

            // TODO: CAN BE FASTER
            // if the current node has reached max # of objects and needs to be chopped
            else if (curr.objs.length >= MAX_OBJS) {
                var transfer = curr.objs;
                curr.objs = [];
                this.chop(curr);
                
                // redistrubute existing objects in curr node to its children
                for (var i in transfer) {
                    var quadrant = this.quad(curr.bounds, transfer[i].bounds);
                    switch (quadrant) {
                        // if any kind of overlapping
                        case -2:
                        case -1:
                            transfer[i].overlapping = true;
                            curr.objs.push(transfer[i]);
                            break;

                        // if obj in bounds and is bounded by some next quadrant
                        default:
                            curr.children[quadrant].objs.push(transfer[i]);
                    }
                }
            }
        }// end loop

        return 0;
    }

    this.quad = function(space_bounds, obj_bounds) {
        //--    returns which quadrant obj_bounds' lies within if
        //--    space_bounds is split into 4 equal squares
        //--    returns -2 if obj is out of bounds or is overlapping with the space_bounds
        //--    returns -1 if obj is in bounds but overlaps over at least one next quadrant
        //--    returns 0 if obj is bounded by the North West quadrant
        //--    returns 1 if obj is bounded by the North East quadrant
        //--    returns 2 if obj is bounded by the South East quadrant
        //--    returns 3 if obj is bounded by the South West quadrant
        //--

        // extra vars help with readability, performance
        var sleft = space_bounds.x;
        var stop = space_bounds.y;
        var sright = space_bounds.x + space_bounds.w;
        var sbottom = space_bounds.y + space_bounds.h;
        var cx = space_bounds.x + space_bounds.w / 2;
        var cy = space_bounds.y + space_bounds.h / 2;
        var oleft = obj_bounds.x;
        var otop = obj_bounds.y;
        var oright = obj_bounds.x + obj_bounds.w;
        var obottom = obj_bounds.y + obj_bounds.h;
        
        // if object inside space_bounds
        if (oleft > sleft && oright < sright &&
            otop > stop && obottom < sbottom) {
            
            if (oright < cx) {
                
                // if inside topleft
                if (obottom < cy) {
                    return 0;
                    
                // if inside bottomleft
                } else if (otop > cy) {
                    return 3;
                }
                
            } else if (oleft > cx) {
                
                // if inside topright
                if (obottom < cy) {
                    return 1;
                    
                // if inside bottomright
                } else if (otop > cy) {
                    return 2;
                }
            }
            
            // if code reaches here, then there
            // is some internal overlapping
            return -1;
        }
        
        // if code reaches here, then there
        // at least some of the object has reached
        // or surpassed the edges of the space_bounds
        return -2;
    }

    this.chop = function(node) {
        //--    populates input node with children
        //--    representing a 4-way split
        //--    Note: vars help with performance (reduce # ops)
        //--

        var A = new QuadTreeNode();
        var B = new QuadTreeNode();
        var C = new QuadTreeNode();
        var D = new QuadTreeNode();
        
        A.parent = node;
        B.parent = node;
        C.parent = node;
        D.parent = node;

        var next_level = node.level + 1;
        A.level = next_level;
        B.level = next_level;
        C.level = next_level;
        D.level = next_level;

        var halfw = node.bounds.w / 2;
        var halfh = node.bounds.h / 2;
        var cx = node.bounds.x + node.bounds.w / 2;
        var cy = node.bounds.y + node.bounds.h / 2;
        A.bounds = {
            x:node.bounds.x,
            y:node.bounds.y,
            w:halfw,
            h:halfh
        }
        B.bounds = {
            x:cx,
            y:node.bounds.y,
            w:halfw,
            h:halfh
        }
        C.bounds = {
            x:cx,
            y:cy,
            w:halfw,
            h:halfh
        }
        D.bounds = {
            x:node.bounds.x,
            y:cy,
            w:halfw,
            h:halfh
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
    
    this._get_all = function(node,objs) {
        //--    recursively collects all objects starting from
        //--    a specific node in the quadtree and marks them
        //--    as 'selected' (for debugging purposes)
        //--
        
        // set all objects to 'selected'
        for (var i in node.objs) {
            node.objs[i].selected = true;
        }
        
        // accumulate all objs of current node into objs list
        objs.push.apply(objs, node.objs);
        
        // if children, recurse using children nodes
        if (node.children.length) {
            this._get_all(node.children[0], objs);
            this._get_all(node.children[1], objs);
            this._get_all(node.children[2], objs);
            this._get_all(node.children[3], objs);
        }
        
        // otherwise, we are done
        return objs;
    }

    this._get = function(node,bounds,objs) {
        //--    recursively searches through the quadtree for
        //--    all the nodes in the cell intersecting with the
        //--    rect of 'bounds', starting from 'node'; 'objs'
        //--    is filled up with all the objects found and marks
        //--    them as 'selected' (for debugging purposes)
        //--
        
        // first, check if this node is a leaf
        if (!node.children.length) {
            
            // set all objects to 'selected'
            for (var i in node.objs) {
                node.objs[i].selected = true;
            }

            // accumulate all objs of current node into objs list
            objs.push.apply(objs, node.objs);
        
        // else, node has children
        } else {
        
            // get quadrant current node fits into
            var quadrant = this.quad(node.bounds, bounds);

            // if any kind of overlapping, get all objs under this node
            if (quadrant < 0) {
                this._get_all(node,objs);

            // else, recurse using the next quadrant
            } else {

                // set all objects to 'selected'
                for (var i in node.objs) {
                    node.objs[i].selected = true;
                }

                // accumulate all objs of current node into objs list
                objs.push.apply(objs, node.objs);

                // get from next quadrant
                this._get(node.children[quadrant], bounds, objs);
            }
        }
        
        // optimized list of objs
        return objs;
    }

    this.clear = function() {
        //--    clears and resets root node, ultimately
        //--    clearing the entire quadtree
        //--

        this.root.parent = null;
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
                context.beginPath();
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
                    context.rect(o.bounds.x, o.bounds.y,
                                      o.bounds.w, o.bounds.h);
                }
                context.stroke();
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
