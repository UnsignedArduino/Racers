namespace SpriteKind {
    export const Checkpoint = SpriteKind.create()
}
function debug_move_camera_with_directions () {
    debug_cam = sprites.create(assets.image`pink_block`, SpriteKind.Player)
    debug_cam.setFlag(SpriteFlag.Ghost, true)
    controller.moveSprite(debug_cam, 500, 500)
    scene.cameraFollowSprite(debug_cam)
    spriteutils.placeAngleFrom(
    debug_cam,
    0,
    0,
    sprite_player
    )
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Checkpoint, function (sprite, otherSprite) {
    if (in_game) {
        if (sprites.readDataNumber(sprite, "checkpoints_got") == sprites.readDataNumber(otherSprite, "checkpoint")) {
            sprites.setDataNumber(sprite, "checkpoints_got", (sprites.readDataNumber(sprite, "checkpoints_got") + 1) % map_checkpoints_needed)
            sprite.sayText(sprites.readDataNumber(sprite, "checkpoints_got"))
            sprites.setDataSprite(sprite, "target_checkpoint", null)
        }
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_car(sprite_player, 0, car_accel)
    }
})
function debug_reveal_checkpoints () {
    for (let sprite of sprites.allOfKind(SpriteKind.Checkpoint)) {
        sprite.setFlag(SpriteFlag.Invisible, false)
        sprite.sayText("" + (sprites.readDataNumber(sprite, "checkpoint") + 1) + "/" + map_checkpoints_needed)
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
    maps_checkpoints_needed = [4]
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
    all_checkpoint_tiles = [
    assets.tile`checkpoint_1_tile1`,
    assets.tile`checkpoint_2_tile`,
    assets.tile`checkpoint_3_tile`,
    assets.tile`checkpoint_4_tile`
    ]
    all_checkpoints = []
    for (let index = 0; index <= map_checkpoints_needed - 1; index++) {
        these_checkpoints = []
        for (let location of tiles.getTilesByType(all_checkpoint_tiles[index])) {
            sprite_checkpoint = sprites.create(assets.image`checkpoint_sprite`, SpriteKind.Checkpoint)
            sprite_checkpoint.setFlag(SpriteFlag.Invisible, true)
            sprite_checkpoint.setFlag(SpriteFlag.GhostThroughTiles, true)
            sprite_checkpoint.setFlag(SpriteFlag.GhostThroughWalls, true)
            sprites.setDataNumber(sprite_checkpoint, "checkpoint", index)
            tiles.placeOnTile(sprite_checkpoint, location)
            tiles.setTileAt(location, map_driving_tiles[0])
            these_checkpoints.push(sprite_checkpoint)
        }
        all_checkpoints.push(these_checkpoints)
    }
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (in_game) {
        move_car(sprite_player, 2, 0)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_car(sprite_player, 3, car_accel)
    }
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
    if (in_game) {
        move_car(sprite_player, 1, 0)
    }
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (in_game) {
        move_car(sprite_player, 3, 0)
    }
})
function start_race () {
    in_game = true
    refresh_following()
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (in_game) {
        move_car(sprite_player, 1, car_accel)
    }
})
function prepare_bot (skin: number) {
    sprite_bot = prepare_car(skin)
    sprites.setDataBoolean(sprite_bot, "bot", true)
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
    if (in_game) {
        move_car(sprite_player, 0, 0)
    }
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
    if (in_game) {
        move_car(sprite_player, 2, car_accel)
    }
})
function refresh_following () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        if (!(sprites.readDataBoolean(sprite, "bot"))) {
            continue;
        }
        if (spriteutils.isDestroyed(sprites.readDataSprite(sprite, "target_checkpoint"))) {
            local_closest_checkpoint = all_checkpoints[sprites.readDataNumber(sprite, "checkpoints_got")][0]
            for (let sprite_checkpoint of all_checkpoints[sprites.readDataNumber(sprite, "checkpoints_got")]) {
                if (spriteutils.distanceBetween(sprite, sprite_checkpoint) < spriteutils.distanceBetween(sprite, local_closest_checkpoint)) {
                    local_closest_checkpoint = sprite_checkpoint
                }
            }
            sprites.setDataSprite(sprite, "target_checkpoint", local_closest_checkpoint)
        }
        local_last_vx = sprite.vx
        local_last_vy = sprite.vy
        spriteutils.setVelocityAtAngle(sprite, spriteutils.angleFrom(sprite, sprites.readDataSprite(sprite, "target_checkpoint")), car_accel)
        sprite.ax = sprite.vx * 1
        sprite.ay = sprite.vy * 1
        sprite.setVelocity(local_last_vx, local_last_vy)
    }
}
function debug_place_tiles_in_top_right (tiles2: any[]) {
    for (let x = 0; x <= tiles2.length - 1; x++) {
        tiles.setTileAt(tiles.getTileLocation(x, 0), tiles2[x])
    }
}
function debug_show_car_physics () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        sprite.setFlag(SpriteFlag.ShowPhysics, true)
    }
}
function prepare_player (skin: number) {
    sprite_player = prepare_car(skin)
    scene.cameraFollowSprite(sprite_player)
    sprites.setDataBoolean(sprite_player, "bot", false)
}
function update_car_physics (car: Sprite, drive_frict: number, slow_frict: number, drive_max_velo: number, slow_max_velo: number) {
    for (let tile of map_driving_tiles) {
        if (car.tileKindAt(TileDirection.Center, tile)) {
            car.fx = drive_frict
            car.fy = car.fx
            car.vx = Math.min(car.vx, drive_max_velo)
            car.vy = Math.min(car.vy, drive_max_velo)
            return
        }
    }
    for (let tile of map_slow_tiles) {
        if (car.tileKindAt(TileDirection.Center, tile)) {
            car.fx = slow_frict
            car.fy = car.fx
            car.vx = Math.min(car.vx, slow_max_velo)
            car.vy = Math.min(car.vy, slow_max_velo)
            return
        }
    }
}
let local_last_vy = 0
let local_last_vx = 0
let local_closest_checkpoint: Sprite = null
let local_last_tilemap: tiles.TileMapData = null
let local_all_tiles: Image[] = []
let sprite_car: Sprite = null
let sprite_bot: Sprite = null
let sprite_checkpoint: Sprite = null
let these_checkpoints: Sprite[] = []
let all_checkpoints: Sprite[][] = []
let all_checkpoint_tiles: Image[] = []
let rng_flower: FastRandomBlocks = null
let map_name = ""
let map_wall_tiles: Image[] = []
let map_slow_tiles: Image[] = []
let map_starting_tile: Image = null
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
let map_checkpoints_needed = 0
let sprite_player: Sprite = null
let debug_cam: Sprite = null
let in_game = false
let car_accel = 0
stats.turnStats(false)
car_accel = 100
let car_drive_max_velo = 150
let car_drive_frict = 500
let car_slow_max_velo = 75
let car_slow_frict = 1000
let laps = 3
in_game = false
define_maps()
define_animations()
prepare_map(0)
prepare_player(0)
for (let index = 0; index < 8; index++) {
    prepare_bot(0)
}
start_race()
debug_reveal_checkpoints()
debug_show_car_physics()
game.onUpdate(function () {
    if (in_game) {
        for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
            update_car_physics(sprite, car_drive_frict, car_slow_frict, car_drive_max_velo, car_slow_max_velo)
        }
        refresh_following()
    }
})
