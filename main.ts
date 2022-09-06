function define_maps () {
    maps = [tilemap`classic_loop_map`]
    driving_tiles = [tilemap`classic_loop_map_driving_tiles`]
    slow_tiles = [tilemap`classic_loop_map_slow_tiles`]
    wall_tiles = [tilemap`classic_loop_map_wall_tiles`]
    map_names = ["Classic loop"]
    flower_seeds = [645]
}
let flower_seeds: number[] = []
let map_names: string[] = []
let wall_tiles: tiles.TileMapData[] = []
let slow_tiles: tiles.TileMapData[] = []
let driving_tiles: tiles.TileMapData[] = []
let maps: tiles.TileMapData[] = []
define_maps()
