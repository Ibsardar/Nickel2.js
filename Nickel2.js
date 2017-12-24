/*
    NAME:   "Nickel2.js"
    AUTH:   Ibrahim Sardar
    DESC:   A major update from Nickel.js.
    NOTE:   Does not require simpleGame.js anymore.
*/



// --
// ------- GLOBAL OBJECTS ------------------------------------
// --



////////////////////////////////////////////
///   GRID   ///////////////////////////////
////////////////////////////////////////////
function Grid(grid_data) {

    GridBuilder.create_grid(this, grid_data);
    GridBuilder.build_specializations(this);
}



////////////////////////////////////////////
///   TILE   ///////////////////////////////
////////////////////////////////////////////
function Tile(tile_data) {

    var tile = TileBuilder.create_tile(tile_data);
    return tile;
}



////////////////////////////////////////////
///   NAVNODE   ////////////////////////////
////////////////////////////////////////////
function NavNode(node_data) {

    NavNodeBuilder.create_node(this, node_data);
    NavNodeBuilder.build_specializations(this);
}



////////////////////////////////////////////
///   LOCOMOTIVE   /////////////////////////
////////////////////////////////////////////
function Locomotive(loco_data) {
    
    var locomotive = LocomotiveBuilder.create_locomotive(loco_data);
    LocomotiveBuilder.create_steering_behaviours(locomotive);
    return locomotive;
}



// --
// ------- UTILITY OBJECTS -----------------------------------
// --



////////////////////////////////////////////
///   PATHFINDER   /////////////////////////
////////////////////////////////////////////
var Pathfinder = {
    
    //
    //  private functions
    //
    _explore            : function (dict, pt) {
        if (!dict[pt[0]]) {
            dict[pt[0]] = {};
        }
        dict[pt[0]][pt[1]] = true;
    },

    _explored           : function (dict, pt) {
        try {
            if (dict[pt[0]][pt[1]])
                return true;
        } catch(e) {}
        return false;
    },

    _compare            : function (pta, ptb) {
        if (pta[0] == ptb[0])
            if (pta[1] == ptb[1])
                return true;
        return false;
    },
    
    //
    //  public functions
    //
    distance_to         : function(p0, p1) {
        var run  = p0[0] - p1[0];
        var rise = p0[1] - p1[1];
        return Math.sqrt(rise*rise + run*run);
    }
    
    ,
    
    get_vertices        : function(items) {     ///TEST THIS (TODO) (HERE) ~~~~~~~~~~
        // returns a 2D list:
        //    items[ item1[edge1,edge2...], item2[...], ... ]
        //
        // input must be a list of sprites/shapes (list of edge points)
        
        var objs = [];
        for (var i in items) {
            var vertices = [];
            var obj = items[i];
            if (Nickel.UTILITY.is_array(obj)) {
                vertices = obj;
            } else {
                vertices.push(obj.get_topleft());
                vertices.push(obj.get_topright());
                vertices.push(obj.get_bottomright());
                vertices.push(obj.get_bottomleft());
            }
            objs.push(vertices);
        }
        
        return objs;
    }
    
    ,
    
    // TODO: DELETE THIS CAREFULLY
    is_in_los           : function(host,source,target,obstructions,avoid_collisions=false,offset_size=null) {
        //
        // returns true if target is in line of sight of sprite
        // false if not
        //
        // offset_size: rayblock size=[width + offset[1], height + offset[0]]
        //
        
        // change source to be an array if we don't care about collisions
        if (!avoid_collisions) {
            source = [source.get_cx(), source.get_cy()];
        }
        
        // obtain target
        var t = [0,0,0,0];
        if (Nickel.UTILITY.is_array(target)) {
            // x,y position
            t[0] = target[0];
            t[1] = target[1];
            // center position
            t[2] = t[0];
            t[3] = t[1];
        } else {
            // x,y position
            t[0] = target.get_x();
            t[1] = target.get_y();
            // center position
            t[2] = target.get_cx();
            t[3] = target.get_cy();
        }
        
        // obtain source with position, dimension, center points, and center origin
        var s = [0,0,0,0,0,0,0,0];
        if (Nickel.UTILITY.is_array(source)) {
            // x,y position
            s[0] = source[0];
            s[1] = source[1];
            // width, height (behave like a line)
            s[2] = 0;
            s[3] = 2;
            // center postion
            s[4] = s[0];
            s[5] = s[1];
            // center origin
            s[6] = 0;
            s[7] = 0;
        } else {
            // x,y position
            s[0] = source.get_x();
            s[1] = source.get_y();
            // width, height
            s[2] = source.get_w();
            s[3] = source.get_h();
            // center postion
            s[4] = source.get_cx();
            s[5] = source.get_cy();
            // center origin
            s[6] = s[2]/2;
            s[7] = s[3]/2;
        }
        
        // determine distance (width of ray block)
        var xdiff = s[4] - t[2];
        var ydiff = s[5] - t[3];
        var width = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff)) + s[2];
        
        // determine height of ray block
        var height = s[3];
        
        // determine angle of ray block from center points
        var theta = Math.atan2(s[5]-t[3], t[2]-s[4]) * 180 / Math.PI;
        
        // create and update ray block
        var rayblock = new Sprite(host, {w:22, h:10});
        rayblock.set_size(width,height);
        rayblock.set_origin([s[6],s[7]]);
        rayblock.set_pos2(s[4],s[5]);
        rayblock.set_rot(theta);
        rayblock.update();
        
        ///UList.push(rayblock); //junk
        
        // apply offset, if any
        if (offset_size) {
            var rc = rayblock.get_center();
            console.log(rc);
            rayblock.set_size(width+offset_size[1],height+offset_size[0]);
            rayblock.update();
            rayblock.set_center(rc[0],rc[1]);
        }
        
        // determine line of sight successful
        for (var i in obstructions) {
            var wall = obstructions[i];
            if (wall.colliding_with(rayblock, false)) {
                return false;
            }
        }
        
        return true;
    }
    
    ,
    
    // TODO: OPTIMIZE TYPE CHECKING, OPTIMIZE LOOP, REDO WITH LINESEG INSTEAD OF RAY
    is_in_los2          : function(start,end,obstructions) {
        //--    returns true if there is nothing blocking
        //--    the view from start to end
        //--
        
        // lineseg from start to end points
        var line = new LineSegment(start, end);
        
        // check collision of lineseg with every obstruction
        for (var i in obstructions) {
            if (Nickel.UTILITY.is_array(obstructions[i])) {
                if (Collision_Detector.collides_line_point(line, obstructions[i])) return false;
                
            } else if (obstructions[i].type == "Sprite") {
                if (obstructions[i].colliding_with(line, false)) return false;
                
            } else if (obstructions[i].type == "SimplePoly") {
                if (Collision_Detector.collides_poly_line(obstructions[i], line)) return false;
                
            } else if (obstructions[i].type == "SimpleCircle") {
                if (Collision_Detector.collides_circle_line(obstructions[i], line)) return false;
                
            } else if (obstructions[i].type == "SimpleLine") {
                if (Collision_Detector.collides_line_line(line, obstructions[i])) return false;
            }
        }
        
        // no obstructions are blocking the view!
        return true;
    }
    
    ,
    
    adjacent_to_point   : function(pos,incl_diag=true) {
        // returns adjacent positions in clockwise direction,
        // starting from the right.
        
        adjs = [];
        
        // E
        adjs.push( [pos[0]+1,pos[1]] );
        // SE
        if (incl_diag) adjs.push( [pos[0]+1,pos[1]+1] );
        // S
        adjs.push( [pos[0],pos[1]+1] );
        // SW
        if (incl_diag) adjs.push( [pos[0]-1,pos[1]+1] );
        // W
        adjs.push( [pos[0]-1,pos[1]] );
        // NW
        if (incl_diag) adjs.push( [pos[0]-1,pos[1]-1] );
        // N
        adjs.push( [pos[0],pos[1]-1] );
        // NE
        if (incl_diag) adjs.push( [pos[0]+1,pos[1]-1] );
        
        return adjs;
    }
    
    ,
    
    adjacents           : function(pos,lim_e,lim_n,lim_w,lim_s,incl_diag=true) {
        // returns valid adjacents
        // (clockwise direction starting from right)
        
        var adjs = Pathfinder.adjacent_to_point(pos,incl_diag);
        var new_adjs = [];
        for (var i=0; i<8; i++) {
            if (adjs[i][0] <= lim_e &&
                adjs[i][0] >= lim_w &&
                adjs[i][1] <= lim_s &&
                adjs[i][1] >= lim_n) {
                new_adjs.push(adjs[i]);
            }
        }
        return new_adjs;
    }
    
    ,
    
    adjacent_neighbors  : function(nav,from_positions,guess_outer=true,start_angle=0,out_heap=0,center_coord=null,limit=1000) {
        //  Returns list of neighbor coordinates adjacent to the specified coordinates
        //  Uses the Moore-Neighborhood Tracing Algoithm
        //  out_heap Code:
        //    0 :   false
        //    1 :   min heap
        //    2 :   max heap
        //
        
        // helpers
        function same_as(a,b) {
            return a[0]==b[0] && a[1]==b[1] ? true : false;
        }
        
        function exists_in(point, list) {
            var len = list.length;
            for (var i=0; i<len; i++) {
                if (point[0] == list[i][0] &&
                    point[1] == list[i][1]) {
                    return true;
                }
            }
            return false;
        }
        
        function is_in_range(point) {
            if (point[0] >= 0     &&
                point[0] <  nav.w &&
                point[1] >= 0     &&
                point[1] <  nav.h ) {
                return true
            }
            return false;
        }
        
        function nbor_at(pivot,angle) {
            
            // get cooresponding coordinate
            switch(angle) {
                case 0:
                    return [pivot[0]+1,pivot[1]  ];
                case 45:
                    return [pivot[0]+1,pivot[1]-1];
                case 90:
                    return [pivot[0],  pivot[1]-1];
                case 135:
                    return [pivot[0]-1,pivot[1]-1];
                case 180:
                    return [pivot[0]-1,pivot[1]  ];
                case 225:
                    return [pivot[0]-1,pivot[1]+1];
                case 270:
                    return [pivot[0]  ,pivot[1]+1];
                case 315:
                    return [pivot[0]+1,pivot[1]+1];
            }
            
            // error
            return -1;
        }
        
        function is_diagonal(angle) {
            switch(angle) {
                case 0:
                case 90:
                case 180:
                case 270:
                    return false;
                default:
                    return true;
            }
        }
        
        // variables
        var count = 0;
        var nbors = [];
        var start = [-1,-1];
        var curr  = [0,0];
        var prev  = [0,0];
        var angle = start_angle;
        var start_visits = 1;
        
        // init heap if any
        if (out_heap==1) {
            var heap = new Heap('min');
        } else if (out_heap==2) {
            var heap = new Heap('max');
        }
        
        // if returning a heap
        if (out_heap) {
            
            // if center is not set
            if (center_coord == null) {

                // get avg center of tiles
                var avgx = 0;
                var avgy = 0;
                for (var i in from_positions) {
                    avgx += nav.at(from_positions[i]).x;
                    avgy += nav.at(from_positions[i]).y;
                }
                center_coord = [avgx / from_positions.length,
                                avgy / from_positions.length];
            }
        }
        
        // init
        curr[0] = from_positions[0][0];
        curr[1] = from_positions[0][1];
        
        // guess the "outer" area of the given structure
        // (keep going right until we hit an empty space)
        if (guess_outer) {
            curr[0]++;
            while(exists_in(curr, from_positions)) {
                curr[0]++;
            }
            curr[0]--;
        }
        
        // don't guess outer; user specifies outer via angle from [[0,0]]
        else {
            
            angle = start_angle;
        }
        
        // remember start coordinate
        start[0] = curr[0];
        start[1] = curr[1];
        
        // rotate around from_positions until we reach starting pos
        while(true){
            
            // error handle
            if (count >= limit) {return 'ERROR';}
            count++;
            
            // clean angle
            angle = Nickel.UTILITY.trim_angle(angle);
            
            // get neighbor coordinate
            var tmp_nbor = nbor_at(curr,angle);
            
            console.log('current: '+curr+', angle: '+angle+', neighbor: '+tmp_nbor);
            console.log('START: '+start);
            
            // if current tile is start tile
            if (same_as(curr,start)) {
                console.log('current is start');
                
                // if current angle same as start angle
                if (angle == start_angle) {
                    
                    // if start was visited at least twice
                    if (start_visits > 1) {
                        console.log('start has been visited again, we are done.');
                        
                        // all neighbors have been found
                        console.log(nbors); 
                        if (!out_heap) {
                            return nbors;
                        } else {
                            return heap;
                        }
                    }
                    
                    // if start is the only source
                    //   visit self once more so next time we visit, we are finished
                    if (from_positions.length == 1) {
                        start_visits++;
                    }
                }
            }
            
            // if neighbor is out of bounds
            if (!is_in_range(tmp_nbor)) {
                console.log('nbor is out of bounds');
                
                // skip it, go to next
                angle += 45;
                continue;
            }
            
            // get neighbor coordinate's tile
            var tmp_tile = nav.at(tmp_nbor);
            
            // if neighbor tile is blocked
            if (tmp_tile.blocked) {
                console.log('nbor is blocked');
                
                // skip it, go to next
                angle += 45;
                continue;
            }
            
            // if neighbor tile is the start tile
            if (same_as(tmp_nbor,start)) {
                console.log('neighbor is start');
                
                // curr becomes start
                curr[0] = start[0];
                curr[1] = start[1];
                
                // flip current angle to continue from start
                angle += 180;
                
                // increment angle at least once to skip where we just were
                angle += 45;
                
                // increment start tile visits
                start_visits++;
                
                // go to next
                continue;
            }
            
            // if neighbor tile is a source tile (other than start)
            if (exists_in(tmp_nbor,from_positions)) {
                console.log('neighbor is source; not start');
                
                // curr becomes neighbor
                curr[0] = tmp_nbor[0];
                curr[1] = tmp_nbor[1];
                
                // flip current angle to continue from start
                angle += 180;
                
                // increment angle at least once to skip where we just were
                angle += 45;
                
                // go to next
                continue;
            }
            
            // if neighbor tile has already been added
            if (exists_in(tmp_nbor,nbors)) {
                
                // skip it, go to next
                angle += 45;
                continue;
            }
            
            
            
            // if neighbor tile is empty:
            
            // if outputs a heap
            if (out_heap) {
                
                // order by distance from avg center coordinate
                var dist = Pathfinder.distance_to(center_coord,tmp_tile.pos());
                heap.in(tmp_nbor,dist);
            }
            
            // add it as a neighbor
            nbors.push(tmp_nbor);
            
            // go to next
            angle += 45;
            console.log('neighbor is empty');
        }
    }
    
    ,
    
    nearest_neighbor    : function(grid,from_positions,center_coordinate=null) {
        //  Returns the nearest neighbor coordinate
        //  center default is ang coordinate of from_positions
        //
        
        return Pathfinder.adjacent_neighbors(grid.nav, from_positions, true, 0, 1, center_coordinate).out().obj;
    }
    
    ,
    
    furthest_neighbor   : function(grid,from_positions,center_coordinate=null) {
        //  Returns the furthest neighbor coordinate
        //  center default is ang coordinate of from_positions
        //
        
        return Pathfinder.adjacent_neighbors(grid.nav, from_positions, true, 0, 2, center_coordinate).out().obj;
    }
    
    ,
    
    bordering_neighbors : function(grid,from_positions) {
        //  Returns a list of neighborring sprites
        //
        
        return Pathfinder.adjacent_neighbors(grid.nav, from_positions);
    }
    
    ,
    
    dijkstra            : function(nav,a,b,lim_e,lim_n,lim_w,lim_s,incl_diag=true,limit=333333) {
        
        // edge case
        if (a[0]==b[0] && a[1]==b[1]) return [];
        
        var exp = {};
        var adjs = [];
        var H = new Heap('min');
        var curr = a;
        var cnt = 0;
        var tmpcost = 0;
        var tmpnext = null;
        var tmpcurr = null;
        
        nav.apply_to_all(function(n){
            n.G = 9999;
            n.P = null;
        });
        
        nav.at(curr).G = 0;
        
        // set parents
        while(true){
            
            tmpcurr = nav.at(curr);
            adjs = Pathfinder.adjacents(curr, lim_e, lim_n, lim_w, lim_s, incl_diag);
            
            if(cnt>limit){break;}
            cnt++;
            
            Pathfinder._explore(exp, curr);
            
            for (var i=0, len=adjs.length; i<len; i++) {
                
                if (!Pathfinder._explored(exp, adjs[i])) {
                    
                    tmpnext = nav.at(adjs[i]);
                    if (!tmpnext.blocked) {
                        
                        tmpcost = tmpcurr.G + Pathfinder.distance_to(curr, adjs[i]);
                        if (tmpcost < tmpnext.G) {
                            
                            tmpnext.G = tmpcost;
                            tmpnext.P = tmpcurr;
                            
                            // also tweak node if it is in the frontier:
                            if (!H.tweak(adjs[i], tmpnext.G, Pathfinder._compare)) {
                                
                                // ...else, add it to the frontier:
                                H.in(adjs[i], tmpnext.G);
                            }
                        }
                    }
                }
            }
            
            var curr_is_available = false;
            while(!H.is_empty()) {
                
                curr = H.out().obj;
                
                if (!Pathfinder._explored(curr)) {curr_is_available=true; break;}
            }
            
            if (!curr_is_available && H.is_empty()) break;
            
            if (curr[0]==b[0] && curr[1]==b[1]) break;
        }
        
        // get path
        var par = null;
        var S = new Stack();
        
        curr = nav.at(b);
        S.push(curr);
        
        while(true) {
            
            if(cnt>limit){break;}
            cnt++;
            
            par = curr.P;
            
            if (!par) break;
            
            S.push(par);
            curr = par;
        }
        
        // return node path
        if (cnt <= limit) { return S.dump(); }
        else return [];
    }
    
    ,
    
    a_star : function(nav,a,b,lim_e,lim_n,lim_w,lim_s,incl_diag=true,limit=333333) {
        
        // edge case
        if (a[0]==b[0] && a[1]==b[1]) return [];
        
        var exp = {};
        var front = {};
        var adjs = [];
        var H = new Heap('min');
        var curr = a;
        var cnt = 0;
        var tmpcost = 0;
        var tmphuer = 0;
        var tmpnext = null;
        var tmpcurr = null;
        
        nav.apply_to_all(function(n){
            n.G = 0;
            n.H = 9999;
            n.P = null;
        });
        
        nav.at(curr).G = 0;
        
        // set parents
        while(true){
            
            tmpcurr = nav.at(curr);
            adjs = Pathfinder.adjacents(curr, lim_e, lim_n, lim_w, lim_s, incl_diag);
            
            if(cnt>limit){break;}
            cnt++;
            
            Pathfinder._explore(exp, curr);
            
            for (var i=0, len=adjs.length; i<len; i++) {
                
                if (!Pathfinder._explored(exp, adjs[i])) {
                    
                    tmpnext = nav.at(adjs[i]);
                    if (!tmpnext.blocked) {
                        
                        tmpcost = tmpcurr.G + Pathfinder.distance_to(curr, adjs[i]);
                        tmphuer = Pathfinder.distance_to(adjs[i], b);
                        if ((tmpcost + tmphuer) < (tmpnext.G + tmpnext.H)) {

                            tmpnext.G = tmpcost;
                            tmpnext.H = tmphuer;
                            tmpnext.P = tmpcurr;

                            // also tweak node if it is in the frontier:
                            if (!H.tweak(adjs[i], (tmpcost + tmphuer), Pathfinder._compare)) {

                                // ...else, add it to the frontier:
                                H.in(adjs[i], (tmpcost + tmphuer));
                            }
                        }
                    }
                }
            }
            
            var curr_is_available = false;
            while(!H.is_empty()) {
                
                curr = H.out().obj;
                
                if (!Pathfinder._explored(curr)) {curr_is_available=true; break;}
            }
            
            if (!curr_is_available && H.is_empty()) {console.log("No Path Found"); break};
            
            if (curr[0]==b[0] && curr[1]==b[1]) break;
        }
        
        
        
        // get path
        var par = null;
        var S = new Stack();
        
        curr = nav.at(b);
        S.push(curr);
        
        while(true) {
            
            if(cnt>limit){break;}
            cnt++;
            
            par = curr.P;
            
            if (!par) break;
            
            S.push(par);
            curr = par;
        }
        
        // return node path
        if (cnt <= limit) { return S.dump(); }
        else return [];
    }
    
    ,
    
    // TODO: CLEAN UP COMMENTS AND OTHER JUNK, OPTIMIZE
    theta_star : function(host,map,a,b,lim_e,lim_n,lim_w,lim_s,obstructions=[],incl_diag=true,limit=333333) {
        
        // edge case
        if (a[0]==b[0] && a[1]==b[1]) return [];
        
        var exp = {};
        var front = {};
        var adjs = [];
        var H = new Heap('min');
        var nav = map.nav;
        var curr = a;
        var cnt = 0;
        var tmpcost = 0;
        var tmphuer = 0;
        var tmpnext = null;
        var tmpcurr = null;
        var tilnext = null;
        var tilcurp = null;
        var tilcurr = null;
        var tmpspr  = null;
        
        nav.apply_to_all(function(n){
            n.G = 0;
            n.H = 9999;
            n.P = null;
        });
        
        nav.at(curr).G = 0;
        
        // final tile
        var tilfinal = map.get_tile(b);
        
        // set parents
        while(true){
            
            if(cnt>limit){break;}
            cnt++;
            
            Pathfinder._explore(exp, curr);
            
            adjs = Pathfinder.adjacents(curr, lim_e, lim_n, lim_w, lim_s, incl_diag);
            
            /* // ====
            // before checking adjacents, check final destination
            //
            //
            var tilcurr = map.get_tile(curr);
            
            // check if final dest. is reachable from curr
            if (sprite) {

                // use sprite dimensions for a collision-less path
                sprite.hide();
                tmpspr = sprite.copy_frozen();
                sprite.show();
                tmpspr.set_center(tilfinal.get_cx(),tilfinal.get_cy());
                tmpspr.set_origin_centered();
                tmpspr.update();
                tmpspr.turn_to(tilcurr);
                var LOS0 = Pathfinder.is_in_los(host,tmpspr,tilcurr.get_center(),obstructions,true);
            } else {

                // use point for absolute path
                var LOS0 = Pathfinder.is_in_los(host,tilfinal.get_center(),tilcurr.get_center(),obstructions);
            }
            
            if (LOS0) {
                nav.at(curr).P = nav.at(b);
                break;
            }
            //
            //
            // ====***/
            
            for (var i=0, len=adjs.length; i<len; i++) {
                
                if (!Pathfinder._explored(exp, adjs[i])) {
                    
                    // get nav nodes of curr and next
                    tmpcurr = nav.at(curr);
                    tmpnext = nav.at(adjs[i]);
                    
                    if (!tmpnext.blocked) {
                        
                        // get tiles of curr and next
                        tilcurr = map.get_tile(tmpcurr.pos());
                        tilnext = map.get_tile(tmpnext.pos());
                        
                        // ***MAY NOT NEED THIS HERE
                        // can curr see adjacent?
                        var LOS = Pathfinder.is_in_los2(tilnext.get_center(), tilcurr.get_center(), obstructions);
                        
                        // check if adjacent is reachable from curr
                        if (LOS) {
                    
                            tmpcost = tmpcurr.G + Pathfinder.distance_to(curr, adjs[i]);
                            tmphuer = Pathfinder.distance_to(adjs[i], b);

                            var curr_recorded_cost = tmpcost   + tmphuer;
                            var next_recorded_cost = tmpnext.G + tmpnext.H;
                            if (curr_recorded_cost < next_recorded_cost) {

                                // record new, better cost
                                tmpnext.G = tmpcost;
                                tmpnext.H = tmphuer;

                                // get tile of current's parent
                                if (tmpcurr.P) {
                                    tilcurp = map.get_tile(tmpcurr.P.pos());
                                }

                                // helper variable
                                var check = false;

                                // LOS Checks
                                ///////////////////////////////////////

                                // if prev parent exists
                                if (tmpcurr.P) {
                                    
                                    // get LOS to prev parent
                                    var LOS2 = Pathfinder.is_in_los2(tilnext.get_center(), tilcurp.get_center(), obstructions);
                                    
                                    // if LOS to prev parent:
                                    if (LOS2) {

                                        // then set prev parent as parent
                                        tmpnext.P = tmpcurr.P;
                                    } else {

                                        // else mark for adjacent LOS check
                                        //check = true;
                                        tmpnext.P = tmpcurr;
                                    }
                                } else {

                                    // else mark for adjacent LOS check
                                    //check = true;
                                    tmpnext.P = tmpcurr;
                                }

                                // also tweak node if it is in the frontier:
                                if (!H.tweak(adjs[i], (tmpcost + tmphuer), Pathfinder._compare)) {

                                    // ...else, add it to the frontier:
                                    H.in(adjs[i], (tmpcost + tmphuer));
                                }
                            }
                        }
                    }
                }
            }
            
            var curr_is_available = false;
            while(!H.is_empty()) {
                
                curr = H.out().obj;
                
                if (!Pathfinder._explored(curr)) {curr_is_available=true; break;}
            }
            
            if (!curr_is_available && H.is_empty()) {console.log("No Path Found"); break};
            
            if (curr[0]==b[0] && curr[1]==b[1]) break;
        }
        
        
        
        // get path
        var par = null;
        var S = new Stack();
        
        curr = nav.at(b);
        S.push(curr);
        
        while(true) {
            
            if(cnt>limit){break;}
            cnt++;
            
            par = curr.P;
            
            if (!par) break;
            
            S.push(par);
            curr = par;
        }
        
        // return node path
        if (cnt <= limit) { return S.dump(); }
        else return [];
    }
    
    ,
    
    // TODO
    find_path_to        : function(grid,unit,dest) {
        // Use an arbitrary algorithm along with navnode info
        //   to generate best path to goal.
        //
        
        var node1 = { tile:grid[0][1], xoff:12, yoff:-8 };
        var node2 = { tile:grid[0][0], xoff:-10, yoff:30 };
        var node3 = { tile:grid[1][0], xoff:0, yoff:0 };
        return [ node1, node2, node3 ]; 
    }
    
    ,
    
    // TODO
    find_path_near      : function(grid,unit,dest) {
        // ...
        
    }
    
    ,
    
    // TODO
    find_path_around    : function(grid,unit,dest) {
        // ...
        
    }
    
}



// --
// ------- DESIGN PATTERN OBJECTS ----------------------------
// --



////////////////////////////////////////////
///   GUI BUILDER   ////////////////////////
////////////////////////////////////////////
var GUIBuilder = {
    
    // ...
    
}//end gui builder



////////////////////////////////////////////
///   GRID BUILDER   ///////////////////////
////////////////////////////////////////////
var GridBuilder = {

    create_grid : function(grid, grid_data) {

        //extract data
        var scene   = grid_data.scene;
        var matrix  = grid_data.matrix;
        var types   = grid_data.types;
        var bg_data = grid_data.bg_data;
        var tdata   = grid_data.scroll_data;
        var rdata   = grid_data.rotation_data;
        var sdata   = grid_data.zoom_data;
        var ndata   = grid_data.navmesh_data;

        //data parts
        grid.tdata = tdata;
        grid.rdata = rdata;
        grid.sdata = sdata;
        grid.ndata = ndata;

        //viewport
        grid.scene = scene;

        //background
        if (bg_data) {
            grid.bg = new Sprite(scene, bg_data);
            grid.bg.bound = function() {};
            grid.bg.set_pos(0,0);
        }

        //tiled map
        grid.map = [];
        for (var x in matrix[0]) {

            grid.map.push([]);
            for (var y in matrix) {

                var tile = new Tile( types[matrix[y][x]] );
                tile.set_pos( tile.get_w()*x, tile.get_h()*y );
                grid.map[x].push(tile);
            }
        }

        //tiles
        grid.tiles_south = matrix.length;
        grid.tiles_east = matrix[0].length;

        //dimensions
        grid.width_orig = 0;
        grid.height_orig = 0;
        for (var x=0 ; x<grid.tiles_east ; x++) {
            grid.width_orig += grid.map[x][0].get_w();
        }
        for (var y=0 ; y<grid.tiles_south ; y++) {
            grid.height_orig += grid.map[0][y].get_h();
        }
        if (grid.bg && grid.width_orig < grid.bg.get_w()) grid.width_orig = grid.bg.get_w();
        if (grid.bg && grid.height_orig < grid.bg.get_h()) grid.height_orig = grid.bg.get_h();

        //rect
        var grid_rect = {
            w : grid.width_orig,
            h : grid.height_orig
        };
        grid.rect = new Sprite(grid.scene, grid_rect);
        grid.rect.bound = function() {};
        grid.rect.set_pos(0,0);

        //bounding box
        grid.bbox = new Sprite(grid.scene, grid_rect);
        grid.bbox.bound = function() {};
        grid.bbox.set_pos(0,0);
        
        //accessors
        grid.get_tile = function(pt) {return grid.map[pt[0]][pt[1]]};

        //transformation update
        grid.update_transformations = function() {

            // simplify vars
            var w   = grid.scene.get_w();
            var h   = grid.scene.get_h();
            var gcx = grid.bbox.get_cx();
            var gcy = grid.bbox.get_cy();
            var mx  = grid.scene.mouse_x;
            var my  = grid.scene.mouse_y;

            // translation
            if (tdata) {
                if (mx > w-tdata.buffer) {
                    grid.translate(-tdata.speed,0);
                }
                if (mx < tdata.buffer) {
                    grid.translate(tdata.speed,0);
                }
                if (my > h-tdata.buffer) {
                    grid.translate(0,-tdata.speed);
                }
                if (my < tdata.buffer) {
                    grid.translate(0,tdata.speed);
                }
            }

            // rotation
            if (rdata) {
                if (grid.scene.key_downs[Nickel.KEYCODES.ALT]) {

                    // - check event
                    var degrees = 0;
                    if (grid.scene.key_downs[Nickel.KEYCODES.LEFTARROW]) {
                        degrees = -rdata.speed;
                    }
                    if (grid.scene.key_downs[Nickel.KEYCODES.RIGHTARROW]) {
                        degrees = rdata.speed;
                    }

                    // - setup origin
                    var rox = 0;
                    var roy = 0;
                    if (rdata.origin == 'mouse') {
                        rox = mx;
                        roy = my;
                    }
                    if (rdata.origin == 'center') {
                        rox = gcx;
                        roy = gcy;
                    }
                    if (rdata.ox) rox = rdata.ox;
                    if (rdata.oy) roy = rdata.oy;

                    // - apply rotation
                    grid.rotate(degrees,[rox,roy]);
                }
            }

            // scale
            if (sdata) {
                if (grid.scene.wheel_impulse != 0) {
                    var scale  = (grid.scene.wheel_impulse / 1000 * sdata.speed) + 1;
                    var origin = [grid.scene.mouse_x, grid.scene.mouse_y];
                    grid.scale(scale, origin);
                    grid.scene.wheel_impulse = 0;
                }
            }
        }

        //main update
        grid.update = function() {

            //transformations
            grid.update_transformations();

            //background
            if (grid.bg) grid.bg.update();

            //rect
            grid.rect.update();

            //bounding box
            grid.bbox.update();

            //tiles
            for (var x in grid.map) {
                for (var y in grid.map[x]) {
                    grid.map[x][y].update();
                }
            }

            //navmesh
            if (grid.nav) grid.nav.update();
        }
    }

    ,

    build_specializations : function(grid) {

        if (grid.tdata) GridBuilder.build_translators(grid);
        if (grid.rdata) GridBuilder.build_rotators(grid);
        if (grid.sdata) GridBuilder.build_scalers(grid);
        if (grid.ndata) GridBuilder.build_navmesh(grid);
    }

    ,

    build_translators : function(grid) {

        //simplify
        var tdata = grid.tdata;

        //translate function
        grid.translate = function(offx,offy) {

            // grid sides
            var l = grid.bbox.get_left();
            var t = grid.bbox.get_top();
            var r = grid.bbox.get_right();
            var b = grid.bbox.get_bottom();

            // apply bounding action
            if (l + offx > tdata.bounds.left) {
                offx = tdata.bounds.left - l;
            } else
            if (r + offx < grid.scene.get_w() - tdata.bounds.right) {
                offx = grid.scene.get_w() - tdata.bounds.right - r;
            }
            if (t + offy > tdata.bounds.top) {
                offy = tdata.bounds.top - t;
            } else
            if (b + offy < grid.scene.get_h() - tdata.bounds.bottom) {
                offy = grid.scene.get_h() - tdata.bounds.bottom - b;
            }

            //background
            if (grid.bg) grid.bg.offset_position(offx,offy);

            //rect
            grid.rect.offset_position(offx,offy);

            //bounding box
            grid.bbox.offset_position(offx,offy);

            //tiles
            for (var x in grid.map) {
                for (var y in grid.map[x]) {
                    grid.map[x][y].offset_position(offx,offy);
                }
            }

        }
    }

    ,

    build_rotators : function(grid) {

        //simplify
        var rdata = grid.rdata;

        //rotate function
        grid.rotate = function(angle, origin) {

            //background
            if (grid.bg) grid.bg.offset_turn(angle,origin);

            //rect
            grid.rect.offset_turn(angle,origin);

            //bounding box
            grid.bbox.bound_around(grid.rect);

            //tiles
            for (var x in grid.map) {
                for (var y in grid.map[x]) {
                    grid.map[x][y].offset_turn(angle,origin);
                }
            }
        }

    }

    ,

    build_scalers : function(grid) {

        //simplify
        var sdata = grid.sdata;
        var tdata = grid.tdata;

        //scale function
        grid.scale = function(scale,origin) {

            //apply bound action
            // - zoom out
            if (scale < 1) {
                if (grid.rect.get_scaleg() == sdata.bounds.out) return;
                if (grid.rect.get_scaleg() * scale < sdata.bounds.out) {
                    scale = sdata.bounds.out / grid.rect.get_scaleg();
                }
            // - zoom in
            } else if (scale > 1) {
                if (grid.rect.get_scaleg() == sdata.bounds.in) return;
                if (grid.rect.get_scaleg() * scale > sdata.bounds.in) {
                    scale = sdata.bounds.in / grid.rect.get_scaleg();
                }
            // - no zoom
            } else {
                return;
            }

            //translational bounds
            if(tdata) {
                tdata.bounds.left   /= scale;
                tdata.bounds.right  /= scale;
                tdata.bounds.top    /= scale;
                tdata.bounds.bottom /= scale;
            }

            //background
            if (grid.bg) grid.bg.offset_scale(scale,origin);

            //rect
            grid.rect.offset_scale(scale,origin);

            //bounding box
            grid.bbox.offset_scale(scale,origin);

            //tiles
            for (var x in grid.map) {
                for (var y in grid.map[x]) {
                    grid.map[x][y].offset_scale(scale,origin);
                }
            }
        }

    }

    ,

    build_navmesh : function(grid) {

        grid.nav = NavBuilder.create_navmesh(grid, grid.ndata);

    }

}//end grid builder



////////////////////////////////////////////
///   TILE BUILDER   ///////////////////////
////////////////////////////////////////////
var TileBuilder = {

    create_tile : function(tile_data) {

        //extract data
        scene = tile_data.scene;
        img   = tile_data.img_data;
        types = tile_data.types;

        //tile inherits sprite
        var tile = new Sprite(scene, img);

        //properties
        tile.types = types;
        tile.bound = function() {/* Continue */};

        return tile;
    }

}//end tile builder



////////////////////////////////////////////
///   NAVMESH BUILDER   ////////////////////
////////////////////////////////////////////
var NavBuilder = {

    create_navmesh : function(host, data) {

        /***

            Thoughts:
            ---------

            The navmesh should be a sprite (so it can perform transformations)

            types:  Basic       ->  each node has the following variables: G,Parent,Weight
                                ->  this obj has the following special functions: path_to, all_paths, nearest, furthest, nearer(user defined)
                     \-> used for Dijkstra, BFS, DFS

                    Optimized   ->  each node has the following variables: G,H,F,Parent,Weight
                                ->  this obj has the following special functions: hueristic(user defined), path_to, nearest, furthest, nearer(user defined)
                     \-> used for A*, Theta*, Lazy Theta

                    field       ->  each node has the following variables: Radius,Shape,?
                     \-> used for Map-segmentation, Voroni, Weighted fields that affect pathfinding
                     
                     
                     
                     
                    --- Actually, combine Optimized and Basic and make the field a seperate system
                    
                    
                    Field system:   nav should have a field list. Each field is an object. The object will have the following:
                                        - Shape
                                            - Circle:       x,y,radius
                                            - Rectangle:    x,y,w,h
                                        - user defined 'effect' function
                                        

        ***/

        //init
        var nav = this;
        nav.w = host.tiles_east;
        nav.h = host.tiles_south;
        
        // extract data
        var node_data = data.node_data;
        nav.fields = data.field_list;

        // map navigation nodes to tiles
        nav.nodes = [];
        for (var x=0; x<nav.w; x++) {

            nav.nodes.push([]);
            for (var y=0; y<nav.h; y++) {

                // this part is only if user wants to debug
                if (node_data.type == "debug") {
                    node_data.grid = host;
                    node_data.tile = host.map[x][y];
                }

                // generic part
                var node = new NavNode(node_data);
                node.x = x;
                node.y = y;
                nav.nodes[x].push(node);
            }
        }
        
        // apply fields to tiles
        for (var i in nav.fields) {
            var field = nav.fields[i];
            if (field.shape == 'rectangle') {
                
                // add effect and/or blockages to rectangle grid
                for (var j=field.x; j<field.x+field.w; j++) {
                    for (var k=field.y; k<field.y+field.h; k++) {
                        if (field.effect)
                            nav.nodes[j][k].effects.push(field.effect);
                        if (field.blocked)
                            nav.nodes[j][k].blocked = true;
                    }
                }
            } else if (field.shape == 'point') {
                
                // add effect and/or blockages to a single node
                if (field.effect)
                    nav.nodes[field.x][field.y].effects.push(field.effect);
                if (field.blocked)
                    nav.nodes[field.x][field.y].blocked = true;
            }
        }
        
        nav.at = function(pt) {
            return nav.nodes[pt[0]][pt[1]];
        }
        
        // user can run a function which takes in
        //  a navnode to all navnodes
        nav.apply_to_all = function(func) {
            for (x=0; x<host.tiles_east; x++) {
                for (y=0; y<host.tiles_south; y++) {
                    func(nav.nodes[x][y]);
                }
            }
        }
        
        nav.place = {
            
            // place sprite at some position/sprite
            at : function(spr, dest) {
                /*** Old (working) snippet
                if (dest instanceof Array) {
                    var target = host.map[dest[0]][dest[1]];
                } else if (dest instanceof Sprite) {
                    var target = dest;
                }***/
                var target = Nickel.UTILITY.determine_destination(host, dest);
                
                var c = target.get_center();
                spr.set_center(c[0],c[1]);
            }// end at
    
            ,
    
            // place sprite at closest available position to position/sprite
            near : function(spr, dest) {
                var target = Nickel.UTILITY.determine_destination(host, dest);
                
                                                                            ////////////     tiles must be a 2D list rectangle where start_area[0][0] is the topleft tile.    !!!!
                var start_area = target.get_occupied_tiles();    ///////////////////////******************   IMPLEMENT THIS FUNCTION !  ******** HERE *** 
                var nearest = Pathfinder.nearest_neighbor(host, start_area);
                var c = nearest.get_center();
                spr.set_center(c[0],c[1]);
            }// end near
            
            ,
            
            // place sprite randomly around position/sprite
            around : function(spr, dest) {
                var target = Nickel.UTILITY.determine_destination(host, dest);
                
                var start_area = target.get_occupied_tiles();    ///////////////////////******************   IMPLEMENT THIS FUNCTION !   HERE
                var neighbors = Pathfinder.bordering_neighbors(host, start_area);
                var pick = Nickel.UTILITY.random_element(neighbors);
                var c = pick.get_center();
                spr.set_center(c[0],c[1]);
            }// end around
    
        };
        
        nav.move = {
            
            to : function(spr, dest) {
                var target = Nickel.UTILITY.determine_destination(host, dest);
                
                var path = Pathfinder.find_path_to(host, spr, target);
                spr.ai.set_path( path );            //////////////////////////////////***************   IMPLEMENT later...          HERE
                spr.follow_path();                  //////////////////////////////////***************   IMPLEMENT later...          HERE
            }
            
            ,
            
            near_to : function(spr, dest) {
                var target = Nickel.UTILITY.determine_destination(host, dest);
                
                var path = Pathfinder.find_path_near(host, spr, target);
                spr.ai.set_path( path );
                spr.follow_path();
            }
            
            ,
            
            around_to : function() {
                var target = Nickel.UTILITY.determine_destination(host, dest);
                
                var path = Pathfinder.find_path_around(host, spr, target);
                spr.ai.set_path( path );
                spr.follow_path();
            }
            
        };

        nav.update = function() {

            // update all nav nodes
            nav.apply_to_all(function(navnode) {
                navnode.update();
            });

        }

        return nav;

    }

}//end nav builder



////////////////////////////////////////////
///   NAVNODE BUILDER   ////////////////////
////////////////////////////////////////////
var NavNodeBuilder = {

    create_node : function(node, data) {

        //extract data
        node.data = data;
        
        // Parent, Cost from source, Hueristic cost to end
        node.P = null;
        node.G = 0;
        node.H = 0;
        
        // list of functions incrementing/decrementing priority
        // effects will determine priority
        node.effects = [];
        
        // large priority means more favorable,
        // small priority means less favorable,
        // zero priority means it's nuetral
        node.priority = 0;
        node.get_weight = function () {return -node.priority;}
        
        // if node is not passable
        node.blocked = false;
        
        // position vars
        node.x = -1;
        node.y = -1;
        node.pos = function () {return [node.x,node.y];}
    }

    ,

    build_specializations : function(node) {
        
        if (node.data.type == "debug") {
            
            node.spr = new Sprite(node.data.grid.scene, node.data.spr_data, true);
            node.spr.bound = function() {};
            node.spr.set_origin_centered(); ///new update HERE********************************
            node.til = node.data.tile;
            
            node.update = function() {
                if (node.P) {
                    var par = node.data.grid.map[node.P.x][node.P.y];
                    node.spr.turn_to(par);
                    //console.log(node.spr.get_center()+" , "+par.get_center());
                    //node.spr.turn_to([0,0]);
                }
                node.spr.set_center(node.til.get_cx(), node.til.get_cy());
                if (node.P) node.spr.update();
            }
            
        } else {
            
            node.update = function() {}
        
        }
        
    }

}//end nav node builder



////////////////////////////////////////////
///   LOCOMOTIVE BUILDER   /////////////////
////////////////////////////////////////////
var LocomotiveBuilder = {
    
    create_locomotive : function(loco_data) {
        
        // inherit from sprite and extract data
        var unit = new Sprite(loco_data.scene,
                              loco_data.img_data,
                              true, null, false);
        
        // set properties
        unit.type = "Locomotive";
        unit.bound = function () {/* Continue */};
        unit.set_origin_centered();
        unit.set_rot_max(loco_data.max_rot);
        if (loco_data.hull)
            unit.set_hull(loco_data.hull);
        else if (loco_data.hull_exists)
            unit.set_hull(new ColliderHull(unit));
        
        // return object
        return unit;
    },
    
    create_steering_behaviours : function(unit) {
        
        unit.ease_to_speed = function (speed,accel) {
            //--    Eases into the given speed by altering acceleration,
            //--    buffer allows the ease to stop earlier
            //--
            
            if (speed == unit.get_speed()) {
                
                // finish ease
                unit.set_accel(0);
            } else if (speed > unit.get_speed()) {
                
                // pos accel
                unit.set_accel(accel);
                
                // if next step exceeds, ease is finished
                if (speed < unit.get_speed() + unit.get_accel()) {
                    unit.set_speed(speed);
                    unit.set_accel(0);
                }
            } else {
                
                // neg accel
                unit.set_accel(accel * -1);
                
                // if next step exceeds, ease is finished
                if (speed > unit.get_speed() + unit.get_accel()) {
                    unit.set_speed(speed);
                    unit.set_accel(0);
                }
            }
        }
        
        unit.seek = function (target,speed,accel) {
            //--    seeks towards a position
            //--
            
            unit.ease_to_speed(speed,accel);
            unit.turn_to(target,false);
        }
        
        unit.flee = function (target,fov_radius,speed,accel) {
            //--    flees away from a position
            //--    returns int representing current stage
            //--    Stages:
            //--    0   :   not fleeing from target
            //--    1   :   fleeing from target
            //--
            
            // determine target
            if (!Nickel.UTILITY.is_array(target)) {
                target = target.get_center();
            }
            
            // if target is not in FOV, ignore
            if (Pathfinder.distance_to(unit.get_center(), target) > fov_radius) {
                return 0;
            }
            // if target is in FOV, turn away from target
            else {
                var cx = unit.get_cx();
                var cy = unit.get_cy();
                new_target = [cx + (cx-target[0]), cy + (cy-target[1])];
                
                // seek away from target
                unit.seek(new_target,speed,accel);
                return 1;
            }
        }
        
        unit.arrive = function (target,max_speed,min_speed,
                                arrive_radius,buffer_radius,
                                halt=true,round_places=0) {
            //--    softly arrives at a position
            //--    returns int representing current stage
            //--    Stages:
            //--    0   :   target not in yet in fov
            //--    1   :   target in fov, but not arrived yet
            //--    2   :   target arrived or stopped
            //--
            
            // cannot arrive if no speed (assume target reached)
            if (unit.get_speed() == 0) return 2;
            
            // determine target
            if (!Nickel.UTILITY.is_array(target)) {
                target = target.get_center();
            }
            
            // if target is not in FOV, ignore
            var dist_to_target = Pathfinder.distance_to(unit.get_center(), target);
            if (dist_to_target > arrive_radius) {
                return 0;
            }
            // if speed is low enough, arrive finishes
            else if (unit.get_speed() <= min_speed) {
                
                // halt if specified (speed most probably not near 0)
                if (halt)
                    unit.set_speed(0);
            
                // indicates target reached
                return 2;
                
            }
            // if position is close enough, arrive finishes
            else if (Nickel.UTILITY.round(dist_to_target,round_places) <= buffer_radius) {
                
                // halt regardless (speed should be already about zero)
                unit.set_speed(0);
            
                // indicates target reached
                return 2;
            }
            // if target is in FOV, ease into target
            else {
                unit.set_accel(0);
                var slower = (dist_to_target-buffer_radius) / (arrive_radius-buffer_radius) * max_speed;
                unit.set_speed(slower);
                unit.turn_to(target,false);
                
                return 1;
            }
        }
        
        unit.wander = function (speed, smooth_chance=50,
                                max_rot=unit.get_rot_max()) {
            //--    randomly wanders from the current position
            //--
            
            // get turn direction (sign of displacement indicates direction)
            // positive = counter-clockwise
            // negative = clockwise
            // 0 = none
            var dir = Math.sign(unit.get_last_rot());
            if (!dir) {
                dir = Nickel.UTILITY.random_number(0,1);
                if (!dir)
                    dir = -1;
            }
            
            // should we keep turning in same direction?
            var rnd_smooth = Nickel.UTILITY.random_number(0,100);
            var smooth = false;
            if (rnd_smooth <= smooth_chance)
                smooth = true;

            // choose random number between 0 and maximum turning rate
            var turn = Nickel.UTILITY.random_number(0,Math.round(max_rot*100000)) / 100000;

            // if smooth, turn in the same direction
            if (smooth) {
                turn *= dir;
                
            // if not, turn in the opposite direction
            } else {
                turn *= dir * -1;
            }

            // set speed and angle
            unit.set_speed(speed);
            unit.offset_turn(turn);
        }
        
        unit.follow = function (path,index=0,patrol=false) {
            //--    follows the given path
            //--    returns index of current path element
            //--    returns -1 if path complete
            //--    returns -2 if error
            //--
            //--    path:
            //--        List of Objects where first Object is first element
            //--        of path and final destination is last element of path.
            //--
            //--    path Object:
            //--        target = [x-position, y-position] OR Sprite,
            //--        seek_speed,
            //--        seek_accel,
            //--        arrive_max_speed,
            //--        arrive_min_speed,
            //--        arrive_radius,
            //--        buffer_radius,
            //--        halt=true,
            //--        skip_arrival,
            //--        round_places (default = 0)
            //--
            //--    skip_arrival allows for unit to skip arriving at the target
            //--    and instead just start seeking to the next target
            //--
            
            // edge case (null or empty)
            if (!path || !path.length) {
                
                // bad path
                console.log("Warning: path is null or empty.");
                return -2;
            }
            
            // edge case (index doesn't exist)
            if (!path[index]) {
                
                // restart path if patrol
                if (patrol)
                    return 0;
                
                // else, path finished
                return -1;
            }
            
            // simplify some stuff
            var curr = path[index];
            var rounding = curr.round_places;
            if (!rounding) rounding = 0;
            
            // start moving if stopped
            if (!unit.get_speed())
                unit.set_speed(curr.seek_accel);
            
            // arrive at current path node
            var arrive_state = unit.arrive(curr.target,curr.arrive_max_speed,curr.arrive_min_speed,
                                           curr.arrive_radius,curr.buffer_radius,
                                           curr.halt,rounding);
            
            // if not in arrive radius
            if (arrive_state == 0) {
                
                // seek target
                unit.seek(curr.target,curr.seek_speed,curr.seek_accel);
            }
            
            // if in arrived radius but not arrived
            else if (arrive_state == 1) {
                
                // if we want to skip this arrival
                if (curr.skip_arrival) {
                    
                    // next index
                    index++;
                }
            }
            
            // if arrived
            else if (arrive_state == 2) {
                
                // next index
                index++;
            }
            
            // return sought after target
            return index;
        }
        
        unit.separate = function (targets,crowd_radius,speed,accel,halt_not_found=true) {
            //--    separates a distance away from nearby targets
            //--    returns 0 if error
            //--    returns 1 if no target in crowd_radius
            //--    returns 2 if separating from 1 or more target
            //--
            
            // edge case
            if (!targets.length) {
                console.log("Warning: no targets!");
                return 0;
            }
            
            var opposites = [];
            
            var unit_center = unit.get_center();
            
            // determine angle by analyzing all nearby
            for (var i in targets) {
                
                // determine target
                var target = [];
                if (!Nickel.UTILITY.is_array(targets[i])) {
                    target = targets[i].get_center();
                }
                
                // if nearby
                if (Pathfinder.distance_to(unit_center,target) <= crowd_radius) {
                    
                    // get my center
                    var cx = unit.get_cx();
                    var cy = unit.get_cy();
                    
                    // compute an opposite vector
                    opposite = [cx + (cx-target[0]), cy + (cy-target[1])];
                    
                    // add it
                    opposites.push(opposite);
                }
            }
            
            // no targets close enough
            if (!opposites.length) {
                
                // slowly halt if specified
                if (halt_not_found)
                    unit.ease_to_speed(0,accel);
                
                return 1;
            }
            
            // average out opposite vectors
            net_opposite = [0,0];
            for (var i in opposites) {
                net_opposite[0] += opposites[i][0];
                net_opposite[1] += opposites[i][1];
            }
            net_opposite[0] /= opposites.length;
            net_opposite[1] /= opposites.length;
            
            // seek away from crowd 
            unit.seek(net_opposite,speed,accel);
            return 2;
        }
        
        unit.cohere = function (targets,crowd_radius,reach_radius,speed,accel,halt_not_found=true) {
            //--    coheres a distance towards nearby sprites
            //--    returns 0 if error
            //--    returns 1 if no target in crowd_radius
            //--    returns 2 if cohering with 1 or more target
            //--
            
            // edge case
            if (!targets.length) {
                console.log("Warning: no targets!");
                return 0;
            }
            
            var headings = [];
            
            var unit_center = unit.get_center();
            
            // determine angle by analyzing all nearby
            for (var i in targets) {
                
                // determine target
                var target = [];
                if (!Nickel.UTILITY.is_array(targets[i])) {
                    target = targets[i].get_center();
                }
                
                // if nearby
                if (Pathfinder.distance_to(unit_center,target) <= crowd_radius) {
                    
                    // add target position
                    headings.push(target);
                }
            }
            
            // no targets close enough
            if (!headings.length) {
                
                // slowly halt if specified
                if (halt_not_found)
                    unit.ease_to_speed(0,accel);
                
                return 1;
            }
            
            // average out heading vectors
            net_heading = [0,0];
            for (var i in headings) {
                net_heading[0] += headings[i][0];
                net_heading[1] += headings[i][1];
            }
            net_heading[0] /= headings.length;
            net_heading[1] /= headings.length;
            
            // if surpassed reach radius
            if (reach_radius && Pathfinder.distance_to(unit_center,net_heading) <= reach_radius) {
            
                // indicate reach radius reached
                return 3;
            
            // if not surpassed reach radius (but within crowd radius)
            } else {
                
                // seek center of crowd
                unit.seek(net_heading,speed,accel);
                return 2;
            }
        }
        
        unit.align = function (targets,align_radius,match_speed=false,accel=0) {
            //--    aligns rotation and direction with nearby sprites
            //--    returns 0 if error
            //--    returns 1 if no target in align_radius
            //--    returns 2 if turning/altering speed to align
            //--
            
            // edge case
            if (!targets.length) {
                console.log("Warning: no targets!");
                return 0;
            }
            
            var rotations = [];
            var speeds = [];
            
            var unit_center = unit.get_center();
            
            // determine angle by analyzing all nearby
            for (var i in targets) {
                
                // target must be a sprite
                var target_angle = targets[i].get_rot();
                
                // if nearby
                if (Pathfinder.distance_to(unit_center,targets[i].get_center()) <= align_radius) {
                    
                    // add target position (0 to 359)
                    rotations.push( Nickel.UTILITY.trim_angle(target_angle) );
                    
                    // add speed if specified
                    if (match_speed)
                        speeds.push(targets[i].get_speed());
                }
            }
            
            // no targets close enough
            if (!rotations.length) {
                return 1;
            }
            
            // average out angles
            var net_rot = 0;
            for (var i in rotations) {
                net_rot += rotations[i];
            }
            net_rot /= rotations.length;
            
            // set turn without controlling destination
            unit.turn(net_rot,false,false);
            
            // ease to net speed if specified
            if (match_speed) {
                
                // average out speeds
                net_spd = 0;
                for (var i in speeds) {
                    net_spd += speeds[i];
                }
                net_spd /= speeds.length;
                
                // ease
                unit.ease_to_speed(net_spd,accel);
            }
                
            // unit is aligning...
            return 2;
        }
    }
}//end locomotive builder

