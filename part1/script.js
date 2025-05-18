window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280 / 2;
    canvas.height = 720 / 2;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    //Objects in JavaScript our so called reference to data types 
    class Player {
        constructor(game){
            this.game = game;
            this.image = document.getElementById("player");
            this.spriteWidth = 100;
            this.spriteHeight = 91.3;
            this.width = this.spriteWidth/1.2;
            this.height = this.spriteHeight/1.2;
            this.collisonX = this.game.width * 0.5;
            this.collisonY = this.game.height * 0.5;
            this.collisonRadius = 30;
            this.x = this.game.width/2 - this.width/2;
            this.y = this.game.height - this.height - this.game.groundMargin;
            this.vy = 0;
            this.weight = 1;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame= 6;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 0;
            this.maxSpeed = 10;
        }
        update(input, deltaTime){
            // horizontal movement

            // horizontal boundaries

            // vertical movement

            // vertical boundaries

            // sprite animation
            if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0;
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(context){
            context.beginPath();
            context.arc(this.collisonX, this.collisonY, this.collisonRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            //context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }
    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
        }
        render(context){
            this.player.draw(context);
        }
    }

    const game = new Game(canvas);
    game.render(ctx);
    console.log(game);

    function animate(){
        
    }
});
