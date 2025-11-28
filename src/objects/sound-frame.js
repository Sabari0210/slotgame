export class SoundFrame extends Phaser.GameObjects.Container {
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
            this.setScale(.8);
        }else{
            this.setScale(1);
        }

    }

    init() {

        this.bg = this.scene.add.sprite(0,0,"roundFrame");
        this.bg.setOrigin(.5);
        this.add(this.bg);

        this.text = this.scene.add.text(0,-this.bg.displayHeight/4, "SETTING", {
            fontFamily: 'Playground', fontSize: 55, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        })
        this.text.setOrigin(0.5);
        this.add(this.text);

        this.closeFrame = this.scene.add.sprite(this.bg.displayWidth/2 - 40,-this.bg.displayHeight/2 + 40,"circle");
        this.closeFrame.setOrigin(.5);
        this.add(this.closeFrame);

        this.closeTxt = this.scene.add.text(this.closeFrame.x,this.closeFrame.y, "X", {
            fontFamily: 'Playground', fontSize: 55, color: '#b12711',
            align: 'center'
        })
        this.closeTxt.setOrigin(0.5);
        this.add(this.closeTxt);

        this.closeFrame.setInteractive();
         this.closeFrame.on('pointerup', function(pointer) {
            this.closeSetting(pointer,this.closeFrame);
        }.bind(this));

       this.musicBar();
       this.soundBar();

        // store min and max positions for dragging
        const minX = this.bar_music.x -this.bar_music.displayWidth / 2 + 20;
        const maxX = this.bar_music.x + this.bar_music.displayWidth / 2 - 20;


        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === this.icon_music) {
                gameObject.x = Phaser.Math.Clamp((this.scene.offsetMouse().x - this.x)/this.scaleX, minX, maxX);
                const volume = Phaser.Math.Linear(0, 1, (gameObject.x - minX) / (maxX - minX));
                // this.scene.sound.volume = volume;
                this.scene.bgm.setVolume(volume*2);
                if(volume==0){
                    this.musicIcon.setTexture("music_off");
                }else{
                    this.musicIcon.setTexture("music_on");
                }

                // Optionally: visually update the filled bar width
                this.bar_music.setCrop(0, 0, this.bar_music.width * volume, this.bar_music.height);
            }

            if (gameObject === this.icon_sound) {
                gameObject.x = Phaser.Math.Clamp((this.scene.offsetMouse().x - this.x)/this.scaleX, minX, maxX);
                const volume = Phaser.Math.Linear(0, 1, (gameObject.x - minX) / (maxX - minX));
                this.scene.soundVolume = volume;
                if(volume==0){
                    this.soundIcon.setTexture("sound_off");
                }else{
                    this.soundIcon.setTexture("sound_on");
                }
                // this.scene.bgm.setVolume(volume*2);


                // Optionally: visually update the filled bar width
                this.bar_sound.setCrop(0, 0, this.bar_sound.width * volume, this.bar_sound.height);
            }
        });

        this.visible = false;
        // this.show();
    }

    musicBar(){
         this.musicTxt = this.scene.add.text(0,-30, "Music", {
            fontFamily: 'Playground', fontSize: 40, color: '#000000',
            align: 'center'
        })
        this.musicTxt.setOrigin(0.5);
        this.add(this.musicTxt);

        this.musicIcon = this.scene.add.sprite(0,20,"music_on");
        this.musicIcon.setOrigin(.5);
        this.musicIcon.setScale(.2);
        this.add(this.musicIcon);

        this.frame_music = this.scene.add.sprite(30,20,"barFrame");
        this.frame_music.setOrigin(0.5);
        this.frame_music.setScale(0.9);
        this.add(this.frame_music);

        this.bar_music = this.scene.add.sprite(30,20,"barFrame_1");
        this.bar_music.setOrigin(0.5);
        this.bar_music.setScale(0.9);
        this.add(this.bar_music);

        this.musicIcon.x = -this.frame_music.displayWidth/1.9;

        this.icon_music = this.scene.add.sprite(this.bar_music.x + this.bar_music.displayWidth/2 - 20,20,"barFrame_2");
        this.icon_music.setOrigin(0.5);
        this.icon_music.setScale(0.9);
        this.add(this.icon_music);

        this.icon_music.setInteractive({ draggable: true });
        this.scene.input.setDraggable(this.icon_music);
    }

    soundBar(){

        this.soundTxt = this.scene.add.text(0,120, "Sound", {
            fontFamily: 'Playground', fontSize: 50, color: '#000000',
            align: 'center'
        })
        this.soundTxt.setOrigin(0.5);
        this.add(this.soundTxt);

        this.soundIcon = this.scene.add.sprite(0,170,"sound_on");
        this.soundIcon.setOrigin(.5);
        this.soundIcon.setScale(.2);
        this.add(this.soundIcon);

        this.frame_sound = this.scene.add.sprite(30,170,"barFrame");
        this.frame_sound.setOrigin(0.5);
        this.frame_sound.setScale(0.9);
        this.add(this.frame_sound);

        this.bar_sound = this.scene.add.sprite(30,170,"barFrame_1");
        this.bar_sound.setOrigin(0.5);
        this.bar_sound.setScale(0.9);
        this.add(this.bar_sound);

        this.soundIcon.x = -this.frame_sound.displayWidth/1.9;

        this.icon_sound = this.scene.add.sprite(this.bar_sound.x + this.bar_sound.displayWidth/2 - 20,170,"barFrame_2");
        this.icon_sound.setOrigin(0.5);
        this.icon_sound.setScale(0.9);
        this.add(this.icon_sound);

        this.icon_sound.setInteractive({ draggable: true });
        this.scene.input.setDraggable(this.icon_sound);
    }

    closeSetting(pointer,sprite){
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

        this.scene.tweens.add({
            targets: this.closeTxt,
            scale: this.closeTxt.scaleX-.2,
            yoyo:true,
            ease: "linear",
            duration: 100,
            onComplete:()=>{
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
        // this.frame.alpha = 0;
        // this.playBtn.alpha = 0;
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: "linear",
            duration: 200,
            onComplete:()=>{
                // this.scene.tweens.add({
                //     targets: this.frame,
                //     alpha: 1,
                //     y:{from:this.frame.y - 100,to:this.frame.y},
                //     ease: "Power2",
                //     duration: 200,
                //     onComplete:()=>{
                //         this.scene.tweens.add({
                //             targets: this.playBtn,
                //             alpha: 1,
                //             scale:{from:this.playBtn.scaleX+.2,to:this.playBtn.scaleX},
                //             ease: "Power2",
                //             duration: 200,
                //             onComplete:()=>{
                //                 this.playBtn.setInteractive();
                //             }
                //         })
                //     }
                // })
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
                this.scene.settingIcon.setInteractive();
                this.closeFrame.setInteractive();
            }
        });
    }
}