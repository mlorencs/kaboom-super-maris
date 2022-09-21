export const createButton = ({
  width,
  height,
  alignment,
  position,
  btnText,
  onBtnClick,
}) => {
  add([
    rect(width, height),
    origin(alignment),
    pos(position),
    color(198, 198, 198),
    area(),
    "btn-block",
  ]);

  add([
    text(btnText, { size: 16 }),
    origin(alignment),
    pos(position),
    area(),
    "btn-text",
  ]);

  onClick("btn-block" || "btn-text", () => {
    onBtnClick();
  });
};
