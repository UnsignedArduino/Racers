namespace SpriteKind {
    export const Checkpoint = SpriteKind.create()
}
function debug_move_camera_with_directions () {
    debug_cam = sprites.create(assets.image`pink_block`, SpriteKind.Player)
    debug_cam.setFlag(SpriteFlag.GhostThroughSprites, true)
    debug_cam.setFlag(SpriteFlag.GhostThroughTiles, true)
    controller.moveSprite(debug_cam, 200, 200)
    scene.cameraFollowSprite(debug_cam)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    move_car(sprite_player, 0, car_accel)
})
function debug_reveal_checkpoints () {
    for (let sprite of sprites.allOfKind(SpriteKind.Checkpoint)) {
        sprite.setFlag(SpriteFlag.Invisible, false)
    }
}
function define_animations () {
    car_images = [[
    assets.animation`red_car_up`,
    assets.animation`red_car_right`,
    assets.animation`red_car_down`,
    assets.animation`red_car_left`
    ]]
}
function define_maps () {
    maps = [tilemap`classic_loop_map`]
    maps_checkpoints_needed = [3]
    maps_starting_tile = [assets.tile`start_right`]
    maps_driving_tiles = [tilemap`classic_loop_map_driving_tiles`]
    maps_slow_tiles = [tilemap`classic_loop_map_slow_tiles`]
    maps_wall_tiles = [tilemap`classic_loop_map_wall_tiles`]
    maps_names = ["Classic loop"]
    maps_flower_seeds = [645]
    maps_background_color = [images.colorBlock(7)]
}
function get_overlapping_sprites (target: Sprite, kind: number) {
    local_sprites = []
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            local_sprites.push(sprite)
        }
    }
    return local_sprites
}
function prepare_map (map_select: number) {
    tiles.setCurrentTilemap(maps[map_select])
    map_driving_tiles = get_all_tiles_in_tilemap([maps_driving_tiles[map_select]])
    map_checkpoints_needed = maps_checkpoints_needed[map_select]
    map_starting_tile = maps_starting_tile[map_select]
    map_slow_tiles = get_all_tiles_in_tilemap([maps_slow_tiles[map_select]])
    map_wall_tiles = get_all_tiles_in_tilemap([maps_wall_tiles[map_select]])
    map_name = maps_names[map_select]
    scene.setBackgroundColor(maps_background_color[map_select])
    if (maps_flower_seeds[map_select] != -1) {
        rng_flower = Random.createRNG(maps_flower_seeds[map_select])
        for (let index = 0; index < tiles.getTilesByType(assets.tile`grass`).length / 6; index++) {
            for (let tile of [sprites.castle.tileGrass1, sprites.castle.tileGrass3, sprites.castle.tileGrass2]) {
                tiles.setTileAt(rng_flower.randomElement(tiles.getTilesByType(assets.tile`grass`)), tile)
            }
        }
    }
    for (let tile of map_wall_tiles) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
    for (let location of tiles.getTilesByType(assets.tile`checkpoint_tile`)) {
        sprite_checkpoint = sprites.create(assets.image`checkpoint_sprite`, SpriteKind.Checkpoint)
        sprite_checkpoint.setFlag(SpriteFlag.Invisible, true)
        sprite_checkpoint.setFlag(SpriteFlag.GhostThroughTiles, true)
        sprite_checkpoint.setFlag(SpriteFlag.GhostThroughWalls, true)
        tiles.placeOnTile(sprite_checkpoint, location)
        tiles.setTileAt(location, map_driving_tiles[0])
    }
}
function update_car_friction (car: Sprite, drive_frict: number, slow_frict: number) {
    if (spriteutils.isDestroyed(car)) {
        return
    }
    for (let tile of map_driving_tiles) {
        if (car.tileKindAt(TileDirection.Center, tile)) {
            car.fx = drive_frict
            car.fy = car.fx
            return
        }
    }
    for (let tile of map_slow_tiles) {
        if (car.tileKindAt(TileDirection.Center, tile)) {
            car.fx = slow_frict
            car.fy = car.fx
            return
        }
    }
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    move_car(sprite_player, 2, 0)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    move_car(sprite_player, 3, car_accel)
})
function move_car (car: Sprite, dir: number, accel: number) {
    if (spriteutils.isDestroyed(car)) {
        return
    }
    if (dir == 0) {
        car.ay = accel * -1
    } else if (dir == 1) {
        car.ax = accel
    } else if (dir == 2) {
        car.ay = accel
    } else {
        car.ax = accel * -1
    }
}
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    move_car(sprite_player, 1, 0)
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    move_car(sprite_player, 3, 0)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    move_car(sprite_player, 1, car_accel)
})
function prepare_bot (skin: number) {
    prepare_car(skin)
}
function prepare_car (skin: number) {
    sprite_car = sprites.create(car_images[skin][0][0], SpriteKind.Player)
    characterAnimations.loopFrames(
    sprite_car,
    car_images[skin][0],
    100,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    sprite_car,
    [car_images[skin][0][0]],
    100,
    characterAnimations.rule(Predicate.FacingUp, Predicate.NotMoving)
    )
    characterAnimations.loopFrames(
    sprite_car,
    car_images[skin][1],
    100,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    sprite_car,
    [car_images[skin][1][0]],
    100,
    characterAnimations.rule(Predicate.FacingRight, Predicate.NotMoving)
    )
    characterAnimations.loopFrames(
    sprite_car,
    car_images[skin][2],
    100,
    characterAnimations.rule(Predicate.MovingDown)
    )
    characterAnimations.loopFrames(
    sprite_car,
    [car_images[skin][2][0]],
    100,
    characterAnimations.rule(Predicate.FacingDown, Predicate.NotMoving)
    )
    characterAnimations.loopFrames(
    sprite_car,
    car_images[skin][3],
    100,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    sprite_car,
    [car_images[skin][3][0]],
    100,
    characterAnimations.rule(Predicate.FacingLeft, Predicate.NotMoving)
    )
    while (true) {
        tiles.placeOnRandomTile(sprite_car, map_starting_tile)
        if (get_overlapping_sprites(sprite_car, SpriteKind.Player).length == 0) {
            break;
        }
    }
    sprites.setDataNumber(sprite_car, "lap", 0)
    sprites.setDataNumber(sprite_car, "checkpoints_got", 0)
    return sprite_car
}
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    move_car(sprite_player, 0, 0)
})
function get_all_tiles_in_tilemap (tilemap_in_array: any[]) {
    local_all_tiles = []
    local_last_tilemap = tileUtil.currentTilemap()
    tiles.setCurrentTilemap(tilemap_in_array[0])
    for (let y = 0; y <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Rows); y++) {
        for (let x = 0; x <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns); x++) {
            if (local_all_tiles.indexOf(tiles.tileImageAtLocation(tiles.getTileLocation(x, y))) == -1) {
                local_all_tiles.push(tiles.tileImageAtLocation(tiles.getTileLocation(x, y)))
            }
        }
    }
    tiles.setCurrentTilemap(local_last_tilemap)
    local_all_tiles.pop()
    return local_all_tiles
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    move_car(sprite_player, 2, car_accel)
})
function debug_place_tiles_in_top_right (tiles2: any[]) {
    for (let x = 0; x <= tiles2.length - 1; x++) {
        tiles.setTileAt(tiles.getTileLocation(x, 0), tiles2[x])
    }
}
function prepare_player (skin: number) {
    sprite_player = prepare_car(skin)
    scene.cameraFollowSprite(sprite_player)
}
let local_last_tilemap: tiles.TileMapData = null
let local_all_tiles: Image[] = []
let sprite_car: Sprite = null
let sprite_checkpoint: Sprite = null
let rng_flower: FastRandomBlocks = null
let map_name = ""
let map_wall_tiles: Image[] = []
let map_slow_tiles: Image[] = []
let map_starting_tile: Image = null
let map_checkpoints_needed = 0
let map_driving_tiles: Image[] = []
let local_sprites: Sprite[] = []
let maps_background_color: number[] = []
let maps_flower_seeds: number[] = []
let maps_names: string[] = []
let maps_wall_tiles: tiles.TileMapData[] = []
let maps_slow_tiles: tiles.TileMapData[] = []
let maps_driving_tiles: tiles.TileMapData[] = []
let maps_starting_tile: Image[] = []
let maps_checkpoints_needed: number[] = []
let maps: tiles.TileMapData[] = []
let car_images: Image[][][] = []
let sprite_player: Sprite = null
let debug_cam: Sprite = null
let car_accel = 0
stats.turnStats(true)
car_accel = 100
let laps = 3
let car_drive_frict = 1000
let car_slow_frict = 2000
define_maps()
define_animations()
prepare_map(0)
prepare_player(0)
for (let index = 0; index < 8; index++) {
    prepare_bot(0)
}
debug_reveal_checkpoints()
game.onUpdate(function () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        update_car_friction(sprite, car_drive_frict, car_slow_frict)
    }
})
