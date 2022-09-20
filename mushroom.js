// Constants

const MUSHROOM_SPEED = 30;

/**
 * Function that adds a mushroom.
 *
 * @param {number} x - position on the x axis
 * @param {number} y - position on the y axis
 * @returns Object of the mushroom
 */
export const addMushroom = (x, y) => {
  const position = vec2(x, y - 1);

  return add([
    sprite("mushroom"),
    pos(position),
    area(),
    body(),
    "mushroom",
    {
      direction: RIGHT,
    },
  ]);
};

/**
 * Function that moves mushroom.
 *
 * @param {GameObj} mushroom - Object of the mushroom
 */
export const moveMushroom = (mushroom) => {
  switch (mushroom.direction) {
    case RIGHT:
      mushroom.move(MUSHROOM_SPEED, 0);

      mushroom.onCollide("coin", (c) => {
        mushroom.direction = LEFT;
      });

      break;
    case LEFT:
      mushroom.move(-MUSHROOM_SPEED, 0);

      mushroom.onCollide("coin", (c) => {
        mushroom.direction = RIGHT;
      });

      break;
    default:
  }
};

/**
 * Function that removes mushroom
 * from the level.
 *
 * @param {GameObj} mushroom - Object of the mushroom
 * @param {Object} mushrooms - Object that consists of mushrooms
 * that are currently spawned in
 * @returns Object that consists of mushrooms that are currently
 * spawned in
 */
export const destroyMushroom = (mushroom, mushrooms) => {
  delete mushrooms[mushroom._id];

  destroy(mushroom);

  return mushrooms;
};
