stages.push(new StageSI());

var queen = null;

function StageSI()
{
  this.name = "Alien Invaders";
  this.id = "invaders";
  this.img = imagesPush(cjpath+"stagesi.png");
  this.musicIndex = createMusic(cjpath+"omgwormhole.ogg");
  this.win = false;
  this.brief = ["You found a strange flock life form beyond the final frontier.",
                "Show them who is the real invader."];

  this.start = function()
  {
    queen = new Queen();
    enemies.push(queen);
    enemies[enemies.length-1].init(enemies.length-1, 400, -200);

    for(var i=0; i<4; i++)
    {
      enemies.push(new Ameba());
      enemies[enemies.length-1].init(enemies.length-1, -70-i*70, 20, 3);
      enemies.push(new Ameba());
      enemies[enemies.length-1].init(enemies.length-1, 70+i*70, 20, 3);
    }
    for(var i=0; i<9; i++)
    {
      enemies.push(new Ameba());
      enemies[enemies.length-1].init(enemies.length-1, -280+i*70, 70, 2);
      enemies.push(new Ameba());
      enemies[enemies.length-1].init(enemies.length-1, -280+i*70, 120, 1);
      enemies.push(new Ameba());
      enemies[enemies.length-1].init(enemies.length-1, -280+i*70, 170, 1);
    }
    stageSI();
    setTimeout("stageSI()", 30000);
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

function stageSI()
{
  if(gameover)
    return;
  if(enemies.length == 0)
    gameover = true;
  else
    setTimeout("stageSI()", 500);
}

function stageSI2()
{
  if(gameover)
    return;
  textik.text1 = "Alien life forms";
  textik.text2 = "metabolism speeds up";
  textik.time = 2000;
}
