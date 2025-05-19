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
            //this.image = document.getElementById("player");
            this.collisonX = this.game.width * 0.5;
            this.collisonY = this.game.height * 0.5;
            this.collisonRadius = 30;
            this.speedX = 0;
            this.speedY = 0;
            this.speedModifier = 5;
        }
        update(){
            this.dx = this.game.mouse.x - this.collisonX;
            this.dy = this.game.mouse.y - this.collisonY;
            const distance = Math.hypot(this.dy, this.dx);
            if (distance > this.speedModifier){
                this.speedX = this.dx/distance || 0;
                this.speedY = this.dy/distance || 0;
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
            
            this.collisonX += this.speedX * this.speedModifier;
            this.collisonY += this.speedY * this.speedModifier;
            // horizontal movement

            // horizontal boundaries

            // vertical movement

            // vertical boundaries

            // sprite animation
            /* if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0;
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
            } else {
                this.frameTimer += deltaTime;
            } */
        }
        draw(context){
            context.beginPath();
            context.arc(this.collisonX, this.collisonY, this.collisonRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();

            // line
            context.beginPath();
            context.moveTo(this.collisonX, this.collisonY);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
            //context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Obstacle {
        constructor(game){
            this.game = game;
            this.collisonX = Math.random() * this.game.width;
            this.collisonY = Math.random() * this.game.height;
            this.collisonRadius = 60;
        }
        draw(context){
            context.beginPath();
            context.arc(this.collisonX, this.collisonY, this.collisonRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }
    }
    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.numberOfObstacles = 5;
            this.obstacles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            // event listeners
            canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', e => {
                if (this.mouse.pressed){
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });
        }
        render(context){
            this.player.draw(context);
            this.player.update();
            this.obstacles.forEach(obstacle => obstacle.draw(context));
        }
        init(){
            let attempts = 0;
            while (this.obstacles.length < this.numberOfObstacles && attempts < 500){
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisonX - obstacle.collisonX;
                    const dy = testObstacle.collisonY - obstacle.collisonY;
                    const distance = Math.hypot(dy, dx);
                    const sumOfRadii = testObstacle.collisonRadius + obstacle.collisonRadius;
                    if (distance < sumOfRadii){
                        overlap = true;
                    }
                });
                if (!overlap){
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas);
    game.init();
    console.log(game);
    
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});
