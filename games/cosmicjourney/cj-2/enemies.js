var friends = new Array();

function friendRemove(index)
{
  if(friends.length <= index)
  {
    alert("friendRemove");
    return;
  }
  friends.splice(index, 1);
  for(var i=index; i<friends.length; i++)
    friends[i].index -= 1;
}

var enemies = new Array();

function enemyRemove(index)
{
  if(enemies.length <= index)
  {
    alert("enemyRemove");
    return;
  }
  enemies.splice(index, 1);
  for(var i=index; i<enemies.length; i++)
    enemies[i].index -= 1;
}

var asteroids = 1;
var ufos = true;
var types = true;

function addAsteroids()
{
  if(gameover || asteroids==0)
    return;
  var y = -16;
  var x = 16 + Math.random()*(canvas.width-32);
  if(starSpeed > 1 && starSpeedControl == false)
    x = x/4 - canvas.width/8 + ace.posX;
  enemies.push(new Asteroid());
  enemies[enemies.length-1].init(enemies.length-1, x, y, 0, Math.random());  
  setTimeout("addAsteroids()", (500+Math.random()*6000/asteroids)/starSpeed);
}

function addUfos()
{
  if(gameover || !ufos)
    return;
  var amp =  30+Math.random()*100;
  var y = -32;
  var x = amp+24 + Math.random()*(canvas.width-2*amp-48);
  var count = 2 + Math.random()*5;
  var per =  300+Math.random()*500;
  for(var i=0; i<count; i++)
  {
    nUfos++;
    enemies.push(new Ufo());
    enemies[enemies.length-1].init(enemies.length-1, x, y, 4, amp, per);
    y -= 100;
  }
  var t = distance / 10000;
  if(t < 1)  
    t = 1;
  setTimeout("addUfos()", 1000+Math.random()*6000);
}

function addTypes()
{
  if(gameover || !types)
    return;
  type = Math.random()*7;
  if(type > 5)
  {
    prelet(Math.random()*5);
  }
  else if(type > 3)
  {
    preletL(Math.random()*6);
  }
  else if(type > 1)
  {
    preletR(Math.random()*6);
  }
  else
  {
    var y = -32;
    var x = 132 + Math.random()*(canvas.width-264);
    var count = Math.random()*5;
    var per =  300+Math.random()*500;
    var amp =  30+Math.random()*100;
    for(var i=0; i<count; i++)
    {
      enemies.push(new Type1());
      enemies[enemies.length-1].init(enemies.length-1, x, y, 6, amp, per);
      y -= 250;
    }
  }
  var t = distance / 10000;
  if(t < 1)  
    t = 1;
  setTimeout("addTypes()", 4000+Math.random()*6000);
}

function preletL(count)
{
  var y = -32;
  for(var i=0; i<count; i++)
  {
    enemies.push(new Type1());
    enemies[enemies.length-1].init(enemies.length-1, 0, y, 4, 750, 3200);
    y -= 70;
  }
}
function preletR(count)
{
  var y = -32;
  for(var i=0; i<count; i++)
  {
    enemies.push(new Type1());
    enemies[enemies.length-1].init(enemies.length-1, canvas.width, y, 4, -750, 3200);
    y -= 70;
  }
}

function prelet(count)
{
  var y = -32;
  for(var i=0; i<count; i++)
  {
    enemies.push(new Type1());
    enemies[enemies.length-1].init(enemies.length-1, canvas.width, y, 4, -750, 3200);
    enemies.push(new Type1());
    enemies[enemies.length-1].init(enemies.length-1, 0, y-32, 4, 750, 3200);
    y -= 70;
  }
}
