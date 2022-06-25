var aiLevel = 0.03;
var run ;

function  init() {
  
  //for sound effects  
  var music = document.getElementById("music");  
 var win = document.getElementById("win");   
var lose = document.getElementById("lose");    
win.volume=0; lose.volume=0;
music.play();
    
   
document.getElementsByClassName('tab')[0].style.transform='scale(0)';  
document.getElementsByClassName('tab')[0].style.animation='' ;      
    //Just some canvas setup stuff    
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    
    var h = canvas.height = 450;
    var w = canvas.width = 284;
    var fps = 40 ;
    
    //ball object
    const ball = {
    
        x : w/2 ,
        y : h/2 ,
        r : 10 ,
        speed : 9.5,
        dx : 3,
        dy : 5,
        color : "red" ,
     }
     
     //user paddle
     const user = {
          
          x : 95 ,
          y : h - 30,
          height : 10 ,
          width : 100 ,
          point : 00,
          color : "black" ,                  
     }
     
     //AI paddle
     const ai = {
          
          x : 95,
          y : 20,
          height : 10 ,
          width : 100 ,
          point : 00,
          color : "black" ,                  
     }
     
     //The net
     const net = {
         
          x : 2,
          y : h/2,
          height : 5 ,
          width : 10 ,
          point : 0,
          color : "black" , 
     }


// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}  

//to draw net
function drawNet()  {
    
    for(let i = 0; i<19;i ++)
    {
        drawRect(net.x + 15*i, net.y, net.width, net.height, net.color);
        
    }
}

//to draw text i.e points
function drawText(text,x,y)  {

    ctx.fillStyle = "#FFF";
    ctx.font = "30px Sarabun";
    ctx.fillText(text, x, y);
}
 
// when ai or user scores, we reset the ball
function resetBall(){

    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 9.5;
    ball.dy=-ball.dy;
}

// collision detection
function collision(b,p,dir){
    
    p.top = p.y - dir*p.height;
    p.left = p.x - p.width/5;
    p.right = p.x + p.width + 20 ;
    
    b.top = b.y + dir*b.r;
    b.left = b.x - b.r ;
    b.right = b.x + b.r ;
    
    
var hitX = b.left > p.left && b.right < p.right;
    var hitY = false;
    if(dir === 1){
        hitY = b.dy > 0 && b.y >= p.top;
    }
    if(dir === -1){
        hitY = b.dy < 0 && b.y <= p.top + p.width/7;
    }
    
    return hitY && hitX;    

}

//mousemove eventListener controls
window.addEventListener("mousemove",function(evt) {

  user.x = evt.x - user.width ;
   evt.preventDefault();
   
   });
        
//touchmove eventListener controls
canvas.addEventListener("touchmove", function(e){
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var touch = e.changedTouches[0];
        var touchX = parseInt(touch.clientX) - rect.top - root.scrollTop ;
        e.preventDefault();
        user.x = touchX - user.width/2;});
        
        
        
           
//keyboard controls
addEventListener("keydown",
function(e) {
  
  //arrow left
  if (e.keyCode == "83") {
       user.y-=2;
  } //arrow right
  else if (e.keyCode =="85")  {    
       user.y+=2;
  }
});



    
//to update everything
function update () {
    
    //to change points
    if( ball.y - ball.r < 0 ) {
        user.point++;
        resetBall();

    }else if( ball.y + ball.r >h ){
        ai.point++;
        resetBall();
    }
        
    //moving the ball
    ball.x += ball.dx;
    ball.y += ball.dy;    
  
   //to bounce off the ball from the edge  
   if(ball.x - ball.r - 2 < 0 || ball.x + ball.r + 2> w){
        ball.dx = -ball.dx;
    }
  
    // we check if the paddle hit the user or the ai paddle
  var player = (ball.y + ball.r < h/2)?ai:user;
   var dir =  (ball.y + ball.r < h/2)?-1:1;
   
     //After collision effect
     if(collision(ball,player,dir))
     {
       
      // we check where the ball hits the paddle
      let collidePoint =ball.x - (player.x+player.width/2);
      collidePoint = collidePoint / (player.width/2);

         //angle  
        let angleRad = -(Math.PI/4) * collidePoint;

       ball.dy = -dir*ball.speed * Math.cos(angleRad);

        ball.dx = -dir*dir*ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.64;
}     
     //simple ai
      ai.x += (ball.x - (ai.x + ai.width/2))*aiLevel;   
              
}
    
//to draw everything
function render() {
    
    //clear previous builda
    ctx.clearRect(0,0,w,h);
    //the net
    drawNet();    
    //the ball
    drawArc(ball.x, ball.y, ball.r, ball.color);
    
    //user paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    //ai paddle
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color); 
    
    //points
    drawText(ai.point,20,h/2-20);
    drawText(user.point,w-35,h/2 +45);  
}

//actual game
function game() {

    render();  update();
    if(ai.point == 10)
    {   
        change('You lost');  
        lose.volume=1;
        lose.play()   ;          
    }
    else if(user.point == 10)
    {
        change('You won');
        win.volume=1;
        win.play();
    }    
}  

function change(txt)
{
        clearInterval(run);
        ai.point=0; user.point=0;
        music.pause();
        render();
        
document.getElementById("result").innerHTML= txt ;   document.getElementById('status').style.visibility='visible'; 
document.getElementById('status').style.transform='scale(1)'; 
document.getElementById('status').style.animation='pop .27s ease' ;     
        
}
run = setInterval(game,1000/fps);    

}

function again()
{
document.getElementById('status').style.transform='scale(0)'; 
document.getElementById('status').style.animation='' ;  
    document.getElementsByClassName('tab')[0].style.transform='scale(1)';  
document.getElementsByClassName('tab')[0].style.animation='pop .27s ease' ;
  
}

//levels
function eas() {
    aiLevel = 0.03;    
    document.getElementById("easy").style.backgroundColor="cyan";
document.getElementById("hard").style.backgroundColor="#efefef";
document.getElementById("impossible").style.backgroundColor="#efefef";
    win.play();lose.play();
    init();
}
function har() {
    aiLevel = 0.06;
        document.getElementById("easy").style.backgroundColor="#efefef";
document.getElementById("hard").style.backgroundColor="cyan";
document.getElementById("impossible").style.backgroundColor="#efefef";
     win.play();lose.play();
     init();
    
}
function imp() {
    aiLevel = 0.7;
       document.getElementById("easy").style.backgroundColor="#efefef";
document.getElementById("hard").style.backgroundColor="#efefef";
document.getElementById("impossible").style.backgroundColor="cyan";

    win.play();lose.play();
    init();
}
