export class Snow extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene,dimension) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.dimension = dimension;
        this.scene.add.existing(this);
        this.init();
    }

    update(time,delta){
        // In your scene's update(time, delta):
        this.snowData.forEach((flake) => {
            const s = flake.sprite;
            const t = time / 1000; // convert ms to seconds

            // Fall speed (delta ensures frame-rate independence)
            s.y += (flake.speed * delta) / 1000;

            // Gentle horizontal sway using a sine wave
            s.x += Math.sin(t + flake.offset) * (flake.drift * delta / 1000);

            // Wrap back to top
            if (s.y > this.dimension.bottomOffset + 100) {
                s.y = this.dimension.topOffset - 100;
                s.x = Phaser.Math.Between(this.dimension.leftOffset, this.dimension.rightOffset);
            }
        });

    }

    adjust() {

        if(!this.scene.positioned)return;
        let dimensions = this.dimension;
        
        // this.x = dimensions.gameWidth/2;
        // this.y = dimensions.gameHeight/2;

    }

    init() {
        // this.snowflakes = this.scene.add.container();
        // this.add(this.snowflakes);

        // for (let i = 0; i < 50; i++) {
        //     let snow = this.scene.add.image(
        //         Phaser.Math.Between(0, this.scene.scale.width),
        //         Phaser.Math.Between(0, this.scene.scale.height),
        //         "snow"
        //     );
        //     snow.setScale(Phaser.Math.FloatBetween(0.3, 0.8)); // vary size a bit
        //     snow.setAlpha(Phaser.Math.FloatBetween(0.6, 1));   // vary transparency
        //     this.snowflakes.add(snow);
        // }

        this.snowflakes = this.scene.add.container();
        this.add(this.snowflakes);

        let minDistance = 100; // minimum distance between flakes
        this.snowData = []; // store speed + drift per flake
        for (let i = 0; i < 100; i++) {

            let x, y, valid = false;

            // Try multiple times to find a position far enough from others
            for (let attempts = 0; attempts < 20 && !valid; attempts++) {
                x = Phaser.Math.Between(0, this.scene.scale.width+200);
                y = Phaser.Math.Between(-300, this.scene.scale.height);
                valid = true;

                // Check if too close to an existing snowflake
                for (const flake of this.snowData) {
                    const dx = flake.sprite.x - x;
                    const dy = flake.sprite.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDistance) {
                        valid = false;
                        break;
                    }
                }
            }

            const snow = this.scene.add.image(
                x,
                y,
                'snow_'+Phaser.Math.Between(1,7)
            );

            snow.setScale(Phaser.Math.FloatBetween(0.3, 0.9));
            snow.setAlpha(Phaser.Math.FloatBetween(0.3, .6));
            this.snowflakes.add(snow);

            // Each flake has its own properties
            this.snowData.push({
                sprite: snow,
                speed: Phaser.Math.FloatBetween(30, 80),   // pixels per second
                drift: Phaser.Math.FloatBetween(-20, 20),  // horizontal drift speed
                offset: Phaser.Math.FloatBetween(0, Math.PI * 2) // unique wave phase
            });
        }

        // const confettiEmitter = this.scene.add.particlesFromImages(['snow']);

        // confettiEmitter.createEmitter({
        //     x: { min: 0, max: this.scale.width },
        //     y: 0,
        //     lifespan: 3000,
        //     speedY: { min: 200, max: 300 },
        //     speedX: { min: -100, max: 100 },
        //     rotate: { start: 0, end: 360 },
        //     gravityY: 300,
        //     quantity: 8,
        //     // tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]
        // });
        // this.leftSnowArr = [];
        // this.midSnowArr = [];
        // this.rightSnowArr = [];
        // for(let i=0;i<80;i++){
        //     let snow = this.scene.add.sprite(0,0,"snow");
        //     snow.setOrigin(.5);
        //     snow.setScale(Math.random(.3,.8));
        //     this.add(snow);
        //     snow.alpha = 0;
        //     if(i<40){
        //         this.leftSnowArr.push(snow);
        //         this.scene.tweens.add({
        //             targets: snow,
        //             angle:{from:0,to:360},
        //             ease: "linear",
        //             duration: Phaser.Math.Between(5000,10000),
        //             repeat:-1,
        //             onComplete:()=>{
        //             }
        //         })
        //     }
        //     // else if(i<80){
        //     //      this.scene.tweens.add({
        //     //         targets: snow,
        //     //         angle:{from:0,to:360},
        //     //         ease: "linear",
        //     //         duration: Phaser.Math.Between(5000,10000),
        //     //         repeat:-1,
        //     //         onComplete:()=>{
        //     //         }
        //     //     })
        //     //     this.midSnowArr.push(snow);
        //     // }
        //     else{
        //          this.scene.tweens.add({
        //             targets: snow,
        //             angle:{from:360,to:0},
        //             ease: "linear",
        //             duration: Phaser.Math.Between(5000,10000),
        //             repeat:-1,
        //             onComplete:()=>{
        //             }
        //         })
        //         this.rightSnowArr.push(snow);
        //     }
        // }

        // setTimeout(() => {
        //     this.adjustPosition();
        // }, 100);
    }

    adjustPosition(){
        for(let i=0;i<this.leftSnowArr.length;i++){
            this.leftSnowArr[i].x = Phaser.Math.Between(this.dimension.leftOffset - 200,this.dimension.gameWidth/2);
            this.leftSnowArr[i].y = this.dimension.topOffset - 200;
        }

        for(let i=0;i<this.midSnowArr.length;i++){
            this.midSnowArr[i].x = Phaser.Math.Between(this.dimension.gameWidth/2 - 200,this.dimension.gameWidth/2 + 200);
            this.midSnowArr[i].y = this.dimension.topOffset - 200;
        }

        for(let i=0;i<this.rightSnowArr.length;i++){
            this.rightSnowArr[i].x = Phaser.Math.Between(this.dimension.rightOffset + 200,this.dimension.gameWidth/2);
            this.rightSnowArr[i].y = this.dimension.topOffset - 200;
        }

        this.startSnow();
    }

    startSnow(){

        this.scene.time.addEvent({
            delay: 30,
            loop: true,
            callback: () => {
                this.snowflakes.list.forEach((flake) => {
                    flake.y += Phaser.Math.Between(1, 3);
                    flake.x += Math.sin(flake.y * 0.02);
                        console.log(flake.y,this.scene.scale.height)
                    if (flake.y > (this.scene.scale.height/2)) {
                        flake.y = 0;
                        flake.x = Phaser.Math.Between(0, this.scene.scale.width);
                    }
                });
            }
        });
        return
        for(let i=0;i<this.leftSnowArr.length;i++){
            setTimeout(() => {
                this.snowingLeft(this.leftSnowArr[i]);
            }, i*100);
        }

        // for(let i=0;i<this.midSnowArr.length;i++){
        //     setTimeout(() => {
        //         this.snowingMid(this.midSnowArr[i]);
        //     }, i*500);
        // }

        for(let i=0;i<this.rightSnowArr.length;i++){
            setTimeout(() => {
                this.snowingRight(this.rightSnowArr[i]);
            }, i*1000);
        }
    }

    snowingLeft(snow){
        this.scene.tweens.add({
            targets: snow,
            alpha:.6,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.scene.tweens.add({
                    targets: snow,
                    x: {from:Phaser.Math.Between(this.dimension.leftOffset - 200,this.dimension.gameWidth/2),to:Phaser.Math.Between(this.dimension.gameWidth/2,this.dimension.rightOffset + 200)},
                    y: {from:Phaser.Math.Between(this.dimension.topOffset - 200,this.dimension.topOffset),to:Phaser.Math.Between(this.dimension.bottomOffset + 100,this.dimension.bottomOffset + 200)},
                    ease: "linear",
                    duration: Phaser.Math.Between(10000,17000),
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: snow,
                            alpha:0,
                            ease: "linear",
                            duration: 100,
                            onComplete:()=>{
                                this.snowingLeft(snow);
                            }
                        })
                    }
                })
            }
        })
    }

    snowingMid(snow){
        this.scene.tweens.add({
            targets: snow,
            alpha:.5,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.scene.tweens.add({
                    targets: snow,
                    x: {from:Phaser.Math.Between(this.dimension.gameWidth/2 - 200,this.dimension.gameWidth/2 + 200),to:Phaser.Math.Between(this.dimension.gameWidth/2 - 200,this.dimension.gameWidth/2 + 200)},
                    y: {from:Phaser.Math.Between(this.dimension.topOffset - 200,this.dimension.topOffset),to:Phaser.Math.Between(this.dimension.bottomOffset + 100,this.dimension.bottomOffset + 200)},
                    ease: "linear",
                    duration: Phaser.Math.Between(12000,19000),
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: snow,
                            alpha:0,
                            ease: "linear",
                            duration: 100,
                            onComplete:()=>{
                                this.snowingMid(snow);
                            }
                        })
                    }
                })
            }
        })
    }

    snowingRight(snow){
        this.scene.tweens.add({
            targets: snow,
            alpha:.4,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.scene.tweens.add({
                    targets: snow,
                    x: {from:Phaser.Math.Between(this.dimension.rightOffset + 200,this.dimension.gameWidth/2),to:Phaser.Math.Between(this.dimension.gameWidth/2,this.dimension.leftOffset - 200)},
                    y: {from:Phaser.Math.Between(this.dimension.topOffset - 200,this.dimension.topOffset),to:Phaser.Math.Between(this.dimension.bottomOffset + 100,this.dimension.bottomOffset + 200)},
                    ease: "linear",
                    duration: Phaser.Math.Between(20000,25000),
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: snow,
                            alpha:0,
                            ease: "linear",
                            duration: 100,
                            onComplete:()=>{
                                this.snowingRight(snow);
                            }
                        })
                    }
                })
            }
        })
    }

    onDown(pointer,sprite){
        sprite.disableInteractive();
        this.scene.tweens.add({
            targets: sprite,
            scale: sprite.scaleX-.2,
            yoyo:true,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.hide();
            }
        })
    }

    show() {
        if (this.visible) return
        this.visible = true;
        this.alpha = 0;
        this.frame.alpha = 0;
        this.playBtn.alpha = 0;
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: "linear",
            duration: 200,
            onComplete:()=>{
                this.scene.tweens.add({
                    targets: this.frame,
                    alpha: 1,
                    y:{from:this.frame.y - 100,to:this.frame.y},
                    ease: "Power2",
                    duration: 200,
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: this.playBtn,
                            alpha: 1,
                            scale:{from:this.playBtn.scaleX+.2,to:this.playBtn.scaleX},
                            ease: "Power2",
                            duration: 200,
                            onComplete:()=>{
                                this.playBtn.setInteractive();
                            }
                        })
                    }
                })
            }
        })
    }

    hide(){
        if(!this.visible)return;
        this.scene.tweens.add({
            targets: this,
            alpha:0,
            duration: 200,        // Smooth duration in milliseconds
            ease: 'Power0', // Easing for smoothness
            onComplete:()=>{
                this.alpha = 0;
                this.visible = false;
                this.scene.gameStarted();
            }
        });
    }
}