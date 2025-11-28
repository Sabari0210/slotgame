import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        // this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress) => {

        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);

        // });
    }

    loadAssets(){

        this.load.image('background', 'assets/bg.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('playbtn', 'assets/playbtn.png');
        this.load.image('slotmachine', 'assets/slotmachine.png');
        this.load.image('spinbtn', 'assets/spinbtn.png');
        this.load.image('handle_off', 'assets/handle_off.png');
        this.load.image('handle_on', 'assets/handle_on.png');
        for (let i = 1; i <= 7; i++) {
            this.load.image(`snow_${i}`, `assets/snow/${i}.png`);
        }
        for (let i = 1; i <= 13; i++) {
            this.load.image(`icon_${i}`, `assets/icon/${i}.png`);
        }

        for (let i = 1; i <= 15; i++) {
            this.load.image(`confetti_${i}`, `assets/confetti/${i}.png`);
        }

        this.load.image('setting', 'assets/setting.png');
        this.load.image('sound_on', 'assets/sound_on.png');
        this.load.image('sound_off', 'assets/sound_off.png');
        this.load.image('music_off', 'assets/music_off.png');
        this.load.image('music_on', 'assets/music_on.png');
        this.load.image('barFrame', 'assets/barFrame.png');
        this.load.image('barFrame_1', 'assets/barFrame_1.png');
        this.load.image('barFrame_2', 'assets/barFrame_2.png');
        this.load.image('welldone', 'assets/welldone.png');
        this.load.image('retrybtn', 'assets/retrybtn.png');
        this.load.image('santa_gift', 'assets/santa_gift.png');
    }

    loadSound(){
        
        this.load.audio('click', 'sounds/click.mp3');
        this.load.audio('click_game', 'sounds/click game.mp3');
        this.load.audio('correct', 'sounds/correct.mp3');
        this.load.audio('levelcomplete', 'sounds/levelcomplete.mp3');
        this.load.audio('victory', 'sounds/victory.mp3');
        this.load.audio('fail', 'sounds/fail.mp3');
        this.load.audio('timer', 'sounds/timer.mp3');
        this.load.audio('bgm', 'sounds/bgm.mp3');
        this.load.audio('slot', 'sounds/slot.mp3');
        this.load.audio('slot_start', 'sounds/slot_start.mp3');
        this.load.audio('slot_end', 'sounds/slot_end.mp3');
        this.load.audio('wrong', 'sounds/wrong.mp3');
        this.load.audio('whooo', 'sounds/whooo.mp3');
        this.load.audio('unlock', 'sounds/unlock.mp3');

    }

    updateSize(gameSize) {
        // console.log(gameSize)
        // if (!gameSize) return;

        let width = this.scale.gameSize.width;
        let height = this.scale.gameSize.height;
        console.log(width,height);

        // this.cameras.resize(width, height);
        this.resizeBackground();
    }

    resizeBackground() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        this.bg.setScale(1);
        let scaleX = width / this.bg.displayWidth;
        let scaleY = height / this.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);
        console.log(scale)
    }

    preload() {
        
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        console.log(width,height);

        this.bg = this.add.image(width / 2, height / 2, "bg_loading").setOrigin(0.5)//.setDisplaySize(width, height);
        // Show the logo that was loaded in Boot

        this.bg.setScale(1);

        let scaleX = width / this.bg.displayWidth;
        let scaleY = height / this.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);
        console.log(scale)

        this.logo = this.add.image(width / 2, height / 2 , "logo_loading").setOrigin(0.5).setScale(.2);
        // this.logo.visible = false;
        // UI
        this.progressBox = this.add.image(width / 2, height - 30, 'frame_loading').setOrigin(0.5).setScale(.2);
        this.progressBar = this.add.image(this.progressBox.x - this.progressBox.displayWidth/2 + 12, this.progressBox.y, 'bar_loading').setOrigin(0, 0.5).setScale(.2);
        // let progressBox = this.add.graphics();
        // let progressBar = this.add.graphics();

        // Draw a background rectangle for the progress box
        // progressBox.fillStyle(0x222222, 1);
        // progressBox.fillRect(width/2 - 245, height - 165, 510, 40,15);

        this.progressBarMask = this.add.rectangle(
            this.progressBar.x,    // x
            this.progressBar.y,       // y
            this.progressBar.displayWidth, // this.progressBar.scaleX,                  // width (initially 0 for mask)
            this.progressBar.displayHeight,                 // height
            0xffffff,           // fill color
            .5                  // alpha
        ).setOrigin(0, 0.5).setVisible(false);
        // this.progressBarMask = this.add.rectangle(width / 2 - this.progressBox.width/2.15, height - 110, 0, this.progressBar.height, 0x000000,1)
        //     .setOrigin(0, 0.5)
            // .setVisible(true);

        this.progressBar.setMask(new Phaser.Display.Masks.GeometryMask(this, this.progressBarMask));

        this.loadingText = this.add.text(this.progressBox.x,this.progressBox.y - 30, 'Loading...', {
            font: '20px Arial Bold', fill: '#07ecef'
        }).setOrigin(0.5);

        this.percentText = this.add.text(this.progressBox.x,this.progressBox.y, '0%', {
            font: '14px Arial Bold', fill: '#ffffff'
        }).setOrigin(0.5);

        // Load game assets here
        this.loadAssets();
        // this.load.image('enemy', 'assets/enemy.png');
        // this.load.audio('bgm', 'assets/bgm.mp3');
        // Add more assets as needed

        // Update progress bar
        this.load.on('progress', (value) => {
           let percentage = Math.floor(value * 100);
            this.percentText.setText(`${percentage}%`);
            this.progressBarMask.width = 290 * value;
            //  let percentage = Math.floor(value * 100);
            if (percentage % 5 === 0) { // Update only every 5%
                this.percentText.setText(`${percentage}%`);
                // progressBar.clear();
                // progressBar.fillStyle(0xffffff, .5);
                // progressBar.fillRect(width / 2 - 240, height  - 161, (500) * value, 32,15);
            }
        });

        this.loadSound();

        // Done loading
        this.load.once('complete', () => {
            const keys = this.textures.getTextureKeys();
            this.progressBox.destroy();
            this.progressBar.destroy();
            this.progressBarMask.destroy();
            // progressBar.destroy();
            // progressBox.destroy();

            // this.loadingText.destroy();
            // this.percentText.destroy();
            // this.logo.destroy();
            this.scene.start('MainMenu');
        });

        // this.resizeBackground();

        // // Listen for orientation/resize change
        // this.scale.on('resize', (gameSize) => {
        //     this.cameras.resize(gameSize.width, gameSize.height);
        //     this.updateSize();
        // });
    }

    create ()
    {

    }
}
