// Constants

const PLAYER_NAME = "maris";

const MOVING_SPEED = 120;
const SMALL_JUMP_FORCE = 380;
const BIG_JUMP_FORCE = 550;
const POWERUP_TIME = 6;

/**
 * Function that controls the size of the player.
 *
 * @returns Object which includes function
 * that returns state of the player,
 * function that changes the size of the player
 * to small, and function that changes
 * the size of the player to big
 */
function attributes() {
  let isBig = false;

  /**
   * Function that returns the state of the player.
   *
   * @returns true - player's size is big; false - player's size is small
   */
  function getIsBig() {
    return isBig;
  }

  /**
   * Function that changes the size of the player to small.
   */
  function smallify() {
    isBig = false;

    this.scale = vec2(1);
  }

  /**
   * Function that changes the size of the player to big.
   */
  function biggify() {
    const { x, y } = this.pos;

    let timer = POWERUP_TIME;
    isBig = true;

    this.scale = vec2(2);

    this.moveTo(x, y - 1);

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

/**
 * Function that adds a player.
 *
 * @param {number} x - player's position on the x axis
 * @param {number} y - player's position on the y axis
 * @returns Object of the player
 */
export const addPlayer = (x, y) => {
  const position = vec2(x, y);

  return add([
    sprite(PLAYER_NAME),
    pos(position),
    area(), // has a collider
    body(), // responds to physics and gravity
    attributes(),
  ]);
};

/**
 * Function that moves the player to the right.
 *
 * @param {GameObj} player - Object of the player
 */
export const playerMoveRight = (player) => {
  player.move(MOVING_SPEED, 0);
};

/**
 * Function that moves the player to the left.
 *
 * @param {GameObj} player - Object of the player
 */
export const playerMoveToLeft = (player) => {
  player.move(-MOVING_SPEED, 0);
};

/**
 * Function that makes the player to jump.
 *
 * @param {GameObj} player - Object of the player
 */
export const playerJump = (player) => {
  if (player.isGrounded()) {
    if (!player.getIsBig()) {
      player.jump(SMALL_JUMP_FORCE);
    } else {
      player.jump(BIG_JUMP_FORCE);
    }
  }
};

/**
 * Helper function that spawns a surprise
 * and changes the surprise block to the
 * box block.
 *
 * @param {Level} levelObj - Object of the level
 * @param {GameObj} obj - Object that player headbutts into
 * @param {string} spriteTag
 */
const spawnOnLevel = (levelObj, obj, spriteTag) => {
  levelObj.spawn(spriteTag, obj.gridPos.sub(0, 1));

  destroy(obj);

  levelObj.spawn("X", obj.gridPos.sub(0, 0));
};

/**
 * Function that spawns a surprise
 * when the player headbutts into
 * the surprise block.
 *
 * @param {Level} levelObj - Object of the level
 * @param {GameObj} obj - Object that player headbutts into
 */
export const playerHeadbutt = (levelObj, obj) => {
  if (obj.is("coin-surprise")) {
    spawnOnLevel(levelObj, obj, "$");
  }
  if (obj.is("mushroom-surprise")) {
    spawnOnLevel(levelObj, obj, "M");
  }
};

/**
 * Function that removes coin
 * when player has collected it
 * and increases score value.
 *
 * @param {GameObj} coin - Object of the coin
 * @param {GameObj} score - Object of the score
 */
export const playerCollidesWithCoin = (coin, score) => {
  destroy(coin);

  score.value++;
  score.text = score.value;
};

/**
 * Function that removes mushroom
 * when player has collected it
 * and changes player's size to big.
 *
 * @param {GameObj} mushroom - Object of the mushroom
 * @param {GameObj} player - Object of the player
 */
export const playerCollidesWithMushroom = (mushroom, player) => {
  destroy(mushroom);

  player.biggify();
};

/**
 * Function that controls the collision
 * between the player and an enemy.
 *
 * If the player is on the ground,
 * colliding with an enemy can result in
 * Game Over, if player's size is small.
 * If player's size is big, colliding with
 * an enemy changes player's size back to
 * small.
 *
 * If the player is in the air,
 * colliding with an enemy results in
 * enemy's removal from the level.
 *
 * @param {GameObj} enemy - Object of the enemy
 * @param {GameObj} player - Object of the player
 * @param {GameObj} score - Object of the score
 */
export const playerCollidesWithEnemy = (enemy, player, score) => {
  if (player.isGrounded()) {
    if (!player.getIsBig()) {
      go("gameOver", { score: score.value });
    } else {
      player.smallify();
    }
  } else {
    destroy(enemy);
  }
};

/**
 * Function that takes the player
 * to the next level.
 *
 * @param {number} level
 * @param {GameObj} score - Object of the score
 */
export const playerCollidesWithTube = (level, score) => {
  onKeyPress("down", () => {
    go("gameStart", { level: level + 1, score: score.value });
  });
};
