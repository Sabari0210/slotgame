export class Intro extends Phaser.GameObjects.Container {
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
        
        this.x = dimensions.gameWidth/2;
        this.y = dimensions.gameHeight/2;

        if(dimensions.isLandscape){
            this.frame.setScale(.4);
            this.frame.y = -60;
            this.playBtn.y = 200;

        }else{
            this.frame.setScale(.5);
            this.frame.y = -80;

            this.playBtn.y = 250;
        }

    }

    init() {
        this.frame = this.scene.add.sprite(0,-80,"logo");
        this.frame.setOrigin(0.5);
        this.frame.setScale(0.5);
        this.add(this.frame);

        this.playBtn = this.scene.add.sprite(0,180,"playbtn");
        this.playBtn.setOrigin(0.5);
        this.playBtn.setScale(1);
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
        this.show();
    }

    onDown(pointer,sprite){
        sprite.disableInteractive();
        this.scene.playSound('click', { volume: (this.scene.soundVolume/5) });
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