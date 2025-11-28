import { Scene } from 'phaser';
import portrait from '../data/portrait.js';
import landscape from '../data/landscape.js';
import { Intro } from '../objects/intro.js';
import { Snow } from '../objects/snow.js';
import { GamePlay } from '../objects/game-play.js';
import { SoundFrame } from '../objects/sound-frame.js';
import { Endcard } from '../objects/endcard.js';
import { Confetti } from '../objects/confetti.js';


let dimensions = { 
                }

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        this.scale.lockOrientation(this.game.orientation);
        // this.scale.lockOrientation('portrait');
        // this.scale.lockOrientation('landscape');

        let ratio = window.devicePixelRatio;
        dimensions.fullWidth = window.innerWidth * ratio;
        dimensions.fullHeight = window.innerHeight * ratio;
        // Check and adjust resolution for Portrait
        // if (dimensions.fullWidth > dimensions.fullHeight) {
        //     [dimensions.fullHeight, dimensions.fullWidth] = [dimensions.fullWidth, dimensions.fullHeight];
        // }
        // this.switchMode();

        // Check and adjust resolution for landscape
        // if (dimensions.fullWidth < dimensions.fullHeight) {
        //     [dimensions.fullWidth, dimensions.fullHeight] = [dimensions.fullHeight, dimensions.fullWidth];
        // }
        // this.switchMode();
       
        if (dimensions.isPortrait != dimensions.fullWidth < dimensions.fullHeight) {
            this.switchMode(!dimensions.isPortrait);
        } else {
            this.switchMode(dimensions.isPortrait);
        }

        this.scale.displaySize.setAspectRatio(dimensions.fullWidth / dimensions.fullHeight);
        this.scale.refresh();
    }

    switchMode(isPortrait) {

        dimensions.isPortrait = isPortrait;
        dimensions.isLandscape = !isPortrait;

        let mode = portrait;

        if (dimensions.isLandscape)
            mode = landscape;

        // for portrait
        // dimensions.isPortrait = true;
        // dimensions.isLandscape = false;
        // let mode = portrait;

        // for landscape
        // dimensions.isPortrait = false;
        // dimensions.isLandscape = true;
        // let mode = landscape;

        dimensions.gameWidth = mode.gameWidth;
        dimensions.gameHeight = mode.gameHeight;
    }

    gameResized() {
        try {
			if (`${PLATFORM}` !== "tiktok") {
				try {
					if (mraid) {
						var screenSize = mraid.getScreenSize();
						mraid.setResizeProperties({"width": screenSize.width, "height": screenSize.height, "offsetX": 0, "offsetY": 0});
						mraid.expand();
					}
				} catch (e) {

				}
			}
		}
		catch (e) {
			
		}        

        if (this.resizing) return;
        this.resizing = true; // Set a flag to indicate resizing is in progress

        try {
            let size;
            try {
                size = {
                    width: Math.ceil(window.innerWidth) * window.devicePixelRatio,
                    height: Math.ceil(window.innerHeight) * window.devicePixelRatio,
                };
            } catch (error) {
                console.error("Error getting screen size:", error);
                size = { width: 800, height: 600 }; // Fallback dimensions
            }

            dimensions.fullWidth = size.width;
            dimensions.fullHeight = size.height;

            // Force Portrait dimensions
            // if (dimensions.fullWidth > dimensions.fullHeight) {
            //     [dimensions.fullHeight, dimensions.fullWidth] = [dimensions.fullWidth, dimensions.fullHeight];
            // }

            // Force landscape dimensions
            // if (dimensions.fullWidth < dimensions.fullHeight) {
            //     [dimensions.fullWidth, dimensions.fullHeight] = [dimensions.fullHeight, dimensions.fullWidth];
            // }

            // this.switchMode();

            if (dimensions.isPortrait != dimensions.fullWidth < dimensions.fullHeight) {
                this.switchMode(!dimensions.isPortrait);

            } else {
                this.switchMode(dimensions.isPortrait);
            }

            // if(dimensions.isLandscape){
            //     this.scene.resume(); // Resume the game when in landscape mode
            // }else{
            //     this.scene.pause(); // Pause the scene
            // }

            this.game.scale.setGameSize(dimensions.fullWidth, dimensions.fullHeight);

            this.game.canvas.style.width = `${dimensions.fullWidth}px`;
            this.game.canvas.style.height = `${dimensions.fullHeight}px`;
            this.game.scale.updateBounds();
            this.game.scale.refresh();

            this.setGameScale();
            this.setPositions();
        } finally {
            // Clear the resizing flag
            this.resizing = false;
        }
    }

    setGameScale() {
        let scaleX = dimensions.fullWidth / dimensions.gameWidth;
        let scaleY = dimensions.fullHeight / dimensions.gameHeight;

        this.gameScale = (scaleX < scaleY) ? scaleX : scaleY;

        dimensions.actualWidth = this.game.canvas.width / this.gameScale;
        dimensions.actualHeight = this.game.canvas.height / this.gameScale;

        dimensions.leftOffset = -(dimensions.actualWidth - dimensions.gameWidth) / 2;
        dimensions.rightOffset = dimensions.gameWidth - dimensions.leftOffset;
        dimensions.topOffset = -(dimensions.actualHeight - dimensions.gameHeight) / 2;
        dimensions.bottomOffset = dimensions.gameHeight - dimensions.topOffset;
        this.positioned = true;
    }

    update(time,delta){
        super.update();
        this.snow.update(time,delta);
    }

    create ()
    {
        this.positioned = false;
        this.gameScale = 1;
        this.soundVolume = 2;

        this.cameras.main.setBackgroundColor(0x00ff00);
        this.superGroup = this.add.container();
        this.gameGroup = this.add.container();
        this.superGroup.add(this.gameGroup);

        this.soundMuted = false;
        this.addGraphicsAssets();

        this.bg = this.add.image(0,0,"background");
        this.bg.setOrigin(0.5);
        this.gameGroup.add(this.bg);
        
        this.snow = new Snow(this,0,0,this,dimensions);
        this.gameGroup.add(this.snow);

        this.intro = new Intro(this,0,0,this,dimensions);
        this.gameGroup.add(this.intro);

        this.gamePlay = new GamePlay(this,0,0,this,dimensions);
        this.gameGroup.add(this.gamePlay);

        this.soundFrame = new SoundFrame(this,0,0,this,dimensions);
        this.gameGroup.add(this.soundFrame);

        this.endCard = new Endcard(this,0,0,this,dimensions);
        this.gameGroup.add(this.endCard);

        this.confetti = new Confetti(this,0,0,this,dimensions);
        this.gameGroup.add(this.confetti);

        this.settingIcon = this.add.sprite(0,0,"setting");
        this.settingIcon.setOrigin(.5);
        this.settingIcon.setScale(.8);
        this.gameGroup.add(this.settingIcon);

        this.settingIcon.visible = false;

        this.settingIcon.setInteractive();
         this.settingIcon.on('pointerup', function(pointer) {
            this.onClickSetting(pointer,this.settingIcon);
        }.bind(this));

        this.phaser3 = this.add.text(30,0, "PHASER-3", {
            fontFamily: 'Playground', fontSize: 55, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        })
        this.phaser3.setOrigin(0.5);
        this.gameGroup.add(this.phaser3);
        this.phaser3.visible = false;

        this.logo = this.add.sprite(0,0,"logo");
        this.logo.setOrigin(.5);
        this.logo.setScale(.2);
        this.gameGroup.add(this.logo);
        this.logo.visible = false;

        this.bgm = this.sound.add('bgm', {
            loop: true,    // Loop the background music
            volume: 1   // Set volume to 50%
        });
    
        // Play the background music
        this.bgm.play();

        this.setPositions();
        try {
            dapi.addEventListener("adResized", this.gameResized.bind(this));
        } catch (error) {
            this.scale.on('resize', this.gameResized, this)
        }
        this.gameResized();

    }

    onClickSetting(pointer,sprite){
        this.playSound('click', { volume: this.soundVolume/5 });
        sprite.disableInteractive();
        this.tweens.add({
            targets: sprite,
            scale: sprite.scaleX-.2,
            yoyo:true,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
                this.soundFrame.show();
            }
        })
    }

    showEndCard(){
        if(this.gameEnded)return;
        this.gameEnded = true;
        this.gamePlay.hide();
        this.settingIcon.disableInteractive();
        this.soundFrame.hide();
        this.tweens.add({
            targets: [this.logo,this.settingIcon],
            alpha: 0,
            ease: "linear",
            duration: 200,
            onComplete:()=>{
                this.logo.alpha = 1;
                this.settingIcon.alpha = 1;
                this.logo.visible = false;
                this.settingIcon.visible = false;
                this.endCard.show();
            }
        })
    }

    gameStarted(){
        this.gameEnded = false;
        this.logo.visible = true;
        this.gamePlay.show();
        this.settingIcon.visible = true;
        this.settingIcon.setInteractive();
    }

    restartGame(){
        this.gamePlay.restartLevel();
        setTimeout(() => {
            this.gameStarted();
        }, 200);
    }

    playSound( key, config) {
        // Check if the sound key exists
        if (this.cache.audio.exists(key)) {
            this.sound.play(key, config);
        } else {
            console.warn(`Sound with key '${key}' not found`);
        }
    }

    addGraphicsAssets(){
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, .5);
        graphics.fillRect(0, 0, 160, 100);

        graphics.generateTexture('whiteFrame', 160, 100);
        this.gameGroup.add(graphics);

        graphics.destroy();

        graphics = this.add.graphics();
        graphics.fillStyle(0x54cde8, .8);
        graphics.fillRoundedRect(0, 0, 420, 500,30);
        graphics.generateTexture('roundFrame', 420, 500,30);
        this.gameGroup.add(graphics);

         graphics.destroy();

        graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRoundedRect(0, 0, 70, 20,5);
        graphics.generateTexture('roundFrameA', 70, 20,5);
        this.gameGroup.add(graphics);

        graphics.destroy();

        graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(30,30,30);

        graphics.generateTexture('circle', 60,60);
        this.gameGroup.add(graphics);
        graphics.destroy();
    }

    setPositions() {

        this.superGroup.scale = (this.gameScale);
        this.gameGroup.x = (this.game.canvas.width / this.gameScale - dimensions.gameWidth) / 2;
        this.gameGroup.y = (this.game.canvas.height / this.gameScale - dimensions.gameHeight) / 2 ;

        this.bg.setScale(1);

        let scaleX = dimensions.actualWidth / this.bg.displayWidth;
        let scaleY = dimensions.actualHeight / this.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);

        this.bg.x = dimensions.gameWidth/2;
        this.bg.y = dimensions.bottomOffset - this.bg.displayHeight/2;
        if(dimensions.isLandscape){
            this.bg.y = dimensions.bottomOffset - this.bg.displayHeight/2 + 200;
        }

        this.phaser3.x = dimensions.gameWidth/2;
        this.phaser3.y = dimensions.gameHeight/2;

        this.logo.x = dimensions.leftOffset + this.logo.displayWidth/2 + 20;
        this.logo.y = dimensions.topOffset + this.logo.displayHeight/2 + 20;

        this.settingIcon.x = dimensions.rightOffset - this.settingIcon.displayWidth/2 - 20;
        this.settingIcon.y = dimensions.topOffset + this.settingIcon.displayHeight/2 + 20;

        this.intro.adjust();
        this.gamePlay.adjust();
        this.soundFrame.adjust();
        this.endCard.adjust();
        this.confetti.adjust();
    }

    offsetMouse() {
        return {
            x: (this.game.input.activePointer.worldX * dimensions.actualWidth / dimensions.fullWidth) + ((dimensions.gameWidth - dimensions.actualWidth) / 2),
            y: (this.game.input.activePointer.worldY * dimensions.actualHeight / dimensions.fullHeight) + ((dimensions.gameHeight - dimensions.actualHeight) / 2)
        };
    }

    offsetWorld(point) {
        return {
            x: (point.x * dimensions.actualWidth / this.game.width),
            y: (point.y * dimensions.actualHeight / this.game.height)
        };
    }
}
