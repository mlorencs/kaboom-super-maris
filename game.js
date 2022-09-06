import kaboom from "kaboom";

// Initializing Kaboom with configuration

kaboom({
  global: true,
  scale: 1,
  debug: true,
  background: [0, 0, 0, 1],
});

// Loading sprites

loadRoot("assets/sprites/");

// Sprites for level design

loadSprite("brick", "brick.png");
loadSprite("block", "block.png");
loadSprite("unboxed-block", "unboxed_block.png");
loadSprite("surprise-block", "surprise_block.png");
loadSprite("tube-top-right", "tube_top_right.png");
loadSprite("tube-top-left", "tube_top_left.png");
loadSprite("tube-bottom-right", "tube_bottom_right.png");
loadSprite("tube-bottom-left", "tube_bottom_left.png");

// Sprites for characters

loadSprite("maris", "character.png");
loadSprite("enemy", "evil_mushroom_left.png");

// Sprites for score/level-ups

loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");

// Game scene

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  // Constants

  const MOVE_SPEED = 120;
  const JUMP_FORCE = 380;

  // Level

  let level = 1;

  const map = [
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "  C   =?=C=                     ",
    "                       $        ",
    "                       -+       ",
    "             E    E    []       ",
    "=========================  =====",
  ];

  const spriteMap = {
    "=": () => [sprite("block"), area(), solid()],
    U: () => [sprite("unboxed-block"), area(), solid()],
    C: () => [sprite("surprise-block"), area(), solid(), "coin-surprise"],
    "?": () => [sprite("surprise-block"), area(), solid(), "mushroom-surprise"],

    "-": () => [sprite("tube-top-left"), area(), solid(), scale(0.5)],
    "+": () => [sprite("tube-top-right"), area(), solid(), scale(0.5)],
    "[": () => [sprite("tube-bottom-left"), area(), solid(), scale(0.5)],
    "]": () => [sprite("tube-bottom-right"), area(), solid(), scale(0.5)],

    E: () => [sprite("enemy"), area(), solid()],
    $: () => [sprite("coin"), area(), solid()],
    M: () => [sprite("mushroom"), area(), body(), solid(), "mushroom"],
  };

  const levelConfig = {
    ...spriteMap,
    width: 20,
    height: 20,
  };

  add([text(`level ${level}`), pos(10, 10), scale(0.2)]);

  const gameLevel = addLevel(map, levelConfig);

  // Score

  let score = 0;

  const scoreUi = add([
    text(`Score: ${score}`),
    pos(10, 25),
    scale(0.2),
    layer("ui"),
    {
      value: score,
    },
  ]);

  // Player

  // Function that controls the size of the character
  function big() {
    let timer = 0;
    let isBig = false;

    return {
      update() {
        if (isBig) {
          timer -= dt();

          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        timer = 0;
        isBig = false;

        this.scale = vec2(1);
      },
      biggify(time) {
        timer = time;
        isBig = true;

        this.scale = vec(2);
      },
    };
  }

  const player = add([
    sprite("maris"),
    pos(10, 0),
    area(), // has a collider
    body(), // responds to physics and gravity
    big(),
  ]);

  // Player movement

  onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  onKeyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  onKeyPress("up", () => {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  });

  // Player events

  player.onHeadbutt((obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));

      destroy(obj);

      gameLevel.spawn("U", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));

      destroy(obj);

      gameLevel.spawn("U", obj.gridPos.sub(0, 0));
    }
  });

  // Mushroom event

  action("mushroom", (obj) => {
    obj.move(30, 0);
  });
});

// Main function

go("game");
