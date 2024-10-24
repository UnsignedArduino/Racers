namespace SpriteKind {
    export const Checkpoint = SpriteKind.create()
    export const MiniMap = SpriteKind.create()
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
function label_pop_away_up (s: Sprite) {
    s.setFlag(SpriteFlag.AutoDestroy, true)
    s.ay = -500
    s.vy = -100
    s.lifespan = 3000
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Checkpoint, function (sprite, otherSprite) {
    if (in_game) {
        if (sprites.readDataNumber(sprite, "checkpoints_got") == sprites.readDataNumber(otherSprite, "checkpoint")) {
            sprites.setDataNumber(sprite, "last_checkpoint", sprites.readDataNumber(sprite, "checkpoints_got"))
            sprites.setDataNumber(sprite, "checkpoints_got", (sprites.readDataNumber(sprite, "checkpoints_got") + 1) % map_checkpoints_needed)
            sprites.setDataSprite(sprite, "target_checkpoint", null)
        }
    }
})
// https://github.com/riknoll/arcade-sprite-events/issues/2
events.tileEvent(SpriteKind.Player, assets.tile`checkerflag`, events.TileEvent.StartOverlapping, function (sprite) {
	
})
function full_screen_menu_pop_away_down (s: Sprite) {
    s.setFlag(SpriteFlag.AutoDestroy, true)
    s.ay = 1000
    s.vy = 200
    s.lifespan = 3000
}
function debug_checkpoints_gotten () {
    show_checkpoints_gotten = true
}
function title_pop_in_sprite_left (s: Sprite) {
    s.right = 0
    s.ax = 1000
    s.vx = 200
    timer.background(function () {
        while (s.left < 4) {
            pause(0)
        }
        s.ax = 0
        s.vx = 0
        s.left = 4
    })
}
function debug_reveal_checkpoints () {
    for (let sprite of sprites.allOfKind(SpriteKind.Checkpoint)) {
        sprite.setFlag(SpriteFlag.Invisible, false)
        sprite.sayText("" + (sprites.readDataNumber(sprite, "checkpoint") + 1) + "/" + map_checkpoints_needed)
    }
}
function define_animations () {
    car_images = [
    [
    assets.animation`red_car_up`,
    assets.animation`red_car_right`,
    assets.animation`red_car_down`,
    assets.animation`red_car_left`
    ],
    [
    assets.animation`blue_car_up`,
    assets.animation`blue_car_right`,
    assets.animation`blue_car_down`,
    assets.animation`blue_car_left`
    ],
    [
    assets.animation`pink_car_up`,
    assets.animation`pink_car_right`,
    assets.animation`pink_car_down`,
    assets.animation`pink_car_left`
    ],
    [
    assets.animation`green_car_up`,
    assets.animation`green_car_right`,
    assets.animation`green_car_down`,
    assets.animation`green_car_left`
    ],
    [
    [img`
        . . . . . . 4 4 c c 4 4 . . . . 
        . . . . . 4 5 5 5 5 5 5 4 . . . 
        . . . . 5 c 5 5 5 5 5 5 c 5 . . 
        . . . 4 5 c 1 5 5 5 5 5 c 5 4 . 
        . . . f 5 5 1 5 5 5 5 5 c 5 f . 
        . . . f 5 5 1 5 5 5 5 5 5 5 f . 
        . . . f 5 5 1 5 5 5 5 5 5 5 f . 
        . . . f 5 c 5 5 5 5 5 5 c 5 f . 
        . . . 4 5 c 4 c c c c 4 c 5 4 . 
        . . . 4 5 4 c b b b b c 4 5 4 . 
        . . . 4 5 4 b b b b b b 4 5 4 . 
        . . . 4 4 4 4 4 4 4 4 4 4 4 4 . 
        . . . f 4 d 4 4 4 4 4 4 d 4 f . 
        . . . f 4 4 d 4 4 4 4 d 4 4 f . 
        . . . f f 4 4 4 4 4 4 4 4 f f . 
        . . . . f f . . . . . . f f . . 
        `],
    [img`
        . . . . . . . . . . . . . . . . 
        . . . . 5 5 5 5 5 5 5 5 . . . . 
        . . . 5 1 5 5 5 5 5 5 c 5 . . . 
        . . 5 c 1 5 5 5 5 5 5 c c 5 . . 
        . 5 c c 1 1 1 1 1 1 5 c c d 5 d 
        . 5 c 5 4 4 4 4 4 4 4 b c d 5 5 
        . 5 5 4 b b 4 b b b 4 4 b d 5 5 
        . 5 4 b b b 4 b b b b 4 5 5 5 5 
        . 4 4 5 5 5 4 5 5 5 5 5 4 5 5 5 
        . 4 4 4 4 4 4 f 4 4 4 f 4 5 d d 
        . 4 4 4 4 4 4 f 4 4 f 4 4 4 4 d 
        . 4 4 4 4 4 4 f f f 4 4 4 4 4 4 
        . 4 f f f f 4 4 4 4 f f f 4 4 4 
        . . f f f f f 4 4 f f f f f 4 . 
        . . . f f f . . . . f f f f . . 
        . . . . . . . . . . . . . . . . 
        `],
    [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 5 5 5 5 5 5 . . . . 
        . . . . . 5 5 1 1 5 5 5 5 . . . 
        . . . . . c 1 5 5 5 5 5 c . . . 
        . . . . 5 c 1 5 5 5 5 5 c 5 . . 
        . . . 4 5 c 1 5 5 5 5 5 c 5 4 . 
        . . . f 5 c 1 5 5 5 5 5 c 5 f . 
        . . . f 4 c 5 5 5 5 5 5 c 4 f . 
        . . . f 5 c 5 b b b b 5 c 5 f . 
        . . . 4 5 5 b c c c c b 5 5 4 . 
        . . . 4 4 b c c c c c c b 4 4 . 
        . . . f 4 d d d d d d d d 4 f . 
        . . . f 4 d 5 5 5 5 5 5 d 4 f . 
        . . . . 5 d d 5 5 5 5 d d 5 f . 
        . . . . f 5 d 5 5 5 5 d 5 f . . 
        . . . . . 4 5 5 5 5 5 5 4 . . . 
        `],
    [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 5 5 5 5 5 5 5 5 . . 
        . . . . . 5 c 5 5 5 5 5 5 1 5 . 
        . . . . 5 c c 5 5 5 5 5 5 1 c 5 
        . . d 5 d c c 5 1 1 1 1 1 1 c c 
        . d 5 5 d c b 4 4 4 4 4 4 4 5 c 
        . 5 5 5 d b 4 4 b b b 4 b b 4 5 
        . 5 5 5 5 5 4 b b b b 4 b b b 4 
        . 5 5 5 5 4 5 5 5 5 5 4 5 5 5 4 
        . 5 d d 5 4 f 4 4 4 f 4 4 4 4 4 
        . d d 5 4 4 4 f 4 4 f 4 4 4 4 4 
        . 4 4 4 4 4 4 4 f f f 4 4 4 4 4 
        . 4 4 4 4 f f f 4 4 4 4 f f f f 
        . . . 4 f f f f f 4 4 f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `]
    ]
    ]
    car_images_names = [
    "Red",
    "Blue",
    "Pink",
    "Green",
    "Yellow"
    ]
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 0, car_accel)
    }
})
function define_maps () {
    maps = [
    tilemap`classic_loop_map`,
    tilemap`forest_map`,
    tilemap`beach_side_map`,
    tilemap`space_map`,
    tilemap`mountain_map`,
    tilemap`cannonball_cove_map`
    ]
    maps_checkpoints_needed = [
    6,
    10,
    16,
    9,
    13,
    16
    ]
    maps_starting_tile = [
    tilemap`classic_loop_starting_tiles`,
    tilemap`forest_map_starting_tiles`,
    tilemap`beachside_map_starting_tiles`,
    tilemap`space_map_starting_tiles`,
    tilemap`mountain_map_starting_tiles`,
    tilemap`cannonball_cove_starting_tiles`
    ]
    maps_driving_tiles = [
    tilemap`classic_loop_map_driving_tiles`,
    tilemap`forest_map_driving_tiles`,
    tilemap`beachside_map_driving_tiles`,
    tilemap`space_map_driving_tiles`,
    tilemap`mountain_map_driving_tiles`,
    tilemap`cannonball_cove_driving_tiles`
    ]
    maps_slow_tiles = [
    tilemap`classic_loop_map_slow_tiles`,
    tilemap`forest_map_slow_tiles`,
    tilemap`beachside_map_slow_tiles`,
    tilemap`space_map_slow_tiles`,
    tilemap`mountain_map_slow_tiles`,
    tilemap`cannonball_cove_slow_tiles`
    ]
    maps_wall_tiles = [
    tilemap`classic_loop_map_wall_tiles`,
    tilemap`forest_map_wall_tiles`,
    tilemap`beachside_map_wall_tiles`,
    tilemap`space_map_wall_tiles`,
    tilemap`mountain_map_wall_tiles`,
    tilemap`cannonball_cove_wall_tiles`
    ]
    maps_names = [
    "Classic loop",
    "Forest",
    "Ocean",
    "Star",
    "Mountain - by Lucas_M",
    "Cannonball Cove - by Lucas_M"
    ]
    maps_flower_seeds = [
    645,
    165,
    321,
    -281,
    0,
    0
    ]
    maps_background_color = [
    images.colorBlock(7),
    images.colorBlock(7),
    images.colorBlock(7),
    images.colorBlock(15),
    images.colorBlock(7),
    images.colorBlock(7)
    ]
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
    LoadingAnimations.show_loading(100)
    LoadingAnimations.set_loading_value(LoadingAnimations.LoadingValue.Minimum, 0)
    LoadingAnimations.set_loading_value(LoadingAnimations.LoadingValue.Current, 0)
    LoadingAnimations.set_loading_value(LoadingAnimations.LoadingValue.Maximum, 8)
    fade_out(false, true)
    pause(1000)
    tiles.setCurrentTilemap(tileUtil.cloneMap(maps[map_select]))
    map_driving_tiles = get_all_tiles_in_tilemap([maps_driving_tiles[map_select]])
    increment_loader()
    map_checkpoints_needed = maps_checkpoints_needed[map_select]
    map_starting_tiles = get_all_tiles_in_tilemap([maps_starting_tile[map_select]])
    increment_loader()
    map_slow_tiles = get_all_tiles_in_tilemap([maps_slow_tiles[map_select]])
    increment_loader()
    map_wall_tiles = get_all_tiles_in_tilemap([maps_wall_tiles[map_select]])
    increment_loader()
    map_name = maps_names[map_select]
    scene.setBackgroundColor(maps_background_color[map_select])
    increment_loader()
    if (maps_flower_seeds[map_select] > 0) {
        rng_decoration = Random.createRNG(maps_flower_seeds[map_select])
        for (let index = 0; index < tiles.getTilesByType(assets.tile`grass`).length / 6; index++) {
            for (let tile of [sprites.castle.tileGrass1, sprites.castle.tileGrass3, sprites.castle.tileGrass2]) {
                tiles.setTileAt(rng_decoration.randomElement(tiles.getTilesByType(assets.tile`grass`)), tile)
                pause(0)
            }
        }
    } else if (maps_flower_seeds[map_select] < 0) {
        rng_decoration = Random.createRNG(Math.abs(maps_flower_seeds[map_select]))
        all_black_tiles = tiles.getTilesByType(sprites.builtin.forestTiles10)
        for (let index = 0; index < all_black_tiles.length / 6; index++) {
            for (let tile of [
            assets.tile`night_star_2`,
            assets.tile`night_star_1`,
            assets.tile`night_star_0`,
            assets.tile`night_star_4`
            ]) {
                tiles.setTileAt(rng_decoration.randomElement(all_black_tiles), tile)
            }
        }
    }
    increment_loader()
    for (let tile of map_wall_tiles) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
    increment_loader()
    all_checkpoint_tiles = [
    assets.tile`checkpoint_1_tile1`,
    assets.tile`checkpoint_2_tile`,
    assets.tile`checkpoint_3_tile`,
    assets.tile`checkpoint_4_tile`,
    assets.tile`checkpoint_5_tile0`,
    assets.tile`checkpoint_6_tile`,
    assets.tile`checkpoint_7_tile`,
    assets.tile`checkpoint_8_tile`,
    assets.tile`checkpoint_9_tile`,
    assets.tile`checkpoint_10_tile`,
    assets.tile`checkpoint_11_tile1`,
    assets.tile`checkpoint_12_tile`,
    assets.tile`checkpoint_13_tile0`,
    assets.tile`checkpoint_14_tile0`,
    assets.tile`checkpoint_15_tile0`,
    assets.tile`checkpoint_16_tile`
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
            pause(0)
        }
        all_checkpoints.push(these_checkpoints)
    }
    finished_cars = []
    increment_loader()
    pause(1000)
    fade_in(true, true)
    LoadingAnimations.hide_loading()
}
function wait_for_a_button_press () {
    while (!(controller.A.isPressed())) {
        pause(0)
    }
}
function title_pop_away_sprite_left (s: Sprite) {
    s.setFlag(SpriteFlag.AutoDestroy, true)
    s.ax = -1000
    s.vx = -200
    s.lifespan = 1000
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 2, 0)
    }
})
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 1, car_accel)
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
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 1, 0)
    }
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 3, 0)
    }
})
function fade_out (block: boolean, delay: boolean) {
    if (delay) {
        color.startFade(color.Black, color.originalPalette, 2000)
        if (block) {
            color.pauseUntilFadeDone()
        }
    } else {
        color.setPalette(
        color.originalPalette
        )
    }
}
function label_pop_in_down (s: Sprite) {
    s.bottom = 0
    s.ay = 500
    s.vy = 100
    timer.background(function () {
        while (s.top < 12) {
            pause(0)
        }
        s.ay = 0
        s.vy = 0
        s.top = 12
    })
}
function fade_in (block: boolean, delay: boolean) {
    if (delay) {
        color.startFade(color.originalPalette, color.Black, 2000)
        if (block) {
            color.pauseUntilFadeDone()
        }
    } else {
        color.setPalette(
        color.Black
        )
    }
}
function define_settings () {
    if (!(blockSettings.exists("user_skin"))) {
        blockSettings.writeNumber("user_skin", 0)
    }
}
function start_race () {
    in_game = true
    refresh_following()
}
function wait_for_a_button_release () {
    while (controller.A.isPressed()) {
        pause(0)
    }
}
function define_menu_styles () {
    menu_start = miniMenu.createMenuFromArray([])
    menu_start.setMenuStyleProperty(miniMenu.MenuStyleProperty.Border, 1)
    menu_start.setMenuStyleProperty(miniMenu.MenuStyleProperty.BorderColor, images.colorBlock(15))
    menu_start.setMenuStyleProperty(miniMenu.MenuStyleProperty.BackgroundColor, images.colorBlock(1))
    menu_start.setMenuStyleProperty(miniMenu.MenuStyleProperty.UseAsTemplate, 1)
    menu_start.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, images.colorBlock(1))
    menu_start.setStyleProperty(miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, images.colorBlock(15))
    menu_start.close()
}
function update_minimap () {
    if (show_minimap) {
        minimap2 = minimap.minimap(MinimapScale.Sixteenth, 1, 15)
        for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
            minimap.includeSprite(minimap2, sprite, MinimapSpriteScale.Quadruple)
        }
        if (spriteutils.isDestroyed(sprite_minimap)) {
            sprite_minimap = sprites.create(minimap.getImage(minimap2), SpriteKind.MiniMap)
            sprite_minimap.setFlag(SpriteFlag.Ghost, true)
            sprite_minimap.setFlag(SpriteFlag.RelativeToCamera, true)
            sprite_minimap.left = 4
            sprite_minimap.bottom = scene.screenHeight() - 4
            sprite_minimap.setScale(0.5, ScaleAnchor.BottomLeft)
        } else {
            sprite_minimap.setImage(minimap.getImage(minimap2))
        }
    } else {
        if (!(spriteutils.isDestroyed(sprite_minimap))) {
            sprite_minimap.destroy()
        }
    }
}
function make_title_menu (title: string, options: any[], can_exit: boolean) {
    if (!(spriteutils.isDestroyed(menu_start))) {
        title_pop_away_sprite_left(menu_start)
    }
    menu_start = miniMenu.createMenuFromArray(options)
    if (title.length > 0) {
        menu_start.setTitle(title)
    }
    menu_start.setDimensions(sprite_title.width, scene.screenHeight() - 12 - sprite_title.height)
    if (options.length > 6) {
        menu_start.setMenuStyleProperty(miniMenu.MenuStyleProperty.ScrollIndicatorColor, images.colorBlock(15))
    }
    if (can_exit) {
        menu_start.onButtonPressed(controller.B, function (selection, selectedIndex) {
            music.playTone(262, music.beat(BeatFraction.Sixteenth))
            option_selected = true
        })
    }
    menu_start.setFlag(SpriteFlag.Ghost, true)
    menu_start.setFlag(SpriteFlag.RelativeToCamera, true)
    menu_start.top = sprite_title.bottom + 4
    title_pop_in_sprite_left(menu_start)
    return menu_start
}
function prepare_bot (skin: number, place_on: number) {
    sprite_bot = prepare_car(skin, place_on)
    sprites.setDataBoolean(sprite_bot, "bot", true)
    sprites.setDataString(sprite_bot, "name", bot_names.removeAt(randint(0, bot_names.length - 1)))
    if (!(splash_mode)) {
        sprite_bot.sayText(sprites.readDataString(sprite_bot, "name"))
    }
    return sprite_bot
}
function prepare_car (skin: number, place_on: number) {
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
    tiles.placeOnRandomTile(sprite_car, map_starting_tiles[place_on + 1])
    tileUtil.replaceAllTiles(map_starting_tiles[place_on + 1], map_starting_tiles[0])
    sprites.setDataNumber(sprite_car, "lap", 0)
    sprites.setDataNumber(sprite_car, "last_checkpoint", map_checkpoints_needed - 1)
    sprites.setDataNumber(sprite_car, "checkpoints_got", 0)
    return sprite_car
}
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 0, 0)
    }
})
function increment_loader () {
    LoadingAnimations.change_loading_value(LoadingAnimations.LoadingValue.Current, 1)
    pause(0)
}
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 2, car_accel)
    }
})
function get_all_tiles_in_tilemap (tilemap_in_array: tiles.TileMapData[]) {
    local_all_tiles = []
    local_last_tilemap = tileUtil.currentTilemap()
    tiles.setCurrentTilemap(tilemap_in_array[0])
    for (let y = 0; y <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Rows); y++) {
        for (let x = 0; x <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns); x++) {
            if (local_all_tiles.indexOf(tiles.tileImageAtLocation(tiles.getTileLocation(x, y))) == -1) {
                local_all_tiles.push(tiles.tileImageAtLocation(tiles.getTileLocation(x, y)))
            }
            pause(0)
        }
    }
    tiles.setCurrentTilemap(local_last_tilemap)
    local_all_tiles.pop()
    return local_all_tiles
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (splash_mode) {
        game.showSystemMenu()
    } else if (in_game) {
        timer.background(function () {
            Notification.waitForNotificationFinish()
            Notification.notify("Cannot open system menu right now, go to start menu to change settings!")
        })
    }
})
function wait_for_a_button_press_and_release () {
    wait_for_a_button_press()
    wait_for_a_button_release()
}
// Only works from 0 - 10!
// 
// Used: https://stackoverflow.com/a/15810597/10291933
function make_ordinal (num: number) {
    if (num == 1) {
        return "1st"
    } else if (num == 2) {
        return "2nd"
    } else if (num == 3) {
        return "3rd"
    } else {
        return "" + num + "th"
    }
}
function debug_auto_drive () {
    sprites.setDataBoolean(sprite_player, "bot", true)
}
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
function debug_camera_follow_random_car () {
    sprite = sprites.allOfKind(SpriteKind.Player)._pickRandom()
    scene.cameraFollowSprite(sprite)
    sprite.setFlag(SpriteFlag.ShowPhysics, true)
}
function debug_place_tiles_in_top_right (tiles2: Image[]) {
    for (let x = 0; x <= tiles2.length - 1; x++) {
        tiles.setTileAt(tiles.getTileLocation(x, 0), tiles2[x])
    }
}
function full_screen_menu_pop_in_down (s: Sprite) {
    s.bottom = 0
    s.ay = 1000
    s.vy = 200
    timer.background(function () {
        while (s.top < 4) {
            pause(0)
        }
        s.ay = 0
        s.vy = 0
        s.y = scene.screenHeight() / 2
    })
}
function debug_show_car_physics () {
    for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
        sprite.setFlag(SpriteFlag.ShowPhysics, true)
    }
}
function define_bot_names () {
    // Pulled from: https://forum.makecode.com/u?order=likes_received&period=all 
    // With users with more than 10 likes received as of 9/6/2022 (249 users)
    // 
    // JS code: (used on the page above)
    // 
    // const usernames = document.getElementsByClassName("username bold");
    // let all = "";
    // for (const e of usernames) {
    //     all += e.children[0].innerText;
    //     all += ",";
    // }
    // console.log(all);
    bot_names = "UnsignedArduino,richard,Dreadmask197,GameGod,Kat,Agent_14,jwunderl,livcheerful,DahbixLP,purna079,FlintAsher,AlexK,shakao,E-EnerG-Gamecentral,LCProCODER,omnisImperium,Lucas_M,peli,kwx,Kiwiphoenix364,UnderwaterAstronaut,cosmoscowboy,girlwhocode,Primal_Nexus,S0m3_random_guy,Colethewolf,darzu,jacob_c,MopishCobra75,AqeeAqee,ggiscool,fd268,LaserFoxPro,charliegregg,frank_schmidt,Adri314,ursoalph,mmoskal,MakeCode,CyberPulse,felixtsu,annapurna079,ThunderDrop180,TheJaky,brandodon,personalnote,NxNMatrixGL,theCobolKid,reyhanPanci256,Wanna_be_coder,edubsky,SoftTalker,Taser,GoMustangs,eanders,SCARfazewolf,SPerkins25,Segatendo,gusiscute64,Vidget,jacqueline.russell,Uggie,Purp13,EuJeen,andrew-ski,Bag3l,TZG,XDlol,Opistickz,jedgarpark,Quantum_games,Vegz78,Eden264,demoCrash,Kirito_theblacksword,ymxdj0,CarltonFade,HewwoBug,TakeTheL08,CDarius,Skitter,ractive,ThomasS,PrinceDaBezt123,marioeligi,senorlloyd,shaqattack8,ImaAngryBear,2ndClemens,Unique,shiba-jp,alex812,InvalidProject99,kirbop,Grimm,rymc88,kingcobralasersnakes,Cat10847,ChickenBoy,JRT,Eretick,hasanchik,logic_lab,MrHM,FlyingFox,Younes,timber,portalknight,Nome_muito_criativo,Gideon_loves_cats,hassan,Jabberwock,jvdos,KIKIvsIT,WeCodeMakeCode,kjw,bosnivan,Blobiy,NoValues,Local_momo,JazzyBurrito,Dylsaster,biscuit,gbraad,_nico,EgeoTube,EnteroPositivo,jmods,beepboop,Bill-0-Coding,paul,JustinXue,RarrboiMemes,WoodysWorkshop,cameron,E-EnerG-Gamecentral2,robigu444,codebott578,I_Love_HxH,stulowe80,Darkfeind,Gabriel,Kai,The_pro551,3issa,bsiever,nobita10,Sonicblaston,ChaseMor,Spinecho,Codeboy-Advanced,viny1234,IvanPoon,AussieAlpha,shaoziyang,Satisfaction,thesonicfan192,Rocket_Scion,Camaro,randomuser,drtongue96,SebT,otorp2,Redjay1011,Arielprogamer76,SAO_Me,CoolSwords4,loretod,thegreatone,squidink7,Cbomb,henrym,MinatsuT,joshmarinacci,eligaming1311,LJJames,peter,asigned_arduino,grandmadeb,cherietan,Daniel,techahoynyc,Jeanne,isaacreisbr23,jubelit,SizzleStick,DragonMountainDesign,mileswatson,Sirbull,CoolCreeper,nayrbgo,mameeewin,infchem,llNekoll,eigenjoy,CoreyZeneberg,jlj1978,KittenMaster37,Jernau,SM123456,Spacetime50,marioninja430,abchatra,cora.yang,njp,MK97-2007,salieri,NotOnefinity,Cookiecreationsyt,CuteMrMerp,KeveZeer,Napomex,mmmacademy,ArboTeach,DaEnderman,awful-coder,Galorlx,tballmsft,teachcreamer,wimberlyw,204maker,sofiania,MKleinSB,adcoding,jfo8000,Nobrain,Karlstens,Gickin,Santiago,Glitch,TailsCodingClub,Windoman,KalanTOWN,CardboardPete,GGBot,kristianpedersen,mouseart,Dace,user14,jenfoxbot,pvzsupersanicman,Josh,rossana,CharlieDeBoss12,SCAR.chris,Milo,Delta,CrownYou,dp4".split(",")
}
function prepare_player (skin: number, place_on: number) {
    sprite_player = prepare_car(skin, place_on)
    scene.cameraFollowSprite(sprite_player)
    sprites.setDataBoolean(sprite_player, "bot", false)
    sprites.setDataString(sprite_player, "name", "You")
    if (!(splash_mode)) {
        sprite_player.sayText(sprites.readDataString(sprite_player, "name"))
    }
    return sprite_player
}
function make_leaderboard (items: any[], scroll_to: number) {
    menu_leaderboard = miniMenu.createMenuFromArray(items)
    for (let index = 0; index < scroll_to; index++) {
        menu_leaderboard.moveSelection(miniMenu.MoveDirection.Down)
    }
    menu_leaderboard.setDimensions(scene.screenWidth() - 8, scene.screenHeight() - 10)
    menu_leaderboard.setButtonEventsEnabled(false)
    menu_leaderboard.setFlag(SpriteFlag.RelativeToCamera, true)
    menu_leaderboard.x = scene.screenWidth() / 2
    menu_leaderboard.y = scene.screenHeight() / 2
    menu_leaderboard.z = 100
}
function update_car_physics (car: Sprite, drive_frict: number, slow_frict: number, drive_max_velo: number, slow_max_velo: number) {
    for (let tile of map_driving_tiles) {
        if (car.tileKindAt(TileDirection.Center, tile)) {
            car.fx = drive_frict
            car.fy = drive_frict
            car.vx = Math.constrain(car.vx, drive_max_velo * -1, drive_max_velo)
            car.vy = Math.constrain(car.vy, drive_max_velo * -1, drive_max_velo)
            return
        }
    }
    for (let tile of map_slow_tiles) {
        if (car.tileKindAt(TileDirection.Center, tile)) {
            car.fx = slow_frict
            car.fy = slow_frict
            car.vx = Math.constrain(car.vx, slow_max_velo * -1, slow_max_velo)
            car.vy = Math.constrain(car.vy, slow_max_velo * -1, slow_max_velo)
            return
        }
    }
}
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (in_game && !(sprites.readDataBoolean(sprite_player, "bot"))) {
        move_car(sprite_player, 3, car_accel)
    }
})
let local_player_names: miniMenu.MenuItem[] = []
let sprite_finished_cars: TextSprite = null
let sprite: Sprite = null
let local_last_vy = 0
let local_last_vx = 0
let local_closest_checkpoint: Sprite = null
let local_last_tilemap: tiles.TileMapData = null
let local_all_tiles: Image[] = []
let sprite_car: Sprite = null
let bot_names: string[] = []
let sprite_bot: Sprite = null
let sprite_minimap: Sprite = null
let minimap2: minimap.Minimap = null
let finished_cars: Sprite[] = []
let sprite_checkpoint: Sprite = null
let these_checkpoints: Sprite[] = []
let all_checkpoints: Sprite[][] = []
let all_checkpoint_tiles: Image[] = []
let all_black_tiles: tiles.Location[] = []
let rng_decoration: FastRandomBlocks = null
let map_name = ""
let map_wall_tiles: Image[] = []
let map_slow_tiles: Image[] = []
let map_starting_tiles: Image[] = []
let map_driving_tiles: Image[] = []
let local_sprites: Sprite[] = []
let maps_background_color: number[] = []
let maps_flower_seeds: number[] = []
let maps_wall_tiles: tiles.TileMapData[] = []
let maps_slow_tiles: tiles.TileMapData[] = []
let maps_driving_tiles: tiles.TileMapData[] = []
let maps_starting_tile: tiles.TileMapData[] = []
let maps_checkpoints_needed: number[] = []
let maps: tiles.TileMapData[] = []
let show_checkpoints_gotten = false
let map_checkpoints_needed = 0
let sprite_player: Sprite = null
let debug_cam: Sprite = null
let sprite_321go: TextSprite = null
let menu_leaderboard: miniMenu.MenuSprite = null
let car_names_at_begin: miniMenu.MenuItem[] = []
let menu_start: miniMenu.MenuSprite = null
let car_images_names: string[] = []
let maps_names: string[] = []
let menu_options: miniMenu.MenuItem[] = []
let option_selected = false
let done_options = false
let sprite_title: TextSprite = null
let car_images: Image[][][] = []
let laps = 0
let splash_mode = false
let show_minimap = false
let in_game = false
let car_accel = 0
stats.turnStats(true)
if (false) {
    pause(1000)
    LoadingAnimations.show_splash()
    pause(5000)
    fade_in(true, true)
    LoadingAnimations.hide_splash()
}
let speed_multiplier = 1
car_accel = speed_multiplier * 500
let car_drive_max_velo = car_accel * 0.333
let car_drive_frict = car_accel * 0.333
let car_slow_max_velo = car_drive_max_velo * 0.333
let car_slow_frict = car_drive_frict * 3
let map_selected = 0
in_game = false
show_minimap = false
let sprites_on_checker: Sprite[] = []
controller.configureRepeatEventDefaults(0, 20)
define_maps()
define_animations()
define_bot_names()
define_menu_styles()
define_settings()
timer.background(function () {
    if (true) {
        splash_mode = true
        laps = -1
        prepare_map(0)
        prepare_bot(randint(0, car_images.length - 1), 0)
        scene.cameraFollowSprite(prepare_bot(randint(0, car_images.length - 1), 1))
        for (let index = 0; index <= 6; index++) {
            prepare_bot(randint(0, car_images.length - 1), index + 2)
        }
        sprite_title = textsprite.create("Racers!", 1, 15)
        sprite_title.setMaxFontHeight(16)
        sprite_title.setBorder(1, 15, 2)
        sprite_title.setFlag(SpriteFlag.Ghost, true)
        sprite_title.setFlag(SpriteFlag.RelativeToCamera, true)
        sprite_title.top = 4
        title_pop_in_sprite_left(sprite_title)
        fade_out(false, true)
        while (!(done_options)) {
            start_race()
            option_selected = false
            done_options = false
            make_title_menu("", [
            miniMenu.createMenuItem("Play"),
            miniMenu.createMenuItem("Skins"),
            miniMenu.createMenuItem("Settings"),
            miniMenu.createMenuItem("Reset preferences")
            ], false).onButtonPressed(controller.A, function (selection, selectedIndex) {
                music.playTone(262, music.beat(BeatFraction.Sixteenth))
                if (selectedIndex == 0) {
                    menu_options = [miniMenu.createMenuItem("Back")]
                    for (let names of maps_names) {
                        menu_options.push(miniMenu.createMenuItem(names))
                    }
                    make_title_menu("Select a map:", menu_options, true).onButtonPressed(controller.A, function (selection, selectedIndex) {
                        music.playTone(262, music.beat(BeatFraction.Sixteenth))
                        option_selected = true
                        if (selectedIndex > 0) {
                            map_selected = selectedIndex - 1
                            done_options = true
                        }
                    })
                } else if (selectedIndex == 1) {
                    menu_options = [miniMenu.createMenuItem("Back")]
                    for (let names of car_images_names) {
                        menu_options.push(miniMenu.createMenuItem(names))
                    }
                    menu_start = make_title_menu("Select a skin:", menu_options, true)
                    for (let index = 0; index < blockSettings.readNumber("user_skin") + 1; index++) {
                        menu_start.moveSelection(miniMenu.MoveDirection.Down)
                    }
                    menu_start.onButtonPressed(controller.A, function (selection, selectedIndex) {
                        music.playTone(262, music.beat(BeatFraction.Sixteenth))
                        option_selected = true
                        if (selectedIndex > 0) {
                            blockSettings.writeNumber("user_skin", selectedIndex - 1)
                            timer.background(function () {
                                Notification.waitForNotificationFinish()
                                Notification.notify("Successfully changed skin to " + selection + "!")
                            })
                        }
                    })
                } else if (selectedIndex == 2) {
                    music.playTone(262, music.beat(BeatFraction.Sixteenth))
                    wait_for_a_button_release()
                    game.showSystemMenu()
                } else {
                    make_title_menu("Confirm reset", [miniMenu.createMenuItem("No, don't reset"), miniMenu.createMenuItem("Yes, reset")], true).onButtonPressed(controller.A, function (selection, selectedIndex) {
                        music.playTone(262, music.beat(BeatFraction.Sixteenth))
                        option_selected = true
                        if (selectedIndex == 1) {
                            blockSettings.clear()
                            define_settings()
                            timer.background(function () {
                                Notification.waitForNotificationFinish()
                                Notification.notify("Reset successful!")
                            })
                        }
                    })
                }
            })
            while (!(option_selected)) {
                pause(0)
            }
        }
        title_pop_away_sprite_left(menu_start)
        title_pop_away_sprite_left(sprite_title)
        fade_in(true, true)
        sprites.destroyAllSpritesOfKind(SpriteKind.MiniMenu)
        sprites.destroyAllSpritesOfKind(SpriteKind.Text)
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        in_game = false
        splash_mode = false
    }
    laps = 3
    prepare_map(map_selected)
    car_names_at_begin = []
    for (let index = 0; index <= 7; index++) {
        car_names_at_begin.push(miniMenu.createMenuItem("---: " + sprites.readDataString(prepare_bot(randint(0, car_images.length - 1), index), "name")))
    }
    car_names_at_begin.push(miniMenu.createMenuItem("---: " + sprites.readDataString(prepare_player(blockSettings.readNumber("user_skin"), 8), "name")))
    if (true) {
        make_leaderboard(car_names_at_begin, 8)
        full_screen_menu_pop_in_down(menu_leaderboard)
        fade_out(false, true)
        wait_for_a_button_press_and_release()
        full_screen_menu_pop_away_down(menu_leaderboard)
    }
    show_minimap = true
    if (true) {
        if (true) {
            sprite_321go = textsprite.create("xxxx", 1, 15)
            sprite_321go.setMaxFontHeight(10)
            sprite_321go.setBorder(1, 15, 2)
            sprite_321go.setFlag(SpriteFlag.Ghost, true)
            sprite_321go.setFlag(SpriteFlag.RelativeToCamera, true)
            sprite_321go.x = scene.screenWidth() * 0.5
            label_pop_in_down(sprite_321go)
        }
        for (let index = 0; index <= 2; index++) {
            sprite_321go.setText("" + (3 - index) + "...")
            timer.background(function () {
                music.playTone(262, 200)
            })
            pause(1000)
        }
        sprite_321go.setText("GO!!")
        timer.background(function () {
            music.playTone(392, 2000)
        })
        start_race()
        pause(5000)
        label_pop_away_up(sprite_321go)
        if (true) {
            if (laps == 0) {
                sprite_321go = textsprite.create("Drive to the finish line!", 1, 15)
            } else {
                sprite_321go = textsprite.create("Drive " + laps + " laps to finish!", 1, 15)
            }
            sprite_321go.setBorder(1, 15, 2)
            sprite_321go.setFlag(SpriteFlag.Ghost, true)
            sprite_321go.setFlag(SpriteFlag.RelativeToCamera, true)
            sprite_321go.x = scene.screenWidth() * 0.5
            label_pop_in_down(sprite_321go)
            timer.after(5000, function () {
                label_pop_away_up(sprite_321go)
            })
        }
    } else {
        start_race()
    }
})
game.onUpdate(function () {
    if (in_game || splash_mode) {
        for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
            update_car_physics(sprite, car_drive_frict, car_slow_frict, car_drive_max_velo, car_slow_max_velo)
        }
        refresh_following()
        if (show_checkpoints_gotten) {
            for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
                sprite.sayText("L: " + sprites.readDataNumber(sprite, "lap") + " CG: " + sprites.readDataNumber(sprite, "checkpoints_got") + " LC: " + sprites.readDataNumber(sprite, "last_checkpoint"))
            }
        }
    }
    update_minimap()
})
game.onUpdate(function () {
    if (in_game || splash_mode) {
        // Workaround for above
        for (let sprite of sprites.allOfKind(SpriteKind.Player)) {
            if (sprite.tileKindAt(TileDirection.Center, assets.tile`checkerflag`)) {
                if (sprites_on_checker.indexOf(sprite) == -1) {
                    sprites_on_checker.push(sprite)
                    if (sprites.readDataNumber(sprite, "last_checkpoint") + 1 == map_checkpoints_needed) {
                        if (sprites.readDataNumber(sprite, "lap") == laps) {
                            if (finished_cars.indexOf(sprite) == -1) {
                                finished_cars.push(sprite)
                                sprite.startEffect(effects.confetti, 1000)
                                if (!(splash_mode)) {
                                    sprite.sayText("" + sprites.readDataString(sprite, "name") + ": Finished " + make_ordinal(finished_cars.length))
                                }
                                if (spriteutils.isDestroyed(sprite_finished_cars)) {
                                    timer.background(function () {
                                        sprite_finished_cars = textsprite.create("1/9 finished", 1, 15)
                                        sprite_finished_cars.setBorder(1, 15, 2)
                                        sprite_finished_cars.setFlag(SpriteFlag.Ghost, true)
                                        sprite_finished_cars.setFlag(SpriteFlag.RelativeToCamera, true)
                                        sprite_finished_cars.setPosition(scene.screenWidth() * 0.5, scene.screenHeight() * 0.1)
                                        label_pop_in_down(sprite_finished_cars)
                                    })
                                } else {
                                    sprite_finished_cars.setText("" + finished_cars.length + "/9 finished")
                                }
                            }
                            if (sprite_player == sprite) {
                                sprites.setDataBoolean(sprite, "bot", true)
                                sprites.setDataNumber(sprite, "checkpoints_got", 0)
                                sprites.setDataSprite(sprite, "target_checkpoint", null)
                            }
                        } else {
                            sprites.changeDataNumberBy(sprite, "lap", 1)
                            if (!(splash_mode)) {
                                sprite.sayText("" + sprites.readDataString(sprite, "name") + ": Lap " + sprites.readDataNumber(sprite, "lap"))
                            }
                        }
                    }
                }
            } else {
                if (sprites_on_checker.indexOf(sprite) != -1) {
                    sprites_on_checker.removeAt(sprites_on_checker.indexOf(sprite))
                }
            }
        }
        for (let index = 0; index <= sprites_on_checker.length - 1; index++) {
            if (spriteutils.isDestroyed(sprites_on_checker[sprites_on_checker.length - (index + 1)])) {
                sprites_on_checker.removeAt(sprites_on_checker.length - (index + 1))
            }
        }
    }
})
forever(function () {
    if (in_game) {
        if (finished_cars.length == 9) {
            pause(1000)
            local_player_names = []
            for (let index = 0; index <= finished_cars.length - 1; index++) {
                local_player_names.push(miniMenu.createMenuItem("" + make_ordinal(index + 1) + ": " + sprites.readDataString(finished_cars[index], "name")))
            }
            show_minimap = false
            label_pop_away_up(sprite_finished_cars)
            make_leaderboard(local_player_names, finished_cars.indexOf(sprite_player))
            full_screen_menu_pop_in_down(menu_leaderboard)
            wait_for_a_button_press_and_release()
            game.over(true)
        }
    }
    pause(100)
})
