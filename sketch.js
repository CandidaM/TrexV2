var PLAY = 1;              
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided; 
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudsGroup; 
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOverImg,restartImg  
var jumpSound , checkPointSound, dieSound 



var score = 0;  


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png"); 
  
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png") 

  obstacle1 = loadImage("obstacle1.png"); 
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3") 
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
}

function setup() {

  createCanvas(windowWidth, windowHeight);   ////////////// 1 

  //crie um sprite de trex
  trex = createSprite(100,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  //crie sprite ground (solo)
  ground = createSprite(width/2,height-30,width,2);  //////////// 2
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //crie um solo invisível
  invisibleGround = createSprite(width/2,height-10,width,20);   ///////////// 3
  invisibleGround.visible = false;

  gameOver = createSprite(width/2,height/2- 50);  /////////// 4
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;  
  
  restart = createSprite(width/2,height/2);    ///////////  5
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //gerar números aleatórios
  var rand =  Math.round(random(1,100))
  //console.log(rand)

  //crie Grupos de Obstáculos e Nuvens      
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.debug = true
  trex.setCollider("circle",0,0,40);
  //trex.setCollider("rectangle",0,0,200,trex.height); 

}

function draw() {
  //definir cor do plano de fundo
  background(180);

  //cria placar 
  text("Score: " + score, 500,50);
  
  console.log("isto é ",gameState)

  if(gameState === PLAY){

    gameOver.visible = false
    restart.visible = false

    //ground.velocityX = -4;
    ground.velocityX = -(4 + 3* score/100) 
    score = score + Math.round(getFrameRate()/60);  
    
     
    if(score>0 && score%100 === 0){ 
      checkPointSound.play() 
   }
    
    if (ground.x < 0){                
      ground.x = ground.width/2;
    }

    // pulando o trex ao pressionar a tecla de espaço  ou tocando na tela  
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {       ///////////  9
      jumpSound.play( )
      trex.velocityY = -10;
      touches = [];
    }
  
    trex.velocityY = trex.velocityY + 0.8 

    //Gerar Nuvens
    spawnClouds() 
  
    //Gerar Obstáculos
    spawnObstacles()

    if(obstaclesGroup.isTouching(trex)){
      dieSound.play()                 
      gameState = END;

      // Trex pula sozinho
      //trex.velocityY = -10     
      //trex.velocityY = trex.velocityY + 1 
      // Tem que comentar linhas dieSound.play() e  gameState = END;
    }
  
  }
  else if(gameState === END){

    gameOver.visible = true; 
    restart.visible = true; 


    ground.velocityX = 0; 
    trex.velocityY = 0    


    obstaclesGroup.setVelocityXEach(0); 
    cloudsGroup.setVelocityXEach(0); 

    //mudar a animação do trex
    trex.changeAnimation("collided", trex_collided); 

    //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos 
    obstaclesGroup.setLifetimeEach(-1); 
    cloudsGroup.setLifetimeEach(-1);
  }
  
  //console.log(trex.y)
  //console.log(frameCount) 
  
  
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {     
    reset();                         
  }

  drawSprites();
}

 

function spawnClouds(){                       
  if(frameCount % 60 === 0){
    cloud = createSprite(width+20,height-300,40,10);  ////////////// 6
    cloud.addImage(cloudImage)             
    cloud.y = Math.round(random(100,300))   //////// 7
    cloud.velocityX = -3
    cloud.scale = 0.4   
    
    cloud.lifetime = 600

    cloud.depth = trex.depth               
    trex.depth = trex.depth + 1;


    //adicionando nuvem ao grupo 
    cloudsGroup.add(cloud);
  }                      
 }

 function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacle  = createSprite(width+20,height-45,20,30);    ///////////  8         
    //obstacle.velocityX = -6
    obstacle.velocityX = -(6 + score/100);

     // gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }

   //atribuir dimensão e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    //adicione cada obstáculo ao grupo 
    obstaclesGroup.add(obstacle);
  }                      
}

function reset(){  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  

}


