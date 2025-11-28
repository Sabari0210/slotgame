export class Timer extends Phaser.GameObjects.Container {
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
            this.x = dimensions.leftOffset + this.frame.displayWidth/2 + 10;
            this.y = this.scene.logo.y + this.scene.logo.displayHeight;
        }else{
            this.x = dimensions.gameWidth/2;
            this.y = dimensions.topOffset + this.frame.displayHeight/2 + 50;
        }

    }

    init() {
        this.gameOver = false;
        this.frame = this.scene.add.sprite(0,0,"timerframe");
        this.frame.setOrigin(0.5);
        this.frame.setScale(0.6);
        this.add(this.frame);

        this.totalTime = 60;      // seconds
        this.timeLeft = this.totalTime;

        this.timerText = this.scene.add.text(0, 10, "60:00", {
            fontFamily: 'Playground', fontSize: 25, color: '#ffffff',
        });
        this.timerText.setOrigin(.5);
        this.add(this.timerText);

        this.timerSound = this.scene.sound.add("timer", {
            volume: this.scene.soundVolume / 5
        });

        this.visible = false;
        // this.show();
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        // Add leading zero for seconds below 10
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    update(time, delta) {
        if(!this.gameStart)return;
        if(this.gameOver)return;
    
        if (this.timeLeft > 0) {
            this.timeLeft -= delta / 1000; // convert ms to seconds

            if (this.timeLeft < 0) this.timeLeft = 0;

            this.timerText.setText(this.formatTime(this.timeLeft));

        }else{
            this.gameOver = true;
            this.showFail();
        }

        if (this.timeLeft <= 5 && !this.isBlinking) {
            this.isBlinking = true;
        }

        if (this.isBlinking) {
            this.blinkTimer += delta;
            if (this.blinkTimer >= 200) {   // 200ms
                this.timerText.alpha = this.timerText.alpha === 1 ? 0.2 : 1;
                this.blinkTimer = 0;
            }

            if(!this.timerSound.isPlaying){
                this.timerSound.play();
            }

        }
    }

    showFail(){
        this.scene.gamePlay.canClick = false;
        this.timerText.alpha = 1;
        setTimeout(() => {
            this.timerText.alpha = 1;
            this.hide(true);
        }, 1000);
        this.gameStart = false;
    }

    stopTimer(){
        this.gameOver = true;
        this.gameStart = false;
        this.timerSound.stop();
        this.hide();
    }

    resetTimer(val){
        this.gameStart = false;
        this.totalTime = val;      // seconds
        this.timeLeft = this.totalTime;
        this.timerText.setText(this.formatTime(this.timeLeft));
        this.show();
    }

    show() {
        return
        if (this.visible) return
        this.isBlinking = false;
        this.blinkTimer = 0;
        this.soundTimer = 0;
        this.timerText.alpha = 1;
        this.visible = true;
        this.alpha = 0;
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: "linear",
            duration: 200,
            onComplete:()=>{
                this.gameOver = false;
                setTimeout(() => {
                    this.gameStart = true;
                }, 1000);
               
            }
        })
    }

    hide(val){
        if(!this.visible)return;
        this.scene.tweens.add({
            targets: this,
            alpha:0,
            duration: 200,        // Smooth duration in milliseconds
            ease: 'Power0', // Easing for smoothness
            onComplete:()=>{
                this.alpha = 0;
                this.visible = false;
                if(val){
                    this.scene.showEndCard(val);
                }
            }
        });
    }
}