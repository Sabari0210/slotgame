export class Confetti extends Phaser.GameObjects.Container {
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

        let dimensions = this.dimension;
        
        this.x = dimensions.gameWidth/2;
        this.y = dimensions.gameHeight/2;

        this.bg.displayWidth = dimensions.actualWidth;
        this.bg.displayHeight = dimensions.actualHeight;
    }

    init() {

        this.bg = this.scene.add.sprite(0, 0, 'whiteFrame');
        this.bg.setOrigin(0.5);
        this.add(this.bg);

        this.santa = this.scene.add.sprite(0,0,"santa_gift")
        this.santa.setOrigin(0.5);
        this.santa.setScale(0.8);
        this.add(this.santa);

        this.confettiArr = [];

        for(let i=0;i<200;i++){
            let path = Phaser.Math.Between(1, 15);
            let confetti = this.scene.add.sprite(0,0,`confetti_${path}`);
            confetti.setOrigin(0.5);
            confetti.setScale(.4*Math.random());
            confetti.alpha = 0;
            // if(path>5){
            //     confetti.setScale(1);
            // }
            this.add(confetti);
            this.confettiArr.push(confetti);
        }

        this.visible = false;

        // setTimeout(() => {
        //     this.show(); 
        // }, 1000);
    }

    show(){
        if(this.visible)return;
        this.visible = true;
        this.santa.alpha = 0;
        this.santa.angle = 0;
        this.scene.tweens.add({
            targets: this,
            alpha:1,
            duration: 200,        // Smooth duration in milliseconds
            ease: 'Power0', // Easing for smoothness
            onComplete:()=>{

                this.fallConfetti();

                this.scene.tweens.add({
                    targets: this,
                    alpha:1,
                    duration: 200,        // Smooth duration in milliseconds
                    ease: 'Power0', // Easing for smoothness
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: this.santa,
                            alpha:1,
                            scale:{from:0,to:.8},
                            duration: 300,        // Smooth duration in milliseconds
                            ease: 'Power4', // Easing for smoothness
                            onComplete:()=>{
                                 this.scene.playSound('whooo', { volume: this.scene.soundVolume/5 });
                                this.santaTweenAngle = this.scene.tweens.add({
                                    targets: this.santa,
                                    alpha:1,
                                    angle:{from:0,to:5},
                                    yoyo:true,
                                    repeat:-1,
                                    duration: 200,        // Smooth duration in milliseconds
                                    ease: 'Power0', // Easing for smoothness
                                    onComplete:()=>{
                                    }
                                })
                                this.santaTween = this.scene.tweens.add({
                                    targets: this.santa,
                                    alpha:1,
                                    scale:{from:0.8,to:.85},
                                    yoyo:true,
                                    repeat:-1,
                                    duration: 500,        // Smooth duration in milliseconds
                                    ease: 'Power0', // Easing for smoothness
                                    onComplete:()=>{
                                    }
                                })
                            }
                        })
                    }
                })
                
            }
        });
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
                this.scene.showEndCard();
                if(this.santaTween)this.santaTween.stop();
                if(this.santaTweenAngle)this.santaTweenAngle.stop();
            }
        });
    }

    fallConfetti(){
        for(let i=0;i<this.confettiArr.length;i++){
            this.confettiArr[i].x = Phaser.Math.Between((this.dimension.leftOffset - this.x),(this.dimension.rightOffset - this.x));
            this.confettiArr[i].y = this.dimension.topOffset - this.y + Phaser.Math.Between(0,-400);
        }

        for(let i=0;i<this.confettiArr.length;i++){
            this.confettiArr[i].tween = this.scene.tweens.add({
                targets: this.confettiArr[i],
                angle:360,
                ease: "Linear",
                duration: Phaser.Math.Between(3600, 5600),
                repeat:-1,
            })           
        }

        for(let i=0;i<this.confettiArr.length;i++){
            setTimeout(() => {
                this.confettiArr[i].alpha = 1;
                 let speedA = Phaser.Math.Between(2400, 3000);
                this.scene.tweens.add({
                    targets: this.confettiArr[i],
                    y:{
                        from:this.confettiArr[i].y,
                        to:this.dimension.bottomOffset - this.y
                    },
                    ease: "Power0",
                    duration: speedA,
                    onComplete:()=>{
                    }
                })

                this.scene.tweens.add({
                    targets: this.confettiArr[i],
                    alpha:1,
                    ease: "Power0",
                    duration: speedA - speedA/3.5,
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: this.confettiArr[i],
                            alpha:0,
                            ease: "Power0",
                            duration: speedA/3.5,
                            onComplete:()=>{
                                if(this.confettiArr[i].tween)this.confettiArr[i].tween.stop();
                                if(i==(this.confettiArr.length-1))this.hide();
                            }
                        })
                    }
                })
            }, i*10);
        }
    }

    throwConfetti(){

        for(let i=0;i<this.confettiArr.length;i++){
            if(i>(this.confettiArr.length/2)){
                this.confettiArr[i].x = (this.dimension.gameWidth/2 - this.dimension.actualWidth/2) - this.x;
            }else{
                this.confettiArr[i].x = (this.dimension.gameWidth/2 + this.dimension.actualWidth/2) - this.x;
            }

            this.confettiArr[i].y = 0;
        }

        for(let i=0;i<this.confettiArr.length;i++){
            this.confettiArr[i].tween = this.scene.tweens.add({
                targets: this.confettiArr[i],
                angle:360,
                ease: "Linear",
                duration: Phaser.Math.Between(3600, 5600),
                repeat:-1,
            })           
        }
        for(let i=0;i<this.confettiArr.length; i++){
            this.popup(i);
        }
    }

    popup(i){
        this.scene.tweens.add({
            targets: this.confettiArr[i],
            alpha: 1,
            scale:{
                from : 0,
                to:this.confettiArr[i].scaleX,
            },
            x:{
                from:this.confettiArr[i].x,
                to:Phaser.Math.Between((this.dimension.gameWidth/2 - this.x - 250), (this.dimension.gameWidth/2 - this.x + 250))
            },
            y:{
                from:this.confettiArr[i].y,
                to:Phaser.Math.Between((this.dimension.topOffset - this.y), (this.dimension.topOffset - this.y - 300))
            },
            ease: "Power0",
            duration: 400,
            onComplete:()=>{
                let speedA = Phaser.Math.Between(2400, 6000);
                this.scene.tweens.add({
                    targets: this.confettiArr[i],
                    y:{
                        from:this.confettiArr[i].y,
                        to:this.dimension.bottomOffset - this.y
                    },
                    ease: "Power0",
                    duration: speedA,
                    onComplete:()=>{
                    }
                })

                this.scene.tweens.add({
                    targets: this.confettiArr[i],
                    alpha:1,
                    ease: "Power0",
                    duration: speedA - speedA/3.5,
                    onComplete:()=>{
                        this.scene.tweens.add({
                            targets: this.confettiArr[i],
                            alpha:0,
                            ease: "Power0",
                            duration: speedA/3.5,
                            onComplete:()=>{
                                if(this.confettiArr[i].tween)this.confettiArr[i].tween.stop();
                                if(i==(this.confettiArr.length-1))this.hide();
                            }
                        })
                    }
                })
            }
        })
    }
}