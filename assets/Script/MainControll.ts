// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioSourceControl, {SoundType} from "./AudioSourceControl";

const {ccclass, property} = cc._decorator;

export enum GameStatus {
  Game_Ready = 0,
  Game_Playing,
  Game_Over
}

@ccclass
export default class MainControl extends cc.Component {

  @property(cc.Sprite)
  spBg: cc.Sprite [] = [null, null];

  @property(cc.Prefab)
  pipePrefab: cc.Prefab = null;

  spGameOver: cc.Sprite = null;

  pipe: cc.Node[] = [null, null, null];

  btnStart: cc.Button = null;

  @property(cc.Label)
  labelScore: cc.Label = null;

  @property(AudioSourceControl)
  audioSourceControl: AudioSourceControl = null;

  gameScore: number = 0;

  gameStatus: GameStatus = GameStatus.Game_Ready;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    var collisionManager = cc.director.getCollisionManager();
    collisionManager.enabled = true;
    collisionManager.enabledDebugDraw = false;
    this.spGameOver = this.node.getChildByName("GameOver").getComponent(cc.Sprite);
    this.spGameOver.node.active = false;
    this.btnStart = this.node.getChildByName("BtnStart").getComponent(cc.Button);
    this.btnStart.node.on(cc.Node.EventType.TOUCH_END, this.touchStartBtn, this);
  }

  start() {
    for (let i = 0; i < this.pipe.length; i++) {
      this.pipe[i] = cc.instantiate(this.pipePrefab);
      this.node.getChildByName("Pipe").addChild(this.pipe[i]);

      this.pipe[i].x = 170 + 200 * i;
      var minY = -120;
      var maxY = 120;
      this.pipe[i].y = minY + Math.random() * (maxY - minY);
    }

  }

  update(dt) {
    if (this.gameStatus !== GameStatus.Game_Playing) {
      return;
    }

    for (let i = 0; i < this.spBg.length; i++) {
        this.spBg[i].node.x -= 1.0;
        if (this.spBg[i].node.x <= -288) {
            this.spBg[i].node.x = 288;
        }
    }
    // move pipe
    for (let i = 0; i < this.pipe.length; i++) {
      this.pipe[i].x -= 1.0;
      if (this.pipe[i].x <= -170) {
        this.pipe[i].x = 430;
        var minY = -120;
        var maxY = 120;
        this.pipe[i].y = minY + Math.random() * (maxY - minY);
      }
    }
  }

  gameOver () {
    this.spGameOver.node.active = true;
    this.btnStart.node.active = true;
    this.gameStatus = GameStatus.Game_Over;
    this.audioSourceControl.playSound(SoundType.E_Sound_Die)
  }

  touchStartBtn () {
    this.btnStart.node.active = false;
    this.gameStatus = GameStatus.Game_Playing;
    this.spGameOver.node.active = false;

    for (let i = 0; i < this.pipe.length; i++) {
      this.pipe[i].x = 170 + 200 * i;
      var minY = -120;
      var maxY = 120;
      this.pipe[i].y = minY + Math.random() * (maxY - minY);
    }

    var bird = this.node.getChildByName("Bird");
    bird.y = 0;
    bird.rotation = 0;

    this.gameScore = 0;
    this.labelScore.string = this.gameScore.toString();
  }
}
