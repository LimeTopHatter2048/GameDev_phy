window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280 / 2;
    canvas.height = 720 / 2;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.font = '30px Exile';
    ctx.textAlign = 'center';

    //Objects in JavaScript our so called reference to data types 
    class Player {
        constructor(game){
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30;
            this.image = document.getElementById('bull');
            this.spriteWidth = 255;
            this.spriteHeight = 256;
            this.width = this.spriteWidth/2.5;
            this.height = this.spriteHeight/2.5;
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = 0;
            this.speedX = 0;

            this.speedY = 0;
            this.speedModifier = 5;
        }
        restart(){
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5;
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
            // line
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }
        update(){
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            // sprite animation
            const angle = Math.atan2(this.dy, this.dx);
            if (angle < -2.74 || angle > 2.74) this.frameY = 6;
            else if (angle < -1.96) this.frameY = 7;
            else if (angle < -1.17) this.frameY = 0;
            else if (angle < -0.39) this.frameY = 1;
            else if (angle < 0.39) this.frameY = 2;
            else if (angle < 1.17) this.frameY = 3;
            else if (angle < 1.96) this.frameY = 4;
            else if (angle < 2.74) this.frameY = 5;
            

            const distance = Math.hypot(this.dy, this.dx);
            if (distance > this.speedModifier){
                this.speedX = this.dx/distance || 0;
                this.speedY = this.dy/distance || 0;
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
            
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;

            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5;
            // horizontal movement

            // horizontal boundaries
            if(this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius; 
            else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;

            // vertical movement

            // vertical boundaries
            if (this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
            else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;

            // collisions with obstacles
            this.game.obstacles.forEach(obstacle => {
                // [(distance < sumOfRadii), distance, sumOfRadii, dx, dy]
                let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
                //let collision = game.checkCollision(this,obstacle)[0];
                if(collision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
                    this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
                }
            });

            // sprite animation
            /* if (this.frameTimer > this.frameInterval){
                this.frameTimer = 0;
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
            } else {
                this.frameTimer += deltaTime;
            } */
        }
    }

    class Obstacle {
        constructor(game){
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 30;
            this.image = document.getElementById('obstacles');
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth/2.5;
            this.height = this.spriteHeight/2.5;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 -20;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 3);
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }   
        }
        update(){

        }
    }
    class Egg {
        constructor(game){
            this.game = game;
            this.collisionRadius = 20;
            this.margin = this.collisionRadius * 3;
            this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2));
            this.collisionY = this.game.topMargin + this.margin + Math.random() * (this.game.height - this.game.topMargin - 2 * this.margin);
            this.image = document.getElementById('egg');
            this.spriteWidth = 110;
            this.spriteHeight = 135;
            this.width = this.spriteWidth/2.5;
            this.height = this.spriteHeight/2.5;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 10 * 1000;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
                context.fillText(displayTimer, this.collisionX, this.collisionY - this.collisionRadius * 2);
            }   
        }
        update(deltaTime){
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 10;
            // collisions with obstacles
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.hatchlings];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
                if(collision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
                }
            });
            // hatching
            if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin){
                this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY));
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            } else {
                this.hatchTimer += deltaTime;
            }
        }
    }

    class Larva {
        constructor(game, x, y){
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.collisionRadius = 20;
            this.speedY = Math.random() + 1;
            this.image = document.getElementById('larva');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width = this.spriteWidth/2.5;
            this.height = this.spriteHeight/2.5;
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 2);
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            } 
        }
        update(){
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 10;
            this.collisionY -= this.speedY;
            // move to safety
            if (this.collisionY < this.game.topMargin){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                if (!this.game.gameOver) this.game.score++;
                for (let i = 0; i < 3; i++){
                    this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'));
                }
            }
            // collisions with obstacles
            let collisionObjects = [this.game.player, ...this.game.obstacles];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
                if(collision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
                }
            });
            // collisions with enemies
            this.game.enemies.forEach(enemy =>{
                if (this.game.checkCollision(this, enemy)[0] && !this.game.gameOver){
                    this.markedForDeletion = true;
                    this.game.removeGameObjects();
                    this.game.lostHatchlings++;
                    for (let i = 0; i < 5; i++){
                        this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'red'));
                    }
                }
            });
        }
    }
    class Enemy {
        constructor(game){
            this.game = game;
            this.collisionRadius = 20;
            this.margin = this.collisionRadius * 3;
            this.speedX = Math.random() * 3 + 2;
            this.image = document.getElementById('toads');
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth/2.5;
            this.height = this.spriteHeight/2.5;
            this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 4);
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            } 
        }
        update(){
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 10;
            this.collisionX -= this.speedX;
            if (this.spriteX + this.width < 0 && !this.game.gameOver){
                this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
                this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
                this.frameY = Math.floor(Math.random() * 4);
            }
            // collisions with obstacles
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
                if(collision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
                }
            });
        }
        
    }
    class Particle {
        constructor(game, x, y, color){
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.color = color;
            this.radius = Math.floor(Math.random() * 10 + 5);
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 2 + 0.5;
            this.angle = 0;
            this.va = Math.random() * 0.1 + 0.01;
            this.markedForDeletion = false;
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.restore();
        }
    }
    class Firefly extends Particle {
        update(){
            this.angle += this.va;
            this.collisionX += Math.cos(this.angle) * this.speedX;
            this.collisionY -= this.speedY;
            if (this.collisionY < 0 - this.radius){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }
        }
    }
    class Spark extends Particle {
        update(){
            this.angle += this.va * 0.5;
            this.collisionX -= Math.cos(this.angle) * this.speedX;
            this.collisionY -= Math.sin(this.angle) * this.speedY;
            if (this.radius > 0.1) this.radius -= 0.05;
            if (this.radius < 0.2){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }
        }
    }

    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargin = 90;
            this.debug = false;
            this.player = new Player(this);
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.eggTimer = 0;
            this.eggInterval = 1000;
            this.numberOfObstacles = 10;
            this.maxEggs = 5;
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.gameObjects = [];
            this.lostHatchlings = 0;
            this.winningScore = 1;
            this.gameOver = false;
            this.score = 0;
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
            window.addEventListener('keydown', e => {
                if (e.key == 'd') this.debug = !this.debug;
                console.log(this.debug);
                if (e.key == 'r') this.restart();
            });
        }
        render(context, deltaTime){
            if( this.timer > this.interval){
                context.clearRect(0, 0, this.width, this.height);
                this.gameObjects = [this.player, ...this.eggs, ...this.obstacles, ...this.enemies, ...this.hatchlings, ...this.particles];
                // sort by vertical position
                this.gameObjects.sort((a,b) => {
                    return a.collisionY - b.collisionY;
                });
                this.gameObjects.forEach(object => {
                    object.draw(context)
                    object.update(deltaTime);
                });
                this.timer = 0;
            }
            this.timer += deltaTime;

            //add eggs periodically
            if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver){
                this.addEgg();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime; 
            }

            // draw status text
            context.save();
            context.textAlign = 'left';
            context.fillText('Score: ' + this.score, 25, 50);
            if (this.debug){
                context.fillText('Lost: ' + this.lostHatchlings, 25, 100);
            }
            context.restore();

            // win / lose message
            if (this.score >= this.winningScore){
                this.gameOver = true;
                context.save();
                context.fillStyle = 'rgba(0,0,0,0.5)';
                context.fillRect(0, 0, this.width, this.height);
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.shadowOffSetX = 4;
                context.shadowOffSetY = 4;
                context.shadowColor = 'black';
                let message1;
                let message2;
                if (this.lostHatchlings <= 5){
                    message1 = "Bullseye!!!";
                    message2 = "You bullied the bullies";
                } else {
                    message1 = "BullLocks!";
                    message2 = "You lost "+ this.lostHatchlings + " hatchlings, don't be be a pushover!";
                }
                context.font = "100px Exile";
                context.fillText(message1, this.width * 0.5, this.height * 0.5 - 20);
                context.font = "20px Exile";
                context.fillText(message2, this.width * 0.5, this.height * 0.5 + 20);
                context.fillText("Final score " + this.score + ". Press 'R' to butt heads again!", this.width * 0.5, this.height * 0.5  + 50);

                context.restore();
            }
        }
        checkCollision(a, b){
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            const sumOfRadii = a.collisionRadius + b.collisionRadius;
            return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
        }
        addEgg(){
            this.eggs.push(new Egg(this));
        }
        addEnemy(){
            this.enemies.push(new Enemy(this));
        }
        removeGameObjects(){
            this.eggs = this.eggs.filter(object => !object.markedForDeletion);
            this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion);
            this.particles = this.particles.filter(object => !object.markedForDeletion);
        }
        restart(){
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }
            this.score = 0;
            this.lostHatchlings = 0;
            this.gameOver = false;
            this.init();
        }
        init(){
            for (let i = 0; i < 5; i++){
                this.addEnemy();
            }
            let attempts = 0;
            while (this.obstacles.length < this.numberOfObstacles && attempts < 500){
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 80;
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer;
                    if (distance < sumOfRadii){
                        overlap = true;
                    }
                });
                const margin = testObstacle.collisionRadius * 3;
                if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin){
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas);
    game.init();
    console.log(game);
    
    let lastTime = 0;
    function animate(timeStamp){
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});
