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

// Function that creates an enemy
// TODO: Separate this as its own class
const addEnemy = (startX, endX) => {
  function move() {
    const ENEMY_SPEED = 20;

    let direction = "left";

    // Function that returns the moving direction of an enemy
    function getDirection() {
      return direction;
    }

    // Function that moves enemy to the left until
    // it reaches it's end position
    function moveLeft() {
      const { x } = this.pos;

      direction = "left";

      if (x > endX) {
        this.move(-ENEMY_SPEED, 0);
      } else {
        direction = "right";
      }
    }

    // Function that moves enemy to the right until
    // it reaches it's starting position
    function moveRight() {
      const { x } = this.pos;

      direction = "right";

      if (x < startX) {
        this.move(ENEMY_SPEED, 0);
      } else {
        direction = "left";
      }
    }

    return {
      getDirection,
      moveRight,
      moveLeft,
    };
  }

  return add([
    sprite("enemy"),
    pos(startX, 0),
    area(),
    body(),
    "enemy",
    move(),
  ]);
};

// Game Start scene

scene("gameStart", () => {
  layers(["bg", "game", "ui"], "game");

  // Constants

  // Player constants

  const MOVE_SPEED = 120;
  const SMALL_JUMP_FORCE = 550; // 380
  const BIG_JUMP_FORCE = 550;
  const POWERUP_TIME = 6;

  // Enemy constants

  const ENEMY_1_STARTING_POS_X = 280;
  const ENEMY_1_ENDING_POS_X = 180;

  const ENEMY_2_STARTING_POS_X = 380;
  const ENEMY_2_ENDING_POS_X = 280;

  // Other constants

  const BLOCK_SIZE = 20;
  const MUSHROOM_SPEED = 30;

  // Level

  let level = 1;

  const map = [
    "|                                |",
    "|                                |",
    "|                                |",
    "|                                |",
    "|                                |",
    "|  C   =?=C=                     |",
    "|                       $        |",
    "|                       -+       |",
    "|                       []       |",
    "|=========================  =====|",
  ];

  const spriteMap = {
    "|": () => [
      rect(BLOCK_SIZE, BLOCK_SIZE),
      color(0, 0, 0),
      area(),
      solid(),
      "wall",
    ],
    "=": () => [sprite("block"), area(), solid()],
    U: () => [sprite("unboxed-block"), area(), solid()],
    C: () => [sprite("surprise-block"), area(), solid(), "coin-surprise"],
    "?": () => [sprite("surprise-block"), area(), solid(), "mushroom-surprise"],

    "-": () => [sprite("tube-top-left"), area(), solid(), scale(0.5)],
    "+": () => [sprite("tube-top-right"), area(), solid(), scale(0.5)],
    "[": () => [sprite("tube-bottom-left"), area(), solid(), scale(0.5)],
    "]": () => [sprite("tube-bottom-right"), area(), solid(), scale(0.5)],

    // E: () => [sprite("enemy"), area(), solid(), "enemy"],
    $: () => [sprite("coin"), area(), solid(), "coin"],
    M: () => [sprite("mushroom"), area(), body(), solid(), "mushroom"],
  };

  const levelConfig = {
    ...spriteMap,
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
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

  // Function that controls the size of the player
  function big() {
    let isBig = false;

    // Function that returns the state of the player.
    // True - player's size is big
    // False - player's size is small
    function getIsBig() {
      return isBig;
    }

    // Function that changes the size of the player to small
    function smallify() {
      isBig = false;

      this.scale = vec2(1);
    }

    // Function that changes the size of the player to big
    // for a limited time
    function biggify() {
      let timer = POWERUP_TIME;
      isBig = true;

      this.scale = vec2(2);

      onUpdate(() => {
        if (isBig) {
          timer -= dt();

          if (timer <= 0) {
            this.smallify();
          }
        }
      });
    }

    return {
      getIsBig,
      smallify,
      biggify,
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

  // Jump accordingly to player's size
  onKeyPress("up", () => {
    if (player.isGrounded()) {
      if (!player.getIsBig()) {
        player.jump(SMALL_JUMP_FORCE);
      } else {
        player.jump(BIG_JUMP_FORCE);
      }
    }
  });

  // Player events

  player.onHeadbutt((obj) => {
    // If player headbutts mystery box that
    // has a tag "coin-surprise", spawn
    // a coin on top of the box and replace
    // mystery box with a simple box
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));

      destroy(obj);

      gameLevel.spawn("U", obj.gridPos.sub(0, 0));
    }
    // If player headbutts mystery box that
    // has a tag "mushroom-surprise", spawn
    // a mushroom on top of the box and replace
    // mystery box with a simple box
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));

      destroy(obj);

      gameLevel.spawn("U", obj.gridPos.sub(0, 0));
    }
  });

  // Collision events with the player

  // Increase score value once player
  // has collected a coin
  player.onCollide("coin", (c) => {
    destroy(c);

    scoreUi.value++;
    scoreUi.text = scoreUi.value;
  });

  // Change player's size to big once
  // player has collected a mushroom
  player.onCollide("mushroom", (m) => {
    destroy(m);

    player.biggify();
  });

  // If player is grounded and when
  // enemy touches the player, either
  // change player's size to small or
  // go to Game Over scene.
  // If player is jumping/falling and
  // touches the enemy while in the air,
  // remove enemy from the level
  player.onCollide("enemy", (en) => {
    if (player.isGrounded()) {
      if (!player.getIsBig()) {
        go("gameOver", { score: scoreUi.value });
      } else {
        player.smallify();
      }
    } else {
      destroy(en);
    }
  });

  // Enemies

  const enemy1 = addEnemy(ENEMY_1_STARTING_POS_X, ENEMY_1_ENDING_POS_X);
  const enemy2 = addEnemy(ENEMY_2_STARTING_POS_X, ENEMY_2_ENDING_POS_X);

  // Enemy events

  enemy1.onUpdate(() => {
    if (enemy1.getDirection() === "left") {
      enemy1.moveLeft();
    } else {
      enemy1.moveRight();
    }
  });

  enemy2.onUpdate(() => {
    if (enemy2.getDirection() === "left") {
      enemy2.moveLeft();
    } else {
      enemy2.moveRight();
    }
  });

  // Mushroom event

  onUpdate("mushroom", (m) => {
    m.move(MUSHROOM_SPEED, 0);
  });
});

// Game Over scene

scene("gameOver", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});

// Go to Game Start scene

go("gameStart");
