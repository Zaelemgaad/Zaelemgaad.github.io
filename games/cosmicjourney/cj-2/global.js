var pi = 3.1415926;

function getAngle(x, y)
{
  var angle = Math.acos(x/Math.sqrt(x*x+y*y));
  if(y<0)
    angle = 2*pi-angle;
  return angle;
}

function angleDist(a1, a2)
{
  var aa1 = a1%(2*pi);
  var aa2 = a2%(2*pi);
  if(aa1 < 0) aa1 += 2*pi;
  if(aa2 < 0) aa2 += 2*pi;
  var ad = aa2-aa1;
  if(ad > pi) ad = -2*pi+ad;
  if(ad < -pi) ad = 2*pi+ad;
  return ad;
}

function hitRectRect(x1, y1, w1, h1, x2, y2, w2, h2)
{
  if(x1 > x2+w2 ||
     x1+w1 < x2 ||
     y1 > y2+h2 ||
     y1+h1 < y2)
     return false;
  return true;
}

function hitRectCircle(rx, ry, rw, rh, cx, cy, cr)
{
  if(cx-cr > rx+rw ||
     cx+cr < rx ||
     cy-cr > ry+rh ||
     cy+cr < ry)
    return false;
  if(cx > rx && cx < rx+rw &&
     cy > ry && cy < ry+rh)
    return true;
  if((rx-cx)*(rx-cx)+(ry-cy)*(ry-cy) < cr*cr)
    return true;
  if((rx+rw-cx)*(rx+rw-cx)+(ry-cy)*(ry-cy) < cr*cr)
    return true;
  if((rx+rw-cx)*(rx+rw-cx)+(ry+rh-cy)*(ry+rh-cy) < cr*cr)
    return true;
  if((rx-cx)*(rx-cx)+(ry+rh-cy)*(ry+rh-cy) < cr*cr)
    return true;
  if(cy > ry && cy < ry+rh)
  {
    if(cx+cr > rx && cx+cr < rx+rw)
      return true;
    if(cx-cr > rx && cx-cr < rx+rw)
      return true;
  }
  if(cx > rx && cx < ry+rw)
  {
    if(cy+cr > ry && cy+cr < ry+rh)
      return true;
    if(cy-cr > ry && cy-cr < ry+rh)
      return true;
  }
  return false;
}

function hitCircleCircle(x1, y1, r1, x2, y2, r2)
{
  if((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2) < (r1+r2)*(r1+r2))
    return true;
  return false;
}
/*
var audioFireL = new Audio(cjpath+'firel.wav');
audioFireL.load();
var audioFireR = new Audio(cjpath+'firer.wav');
audioFireR.load();
var audioHull = new Audio(cjpath+"hull.wav");
audioHull.load();
var audioShield = new Audio(cjpath+"shield.wav");
audioShield.load();
var audioExplosion = new Audio(cjpath+'explode.wav');
audioExplosion.load();
*/