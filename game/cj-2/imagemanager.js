var images = new Array();
var imagesLoaded = false;

function imagesPush(imageName)
{
  images.push(new Image());
  images[images.length-1].src = imageName;
  return images.length-1;
}

function imagesComplete()
{
  var c = 0;
  for(var i=0; i<images.length; i++)
  {
    if(images[i].complete)
      c++;
  }
  return c;
}

imagesPush(cjpath+"star0.png");
imagesPush(cjpath+"star1.png");
imagesPush(cjpath+"star2.png");
imagesPush(cjpath+"star3.png");
imagesPush(cjpath+"star4.png");
imagesPush(cjpath+"star5.png");
imagesPush(cjpath+"star6.png");

var imgMenuCosmic = imagesPush(cjpath+"cosmic.png");
var imgShield = imagesPush(cjpath+"ace-shield.png")
var imgExplosion1 = imagesPush(cjpath+"explosion1.png");
var imgExplosion2 = imagesPush(cjpath+"explosion2.png");
var imgDebris1 = imagesPush(cjpath+"debris1.png");
var imgShot1 = imagesPush(cjpath+"shot1.png");
var imgPlasma = imagesPush(cjpath+"plasma.png");
var imgMissile1 = imagesPush(cjpath+"missile1.png");
var imgMissile2 = imagesPush(cjpath+"missile2.png");
var imgMissile3 = imagesPush(cjpath+"missile3.png");
var imgFlame = imagesPush(cjpath+"flame.png");
var imgFlame2 = imagesPush(cjpath+"flame2.png");
var imgMine = imagesPush(cjpath+"mine.png");
var imgMine2 = imagesPush(cjpath+"mine2.png");
var imgMiner = imagesPush(cjpath+"miner.png");
var imgMinerSpoon1 = imagesPush(cjpath+"miner-spoon1.png");
var imgMinerSpoon3 = imagesPush(cjpath+"miner-spoon3.png");
var imgAmebaEye = imagesPush(cjpath+"amebaeye.png");
var imgAmeba1Eye = imagesPush(cjpath+"amebaeye1.png");
var imgAmeba2Eye = imagesPush(cjpath+"amebaeye2.png");
var imgAmeba1 = imagesPush(cjpath+"ameba1.png");
var imgAmeba2 = imagesPush(cjpath+"ameba2.png");
var imgAmeba3 = imagesPush(cjpath+"ameba3.png");
var imgAmeba4 = imagesPush(cjpath+"ameba4.png");
var imgUfo = imagesPush(cjpath+"ufo.png");
var imgUfo2 = imagesPush(cjpath+"ufo2.png");
var imgType1 = imagesPush(cjpath+"type1.png");
var imgManowar = imagesPush(cjpath+"manowar.png");
var imgManowarFlame = imagesPush(cjpath+"manowarflame.png");
var imgIroncladR = imagesPush(cjpath+"ironcladr.png");
var imgIroncladTurret = imagesPush(cjpath+"ironcladturret.png");
var imgAsteroidBase = imagesPush(cjpath+"asteroid.png");
var imgCannon1 = imagesPush(cjpath+"cannon1.png");
var imgSiloVrak = imagesPush(cjpath+"silo-vrak.png");
var imgSilo = imagesPush(cjpath+"silo.png");
var imgSilo1 = imagesPush(cjpath+"silo1.png");
var imgSilo2 = imagesPush(cjpath+"silo2.png");
var imgSilo3 = imagesPush(cjpath+"silo3.png");
var imgSilo4 = imagesPush(cjpath+"silo4.png");
var imgSilo5 = imagesPush(cjpath+"silo5.png");
var imgSilo6 = imagesPush(cjpath+"silo6.png");
var imgSilo7 = imagesPush(cjpath+"silo7.png");
var imgSilo8 = imagesPush(cjpath+"silo8.png");
var imgAsteroid1 = imagesPush(cjpath+"asteroid1.png");
var imgAsteroid2 = imagesPush(cjpath+"asteroid2.png");
var imgAsteroid3 = imagesPush(cjpath+"asteroid3.png");
var imgAsteroid4 = imagesPush(cjpath+"asteroid4.png");
var imgStone1 = imagesPush(cjpath+"stone1.png");
var imgBox = imagesPush(cjpath+"box.png");
var imgBonus = imagesPush(cjpath+"bonus.png");
var imgBonus48 = imagesPush(cjpath+"bonus48.png");
var imgBonusBat = imagesPush(cjpath+"bonusbat.png");
var imgBonusShield = imagesPush(cjpath+"bonusshield.png");
var imgBonusWrench = imagesPush(cjpath+"bonuswrench.png");
var imgBonusGun1 = imagesPush(cjpath+"bonusgun.png");
var imgBonusShuriken = imagesPush(cjpath+"bonusshuriken.png");
var imgHole = imagesPush(cjpath+"hole.png");
var imgWing1 = imagesPush(cjpath+"wing1.png");
var imgWing2 = imagesPush(cjpath+"wing2.png");
var imgGun1 = imagesPush(cjpath+"gun.png");
var imgShuriken = imagesPush(cjpath+"shuriken.png");
var imgTransport1 = imagesPush(cjpath+"transport1.png");
var imgTransport2 = imagesPush(cjpath+"transport2.png");
var imgTransport3 = imagesPush(cjpath+"transport3.png");
var imgTransport4 = imagesPush(cjpath+"transport4.png");
var imgZero = imagesPush(cjpath+"zero.png");
