/**
 * VRM Loader
 * TODO:
 * ✔ボーンのローテーションをさせる
 *     ・どうやってローテーションさせる？回転の数値を加えることはできる
 *     ・じゃあローテーションの値を変更させたいなら、前フレームの値引いてから次のフレームの値を加えれば行けるじゃん。
 *     ・BVHのデータが変更だと思っているけど実は回転数の増減値だってりする？確認。
 *     ・確認にはどっかに落ちてたBVHデータのサンプルみたいなのから持ってくる
 *     ・BVHの座標系とbabylon.jsの座標系は同じで良いのか？BVHは以下に記載あり。
 * ・ChromeとFireforxで差分が出るのは何が原因なのか？
 * ・XR時だとFPSが変わってしまうのの原因と解決方法は？
 * ・地面と空間のTextureを加える方法は？
 * ・addの中に入れるべき対象と入れるべきでない対象は？またaddの中に入れると何が変わる？
 * ・ローカルで動かすとXRが正常に終了しないっぽいからどう変えればいいんだ？
 * ・featuresManagerを動かすと止まってしまうのでその解決方法は？
 * ・[C]なんかXRで入ったときにデフォルトの位置がおかしいからそれ直せないのかな？
 * 
 * 調査：
 * ・BVHについて
 *     1.MOCAPデータファイル - TMPSwiki
 *       https://mukai-lab.org/content/MotionCaptureDataFile.pdf
 *         ・基本事項
 *             ・テキスト形式で記述
 *             ・座標系は右手系．XYZ 各軸の扱い（どの軸が鉛直方向に対応するか等）は任意．
 *             ・関節ノードに関する情報を記述．
 *             ・関節回転はオイラー角形式で記述．
 *             ・回転角度の単位は Degree
 *             ・キャラクタのスケルトン階層構造を記述するHIERARCHY部と，動作データを記述するMOTION部の2つから構成
 *         ・この BVH ファイルは，Fig.2 に示すような 1 つのボーンで構成されるスケルトンの，
 *           1 フレーム分の動作を記述したものです．
 *           つまり，★1 つのボーンの静止姿勢（3 次元座標と方向）を指定しています．
 * ・オイラー角とヨーピッチローについて
 *     ・オイラー角
 *       https://www.sky-engin.jp/blog/eulerian-angles/#:~:text=%E3%81%B3%E3%81%BE%E3%81%99%E3%80%82%5B1%5D-,%E3%82%AA%E3%82%A4%E3%83%A9%E3%83%BC%E8%A7%92%E3%81%AF%E4%B8%8A%E8%A8%98%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E3%80%81%EF%BC%93%E3%81%A4%E3%81%AE%E9%80%A3%E7%B6%9A,%E3%81%A8%E3%81%AA%E3%82%8A%E3%81%BE%E3%81%99%E3%80%82,-%E9%A3%9B%E8%A1%8C%E6%A9%9F%E3%81%AE%E5%9B%9E%E8%BB%A2
 *     ・ヨー（ψ）、ピッチ（θ）、ロー（ϕ）
 *       https://blog.goo.ne.jp/awzm22/e/57a0e71599da42151d5f0f85ed88bc8b
 *         ・左手でフレミングの法則作って人差し指が飛行機の頭、親指が左羽、中指がフィギュアの立てるやつと考える。
 *         ・ヨーが頭の左右の向き（=Z軸の回転）、ピッチが頭の上下の向き（=Y軸の回転）、ローが飛行機のローリング方向（=X軸の回転。ローリングでやり過ごすんだのローリング） 
 *         ・0≤ψ<2π、−π2≤θ≤π2、0≤ϕ<2π
 * ・ボーンのローテーション入れるところに都度更新データを入れる
 * 
 * 
 * 
 * 
 */

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import 'babylon-vrm-loader';
//import { text } from 'stream/consumers';
import { update_bvh_motion, read_bvh_file} from './bvh_data';


export async function createScene(canvas:HTMLCanvasElement, engine:BABYLON.Engine):Promise<BABYLON.Scene > {

  read_bvh_file();
   //const scene = new BABYLON.Scene(engine);

    
  const scene = await BABYLON.SceneLoader.LoadAsync(
  // 'https://raw.githubusercontent.com/ayassbgc/MyFileUploadForBabylonjs/main/', //GitLabクラウドから持ち込みたい場合
    './models/', //ローカルファイルを持ち込みたい場合
    'takahashi.vrm',
    engine
  );
  let vrmManager = scene.metadata.vrmManagers[0];

  // Update secondary animation
  scene.onBeforeRenderObservable.add(() => {
    //クラスの詳細はここ
    //https://doc.babylonjs.com/features/featuresDeepDive/events/observables

    vrmManager = update_bvh_motion(vrmManager);//20221124

  });

  // Model Transformation
  vrmManager.rootMesh.translate(new BABYLON.Vector3(1, 0, 0), 1);

  //空間の設定
  //scene.createDefaultCameraOrLight(true, true, true);  ・・・20221124不要
  const camera = createCamera(scene);
  camera.attachControl(canvas, true);
  createLight(scene);
  createSkybox(scene);
  createGround(scene);

  //アクションマネージャーを追加
  scene.actionManager = new BABYLON.ActionManager(scene);

  const xrHelper = await scene.createDefaultXRExperienceAsync({
    inputOptions:{
        //https://doc.babylonjs.com/typedoc/interfaces/BABYLON.IWebXRInputOptions#doNotLoadControllerMeshes:~:text=Optional-,doNotLoadControllerMeshes,-Search%20playground%20for
        doNotLoadControllerMeshes:true
    },
  });

  //★なぜか動かなった。が、ポインターを消すのにより良い方法を見つけた
  // const featuresManager = xrHelper.baseExperience.featuresManager;        
  // featuresManager.enableFeature(BABYLON.WebXRFeatureName.POINTER_SELECTION, "stable", {   
  //     useUtilityLayer: true //if this is true, pointer laser is not displayed.  
  // });

  //ポインターの切り離し
  xrHelper.pointerSelection.detach();


  // GUI
  let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  createHederForDescription(advancedTexture);

  //move XRCamera
  moveXRCamera(xrHelper);

  //teke pictures
  screenShot(scene, engine, camera);
  screenShotForXR(engine, xrHelper); //★これ悪いかも


  return scene;
}

/**
 * Create Litghts
 */
 class StaticParameters {
  public static height_offset: number = 1.0;
  public static gaming_num:number = 0;
}

/**
 * Create main camera
 * @param {BABYLON.Scene} scene
 * @return {BABYLON.ArcRotateCamera}
 */
 function createCamera(scene: BABYLON.Scene) {
  //const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI/2 , Math.PI / 2, 1, new BABYLON.Vector3(0, 1, 0), scene, true); 
  const camera = new BABYLON.ArcRotateCamera("camera1",-Math.PI/2, Math.PI/2, 5, new BABYLON.Vector3(-1, 1, 0), scene, true); 

  camera.panningSensibility = 0;
  camera.wheelPrecision = 10;
  //camera.upperBetaLimit = Math.PI / 1.7;
  camera.lowerRadiusLimit = 0;
  //camera.upperRadiusLimit = 10;
  camera.minZ = 0.1;
  //camera.maxZ = 1000;
  //(window as any).camera = camera;
  return camera;
}

/**
 * Create Litghts
 */
 async function createLight(scene: BABYLON.Scene){
  // Create a default arc rotate camera and light.
  const light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -0.5, -1), scene);
  //const light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, 0.5, 1), scene);
  //const light3 = new BABYLON.DirectionalLight("light3", new BABYLON.Vector3(0, 0.5, -1), scene);
  light.intensity = 1;
  //light2.intensity = 1;
  //light3.intensity = 1;
  light.specular = new BABYLON.Color3(0, 0, 0);
  //light2.specular = new BABYLON.Color3(0, 0, 0);
  //light3.specular = new BABYLON.Color3(0, 0, 0);

  let mycolor = new BABYLON.Color3;
  StaticParameters.gaming_num += 1;
  //let hue: number = 1;
  BABYLON.Color3.HSVtoRGBToRef(1,0,1,mycolor);
  light.diffuse = mycolor;
  //light2.diffuse = mycolor;
  //light3.diffuse = mycolor;
  const gaming = function(){
      //gamingAya({light,light2,light3},hue,mycolor);
  };
  setInterval(gaming, 1000/60);
}

function createHederForDescription( advancedTexture: GUI.AdvancedDynamicTexture){
  var header = new GUI.TextBlock();
  header.text = "撮影：通常時：Sキー、XR時：右トリガーボタン";
  //header.height = "20px";
  header.color = "white";
  header.top = "45%";
  //header.left = "35%";
  //header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  advancedTexture.addControl(header);
  return 0;
}

/**
 * Create skybox with texture
 * 
 * @param {BABYLON.Scene} scene currentScene
 * @return {BABYLON.Mesh} skybox mesh
 */
function createSkybox(scene: BABYLON.Scene) {
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://www.babylonjs-playground.com/textures/TropicalSunnyDay", scene);  //★URL形式にする！
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;  //★こいつがおかしい。原因確認。StandardMaterialがversion4.2.0で使えるのか？
  skybox.infiniteDistance = true;

  return skybox;
}

/**
 * Create ground with texture
 * 
 * @param {BABYLON.Scene} scene currentScene
 * @return {BABYLON.Mesh} ground mesh
 */
 function createGround(scene: BABYLON.Scene) {
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:1000, height: 1000}, scene);
  //const ground2 = BABYLON.Mesh.var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
  ground.scaling = new BABYLON.Vector3(1, 0.1, 1);
  ground.receiveShadows = true;

  const groundTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/grass.jpg", scene);  //★URL形式にする！
  groundTexture.uScale = 500;
  groundTexture.vScale = 500;

  const groundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
  groundMaterial.diffuseTexture = groundTexture;
  ground.material = groundMaterial;
  ground.position.y = -0.25

  return ground;
}


/**
 * On default Mode, if you push "s" key, you can get png file of screenshot
 * 
 * @param scene:BABYLON.Scene
 * @param engine: BABYLON.Engine
 * @param camera: BABYLON.ArcRotateCamera
 * @return 0: number
 */
 function screenShot(scene:BABYLON.Scene, engine: BABYLON.Engine, camera: BABYLON.ArcRotateCamera) {
  scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
          {
              trigger: BABYLON.ActionManager.OnKeyUpTrigger,
              parameter: 's'
          },
          function () { BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera,{width:1200, height:1200});}
      )
  );
  return 0;
}

function moveXRCamera(xrHelper: BABYLON.WebXRDefaultExperience){
  xrHelper.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
          if (motionController.handness === 'left') {
              const xr_ids = motionController.getComponentIds();
              let thumbstickComponent = motionController.getComponent(xr_ids[2]);//xr-standard-thumbstick
              thumbstickComponent.onAxisValueChangedObservable.add((
                  eventData: { x: number, y: number }, _: BABYLON.EventState) => {
                  //let axes = thumbstickComponent.axes;
                  //move forward
                  if (eventData.y < -0.8) {
                      xrHelper.baseExperience.camera.position.z += eventData.y/100;
                      //xrHelper.baseExperience.camera.position.z += eventData.y;
                  //move back
                  }else if(eventData.y > -0.8){

                      xrHelper.baseExperience.camera.position.z += eventData.y/100;
                  }
                  else{

                  }
              /*
                  let axes = thumbstickComponent.axes;
                  Box_Left_ThumbStick.position.x += axes.x;
                  Box_Left_ThumbStick.position.y += axes.y;
                  */
                  });

          }
      })
  });
  return 0;
}

/**
 * On XR Mode, if you push right trigger button of your controller, you can get png file of screenshot
 * 
 * @param scene:BABYLON.Scene
 * @param engine: BABYLON.Engine
 * @param xrHelper: BABYLON.WebXRDefaultExperience
 * @return 0: number
 */
 function screenShotForXR(engine: BABYLON.Engine, xrHelper: BABYLON.WebXRDefaultExperience) {
  //コントローラーの登録
  xrHelper.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
          if (motionController.handness === 'right') {
              //ボタンの登録
              const xr_ids = motionController.getComponentIds();
              let triggerComponent = motionController.getComponent(xr_ids[0]);//xr-standard-trigger
              triggerComponent.onButtonStateChangedObservable.add(() => {
                  //ボタン入力をトリガーにした処理の実行
                  if (triggerComponent.changes.pressed) {
                      if(triggerComponent.pressed){
                          BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, xrHelper.baseExperience.camera ,{width:1200, height:1200}); 
                      }
                  }
              });
          }
      })
  });
  return 0;
}