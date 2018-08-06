import React, { Component } from 'react';
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

import Cesium3DTileset from "cesium/Source/Scene/Cesium3DTileset";
import Cesium3DTileStyle from "cesium/Source/Scene/Cesium3DTileStyle";

import Cartesian3 from "cesium/Source/Core/Cartesian3";
import createWorldTerrain from "cesium/Source/Core/createWorldTerrain";
import HeadingPitchRoll from "cesium/Source/Core/HeadingPitchRoll";
import IonResource from "cesium/Source/Core/IonResource";
import Matrix4 from "cesium/Source/Core/Matrix4";



class FHouse extends Component{
componentDidMount() {




var viewer = new Viewer('cesiumContainer', {
    terrainProvider: createWorldTerrain(),
      animation: false,
    baseLayerPicker: false,
    timeline: false,
    navigationHelpButton: false
});

viewer.scene.globe.depthTestAgainstTerrain = true;

// Set the initial camera view to look at Manhattan
var initialPosition =Cartesian3.fromDegrees(-74.01881302800248, 40.69114333714821, 753);
var initialOrientation = new HeadingPitchRoll.fromDegrees(21.27879878293835, -21.34390550872461, 0.0716951918898415);
viewer.scene.camera.setView({
    destination: initialPosition,
    orientation: initialOrientation,
    endTransform: Matrix4.IDENTITY
});

// Load the NYC buildings tileset.
var tileset = new Cesium3DTileset({ url: IonResource.fromAssetId(5741) });
viewer.scene.primitives.add(tileset);

const tips = document.getElementById('tips');
// Color buildings based on their height.
function colorByLatitude() {
    tileset.style = new Cesium.Cesium3DTileStyle({
        defines: {
            latitudeRadians: "radians(${latitude})"
        },
        color: {
            conditions: [
                ["${latitudeRadians} >= 0.7125", "color('purple')"],
                ["${latitudeRadians} >= 0.712", "color('red')"],
                ["${latitudeRadians} >= 0.7115", "color('orange')"],
                ["${latitudeRadians} >= 0.711", "color('yellow')"],
                ["${latitudeRadians} >= 0.7105", "color('lime')"],
                ["${latitudeRadians} >= 0.710", "color('cyan')"],
                ["true", "color('blue')"]
            ]
        },
        meta : {
            description : '"Building id ${id} has height ${Height}."'
        }
    });
    tips.innerHTML = `<ul>
            <li><span style='background:purple'></span>&gt;=0.7125</li>
            <li><span style='background:red'></span>&gt;=0.712</li>
            <li><span style='background:orange'></span>&gt;=0.7115</li>
            <li><span style='background:yellow'></span>&gt;=0.711</li>
            <li><span style='background:lime'></span>&gt;=0.7105</li>
            <li><span style='background:cyan'></span>&gt;=0.710</li>
            <li><span style='background:blue'></span>&lt;0.710</li>
    </ul>`
}

// Color buildings by distance from a landmark.
function colorByDistance() {
    tileset.style = new Cesium.Cesium3DTileStyle({
        defines : {
            distance : "distance(vec2(radians(${longitude}), radians(${latitude})), vec2(-1.291777521, 0.7105706624))"
        },
        color : {
            conditions : [
                ["${distance} > 0.0012","color('gray')"],
                ["${distance} > 0.0008", "mix(color('yellow'), color('red'), (${distance} - 0.008) / 0.0004)"],
                ["${distance} > 0.0004", "mix(color('green'), color('yellow'), (${distance} - 0.0004) / 0.0004)"],
                ["${distance} < 0.00001", "color('white')"],
                ["true", "mix(color('blue'), color('green'), ${distance} / 0.0004)"]
            ]
        }
    });
    tips.innerHTML = `<ul>
            <li><span style='background:gray'></span>&gt;=0.0012</li>
            <li><span style='background:yellow'></span>-<span style='background:red'></span>&gt;=0.0008</li>
            <li><span style='background:green'></span>-<span style='background:yellow'></span>&gt;=0.0004</li>
            <li><span style='background:blue'></span>-<span style='background:green'></span>&gt;=0.0001</li>
            <li><span style='background:white'></span>&lt;0.00001</li>
            </ul>`
}

// Show only buildings greater than 200 meters in height.

const toolbar = document.getElementById('toolbar');
toolbar.onchange = function(){
    switch(toolbar.value){
        case '0' : colorByHeight(); break;
        case '1' : colorByLatitude();break;
        case '2' : colorByDistance();break;
        default : break;
    }

}
colorByHeight();

}
 componentWillUnmount() {
    this.viewer = null;
  }

render(){
    const lists = ['Color By Height','Color By Latitude','Color By Distance']
    return(
        <div>
            <div id="cesiumContainer" className="fullSize"></div>
            <div id="loadingOverlay"><h1>Loading...</h1></div>
            <select id="toolbar">
                {
                    lists.map((item,index)=>{
                        return <option key={index} value={index}>{item}</option>
                    })
                }
            </select>
            <div id='tips'>
            </div>
        </div>
    )
}
}

export default FHouse