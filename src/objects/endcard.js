export class Endcard extends Phaser.GameObjects.Container {
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

    adjust() {

        if(!this.scene.positioned)return;
        let dimensions = this.dimension;
        
        if(dimensions.isLandscape){
            this.setScale(.9);
            
            this.frame.x = dimensions.gameWidth/2 - 200;
            this.frame.y = dimensions.gameHeight/2 + 20;

            this.wellDone.x = dimensions.gameWidth/2 + 350;
            this.wellDone.y = dimensions.gameHeight/2 - 100;

            this.playBtn.x = dimensions.gameWidth/2 + 350;
            this.playBtn.y = dimensions.gameHeight/2 + 100;
        }else{
            this.setScale(1);

            this.frame.x = dimensions.gameWidth/2;
            this.frame.y = dimensions.gameHeight/2 - 100;

            this.wellDone.x = dimensions.gameWidth/2;
            this.wellDone.y = dimensions.gameHeight/2 + 200;

            this.playBtn.x = dimensions.gameWidth/2;
            this.playBtn.y = dimensions.gameHeight/2 + 400;

        }

    }

    init() {
        this.frame = this.scene.add.sprite(0,-150,"logo");
        this.frame.setOrigin(0.5);
        this.frame.setScale(0.5);
        this.add(this.frame);

        this.wellDone = this.scene.add.sprite(0,70,"welldone");
        this.wellDone.setOrigin(0.5);
        this.wellDone.setScale(0.8);
        this.add(this.wellDone);

        this.playBtn = this.scene.add.sprite(0,210,"retrybtn");
        this.playBtn.setOrigin(0.5);
        this.add(this.playBtn);

        // this.playBtn.on("pointerup",this.onDown);
        this.playBtn.on('pointerup', function(pointer) {
            this.onDown(pointer,this.playBtn);
        }.bind(this));
        
        // this.score = this.scene.add.text(0,-20, "SCORE", {
        //     font: 'Bold 24px Arial',
        //     fill: '#000000'
        // }).setOrigin(0.5, 0.5);
        // this.add(this.score);

        // this.scoreTxt = this.scene.add.text(0,20, this.currentScore, {
        //     font: 'Bold 34px Arial',
        //     fill: '#000000'
        // }).setOrigin(0.5, 0.5);
        // this.add(this.scoreTxt);

        this.visible = false;
        // this.show();
    }

    onDown(pointer,sprite){
        this.scene.playSound('click', { volume: this.scene.soundVolume/5 });
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

    show(val) {
        if (this.visible) return
        this.visible = true;
        this.alpha = 0;
        this.frame.alpha = 0;
        this.wellDone.alpha = 0;
        this.playBtn.alpha = 0;
        if(val){
            this.wellDone.setTexture("timeout");
            this.scene.playSound('fail', { volume: this.scene.soundVolume/5 });
        }
        else {
            this.wellDone.setTexture("welldone");
            this.scene.playSound('victory', { volume: this.scene.soundVolume/5 });
        }
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
                            targets: this.wellDone,
                            alpha: 1,
                            scale:{from:this.wellDone.scaleX+.2,to:this.wellDone.scaleX},
                            ease: "Power2",
                            duration: 200,
                            onComplete:()=>{
                               this.scene.tweens.add({
                                    targets: this.playBtn,
                                    alpha: 1,
                                    y:{from:this.playBtn.y+100,to:this.playBtn.y},
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
                this.scene.restartGame();
            }
        });
    }
}