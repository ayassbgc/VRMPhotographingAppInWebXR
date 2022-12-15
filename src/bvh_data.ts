import { text } from 'stream/consumers';
import * as BABYLON from '@babylonjs/core';
import 'babylon-vrm-loader';


let frame:number = 0;
let total_frames:number;
const radians_motion_data:number[][] = [];
let _is_start_motion:boolean = false;
let text_data:number[][] = [];


const bvh_dict: Record<string, number> = {
    ROOT_Hips_Xposition:0,
    ROOT_Hips_Yposition:1,
    ROOT_Hips_Zposition:2,
    ROOT_Hips_Zrotation:3,
    ROOT_Hips_Xrotation:4,
    ROOT_Hips_Yrotation:5,
    JOINT_Spine_Zrotation:6,
    JOINT_Spine_Xrotation:7,
    JOINT_Spine_Yrotation:8,
    JOINT_Chest_Zrotation:9,
    JOINT_Chest_Xrotation:10,
    JOINT_Chest_Yrotation:11,
    JOINT_UpperChest_Zrotation:12,
    JOINT_UpperChest_Xrotation:13,
    JOINT_UpperChest_Yrotation:14,
    JOINT_Neck_Zrotation:15,
    JOINT_Neck_Xrotation:16,
    JOINT_Neck_Yrotation:17,
    JOINT_Head_Zrotation:18,
    JOINT_Head_Xrotation:19,
    JOINT_Head_Yrotation:20,
    JOINT_LeftEye_Zrotation:21,
    JOINT_LeftEye_Xrotation:22,
    JOINT_LeftEye_Yrotation:23,
    JOINT_RightEye_Zrotation:24,
    JOINT_RightEye_Xrotation:25,
    JOINT_RightEye_Yrotation:26,
    JOINT_LeftShoulder_Zrotation:27,
    JOINT_LeftShoulder_Xrotation:28,
    JOINT_LeftShoulder_Yrotation:29,
    JOINT_LeftUpperArm_Zrotation:30,
    JOINT_LeftUpperArm_Xrotation:31,
    JOINT_LeftUpperArm_Yrotation:32,
    JOINT_LeftLowerArm_Zrotation:33,
    JOINT_LeftLowerArm_Xrotation:34,
    JOINT_LeftLowerArm_Yrotation:35,
    JOINT_LeftHand_Zrotation:36,
    JOINT_LeftHand_Xrotation:37,
    JOINT_LeftHand_Yrotation:38,
    JOINT_LeftIndexProximal_Zrotation:39,
    JOINT_LeftIndexProximal_Xrotation:40,
    JOINT_LeftIndexProximal_Yrotation:41,
    JOINT_LeftIndexIntermediate_Zrotation:42,
    JOINT_LeftIndexIntermediate_Xrotation:43,
    JOINT_LeftIndexIntermediate_Yrotation:44,
    JOINT_LeftIndexDistal_Zrotation:45,
    JOINT_LeftIndexDistal_Xrotation:46,
    JOINT_LeftIndexDistal_Yrotation:47,
    JOINT_LeftLittleProximal_Zrotation:48,
    JOINT_LeftLittleProximal_Xrotation:49,
    JOINT_LeftLittleProximal_Yrotation:50,
    JOINT_LeftLittleIntermediate_Zrotation:51,
    JOINT_LeftLittleIntermediate_Xrotation:52,
    JOINT_LeftLittleIntermediate_Yrotation:53,
    JOINT_LeftLittleDistal_Zrotation:54,
    JOINT_LeftLittleDistal_Xrotation:55,
    JOINT_LeftLittleDistal_Yrotation:56,
    JOINT_LeftMiddleProximal_Zrotation:57,
    JOINT_LeftMiddleProximal_Xrotation:58,
    JOINT_LeftMiddleProximal_Yrotation:59,
    JOINT_LeftMiddleIntermediate_Zrotation:60,
    JOINT_LeftMiddleIntermediate_Xrotation:61,
    JOINT_LeftMiddleIntermediate_Yrotation:62,
    JOINT_LeftMiddleDistal_Zrotation:63,
    JOINT_LeftMiddleDistal_Xrotation:64,
    JOINT_LeftMiddleDistal_Yrotation:65,
    JOINT_LeftRingProximal_Zrotation:66,
    JOINT_LeftRingProximal_Xrotation:67,
    JOINT_LeftRingProximal_Yrotation:68,
    JOINT_LeftRingIntermediate_Zrotation:69,
    JOINT_LeftRingIntermediate_Xrotation:70,
    JOINT_LeftRingIntermediate_Yrotation:71,
    JOINT_LeftRingDistal_Zrotation:72,
    JOINT_LeftRingDistal_Xrotation:73,
    JOINT_LeftRingDistal_Yrotation:74,
    JOINT_LeftThumbProximal_Zrotation:75,
    JOINT_LeftThumbProximal_Xrotation:76,
    JOINT_LeftThumbProximal_Yrotation:77,
    JOINT_LeftThumbIntermediate_Zrotation:78,
    JOINT_LeftThumbIntermediate_Xrotation:79,
    JOINT_LeftThumbIntermediate_Yrotation:80,
    JOINT_LeftThumbDistal_Zrotation:81,
    JOINT_LeftThumbDistal_Xrotation:82,
    JOINT_LeftThumbDistal_Yrotation:83,
    JOINT_RightShoulder_Zrotation:84,
    JOINT_RightShoulder_Xrotation:85,
    JOINT_RightShoulder_Yrotation:86,
    JOINT_RightUpperArm_Zrotation:87,
    JOINT_RightUpperArm_Xrotation:88,
    JOINT_RightUpperArm_Yrotation:89,
    JOINT_RightLowerArm_Zrotation:90,
    JOINT_RightLowerArm_Xrotation:91,
    JOINT_RightLowerArm_Yrotation:92,
    JOINT_RightHand_Zrotation:93,
    JOINT_RightHand_Xrotation:94,
    JOINT_RightHand_Yrotation:95,
    JOINT_RightIndexProximal_Zrotation:96,
    JOINT_RightIndexProximal_Xrotation:97,
    JOINT_RightIndexProximal_Yrotation:98,
    JOINT_RightIndexIntermediate_Zrotation:99,
    JOINT_RightIndexIntermediate_Xrotation:100,
    JOINT_RightIndexIntermediate_Yrotation:101,
    JOINT_RightIndexDistal_Zrotation:102,
    JOINT_RightIndexDistal_Xrotation:103,
    JOINT_RightIndexDistal_Yrotation:104,
    JOINT_RightLittleProximal_Zrotation:105,
    JOINT_RightLittleProximal_Xrotation:106,
    JOINT_RightLittleProximal_Yrotation:107,
    JOINT_RightLittleIntermediate_Zrotation:108,
    JOINT_RightLittleIntermediate_Xrotation:109,
    JOINT_RightLittleIntermediate_Yrotation:110,
    JOINT_RightLittleDistal_Zrotation:111,
    JOINT_RightLittleDistal_Xrotation:112,
    JOINT_RightLittleDistal_Yrotation:113,
    JOINT_RightMiddleProximal_Zrotation:114,
    JOINT_RightMiddleProximal_Xrotation:115,
    JOINT_RightMiddleProximal_Yrotation:116,
    JOINT_RightMiddleIntermediate_Zrotation:117,
    JOINT_RightMiddleIntermediate_Xrotation:118,
    JOINT_RightMiddleIntermediate_Yrotation:119,
    JOINT_RightMiddleDistal_Zrotation:120,
    JOINT_RightMiddleDistal_Xrotation:121,
    JOINT_RightMiddleDistal_Yrotation:122,
    JOINT_RightRingProximal_Zrotation:123,
    JOINT_RightRingProximal_Xrotation:124,
    JOINT_RightRingProximal_Yrotation:125,
    JOINT_RightRingIntermediate_Zrotation:126,
    JOINT_RightRingIntermediate_Xrotation:127,
    JOINT_RightRingIntermediate_Yrotation:128,
    JOINT_RightRingDistal_Zrotation:129,
    JOINT_RightRingDistal_Xrotation:130,
    JOINT_RightRingDistal_Yrotation:131,
    JOINT_RightThumbProximal_Zrotation:132,
    JOINT_RightThumbProximal_Xrotation:133,
    JOINT_RightThumbProximal_Yrotation:134,
    JOINT_RightThumbIntermediate_Zrotation:135,
    JOINT_RightThumbIntermediate_Xrotation:136,
    JOINT_RightThumbIntermediate_Yrotation:137,
    JOINT_RightThumbDistal_Zrotation:138,
    JOINT_RightThumbDistal_Xrotation:139,
    JOINT_RightThumbDistal_Yrotation:140,
    JOINT_LeftUpperLeg_Zrotation:141,
    JOINT_LeftUpperLeg_Xrotation:142,
    JOINT_LeftUpperLeg_Yrotation:143,
    JOINT_LeftLowerLeg_Zrotation:144,
    JOINT_LeftLowerLeg_Xrotation:145,
    JOINT_LeftLowerLeg_Yrotation:146,
    JOINT_LeftFoot_Zrotation:147,
    JOINT_LeftFoot_Xrotation:148,
    JOINT_LeftFoot_Yrotation:149,
    JOINT_LeftToes_Zrotation:150,
    JOINT_LeftToes_Xrotation:151,
    JOINT_LeftToes_Yrotation:152,
    JOINT_RightUpperLeg_Zrotation:153,
    JOINT_RightUpperLeg_Xrotation:154,
    JOINT_RightUpperLeg_Yrotation:155,
    JOINT_RightLowerLeg_Zrotation:156,
    JOINT_RightLowerLeg_Xrotation:157,
    JOINT_RightLowerLeg_Yrotation:158,
    JOINT_RightFoot_Zrotation:159,
    JOINT_RightFoot_Xrotation:160,
    JOINT_RightFoot_Yrotation:161,
    JOINT_RightToes_Zrotation:162,
    JOINT_RightToes_Xrotation:163,
    JOINT_RightToes_Yrotation:164,
}

//mb:MandatoryBoneの略
const mb_num = {
    'hips':{x:bvh_dict.ROOT_Hips_Xrotation,y:bvh_dict.ROOT_Hips_Yrotation,z:bvh_dict.ROOT_Hips_Zrotation},
    'spine':{x:bvh_dict.JOINT_Spine_Xrotation,y:bvh_dict.JOINT_Spine_Yrotation,z:bvh_dict.JOINT_Spine_Zrotation},
    'chest':{x:bvh_dict.JOINT_Chest_Xrotation,y:bvh_dict.JOINT_Chest_Yrotation,z:bvh_dict.JOINT_Chest_Zrotation},
    'upperChest':{x:bvh_dict.JOINT_UpperChest_Xrotation,y:bvh_dict.JOINT_UpperChest_Yrotation,z:bvh_dict.JOINT_UpperChest_Zrotation},
    'neck':{x:bvh_dict.JOINT_Neck_Xrotation,y:bvh_dict.JOINT_Neck_Yrotation,z:bvh_dict.JOINT_Neck_Zrotation},
    'head':{x:bvh_dict.JOINT_Head_Xrotation,y:bvh_dict.JOINT_Head_Yrotation,z:bvh_dict.JOINT_Head_Zrotation},
    'leftEye':{x:bvh_dict.JOINT_LeftEye_Xrotation,y:bvh_dict.JOINT_LeftEye_Yrotation,z:bvh_dict.JOINT_LeftEye_Zrotation},
    'rightEye':{x:bvh_dict.JOINT_RightEye_Xrotation,y:bvh_dict.JOINT_RightEye_Yrotation,z:bvh_dict.JOINT_RightEye_Zrotation},
    'leftShoulder':{x:bvh_dict.JOINT_LeftShoulder_Xrotation,y:bvh_dict.JOINT_LeftShoulder_Yrotation,z:bvh_dict.JOINT_LeftShoulder_Zrotation},
    'leftUpperArm':{x:bvh_dict.JOINT_LeftUpperArm_Xrotation,y:bvh_dict.JOINT_LeftUpperArm_Yrotation,z:bvh_dict.JOINT_LeftUpperArm_Zrotation},
    'leftLowerArm':{x:bvh_dict.JOINT_LeftLowerArm_Xrotation,y:bvh_dict.JOINT_LeftLowerArm_Yrotation,z:bvh_dict.JOINT_LeftLowerArm_Zrotation},
    'leftHand':{x:bvh_dict.JOINT_LeftHand_Xrotation,y:bvh_dict.JOINT_LeftHand_Yrotation,z:bvh_dict.JOINT_LeftHand_Zrotation},
    'leftIndexProximal':{x:bvh_dict.JOINT_LeftIndexProximal_Xrotation,y:bvh_dict.JOINT_LeftIndexProximal_Yrotation,z:bvh_dict.JOINT_LeftIndexProximal_Zrotation},
    'leftIndexIntermediate':{x:bvh_dict.JOINT_LeftIndexIntermediate_Xrotation,y:bvh_dict.JOINT_LeftIndexIntermediate_Yrotation,z:bvh_dict.JOINT_LeftIndexIntermediate_Zrotation},
    'leftIndexDistal':{x:bvh_dict.JOINT_LeftIndexDistal_Xrotation,y:bvh_dict.JOINT_LeftIndexDistal_Yrotation,z:bvh_dict.JOINT_LeftIndexDistal_Zrotation},
    'leftLittleProximal':{x:bvh_dict.JOINT_LeftLittleProximal_Xrotation,y:bvh_dict.JOINT_LeftLittleProximal_Yrotation,z:bvh_dict.JOINT_LeftLittleProximal_Zrotation},
    'leftLittleIntermediate':{x:bvh_dict.JOINT_LeftLittleIntermediate_Xrotation,y:bvh_dict.JOINT_LeftLittleIntermediate_Yrotation,z:bvh_dict.JOINT_LeftLittleIntermediate_Zrotation},
    'leftLittleDistal':{x:bvh_dict.JOINT_LeftLittleDistal_Xrotation,y:bvh_dict.JOINT_LeftLittleDistal_Yrotation,z:bvh_dict.JOINT_LeftLittleDistal_Zrotation},
    'leftMiddleProximal':{x:bvh_dict.JOINT_LeftMiddleProximal_Xrotation,y:bvh_dict.JOINT_LeftMiddleProximal_Yrotation,z:bvh_dict.JOINT_LeftMiddleProximal_Zrotation},
    'leftMiddleIntermediate':{x:bvh_dict.JOINT_LeftMiddleIntermediate_Xrotation,y:bvh_dict.JOINT_LeftMiddleIntermediate_Yrotation,z:bvh_dict.JOINT_LeftMiddleIntermediate_Zrotation},
    'leftMiddleDistal':{x:bvh_dict.JOINT_LeftMiddleDistal_Xrotation,y:bvh_dict.JOINT_LeftMiddleDistal_Yrotation,z:bvh_dict.JOINT_LeftMiddleDistal_Zrotation},
    'leftRingProximal':{x:bvh_dict.JOINT_LeftRingProximal_Xrotation,y:bvh_dict.JOINT_LeftRingProximal_Yrotation,z:bvh_dict.JOINT_LeftRingProximal_Zrotation},
    'leftRingIntermediate':{x:bvh_dict.JOINT_LeftRingIntermediate_Xrotation,y:bvh_dict.JOINT_LeftRingIntermediate_Yrotation,z:bvh_dict.JOINT_LeftRingIntermediate_Zrotation},
    'leftRingDistal':{x:bvh_dict.JOINT_LeftRingDistal_Xrotation,y:bvh_dict.JOINT_LeftRingDistal_Yrotation,z:bvh_dict.JOINT_LeftRingDistal_Zrotation},
    'leftThumbProximal':{x:bvh_dict.JOINT_LeftThumbProximal_Xrotation,y:bvh_dict.JOINT_LeftThumbProximal_Yrotation,z:bvh_dict.JOINT_LeftThumbProximal_Zrotation},
    'leftThumbIntermediate':{x:bvh_dict.JOINT_LeftThumbIntermediate_Xrotation,y:bvh_dict.JOINT_LeftThumbIntermediate_Yrotation,z:bvh_dict.JOINT_LeftThumbIntermediate_Zrotation},
    'leftThumbDistal':{x:bvh_dict.JOINT_LeftThumbDistal_Xrotation,y:bvh_dict.JOINT_LeftThumbDistal_Yrotation,z:bvh_dict.JOINT_LeftThumbDistal_Zrotation},
    'rightShoulder':{x:bvh_dict.JOINT_RightShoulder_Xrotation,y:bvh_dict.JOINT_RightShoulder_Yrotation,z:bvh_dict.JOINT_RightShoulder_Zrotation},
    'rightUpperArm':{x:bvh_dict.JOINT_RightUpperArm_Xrotation,y:bvh_dict.JOINT_RightUpperArm_Yrotation,z:bvh_dict.JOINT_RightUpperArm_Zrotation},
    'rightLowerArm':{x:bvh_dict.JOINT_RightLowerArm_Xrotation,y:bvh_dict.JOINT_RightLowerArm_Yrotation,z:bvh_dict.JOINT_RightLowerArm_Zrotation},
    'rightHand':{x:bvh_dict.JOINT_RightHand_Xrotation,y:bvh_dict.JOINT_RightHand_Yrotation,z:bvh_dict.JOINT_RightHand_Zrotation},
    'rightIndexProximal':{x:bvh_dict.JOINT_RightIndexProximal_Xrotation,y:bvh_dict.JOINT_RightIndexProximal_Yrotation,z:bvh_dict.JOINT_RightIndexProximal_Zrotation},
    'rightIndexIntermediate':{x:bvh_dict.JOINT_RightIndexIntermediate_Xrotation,y:bvh_dict.JOINT_RightIndexIntermediate_Yrotation,z:bvh_dict.JOINT_RightIndexIntermediate_Zrotation},
    'rightIndexDistal':{x:bvh_dict.JOINT_RightIndexDistal_Xrotation,y:bvh_dict.JOINT_RightIndexDistal_Yrotation,z:bvh_dict.JOINT_RightIndexDistal_Zrotation},
    'rightLittleProximal':{x:bvh_dict.JOINT_RightLittleProximal_Xrotation,y:bvh_dict.JOINT_RightLittleProximal_Yrotation,z:bvh_dict.JOINT_RightLittleProximal_Zrotation},
    'rightLittleIntermediate':{x:bvh_dict.JOINT_RightLittleIntermediate_Xrotation,y:bvh_dict.JOINT_RightLittleIntermediate_Yrotation,z:bvh_dict.JOINT_RightLittleIntermediate_Zrotation},
    'rightLittleDistal':{x:bvh_dict.JOINT_RightLittleDistal_Xrotation,y:bvh_dict.JOINT_RightLittleDistal_Yrotation,z:bvh_dict.JOINT_RightLittleDistal_Zrotation},
    'rightMiddleProximal':{x:bvh_dict.JOINT_RightMiddleProximal_Xrotation,y:bvh_dict.JOINT_RightMiddleProximal_Yrotation,z:bvh_dict.JOINT_RightMiddleProximal_Zrotation},
    'rightMiddleIntermediate':{x:bvh_dict.JOINT_RightMiddleIntermediate_Xrotation,y:bvh_dict.JOINT_RightMiddleIntermediate_Yrotation,z:bvh_dict.JOINT_RightMiddleIntermediate_Zrotation},
    'rightMiddleDistal':{x:bvh_dict.JOINT_RightMiddleDistal_Xrotation,y:bvh_dict.JOINT_RightMiddleDistal_Yrotation,z:bvh_dict.JOINT_RightMiddleDistal_Zrotation},
    'rightRingProximal':{x:bvh_dict.JOINT_RightRingProximal_Xrotation,y:bvh_dict.JOINT_RightRingProximal_Yrotation,z:bvh_dict.JOINT_RightRingProximal_Zrotation},
    'rightRingIntermediate':{x:bvh_dict.JOINT_RightRingIntermediate_Xrotation,y:bvh_dict.JOINT_RightRingIntermediate_Yrotation,z:bvh_dict.JOINT_RightRingIntermediate_Zrotation},
    'rightRingDistal':{x:bvh_dict.JOINT_RightRingDistal_Xrotation,y:bvh_dict.JOINT_RightRingDistal_Yrotation,z:bvh_dict.JOINT_RightRingDistal_Zrotation},
    'rightThumbProximal':{x:bvh_dict.JOINT_RightThumbProximal_Xrotation,y:bvh_dict.JOINT_RightThumbProximal_Yrotation,z:bvh_dict.JOINT_RightThumbProximal_Zrotation},
    'rightThumbIntermediate':{x:bvh_dict.JOINT_RightThumbIntermediate_Xrotation,y:bvh_dict.JOINT_RightThumbIntermediate_Yrotation,z:bvh_dict.JOINT_RightThumbIntermediate_Zrotation},
    'rightThumbDistal':{x:bvh_dict.JOINT_RightThumbDistal_Xrotation,y:bvh_dict.JOINT_RightThumbDistal_Yrotation,z:bvh_dict.JOINT_RightThumbDistal_Zrotation},
    'leftUpperLeg':{x:bvh_dict.JOINT_LeftUpperLeg_Xrotation,y:bvh_dict.JOINT_LeftUpperLeg_Yrotation,z:bvh_dict.JOINT_LeftUpperLeg_Zrotation},
    'leftLowerLeg':{x:bvh_dict.JOINT_LeftLowerLeg_Xrotation,y:bvh_dict.JOINT_LeftLowerLeg_Yrotation,z:bvh_dict.JOINT_LeftLowerLeg_Zrotation},
    'leftFoot':{x:bvh_dict.JOINT_LeftFoot_Xrotation,y:bvh_dict.JOINT_LeftFoot_Yrotation,z:bvh_dict.JOINT_LeftFoot_Zrotation},
    'leftToes':{x:bvh_dict.JOINT_LeftToes_Xrotation,y:bvh_dict.JOINT_LeftToes_Yrotation,z:bvh_dict.JOINT_LeftToes_Zrotation},
    'rightUpperLeg':{x:bvh_dict.JOINT_RightUpperLeg_Xrotation,y:bvh_dict.JOINT_RightUpperLeg_Yrotation,z:bvh_dict.JOINT_RightUpperLeg_Zrotation},
    'rightLowerLeg':{x:bvh_dict.JOINT_RightLowerLeg_Xrotation,y:bvh_dict.JOINT_RightLowerLeg_Yrotation,z:bvh_dict.JOINT_RightLowerLeg_Zrotation},
    'rightFoot':{x:bvh_dict.JOINT_RightFoot_Xrotation,y:bvh_dict.JOINT_RightFoot_Yrotation,z:bvh_dict.JOINT_RightFoot_Zrotation},
    'rightToes':{x:bvh_dict.JOINT_RightToes_Xrotation,y:bvh_dict.JOINT_RightToes_Yrotation,z:bvh_dict.JOINT_RightToes_Zrotation}
}

interface MbNumName {
    'hips':Object,
    'spine':Object,
    'chest':Object,
    'upperChest':Object,
    'neck':Object,
    'head':Object,
    'leftEye':Object,
    'rightEye':Object,
    'leftShoulder':Object,
    'leftUpperArm':Object,
    'leftLowerArm':Object,
    'leftHand':Object,
    'leftIndexProximal':Object,
    'leftIndexIntermediate':Object,
    'leftIndexDistal':Object,
    'leftLittleProximal':Object,
    'leftLittleIntermediate':Object,
    'leftLittleDistal':Object,
    'leftMiddleProximal':Object,
    'leftMiddleIntermediate':Object,
    'leftMiddleDistal':Object,
    'leftRingProximal':Object,
    'leftRingIntermediate':Object,
    'leftRingDistal':Object,
    'leftThumbProximal':Object,
    'leftThumbIntermediate':Object,
    'leftThumbDistal':Object,
    'rightShoulder':Object,
    'rightUpperArm':Object,
    'rightLowerArm':Object,
    'rightHand':Object,
    'rightIndexProximal':Object,
    'rightIndexIntermediate':Object,
    'rightIndexDistal':Object,
    'rightLittleProximal':Object,
    'rightLittleIntermediate':Object,
    'rightLittleDistal':Object,
    'rightMiddleProximal':Object,
    'rightMiddleIntermediate':Object,
    'rightMiddleDistal':Object,
    'rightRingProximal':Object,
    'rightRingIntermediate':Object,
    'rightRingDistal':Object,
    'rightThumbProximal':Object,
    'rightThumbIntermediate':Object,
    'rightThumbDistal':Object,
    'leftUpperLeg':Object,
    'leftLowerLeg':Object,
    'leftFoot':Object,
    'leftToes':Object,
    'rightUpperLeg':Object,
    'rightLowerLeg':Object,
    'rightFoot':Object,
    'rightToes':Object
}

export function read_bvh_file(){
    let obj1 = document.getElementById("selfile") as HTMLElement;
  
    //ダイアログでファイルが選択された時
    obj1.addEventListener("change",function(event:Event){
        //モーションデータ関連の変数の初期化
        init_bvh_data();
    
        let file = (event.target as HTMLInputElement).files;
        if(file == null){
            throw new Error("file is null.");
        }
        let string_text_file:string;
        let messages:string[] = [];
        let messages_sliced:string[] = [];
    
        //FileReaderの作成
        var reader = new FileReader();
    
        //テキスト形式で読み込む
        reader.readAsText(file[0]);
        
        //読込終了後の処理
            reader.onload = function(ev:ProgressEvent){
            // テキストファイルの内容を変数に格納
            string_text_file = reader.result as string;
            
            //文字列全体を行ごとに分けて配列に入れる
            messages = string_text_file.split(/\n/);

            //モーションデータだけに文字列を分割
            for(let row=0; row<messages.length; row++){
                if(messages[row].match(/Frame Time/)){
                messages_sliced = messages.slice(row+1);
                break;
                }
            }

            //タブスペースで分割してそれを数値とし出力する
            for(let row=0; row<messages_sliced.length; row++){
                let sliced_value:number[] = [];
                messages_sliced[row].split('	').forEach(function(value){

                sliced_value.push(Number(value));
                })
                text_data[row] = sliced_value;
            }
            
            setup_bvh_motion();

        }
    },false);

}

function _get_bvh_data(){
   //return my_data;
   for(let i=0; i<text_data.length; i++){
    console.log("loadfile length is "+ text_data.length);
        radians_motion_data[i] = text_data[i];
    }   
}

export function init_bvh_data(){
    _is_start_motion = false;
    frame = 0;
    text_data.splice(1);
    radians_motion_data.splice(1);
    
    _get_total_frames(radians_motion_data.length);
}

export function setup_bvh_motion(){
    _get_bvh_data();
    _get_total_frames(radians_motion_data.length);
    _get_radians_motion_data()
    _is_start_motion = true;
}

function _get_radians_motion_data(){
    //度数のbvhデータをラジアンに変換
    for (let i=0; i < radians_motion_data.length; i++){
        for (let j=0; j < radians_motion_data[i].length; j++){
            radians_motion_data[i][j] = radians_motion_data[i][j]*Math.PI/180;
        }
    }
}

export function update_bvh_motion(vrmManager:any){
    if(_is_start_motion){
        vrmManager = _update_motion(vrmManager);
        vrmManager = _update_morphing(vrmManager);
        //揺れ等追加したい場合
        //vrmManager.update(scene.getEngine().getDeltaTime());
        _update_frame();    
    }

    return vrmManager as any;
}


function _update_motion(vrmManager:any ):any{

    let motion_data:BABYLON.Matrix[] = [];
    //let motion_data2:number[] = [];

    //回転を行列に変換
    for(let idx=0; idx < Object.keys(bvh_dict).length; idx++){ //idx 0,1,2 はpositionのため3から
        if(idx%3 === 0){   //Z
            motion_data[idx] = BABYLON.Matrix.RotationZ(radians_motion_data[frame][idx]);
        }else if(idx%3 === 1){   //X
            motion_data[idx] = BABYLON.Matrix.RotationX(radians_motion_data[frame][idx]);
        }else if(idx%3 === 2){   //Y
            motion_data[idx] = BABYLON.Matrix.RotationY(radians_motion_data[frame][idx]);
        }
    }

    //matrixでrotaionをかける その２
    // for(let idx=0; idx < Object.keys(bvh_dict).length; idx++){ //idx 0,1,2 はpositionのため3から
    //     if(idx%3 === 0){   //Z
    //         motion_data2[idx] = radians_motion_data[frame][idx];
    //     }else if(idx%3 === 1){   //X
    //         motion_data2[idx] = radians_motion_data[frame][idx];
    //     }else if(idx%3 === 2){   //Y
    //         motion_data2[idx] = radians_motion_data[frame][idx];
    //     }
    // }    

    

    //forEachを使ってhumanoidBoneの各要素の軸を変換 その１ //20221124
    Object.keys(vrmManager.humanoidBone.nodeMap).forEach(element => {
        //elementの文字列がmb_numのキーであることを約束するためにinterfaceを使って
        const key: keyof MbNumName = element as keyof MbNumName;
        if (!key){
            throw new Error("elementがMbNumNameに存在しない要素を使用しています。element" + element);
        }
        const node_num = mb_num[key];
        //ZXYで回転する行列を作りクオータニオンで動かす
        let rotYXZ = motion_data[node_num.y].multiply(motion_data[node_num.x].multiply(motion_data[node_num.z]));
        vrmManager.humanoidBone.nodeMap[element].rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
        vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.y = -vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.y;
        vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.w = -vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.w;
    });

    //forEachを使ってhumanoidBoneの各要素の軸を変換 その２
    // Object.keys(vrmManager.humanoidBone.nodeMap).forEach(element => {
    //     //elementの文字列がmb_numのキーであることを約束するためにinterfaceを使って
    //     const key: keyof MbNumName = element as keyof MbNumName;
    //     if (!key){
    //         throw new Error("elementがMbNumNameに存在しない要素を使用しています。element" + element);
    //     }
    //     const node_num = mb_num[key];
    //     //matrixで軸を変換
    //     let rotYXZ = BABYLON.Quaternion.RotationYawPitchRoll(motion_data2[node_num.y],motion_data2[node_num.x],motion_data2[node_num.z]);
    //     vrmManager.humanoidBone.nodeMap[element].rotationQuaternion = rotYXZ;
    //     vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.y = -vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.y;
    //     vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.w = -vrmManager.humanoidBone.nodeMap[element].rotationQuaternion.w;
    // });

    return vrmManager as any;
}

function _update_morphing(vrmManager:any):any{
    if(frame === 0){
        return vrmManager as any;
    }

    //cosで良い感じに笑う調整
    let joy_value = 8*Math.cos(Math.PI*(7*frame/total_frames));
    if(joy_value < 0){
      joy_value = 0;
    }else if(joy_value > 0.65){
      joy_value = 0.65;
    }

    vrmManager.morphing('Joy', joy_value+0.3);

    return vrmManager as any;
}

function _get_total_frames(radians_motion_data_length:number){
    total_frames = radians_motion_data_length;
    console.log("toral frame is : "+total_frames);
}

function _update_frame(){
    frame++;
    if(frame >=  total_frames ){  
        frame = 0;
    }
}




    // let rotYXZ = motion_data[bvh_dict.ROOT_Hips_Yrotation].multiply(motion_data[bvh_dict.ROOT_Hips_Xrotation].multiply(motion_data[bvh_dict.ROOT_Hips_Zrotation]));
    // vrmManager.humanoidBone.hips.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.hips.rotationQuaternion.y = -vrmManager.humanoidBone.hips.rotationQuaternion.y;
    // vrmManager.humanoidBone.hips.rotationQuaternion.w = -vrmManager.humanoidBone.hips.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_LeftUpperLeg_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftUpperLeg_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftUpperLeg_Zrotation]));
    // vrmManager.humanoidBone.leftUpperLeg.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftUpperLeg.rotationQuaternion.y = -vrmManager.humanoidBone.leftUpperLeg.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftUpperLeg.rotationQuaternion.w = -vrmManager.humanoidBone.leftUpperLeg.rotationQuaternion.w;


    // rotYXZ = motion_data[bvh_dict.JOINT_LeftLowerLeg_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftLowerLeg_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftLowerLeg_Zrotation]));
    // vrmManager.humanoidBone.leftLowerLeg.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftLowerLeg.rotationQuaternion.y = -vrmManager.humanoidBone.leftLowerLeg.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftLowerLeg.rotationQuaternion.w = -vrmManager.humanoidBone.leftLowerLeg.rotationQuaternion.w;


    // rotYXZ = motion_data[bvh_dict.JOINT_LeftFoot_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftFoot_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftFoot_Zrotation]));
    // vrmManager.humanoidBone.leftFoot.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftFoot.rotationQuaternion.y = -vrmManager.humanoidBone.leftFoot.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftFoot.rotationQuaternion.w = -vrmManager.humanoidBone.leftFoot.rotationQuaternion.w;


    // rotYXZ = motion_data[bvh_dict.JOINT_RightUpperLeg_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightUpperLeg_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightUpperLeg_Zrotation]));
    // vrmManager.humanoidBone.rightUpperLeg.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightUpperLeg.rotationQuaternion.y = -vrmManager.humanoidBone.rightUpperLeg.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightUpperLeg.rotationQuaternion.w = -vrmManager.humanoidBone.rightUpperLeg.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_RightLowerLeg_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightLowerLeg_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightLowerLeg_Zrotation]));
    // vrmManager.humanoidBone.rightLowerLeg.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightLowerLeg.rotationQuaternion.y = -vrmManager.humanoidBone.rightLowerLeg.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightLowerLeg.rotationQuaternion.w = -vrmManager.humanoidBone.rightLowerLeg.rotationQuaternion.w;

   
    // rotYXZ = motion_data[bvh_dict.JOINT_RightFoot_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightFoot_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightFoot_Zrotation]));
    // vrmManager.humanoidBone.rightFoot.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightFoot.rotationQuaternion.y = -vrmManager.humanoidBone.rightFoot.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightFoot.rotationQuaternion.w = -vrmManager.humanoidBone.rightFoot.rotationQuaternion.w;


    // rotYXZ = motion_data[bvh_dict.JOINT_Head_Yrotation].multiply(motion_data[bvh_dict.JOINT_Head_Xrotation].multiply(motion_data[bvh_dict.JOINT_Head_Zrotation]));
    // vrmManager.humanoidBone.head.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.head.rotationQuaternion.y = -vrmManager.humanoidBone.head.rotationQuaternion.y;
    // vrmManager.humanoidBone.head.rotationQuaternion.w = -vrmManager.humanoidBone.head.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_Neck_Yrotation].multiply(motion_data[bvh_dict.JOINT_Neck_Xrotation].multiply(motion_data[bvh_dict.JOINT_Neck_Zrotation]));
    // vrmManager.humanoidBone.neck.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.neck.rotationQuaternion.y = -vrmManager.humanoidBone.neck.rotationQuaternion.y;
    // vrmManager.humanoidBone.neck.rotationQuaternion.w = -vrmManager.humanoidBone.neck.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_Spine_Yrotation].multiply(motion_data[bvh_dict.JOINT_Spine_Xrotation].multiply(motion_data[bvh_dict.JOINT_Spine_Zrotation]));
    // vrmManager.humanoidBone.spine.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.spine.rotationQuaternion.y = -vrmManager.humanoidBone.spine.rotationQuaternion.y;
    // vrmManager.humanoidBone.spine.rotationQuaternion.w = -vrmManager.humanoidBone.spine.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_UpperChest_Yrotation].multiply(motion_data[bvh_dict.JOINT_UpperChest_Xrotation].multiply(motion_data[bvh_dict.JOINT_UpperChest_Zrotation]));
    // vrmManager.humanoidBone.upperChest.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.upperChest.rotationQuaternion.y = -vrmManager.humanoidBone.upperChest.rotationQuaternion.y;
    // vrmManager.humanoidBone.upperChest.rotationQuaternion.w = -vrmManager.humanoidBone.upperChest.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_Chest_Yrotation].multiply(motion_data[bvh_dict.JOINT_Chest_Xrotation].multiply(motion_data[bvh_dict.JOINT_Chest_Zrotation]));
    // vrmManager.humanoidBone.chest.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.chest.rotationQuaternion.y = -vrmManager.humanoidBone.chest.rotationQuaternion.y;
    // vrmManager.humanoidBone.chest.rotationQuaternion.w = -vrmManager.humanoidBone.chest.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_LeftShoulder_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftShoulder_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftShoulder_Zrotation]));
    // vrmManager.humanoidBone.leftShoulder.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftShoulder.rotationQuaternion.y = -vrmManager.humanoidBone.leftShoulder.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftShoulder.rotationQuaternion.w = -vrmManager.humanoidBone.leftShoulder.rotationQuaternion.w;
    

    // rotYXZ = motion_data[bvh_dict.JOINT_LeftUpperArm_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftUpperArm_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftUpperArm_Zrotation]));
    // vrmManager.humanoidBone.leftUpperArm.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftUpperArm.rotationQuaternion.y = -vrmManager.humanoidBone.leftUpperArm.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftUpperArm.rotationQuaternion.w = -vrmManager.humanoidBone.leftUpperArm.rotationQuaternion.w;
    
    
    // rotYXZ = motion_data[bvh_dict.JOINT_LeftLowerArm_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftLowerArm_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftLowerArm_Zrotation]));
    // vrmManager.humanoidBone.leftLowerArm.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftLowerArm.rotationQuaternion.y = -vrmManager.humanoidBone.leftLowerArm.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftLowerArm.rotationQuaternion.w = -vrmManager.humanoidBone.leftLowerArm.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_LeftHand_Yrotation].multiply(motion_data[bvh_dict.JOINT_LeftHand_Xrotation].multiply(motion_data[bvh_dict.JOINT_LeftHand_Zrotation]));
    // vrmManager.humanoidBone.leftHand.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.leftHand.rotationQuaternion.y = -vrmManager.humanoidBone.leftHand.rotationQuaternion.y;
    // vrmManager.humanoidBone.leftHand.rotationQuaternion.w = -vrmManager.humanoidBone.leftHand.rotationQuaternion.w;
  
    
    // rotYXZ = motion_data[bvh_dict.JOINT_RightShoulder_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightShoulder_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightShoulder_Zrotation]));
    // vrmManager.humanoidBone.rightShoulder.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightShoulder.rotationQuaternion.y = -vrmManager.humanoidBone.rightShoulder.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightShoulder.rotationQuaternion.w = -vrmManager.humanoidBone.rightShoulder.rotationQuaternion.w;
    
    
    // rotYXZ = motion_data[bvh_dict.JOINT_RightUpperArm_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightUpperArm_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightUpperArm_Zrotation]));
    // vrmManager.humanoidBone.rightUpperArm.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightUpperArm.rotationQuaternion.y = -vrmManager.humanoidBone.rightUpperArm.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightUpperArm.rotationQuaternion.w = -vrmManager.humanoidBone.rightUpperArm.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_RightLowerArm_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightLowerArm_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightLowerArm_Zrotation]));
    // vrmManager.humanoidBone.rightLowerArm.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightLowerArm.rotationQuaternion.y = -vrmManager.humanoidBone.rightLowerArm.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightLowerArm.rotationQuaternion.w = -vrmManager.humanoidBone.rightLowerArm.rotationQuaternion.w;

    
    // rotYXZ = motion_data[bvh_dict.JOINT_RightHand_Yrotation].multiply(motion_data[bvh_dict.JOINT_RightHand_Xrotation].multiply(motion_data[bvh_dict.JOINT_RightHand_Zrotation]));
    // vrmManager.humanoidBone.rightHand.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotYXZ);
    // vrmManager.humanoidBone.rightHand.rotationQuaternion.y = -vrmManager.humanoidBone.rightHand.rotationQuaternion.y;
    // vrmManager.humanoidBone.rightHand.rotationQuaternion.w = -vrmManager.humanoidBone.rightHand.rotationQuaternion.w;