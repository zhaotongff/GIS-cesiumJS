import React, { Component } from 'react';

class Others1 extends Component{
	render(){
		return(
			<div id="descript">
				<h1 id="descript-h1">使用说明</h1>
				<h3>1.项目介绍</h3>
				<p>本项目自2018年7月9日起实施，项目组成员通过多方面调研，对比MapboxGL、Open Layers、CesiumJS、ArcGIS API forJS、SuperMap几款Gis框架，从它们功能、插件丰富程度、可维护性、可扩展性、坐标兼容性、社区支持度、优缺点等方面分析，最终确定利用支持3D技术gis开源前端框架CesiumJS实现，主要完成的功能包括：3D楼宇模型、3D可视化球型图、平面定位缓存、经纬度显示、热力图、人员轨迹控制、飞机轨迹还原等功能。</p>
				
				<h3>2.使用流程</h3>
				<p>(1)在浏览器中输入网址，打开页面，等待加载。</p>
                <p>(2)网页左边包括首页、功能、其他等选项，右边是项目简介，简单介绍了项目的调研及完成的功能。</p>
                <p>(3)点击功能栏里面的相关选项，会跳转到相应视图，视图框内的工具栏可以详细选择需要显示的功能。</p>
                <p>(4)其他栏里面的功能介绍及版本说明会详细介绍流程和版本。</p>
			</div>
		)
	}
}

export default Others1