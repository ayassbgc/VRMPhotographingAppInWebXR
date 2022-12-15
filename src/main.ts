//import { Engine, Scene, SceneLoader, Vector3, MeshBuilder } from '@babylonjs/core';
import * as BABYLON from '@babylonjs/core';

//import { Engine, MeshBuilder, Scene, Vector3, SceneLoader } from 'babylonjs';
//import '@babylonjs/loaders/glTF';
import './style.scss'
import 'babylon-vrm-loader';
import { createScene } from './top_scene';

const main = async () => {

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (canvas == null){
    console.log("missing!")
    return;
  }

  //ブラウザ表示設定
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  //初期設定？
  const engine = new BABYLON.Engine(canvas, true);

  //フレームレートを落とす。
  //やまゆさんの記事
  //https://qiita.com/il-m-yamagishi/items/2d4f0b342d8763f5d101
  const targetFPS = 30;
  engine.customAnimationFrameRequester = {
    requestAnimationFrame: (func:any) => {
      setTimeout(func, Math.round(1000 / targetFPS));
    },
  };

  const scene:BABYLON.Scene = await createScene(canvas, engine);
  
  engine.runRenderLoop(() => {
    scene.render();
  });

}

main();






////////////////////////////

// import './style.scss'
// import { MeshBuilder, Vector3 } from '@babylonjs/core';
// import { Scene } from '@babylonjs/core';
// import { Engine } from '@babylonjs/core';


