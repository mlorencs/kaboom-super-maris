import kaboom from "kaboom";

import { createButton } from "./button";
import { maps } from "./levelConfig";

import {
  addPlayer,
  playerMoveRight,
  playerMoveToLeft,
  playerJump,
  playerHeadbuttsCoinSurprise,
  playerHeadbuttsMushroomSurprise,
  playerCollidesWithCoin,
  playerCollidesWithMushroom,
  playerCollidesWithEnemy,
  playerCollidesWithTube,
} from "./player";

import { moveMushroom, destroyMushroom } from "./mushroom";
import { addEnemies, enemyCollidesWithMushroom } from "./enemy";

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
loadSprite("enemy", "evil_mushroom.png");

loadSprite("enemy-alt", "evil_mushroom_blue.png");

// Sprites for score/level-ups

loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");

// Constants

const LEVELUI_POSX = 10;
const LEVELUI_POSY = 10;

const SCOREUI_POSX = 10;
const SCOREUI_POSY = 25;

// Game Start scene

scene("gameStart", ({ level, score }) => {
  layers(["bg", "game", "ui"], "game");

  // Level

  const levelUi = add([
    text(`level ${level}`),
    pos(LEVELUI_POSX, LEVELUI_POSY),
    scale(0.2),
    layer("ui"),
  ]);

  const gameLevel = addLevel(maps[level - 1].level, maps[level - 1].config);

  // Score

  const scoreUi = add([
    text(`Score: ${score}`),
    pos(SCOREUI_POSX, SCOREUI_POSY),
    scale(0.2),
    layer("ui"),
    {
      value: score,
    },
  ]);

  // Player object

  const player = addPlayer(10, 0);

  // Mushroom

  let mushrooms = {};

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

  // Level UI and Score UI following player's movements

  onUpdate(() => {
    const { x, y } = player.pos;

    const levelPosition = vec2(x, y - 160 + LEVELUI_POSY);
    const scorePosition = vec2(x, y - 160 + SCOREUI_POSY);

    levelUi.pos = levelPosition;
    scoreUi.pos = scorePosition;
  });

  // Mushroom movement

  onUpdate("mushroom", (m) => {
    m.onCollide("wall", (w) => {
      mushrooms = destroyMushroom(m, mushrooms);
    });

    moveMushroom(m);
  });

  // Enemy movements

  onUpdate(() => {
    for (const enemy of enemies) {
      enemy.onCollide("mushroom", (m) => {
        enemyCollidesWithMushroom(enemy);
      });

      switch (enemy.direction) {
        case LEFT:
          enemy.moveLeft();

          break;
        case RIGHT:
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
    if (obj.is("coin-surprise")) {
      playerHeadbuttsCoinSurprise(gameLevel, obj);
    }
    if (obj.is("mushroom-surprise")) {
      mushrooms = playerHeadbuttsMushroomSurprise(gameLevel, obj, mushrooms);
    }
  });

  player.onCollide("coin", (c) => {
    playerCollidesWithCoin(c, scoreUi);
  });

  player.onCollide("mushroom", (m) => {
    mushrooms = playerCollidesWithMushroom(m, mushrooms, player);
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
  add([
    text("Game Over", { size: 48 }),
    origin("center"),
    pos(width() / 2, height() / 2 - 75),
  ]);

  add([
    text(score, { size: 32 }),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  const onTryAgainClick = () => {
    go("gameStart", { level: 1, score: 0 });
  };

  createButton({
    width: 120,
    height: 40,
    alignment: "center",
    position: vec2(width() / 2, height() / 2 + 75),
    btnText: "Try Again!",
    onBtnClick: () => onTryAgainClick(),
  });
});

// Go to Game Start scene

go("gameStart", { level: 1, score: 0 });
