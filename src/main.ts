import './style.css'

const readCanvas = () => {
  const canvas = document.getElementById("app");
  if (canvas == null) throw new Error("Canvas not found");
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas not found");
  const ctx = canvas.getContext('2d');
  if (ctx == null) throw new Error("Canvas not found");
  return { canvas, ctx };
}

interface State {
  height: number;
  width: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

const state: State = {
  height: 0,
  width: 0,
  ...readCanvas(),
}

const clear = () => state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

const setupCanvas = (): void => {
  const scale = window.devicePixelRatio;
  const heightPx = state.height;
  const widthPx = state.width;

  const scaledWidth = widthPx * scale;
  const scaledHeight = heightPx * scale;

  if (state.canvas.width !== scaledWidth || state.canvas.height !== scaledHeight) {
    state.canvas.width = widthPx * scale;
    state.canvas.height = heightPx * scale;
    state.canvas.style.width = `${state.width}px`;
    state.canvas.style.height = `${state.height}px`;
    state.ctx.scale(scale, scale);
  }

  clear();
};

const resizeCanvas = () => {
  state.height = window.innerHeight;
  state.width = window.innerWidth;
  setupCanvas();
  setupFont();
  draw();
}

const setupFont = () => {
  const myFont = new FontFace(
    "Oswald",
    "url(https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZSSUhiCXAA.woff2)"
  );
  
  myFont.load().then((font) => {
    document.fonts.add(font);
    draw();
  });
};

/*
TODO:
- linter
- event loop
- state manager?
- theme (light / dark)
- wake lock
- import / export KML
- save to google spreadsheet
- spotify integration
*/

/*
Milestones:
1. get time, speed, direction, distance work and test to see if the white on black screen is visible in the sun
*/

const draw = () => {
  const { ctx, width, height } = state;
  if (ctx == null) return;
  ctx.fillStyle = "#eee";
  ctx.fillRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = "#292929";
  ctx.font = "30px Oswald";
  ctx.fillText("TEST FONT", 30, 200);

  // Time
  // Timer

  // Speed
  // Direction
  // Distance

  // Waypoint

  // Location

  // Spotify
}


window.addEventListener("resize", resizeCanvas);


resizeCanvas();
