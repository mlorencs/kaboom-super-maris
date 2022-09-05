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

  const map = [
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "========================= =====",
  ];

  const levelConfig = {
    width: 20,
    height: 20,
    "=": () => [sprite("block", solid())],
  };

  const gameLevel = addLevel(map, levelConfig);
});

// Main function

go("game");
