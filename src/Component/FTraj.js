import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

import BillboardCollection from 'cesium/Source/Scene/BillboardCollection'
import Math from "cesium/Source/Core/Math";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import Color from "cesium/Source/Core/Color";
import Transforms from 'cesium/Source/Core/Transforms'
import HeadingPitchRoll from 'cesium/Source/Core/HeadingPitchRoll'
import Ellipsoid from 'cesium/Source/Core/Ellipsoid'
import Matrix4 from 'cesium/Source/Core/Matrix4'
import JulianDate from 'cesium/Source/Core/JulianDate'

import ArcGisMapServerImageryProvider from "cesium/Source/Scene/ArcGisMapServerImageryProvider";
import Model from "cesium/Source/Scene/Model";

import SampledPositionProperty from "cesium/Source/DataSources/SampledPositionProperty";
import PolylineGlowMaterialProperty from 'cesium/Source/DataSources/PolylineGlowMaterialProperty'
/*import defined from "cesium/Source/Core/defined";

import CzmlDataSource from "cesium/Source/DataSources/CzmlDataSource";
*/

class FTraj extends Component{
componentDidMount() {
let view = new Viewer('cesiumContainer',{
    baseLayerPicker: false,
    timeline: false,
    animation: false,
    imageryProvider: new ArcGisMapServerImageryProvider({
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    }) 
});

const canvas = view.canvas;

canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
canvas.addEventListener('click', function() {
    canvas.focus();
});
canvas.focus();

const scene = view.scene;    
// 小人旋转角度
const radian = Math.toRadians(30.0);
// 小人的速度
const speed = 10;
// 速度矢量
let speedVector = new Cartesian3();
// 起始位置
let position = Cartesian3.fromDegrees(120.433650,31.361800,0);
//镜头一开始的位置
let point = Cartesian3.fromDegrees(120.433650,31.361800, 1500.0);

view.camera.setView({
    destination : point,
    orientation: {
        heading : Math.toRadians(0.0), //实体与z的旋转角
        pitch : Math.toRadians(-90.0), //实体与x的俯视角
        roll : 0.0 //实体与y的航偏角
    }
});

//获取相关DOM
const longitude = document.getElementById('longitude');
const latitude = document.getElementById('latitude');
const altitude = document.getElementById('altitude');

longitude.innerHTML = '120.6200';
latitude.innerHTML = '31.3200';
altitude.innerHTML = '0.0000';

let pathPosition = new SampledPositionProperty();

// 用于设置小人方向
let hpRoll = new HeadingPitchRoll();

let fixedFrameTransforms =  Transforms.localFrameToFixedFrameGenerator('north', 'west');

// 添加小人模型
let personPrimitive = scene.primitives.add(Model.fromGltf({
    url: '../cesium/Apps/SampleData/models/CesiumMan/Cesium_Man.glb',
    modelMatrix: Transforms.headingPitchRollToFixedFrame(position, hpRoll, Ellipsoid.WGS84, fixedFrameTransforms),
    minimumPixelSize:128
}));

// 小人状态标志
let flag = {
    moveUp:false,
    moveDown:false,
    moveLeft:false,
    moveRight:false
};

// 根据键盘按键返回标志
function setFlagStatus(key,value) {
    switch (key.keyCode){
        case 37:
            // 左
            flag.moveLeft = value;
            break;
        case 38:
            // 上
            flag.moveUp = value;
            break;
        case 39:
            // 右
            flag.moveRight = value;
            break;
        case 40:
            flag.moveDown = value;
            // 下
            break;
        default:
            console.log('您的操作有误');
            break;
    }
}

document.addEventListener('keydown',function(e){
    setFlagStatus(e, true);
});

document.addEventListener('keyup',function(e){
    setFlagStatus(e, false);
});


// 对帧添加监听事件 (onTick每当时钟被调用时触发响应时间) 一直在执行 
view.clock.onTick.addEventListener(function(clock){
  
    clock.currentTime=JulianDate.now();
    
    //========所以可以对下面这个函数进行更改
    if(flag.moveUp){             
        if(flag.moveLeft){
            hpRoll.heading -= radian;
        }

        if(flag.moveRight){
            hpRoll.heading += radian;
        }
        movePerson(true);
    }
        
    if(flag.moveLeft){
        hpRoll.heading -= radian;
         movePerson(true);
    }

    if(flag.moveRight){
        hpRoll.heading += radian;
        movePerson(true);
    }
    
    if(flag.moveDown){
        if(flag.moveLeft){
            hpRoll.heading -= radian;
        }

        if(flag.moveRight){
            hpRoll.heading += radian;
        }
        movePerson(false);
    }
});


// == 移动小人
let oldPosition,oldwgs84,newlong,newlat,newPosition,newwgs84;

function movePerson(isUP) {
    oldPosition = new Cartesian3(position.x, position.y, position.z);
    oldwgs84 = Ellipsoid.WGS84.cartesianToCartographic(oldPosition);

    // 计算速度矩阵
    // view.scene.preUpdate.addEventListener(function(scene, time) {
    if(isUP>0){
        speedVector = Cartesian3.multiplyByScalar(Cartesian3.UNIT_X,speed,speedVector);
    }else{
        speedVector = Cartesian3.multiplyByScalar(Cartesian3.UNIT_X,-speed,speedVector);
    }
    // 根据速度计算出下一个位置的坐标
    position =Matrix4.multiplyByPoint(personPrimitive.modelMatrix ,speedVector, position);
    pathPosition.addSample(JulianDate.now(), position);

    //计算经纬度start
    newPosition = new Cartesian3(position.x, position.y, position.z);
    newwgs84 = Ellipsoid.WGS84.cartesianToCartographic(newPosition);
    newlong = Math.toDegrees(newwgs84.longitude);
    newlat = Math.toDegrees(newwgs84.latitude);
    //计算经纬度end
       
    //画线start
    view.entities.add({
        position : pathPosition,
        name : 'trajectory',
        path : {
            show : true,
            leadTime : 0,
            trailTime : 60,
            width : 5,
            resolution : 1,
            material : new PolylineGlowMaterialProperty({
                glowPower : 0.3,
                color : Color.RED
            })
        }
    });
    //画线end

    // 小人移动
    Transforms.headingPitchRollToFixedFrame(position, hpRoll, Ellipsoid.WGS84, fixedFrameTransforms, personPrimitive.modelMatrix);
    
    longitude.innerHTML = newlong.toFixed(4);
    latitude.innerHTML = newlat.toFixed(4);
    altitude.innerHTML = newwgs84.height.toFixed(4);
    //});
    //镜头移动
    view.camera.flyTo({
        destination : Cartesian3.fromDegrees(newlong, newlat,1500)
    });
}

// == 放置苏研广告牌
let billboards = scene.primitives.add(new BillboardCollection());
billboards.add({
  position : Cartesian3.fromDegrees(120.434662,31.361690,0),
  image : '../Apps/images/name.PNG',
  
 


});

}
componentWillUnmount() {
    this.viewer = null;
}
render(){
    return(
        <div>
            <div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
            <div id="toolbar">
                <table className="infoPanel">
                    <tbody>
                        <tr>
                            <td className='TrajTitle'>操作指南：</td>
                        </tr>
                        <tr>
                            <td>← 左转/→ 右转</td>
                        </tr>
                        <tr>
                            <td>↑ 向前/↓ 向后</td>
                        </tr>
                        <tr>
                            <td><br/></td>
                        </tr>
                        <tr>
                            <td className='TrajTitle'>相关参数：</td>
                        </tr>
                        <tr>
                            <td>经度: <span id="longitude"></span>°</td>
                        </tr>
                        <tr>
                            <td>纬度: <span id="latitude"></span>°</td>
                        </tr>
                        <tr>
                            <td>海拔: <span id="altitude"></span>°</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
}

export default FTraj