var audios = new Array();

function stopMusic()
{
  for(var i=0; i<audios.length; i++)
    if(audios[i].music)
      audios[i].stop();
}

var currentMusic = -1;
function loopMusic()
{
  if(currentMusic >= 0)
    audios[currentMusic].play();
}

function MyAudio(src)
{
	this.audio = new Audio(src);
  this.index = 0;
  this.loaded = false;
  this.shouldPlay = false;
  this.music = false;
	this.init = function(i)
  {
    if(i) this.index = i;
    this.audio.addEventListener("loadedmetadata", audios[this.index].onload(), true);
    this.audio.addEventListener("ended", audios[this.index].onend(), true);
  }
  this.onload = function()
  {
    this.loaded = true;
    if(this.shouldPlay)
      this.play();
  }
  this.onend = function()
  {
    if(this.music)
    {
      if(this.audio.currentTime != 0)
        this.audio.currentTime = 0;
      this.play();
    }
  }
  this.play = function()
  {
    if(this.loaded)
    {
      if(this.music)
        stopMusic();
      if(this.audio.currentTime != 0)
        this.audio.currentTime = 0;
      this.audio.play();
      if(this.music)
      {
        currentMusic = this.index;
        setTimeout("loopMusic()", this.audio.duration*1001);
      }
    }
    else
    {
      this.shouldPlay = true;
    }
  }
  this.stop = function()
  {
    currentMusic = -1;
    if(this.loaded)
      this.audio.pause();
    else
      this.shouldPlay = false;
  }
}

function createSound(src)
{
  audios.push(new MyAudio(src));
  audios[audios.length-1].init(audios.length-1);
  return audios.length-1;
}

function createMusic(src)
{
  audios.push(new MyAudio(src));
  audios[audios.length-1].init(audios.length-1);
  audios[audios.length-1].music = true;
  return audios.length-1;
}

var audioFireL = audios[createSound(cjpath+'firel.wav')];
var audioFireR = audios[createSound(cjpath+'firer.wav')];
var audioHull = audios[createSound(cjpath+"hull.wav")];
var audioShield = audios[createSound(cjpath+"shield.wav")];
var audioExplosion = audios[createSound(cjpath+'explode.wav')];
