stages.push(new Pirates());

function Pirates()
{
  this.name = "Space Pirates";
  this.id = "pirates";
  this.img = imagesPush(cjpath+"stage3.png");
  this.musicIndex = createMusic(cjpath+"omgstonestorm.ogg");
  this.win = false;
  this.brief = ["The Wormhole exit was booby-trapped. It looks like",
                "a pirates' work. Find their captain and kill him. "];

  this.start = function()
  {
    starSpeed = 1;
    asteroids = 1;
    addAsteroids();
    stagePirates();
    types = true;
    addTypes();
    setTimeout("boxBattery()", 20000);
    audios[this.musicIndex].play();
}

  this.drawBrief = function()
  {
    context2D.globalAlpha = 0.6;
    context2D.fillStyle = "#aaaaaa";
    context2D.font = '900 12px monospace';
    for(var i=0; i<this.brief.length; i++)
      context2D.fillText(this.brief[i], (canvas.width-context2D.measureText(this.brief[i]).width)/2, 405+i*17);
    context2D.globalAlpha = 1;
  }
}

function stagePirates()
{
  if(gameover)
    return;
  if(distance < 60000)
  {
    if(Math.random() < 0.04)
    {
      enemies.push(new IroncladR());
      enemies[enemies.length-1].init(enemies.length-1, 840, 100+Math.random()*600, -800, 100+Math.random()*600);
    }
    setTimeout("stagePirates()", 1000);
  }
  else
  {
    types = false;
    asteroids = 0.2;
    textik.text1 = "Get ready for";
    textik.text2 = "Man of War";
    textik.time = 2000;
    setTimeout("stagePirates2()", 7000);
  }
}

var manowar = null;

function stagePirates2()
{
  if(gameover)
    return;
  manowar = new Manowar();
  enemies.push(manowar);
  enemies[enemies.length-1].init(enemies.length-1, -150, 0);
  stagePirates3();
}

function stagePirates3()
{
  if(gameover)
    return;
  if(enemies.length == 0 && plasma.length == 0)
    gameover = true;
  else
    setTimeout("stagePirates3()", 500);
}
