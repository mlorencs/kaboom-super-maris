// Constants

const ENEMY_SPEED = 30;
const ENEMY_JUMP_FORCE = 380;

/**
 * Function that controls the movement of an enemy.
 *
 * @param {number} x1 - starting position on the x axis
 * @param {number} x2 - ending position on the x axis
 * @returns Object which includes function
 * that returns enemy's direction, function that
 * moves enemy to the left, and function that
 * moves enemy to the right
 */
function attributes(x1, x2) {
  let direction = "left";

  /**
   * Function that returns enemy's direction.
   *
   * @returns "left" | "right"
   */
  function getDirection() {
    return direction;
  }

  /**
   * Function that moves enemy to the left.
   */
  function moveLeft() {
    const { x } = this.pos;

    direction = "left";

    if (x > x2) {
      this.move(-ENEMY_SPEED, 0);
    } else {
      direction = "right";
    }
  }

  /**
   * Function that moves enemy to the right.
   */
  function moveRight() {
    const { x } = this.pos;

    direction = "right";

    if (x < x1) {
      this.move(ENEMY_SPEED, 0);
    } else {
      direction = "left";
    }
  }

  return {
    getDirection,
    moveLeft,
    moveRight,
  };
}

/**
 * Helper function that adds an enemy.
 *
 * @param {Object} obj - starting and ending positions on the x axis
 * @param {*} y - position on the y axis
 * @returns Object of an enemy
 */
const addEnemy = ({ x1, x2 }, y) => {
  const position = vec2(x1, y);

  return add([
    sprite("enemy"),
    pos(position),
    area(),
    body({ jumpForce: ENEMY_JUMP_FORCE }),
    "enemy",
    attributes(x1, x2),
  ]);
};

/**
 * Function that adds enemies to the level.
 *
 * @param {Array} enemies - an array consisting of enemy positions on x and y axis
 * @returns Array of enemy Objects
 */
export const addEnemies = (enemies) => {
  const enemiesArr = [];

  for (const en of enemies) {
    const enemy = addEnemy({ x1: en.xStartPos, x2: en.xEndPos }, en.y);

    enemiesArr.push(enemy);
  }

  return enemiesArr;
};

/**
 * Function that makes an enemy to jump
 * in order to overcome mushroom obstacle.
 *
 * @param {GameObj} enemy - Object of the enemy
 */
export const enemyCollidesWithMushroom = (enemy) => {
  if (enemy.isGrounded()) {
    enemy.jump();
  }
};
