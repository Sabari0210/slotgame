export class Score extends Phaser.GameObjects.Container {
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

    init() {
        this.currentScore = 0;
        this.oldScore = 0;

        this.score = this.scene.add.text(0,0, "SCORE : " + this.currentScore, {
            fontFamily: 'Playground', fontSize: 15, color: '#ffffff',
            stroke: '#ffffff', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.add(this.score);

    }

    updateScore(val){
        this.currentScore += val;
        if(this.currentScore<=0)this.currentScore = 0;
        let score = this.oldScore;
        if(score < this.currentScore){
            let count = 0;
            for(let i=score;i<=this.currentScore;i++){
                setTimeout(() => {
                    this.score.text = "SCORE : " + i;
                }, count*50);
                count++;
            }
        }else{
            let count = 0;
            for(let i=score;i>=this.currentScore;i--){
                setTimeout(() => {
                    this.score.text = "SCORE : " + i;
                }, count*50);
                count++;
            }
        }
       
       
        this.oldScore = this.currentScore;
    }
}