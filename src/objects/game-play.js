import { Score } from "./score";

export class GamePlay extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene,dimension) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.dimension = dimension;
        this.scene.add.existing(this);
        this.score = 0;

        this.init();
    }

    adjust() {

        if(!this.scene.positioned)return;
        let dimensions = this.dimension;
        
        this.x = dimensions.gameWidth/2;
        this.y = dimensions.gameHeight/2;


        if(dimensions.isLandscape){
            this.setScale(.8);
        }else{
            this.setScale(1);
        }

        this.addMask();
    }

    restartLevel(){
         this.reels.forEach(element => {
            element.icons.forEach(element => {
                element.setTexture(this.symbols[Phaser.Math.Between(0,this.symbols.length-1)])
            });
        });
    }


    init() {

        // this.machineHandle = this.scene.add.sprite(200,160,"handle_off");
        // this.machineHandle.setOrigin(0.5,1);
        // this.machineHandle.setScale(0.7);
        // this.add(this.machineHandle);

        // this.machineHandleOn = this.scene.add.sprite(200,80,"handle_on");
        // this.machineHandleOn.setOrigin(0.5,0);
        // this.machineHandleOn.setScale(0.7);
        // this.add(this.machineHandleOn);
        
        this.slotMachine = this.scene.add.sprite(0,0,"slotmachine");
        this.slotMachine.setOrigin(0.5);
        this.slotMachine.setScale(0.7);
        this.add(this.slotMachine);

        this.score = new Score(this.scene,0,0,this,this.dimension);
        this.add(this.score);
        this.score.x = -90;
        this.score.y = 35;

        this.winText = this.scene.add.text(27,34, "WIN", {
            fontFamily: 'Playground', fontSize: 15, color: '#ffffff',
            stroke: '#ffffff', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.add(this.winText);

        this.lightBlink = this.scene.add.sprite(119,34,"roundFrameA");
        this.lightBlink.setOrigin(.5);
        this.lightBlink.status = "win"
        this.lightBlink.setTint(0x178719);//green
        this.add(this.lightBlink);

        this.addIcon();

        // SPIN BUTTON
        this.spinBtn = this.scene.add.sprite(0, 140, 'spinbtn');
        this.spinBtn.setOrigin(0.5);
        this.spinBtn.setScale(0.7);
        this.add(this.spinBtn);

        this.spinBtn.on('pointerdown', () => this.spin());

        this.visible = false;
        // this.show();
    }

    blinkLight(){
        this.blinkTween = this.scene.tweens.add({
            targets: this.lightBlink,
            alpha: 0.5,
            yoyo:true,
            ease: "linear",
            duration: 100,
            repeat:-1,
            onYoyo: () => {
                if(this.lightBlink.status == "win"){
                    this.lightBlink.status = "fail";
                    this.lightBlink.setTint(0xfa1f14);//red
                    this.winText.text = "FAIL";
                }else{
                    this.lightBlink.status = "win";
                    this.lightBlink.setTint(0x178719);//green
                    this.winText.text = "WIN";
                }
            },
            onComplete:()=>{
            }
        })
    }

    addMask(){

        this.reels.forEach((element,i) => {
            if(element.container.mask)
            element.container.clearMask();
            if(element.masked)element.masked.destroy();
            let xP,yP;
            console.log(element.container.x)
            xP = ((this.scene.gameGroup.x) + this.x + ((element.container.x - element.icons[0].displayWidth/1.6)*this.scaleX)) * this.scene.gameScale;
            yP = ((this.scene.gameGroup.y) + this.y - (135*this.scaleX)) * this.scene.gameScale;
            let val = 7;
            console.log(element.icons[0].width,this.scene.gameScale);
            if(window.innerWidth >= 1324)val = 6;
            let maskShape = this.scene.add.graphics();
            maskShape.fillStyle(0x000000,0);
            maskShape.fillRect(
                xP,
                yP,
                (element.icons[0].width/2)*this.scene.gameScale * this.scaleX,
                ((element.icons[0].height/2)*this.scene.gameScale * this.scaleX)*2.7,
            );
            element.masked = maskShape;
            let mask = element.masked.createGeometryMask();
            element.container.setMask(mask);
        });
        
    }

    addIcon(){
         this.symbols = ['icon_1', 'icon_2', 'icon_3', 'icon_4', 'icon_5', 'icon_6', 'icon_7', 'icon_8', 'icon_9', 'icon_10', 'icon_11', 'icon_12', 'icon_13'];
        this.reels = [];

        const reelWidth = 110;
        const reelHeight = 88 * 3; // 3 rows

        for (let i = 0; i < 5; i++) {

            let reelContainer = this.scene.add.container(-120 + i * 60, 0);
            this.add(reelContainer);

            let xP,yP;
            xP = (this.scene.gameGroup.x + this.x -145 + i * 60) * this.scene.gameScale;
            yP = (this.scene.gameGroup.y + this.y - 140) * this.scene.gameScale;
            // xP = this.slotMachine.x + 300;
            // yP = this.slotMachine.y+this.y;
            // Mask rectangle
            let maskShape = this.scene.add.graphics();
            maskShape.fillStyle(0xffffff,1);
            maskShape.fillRect(
                xP,
                yP,
                reelWidth,
                reelHeight,
            );
            // this.add(maskShape);
            let mask = maskShape.createGeometryMask();
            reelContainer.setMask(mask);

            // Reel icon list (5 icons vertically for looping)
            let icons = [];
            for (let j = 0; j < 5; j++) {
                let tex = Phaser.Utils.Array.GetRandom(this.symbols);
                let icon = this.scene.add.sprite(0, -160 + j * 45, tex);
                icon.setScale(0.4);
                icon.setOrigin(0.5);
                reelContainer.add(icon);
                icons.push(icon);
            }

            this.reels.push({
                container: reelContainer,
                icons: icons,
                masked:maskShape,
                isSpinning: false,
                finalSymbol: null
            });
        }
    }

   spin() {
        if (this.spinning) return;
        if (this.scene.soundFrame.visible) return;
        this.scene.playSound('click', { volume: (this.scene.soundVolume/5) });

        this.spinning = true;
        this.spinBtn.disableInteractive();
        let val = Phaser.Math.Between(0,4);
        this.scene.tweens.add({
            targets: this.spinBtn,
            scale: this.spinBtn.scaleX-.1,
            yoyo:true,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.scene.playSound('slot_start', { volume: (this.scene.soundVolume/15) });
                this.reels.forEach((reel, index) => {
                    this.startReelSpin(reel, index,val);
                });
                this.setForcedResults();
                this.blinkLight();
                setTimeout(() => {
                    this.reels.forEach(element => {
                        element.icons.forEach(element => {
                            element.setTexture(this.symbols[Phaser.Math.Between(0,this.symbols.length-1)])
                        });
                    });
                }, 500);
            }
        })
    }

    startReelSpin(reel, index,val) {
        reel.isSpinning = true;

        // Scroll loop
        reel.scrollLoop = this.scene.time.addEvent({
            delay: 20,
            loop: true,
            callback: () => {
                reel.container.y += 20;

                if (reel.container.y >= 45) {

                    reel.container.y -= 45;
                }
            }
        });

        // Delay for each reel stopping
        this.scene.time.delayedCall(1000 + index * 200, () => {
            this.stopReel(reel, index,val);
            if (index === 0) {
                this.scene.playSound('slot_end', { volume: (this.scene.soundVolume/15) });
            }
        });
    }

    setForcedResults() {

        // 🟥 Example 1: RANDOM results (default)
        this.reels.forEach(r => r.forceSymbol = null);

        for (let i = 0; i < 5; i++) {
            this.reels[i].forceSymbol = "";
        }

        // 🟩 Example 2: FORCE all symbols to be same (guaranteed win)
        let frame = ["icon_1","icon_4","icon_5","icon_8","icon_11","icon_12"];
        // const s = "icon_"+Phaser.Math.Between(1,13);
        let s = frame[Phaser.Math.Between(0,frame.length-1)];
        this.reels.forEach(r => r.forceSymbol = s);

        // 🟦 Example 3: Set custom results for each reel (3×5 middle row)
        // → Change these 5 items to anything you want
        // const result = [
        //     "icon_1",
        //     "icon_1",
        //     "icon_1",
        //     "icon_1",
        //     "icon_1"
        // ];

        // for (let i = 0; i < 5; i++) {
        //     this.reels[i].forceSymbol = result[i];
        // }
    }

    stopReel(reel, index,val) {

        reel.scrollLoop.remove();

        // Pick final symbol (forced or random)
        const finalSymbol = reel.forceSymbol ??
                            Phaser.Utils.Array.GetRandom(this.symbols);

        reel.finalSymbol = finalSymbol;
    
        // Middle icon → always index 1
        reel.icons[val].setTexture(finalSymbol);

        // Align middle icon perfectly in mask
        this.scene.tweens.add({
            targets: reel.container,
            y: 0,                // center row perfect align
            duration: 200,
            ease: "Quad.easeOut",
            onComplete: () => {
                reel.isSpinning = false;

                if (index === this.reels.length - 1) {
                    this.checkWin(val);
                }
            }
        });
    }


    checkWin(val) {
        let win = true;
        if(val == 0 || val == 4) win = false;
        for (let i = 1; i < this.reels.length; i++) {
            if (this.reels[i-1].finalSymbol !== this.reels[i].finalSymbol) {
                win = false;
                break;
            }
        }
        if(this.blinkTween)this.blinkTween.stop();
        this.lightBlink.alpha = 1;
        let split = this.reels[0].icons[val].texture.key.split("_")[1];
        console.log(val,this.reels[0].icons[val].texture.key,Math.abs(split));
        let score = [10,5,7,15,20,12,25,20,2,4,30,25,22][Math.abs(split)-1];
        this.spinBtn.setInteractive();
        this.spinning = false;
        
        if (win) {
            this.score.updateScore(score);
            this.lightBlink.status = "win";
            this.lightBlink.setTint(0x178719);//green
            this.winText.text = "WIN";
            // console.log("WIN!! 5 in middle row");
            this.animateWin(val,Math.abs(split));
            if(score == 30){
                this.spinBtn.disableInteractive();
                this.spinning = true;
            }
        } else {
            this.scene.playSound('wrong', { volume: this.scene.soundVolume/5 });
            this.score.updateScore(Math.round(-score/2));
            // console.log("LOSE");
            this.lightBlink.status = "fail";
            this.lightBlink.setTint(0xfa1f14);//red
            this.winText.text = "FAIL";
        }
    }


    animateWin(val,num) {
        if(num != 11) this.scene.playSound('correct', { volume: this.scene.soundVolume/5 });
        else this.scene.playSound('unlock', { volume: this.scene.soundVolume/5 });
        
        const winningIcons = this.reels.map(reel => reel.icons[val]);

        this.scene.tweens.add({
            targets: winningIcons,
            scaleX: .5,
            scaleY: .5,
            yoyo: true,
            duration: 200,
            repeat: 3,
            ease: "Sine.easeInOut"
        });

        if(num == 11){
            this.scene.settingIcon.disableInteractive();
            setTimeout(() => {
                this.scene.confetti.show();
                console.log("true")
            }, 1000);
        }
       
    }

    showWin(symbol) {

        this.scene.tweens.add({
            targets: this.reels,
            scale: 0.35,
            yoyo: true,
            duration: 150,
            repeat: 3
        });

        this.score += 10;
    }

    showLose() {

        this.scene.tweens.add({
            targets: this.reels,
            alpha: 0.6,
            duration: 150,
            yoyo: true
        });
    }

    onDown(pointer,sprite){
        if(this.scene.soundFrame.visible)return;
        if(!this.canClick)return;
        if(this.currentCount==2)return;
        this.currentCount++;
        this.scene.playSound('click_game', { volume: this.scene.soundVolume });
        sprite.disableInteractive();
        this.scene.tweens.add({
            targets: sprite,
            scale: sprite.scaleX-.1,
            yoyo:true,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.flipPage(sprite);
            }
        })
    }

    show() {
        if (this.visible) return
        this.visible = true;
        this.alpha = 0;
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: "linear",
            duration: 200,
            onComplete:()=>{
                this.spinBtn.setInteractive();
                this.spinning = false;
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
            }
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
}