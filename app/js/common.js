let player        = new Player('../img/player2.png', 16, 300, 51, 64, 3.4);
    player.setVars(0);
let gameIsRunning = false;
let game;
let rivalCycle;
let collectorCycle;
let buyCycle;
let eatCycle;
let glbuy = 18;
let lifetime;
function main() {
  gameIsRunning = true;
  let screen    = document.getElementById('screen');
  let ctx       = screen.getContext('2d');
  let time      = new Date();
  let ms        = 20;
  let mapLength = 100;
  let buy       = glbuy;
  let wood      = new Background();
  let ground    = new Ground('../img/grass.jpg', mapLength);
  let dwood     = new Resources(ground.relief);
  let scores    = new Interface();
  let torch     = new Fire('../img/fireInTheDark.png', 1400, 875);
  let rivals    = new LinkedList();
  let shop      = new Shop('../img/shop.png', 6000);
  let mshop     = new Shop('../img/shop.png', 3200);
  if (ctx) {
    DWFuncs.movingManager(player, ground, dwood, ms, true);
    game = setInterval(render, 25);
  }
  function render() {
    ms = new Date() - time;
    time = new Date();
    DWFuncs.movingManager(player, ground, dwood, ms);
    player.gravity(ground.relief, ms);
    if (player.backZone > 5760)
      stop();
    ctx.clearRect(0, 0, 640, 400);
    wood.draw(ctx, player);
    ground.draw(ctx, player.backZone);
    shop.draw(ctx, player.backZone);
    mshop.draw(ctx, player.backZone);
    dwood.draw(ctx, player.backZone);
    DWFuncs.rivalForeach(rivals.first, ctx, player.backZone, ground.relief, dwood, ms);
    player.draw(ctx);
    torch.draw(ctx, player.x + (player.dir == 1 ? 20 : -20), player.y - 40);
    scores.draw(ctx, player.x + player.backZone, player.food, player.point, buy, ms);
    if (player.food <= 0) {
      let lived = new Date() - lifetime;
      DWFuncs.diedWindow(ctx, lived);
      for (var i = 0; i < dwood.location.length; i++)
        dwood.location[i] = 0;
      stop();
    }
    if (player.backZone + player.x > 3200 && player.backZone + player.x < 3264) {
      player.food += Math.floor(player.point / glbuy);
      player.point = player.point % glbuy;
    }
  }
  collectorCycle  = setInterval(DWFuncs.collector, 20000, (rivals));
  rivalCycle      = setInterval(DWFuncs.newRival,  10000, (rivals), (player), (dwood.location), (mapLength));
  buyCycle        = setInterval(function() { let up = Math.floor(glbuy / 10); glbuy += up; buy += up; }, 12000);
  eatCycle        = setInterval(function() { player.food -= 1; }, 11000);
}
function start() {
  if (!gameIsRunning)
    restart();
}
function stop() {
  gameIsRunning = false;
  clearInterval(game);
  clearInterval(rivalCycle);
  clearInterval(collectorCycle);
  clearInterval(buyCycle);
  clearInterval(eatCycle);
  player.x = 16;
  player.backZone = 0;
  if (player.food > 0) {
    player.food += Math.floor(player.point / glbuy);
    player.point = player.point % glbuy;
    main();
  }
}
function restart() {
  player.x = 16;
  player.backZone = 0;
  player.food = 10;
  player.point = 0;
  glbuy = 18;
  lifetime = new Date();
  main();
}