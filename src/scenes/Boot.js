import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    init(){

    }

    preload ()
    {
        this.load.image('bg_loading', 'assets/loading/bg.png');
        this.load.image('bar_loading', 'assets/loading/bar.png');
        this.load.image('frame_loading', 'assets/loading/frame.png');
        this.load.image('logo_loading', 'assets/loading/logo.png');
 
    }

    create ()
    {
        this.scene.start('Preloader');        
    }
}
