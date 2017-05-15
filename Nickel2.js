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

    GridFactory.createGrid(this, grid_data);
}



////////////////////////////////////////////
///   TILE   ///////////////////////////////
////////////////////////////////////////////
function Tile(tile_data) {

    scene = tile_data.scene;
    img   = tile_data.img_data;

    var tile = new Sprite(scene, img);
    TileFactory.createTile(tile, tile_data);

    // inherits Sprite
    return tile;
}



// --
// ------- FACTORIES -----------------------------------------
// --



////////////////////////////////////////////
///   GRID FACTORY   ///////////////////////
////////////////////////////////////////////
var GridFactory = {

    createGrid : function(grid, grid_data) {

        //extract data
        var scene   = grid_data.scene;
        var matrix  = grid_data.matrix;
        var types   = grid_data.types;
        var bg_data = grid_data.bg_data;
        var tdata   = grid_data.scroll_data;
        var rdata   = grid_data.rotation_data;
        var sdata   = grid_data.zoom_data;

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
            tdata.bounds.left   /= scale;
            tdata.bounds.right  /= scale;
            tdata.bounds.top    /= scale;
            tdata.bounds.bottom /= scale;

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

        grid.update_transformations = function() {

            // simplify vars
            var buffer = tdata.buffer;
            var w   = grid.scene.get_w();
            var h   = grid.scene.get_h();
            var gcx = grid.bbox.get_cx();
            var gcy = grid.bbox.get_cy();
            var mx  = grid.scene.mouse_x;
            var my  = grid.scene.mouse_y;
            var rox = 0;
            var roy = 0;

            // translation
            if (mx > w-buffer) {
                grid.translate(-tdata.speed,0);
            }
            if (mx < buffer) {
                grid.translate(tdata.speed,0);
            }
            if (my > h-buffer) {
                grid.translate(0,-tdata.speed);
            }
            if (my < buffer) {
                grid.translate(0,tdata.speed);
            }

            // rotation
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

            // scale
            if (grid.scene.wheel_impulse != 0) {
                var scale  = (grid.scene.wheel_impulse / 1000 * sdata.speed) + 1;
                var origin = [grid.scene.mouse_x, grid.scene.mouse_y];
                grid.scale(scale, origin);
                grid.scene.wheel_impulse = 0;
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
        }

    }//end create grid

}//end grid factory



////////////////////////////////////////////
///   TILE FACTORY   ///////////////////////
////////////////////////////////////////////
var TileFactory = {

    createTile : function(tile, tile_data) {

        tile.types = tile_data.types;
        tile.bound = function() {/* Continue */};

        return tile;
    }

}
