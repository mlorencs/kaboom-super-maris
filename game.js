import kaboom from "kaboom";

import { maps } from "./levelConfig";

import {
  addPlayer,
  playerMoveRight,
  playerMoveToLeft,
  playerJump,
  playerHeadbutt,
  playerCollidesWithCoin,
  playerCollidesWithMushroom,
  playerCollidesWithEnemy,
  playerCollidesWithTube,
} from "./player";

import { addEnemies } from "./enemy";
import { moveMushroom } from "./mushroom";

// Initializing Kaboom with configuration

kaboom({
  global: true,
  scale: 2,
  debug: true,
  background: [0, 0, 0, 1],
});

// Loading sprites

loadRoot("assets/sprites/");

// Sprites for level design

loadSprite("brick", "block_brick_red.png");
loadSprite("cobble", "block_cobble_red.png");
loadSprite("box", "block_box.png");
loadSprite("surprise-block", "block_surprise.png");
loadSprite("tube-top-right", "tube_top_right.png");
loadSprite("tube-top-left", "tube_top_left.png");
loadSprite("tube-bottom-right", "tube_bottom_right.png");
loadSprite("tube-bottom-left", "tube_bottom_left.png");

loadSprite("brick-alt", "block_brick_blue.png");
loadSprite("cobble-alt", "block_cobble_blue.png");
loadSprite("steel", "block_steel_blue.png");

// Sprites for characters

loadSprite("maris", "character.png");
loadSprite("enemy", "evil_mushroom_left.png");

loadSprite("enemy-alt", "evil_mushroom_blue_left.png");

// Sprites for score/level-ups

loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");

// Game Start scene

scene("gameStart", ({ level, score }) => {
  layers(["bg", "game", "ui"], "game");

  // Level

  add([text(`level ${level}`), pos(10, 10), scale(0.2), layer("ui")]);

  const gameLevel = addLevel(maps[level - 1].level, maps[level - 1].config);

  // Score

  const scoreUi = add([
    text(`Score: ${score}`),
    pos(10, 25),
    scale(0.2),
    layer("ui"),
    {
      value: score,
    },
  ]);

  // Player object

  const player = addPlayer(10, 0);

  // Enemies

  const enemies = addEnemies(maps[level - 1].enemies || []);

  // Player movement

  onKeyDown("right", () => {
    playerMoveRight(player);
  });

  onKeyDown("left", () => {
    playerMoveToLeft(player);
  });

  onKeyPress("up", () => {
    playerJump(player);
  });

  // Mushroom movement

  onUpdate("mushroom", (m) => {
    moveMushroom(m);
  });

  // Enemy movements

  onUpdate(() => {
    for (const enemy of enemies) {
      const direction = enemy.getDirection();

      switch (direction) {
        case "left":
          enemy.moveLeft();

          break;
        case "right":
          enemy.moveRight();

          break;
        default:
      }
    }
  });

  // Player events

  player.onUpdate(() => {
    camPos(player.pos);
  });

  player.onHeadbutt((obj) => {
    playerHeadbutt(gameLevel, obj);
  });

  player.onCollide("coin", (c) => {
    playerCollidesWithCoin(c, scoreUi);
  });

  player.onCollide("mushroom", (m) => {
    playerCollidesWithMushroom(m, player);
  });

  player.onCollide("enemy", (en) => {
    playerCollidesWithEnemy(en, player, scoreUi);
  });

  player.onCollide("tube", (t) => {
    playerCollidesWithTube(level, scoreUi);
  });
});

// Game Over scene

scene("gameOver", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});

// Go to Game Start scene

go("gameStart", { level: 1, score: 0 });
