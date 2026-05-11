stages.push(new Escort());

function Escort()
{
  this.name = "Escort Service";
  this.id = "escort";
  this.img = imagesPush(cjpath+"stageescort.png");
  this.musicIndex = createMusic(cjpath+"omgzerogee.ogg");
  this.win = false;
  this.brief = ["Escort a freighter that carries vital meds for a miner colony.",
                "There is a bonus if you manage to keep the whole cargo intact.",
                "But the miners would be grateful for any amount of the meds.  "];

  this.start = function()
  {
    starSpeed = 1;
    asteroids = 0.2;
    addAsteroids();
    friends.push(new Transport());
    friends[friends.length-1].init(friends.length-1);
    setTimeout("stageEscort()", 4000);
    setTimeout("boxRandom()", 10000);
    setTimeout("boxBattery()", 20000);
    setTimeout("boxRandom()", 30000);
    setTimeout("boxBattery()", 40000);
    setTimeout("boxRandom()", 50000);
    setTimeout("boxBattery()", 60000);
    setTimeout("boxRandom()", 70000);
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

function stageEscort()
{
  if(friends.length == 0)
  {
    ace.shield = 0;
    ace.hull = 0;
    gameover = true;
  }
  if(gameover)
    return;
  if(distance < 80000)
  {
    var r=Math.random();
    if(r < 0.5)
    {
      if(r<0.2)
      {
        enemies.push(new Mine2());
        enemies[enemies.length-1].init(enemies.length-1, 790-3900*r, -20, 0, 1);
      }else if(r<0.4)
      {
        enemies.push(new Mine());
        enemies[enemies.length-1].init(enemies.length-1, 1570-3900*r, -20, 0, 1);
      }
      var rr = Math.random();
      for(var i=0; i<rr*4; ++i)
      {
        enemies.push(new Zero());
        enemies[enemies.length-1].init(enemies.length-1, 50+1500*r, -40-i*80, 1+rr*2, 1000+i*2000+5000*rr);
      }
    }
    else
    {
      var a = Math.random()*2*pi;
      enemies.push(new Zero());
      enemies[enemies.length-1].init(enemies.length-1, 400+Math.sin(a)*600, 400-Math.cos(a)*600, 1+Math.random()*3, 2000+Math.random()*4000);
      enemies[enemies.length-1].angle = a;
    }
    setTimeout("stageEscort()", 3000);
  }
  else if(distance < 100000)
  {
    enemies.push(new Mine2());
    enemies[enemies.length-1].init(enemies.length-1, Math.random()*800, -20, 0, 1);
    setTimeout("stageEscort()", 1000);
  }
  else
  {
    setTimeout("stageEscort2()", 5000);
    textik.text1 = "Avait the reward";
    textik.text2 = "";
    textik.time = 2000;
  }
}

function stageEscort2()
{
  if(friends.length > 0)
  {
    friends[friends.length-1].targetY = -200;
  }
  else
  {
    ace.shield = 0;
    ace.hull = 0;
    gameover = true;
  }
  if(gameover)
    return;
  if(friends[friends.length-1].posY < -20)
  {
    ace.addScore(friends[friends.length-1].power*10);
    gameover = true;
  }
  else
    setTimeout("stageEscort2()", 500);
}
