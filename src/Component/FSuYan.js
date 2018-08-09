import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler'
import Matrix4 from 'cesium/Source/Core/Matrix4'
import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType'
import Cartesian2 from 'cesium/Source/Core/Cartesian2'
import Cartesian3 from 'cesium/Source/Core/Cartesian3'
import defined from 'cesium/Source/Core/defined'
import Color from 'cesium/Source/Core/Color'
import CallbackProperty from 'cesium/Source/DataSources/CallbackProperty'
import Math from 'cesium/Source/Core/Math'
import Plane from 'cesium/Source/Core/Plane'
import Transforms from 'cesium/Source/Core/Transforms'
import IonResource from 'cesium/Source/Core/IonResource'
import HeadingPitchRoll from 'cesium/Source/Core/HeadingPitchRoll'
import HeadingPitchRange from 'cesium/Source/Core/HeadingPitchRange'
import Cesium3DTileset from 'cesium/Source/Scene/Cesium3DTileset'
import ClippingPlane from 'cesium/Source/Scene/ClippingPlane'
import ClippingPlaneCollection from 'cesium/Source/Scene/ClippingPlaneCollection'
import knockout from 'cesium/Source/ThirdParty/knockout.js'
import  'cesium/Apps/Sandcastle/templates/bucket.css'

import BillboardCollection from 'cesium/Source/Scene/BillboardCollection'


import Ellipsoid from 'cesium/Source/Core/Ellipsoid'

import JulianDate from 'cesium/Source/Core/JulianDate'

import ArcGisMapServerImageryProvider from "cesium/Source/Scene/ArcGisMapServerImageryProvider";
import Model from "cesium/Source/Scene/Model";

import SampledPositionProperty from "cesium/Source/DataSources/SampledPositionProperty";
import PolylineGlowMaterialProperty from 'cesium/Source/DataSources/PolylineGlowMaterialProperty'

class FSuYan extends Component{
componentDidMount() {
let view = new Viewer('cesiumContainer',{
    baseLayerPicker: false,
    timeline: false,
    animation: false,
    imageryProvider: new ArcGisMapServerImageryProvider({
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    }) 
});
  var scene = view.scene;
const canvas = view.canvas;

let hpRoll = new HeadingPitchRoll();
let fixedFrameTransforms =  Transforms.localFrameToFixedFrameGenerator('north', 'west');
// 起始位置
let position = Cartesian3.fromDegrees(120.435211,31.362801,0);
//镜头一开始的位置
let point = Cartesian3.fromDegrees(120.433651,31.361801, 1500.0);


var longitude
var latitude
var altitude


let pathPosition = new SampledPositionProperty();

// 添加小人模型
let personPrimitive = scene.primitives.add(Model.fromGltf({
    url: '../cesium/Apps/SampleData/models/box.gltf',
    //url: '../planedatas/box.gltf',
    modelMatrix: Transforms.headingPitchRollToFixedFrame(position, hpRoll, Ellipsoid.WGS84, fixedFrameTransforms),
    minimumPixelSize:128
}));


// == 放置苏研广告牌
let billboards = scene.primitives.add(new BillboardCollection());
billboards.add({
  position : Cartesian3.fromDegrees(120.434662,31.361690,0),
  image : '../Apps/images/name.PNG',
  
});


}
render(){
    return(
        <div>
            <div id="cesiumContainer" ref={ element => this.cesiumContainer = element }/>
            <div >
                <table className="infoPanel">
                    <tbody>
                        <tr>
                            <td >操作指南：</td>
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
                        //<tr>
                           /* <td className='TrajTitle'>相关参数：</td>
                        </tr>
                        <tr>
                            <td>经度: <span id="longitude"></span>°</td>
                        </tr>
                        <tr>
                            <td>纬度: <span id="latitude"></span>°</td>
                        </tr>
                        <tr>
                            <td>海拔: <span id="altitude"></span>°</td>
                        </tr>*/
                    </tbody>
                </table>
            </div>
        </div>
    )
}
}

export default FSuYan


