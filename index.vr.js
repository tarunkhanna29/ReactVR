import React, {Component} from 'react';
import {
  AppRegistry,
  AmbientLight,
  Animated,
  CylindricalPanel,
  Image,
  DirectionalLight,
  asset,
  Model,
  Pano,
  Plane,
  Box,
  Sphere,
  Text,
  View,
  Cylinder,
  Sound,
  VrButton,
  NativeModules
} from 'react-vr';

import styles from './myStyle.js';

const cubeModule = NativeModules.CubeModule;

class Platform extends Component {
	render() {
		return (
			<Box 
				dimWidth={5}
				dimDepth={5}
				dimHeight={.1}
				texture={asset('DeckPlate.jpg')}
				style={{
					transform: [{
						translate: [
							this.props.MyX, this.props.MyY, this.props.MyZ
						]
					}]
				}}
			/>
		);
	}
}

export default class WelcomeToVR extends Component {
  constructor(props) {
	super(props);
	this.state = {
		yRotation: 0,
		btnColor: 'white',
		cubeColor: 'yellow',
		currentPhoto: 2,
		photoCollection: { photos: []},
	}
	this.lastUpdate = Date.now();
	this.rotate = this.rotate.bind(this);
  }
  
  componentDidMount() {
	  this.rotate();
/* 	  Animated.timing( 
		this.state.yRotation,
		{
			duration: 10000,
			toValue: 360,
		}
	  ).start(); */
	  
	  //var myHeaders = new Headers();
	  //myHeaders.append('Access-Control-Request-Method', 'GET');
	  //myHeaders.append('Access-Control-Request-Method', 'Origin, Content-Type, Accept');
	  fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1197&api_key=xe3XBj6sfQpky3h1QR2jiT3gF1fdfzX1TCRdK3Dh', {
		  //headers: myHeaders,
		  method: 'GET',
		  //mode: 'cors',
	  })
	  .then(response => response.json())
	  .then(json => this.setState({
		  photoCollection: json
	  }));
  }
	
  componentWillUnmount() {
	  if(this.frameHandle) {
		  cancelAnimationFrame(this.frameHandle);
		  this.frameHandle = null;
	  }
  }	
	
  rotate() {
	const now = Date.now();
	const delta = now - this.lastUpdate;
	this.lastUpdate = now;
	console.log("Spinning the Pot");
	this.setState({
		yRotation: this.state.yRotation + delta/20
	});
	this.frameHandle = requestAnimationFrame(this.rotate);
  }	
  
  renderLoadingView() {
	  return (
		<View style={styles.frontCard}>
			<Text style={styles.manifestText}>Loading</Text>
			<Text style={styles.manifestText}>image data</Text>
			<Text style={styles.manifestText}>from NASA</Text>
			<Text style={styles.manifestText}>...</Text>
		</View>
	  );
  }
	
  renderPhoto(photo) {
	  return (
		<View style={styles.baseView}>
			<CylindricalPanel			//CylindricalPanel is not recommended to be used as it talks in terms of pixels
				layer={{
					width: 1000,		//1000 px
					height: 1000,		//1000 px
					density: 4680,
					radius: 20
				}}>
				<Image source={{uri: photo.img_src}} style={styles.panoImage}/>
			</CylindricalPanel>
			<Model 
				source={{
					obj: asset('ArrowDown.obj'),
					mtl: asset("ArrowDown.mtl")
				}}
				lit
				style={{
					transform: [{
						translate: [-2.5, -1, -5.1]
					}]
				}}
			/>
			<Model 
				source={{
					obj: asset('ArrowUp.obj'),
					mtl: asset("ArrowUp.mtl")
				}}
				lit
				style={{
					transform: [{
						translate: [1.3, -1, -5.1]
					}]
				}}
			/>
			<View style={styles.manifestCard}>
				<Text style={styles.manifestText}>{photo.camera.full_name}</Text>
				<Text style={styles.manifestText}>{photo.rover.name}</Text>
				<Text style={styles.manifestText}>{photo.rover.landing_date}</Text>
			</View>
		</View>
	  );
  }
	
  render() {
	let renderPhoto;  
	if (!this.state) {
		renderPhoto = this.renderLoadingView();
	}
	var photos = this.state.photoCollection.photos;
	if (!photos || !photos[this.state.currentPhoto]) {
		renderPhoto = this.renderLoadingView();
		return renderPhoto;
	} else {
		renderPhoto = this.renderPhoto(photos[this.state.currentPhoto]);
	}
	
    return (
      <View
		style={{
			transform:[{
				translate:[0,0,-3],
				layoutOrigin: [0.5, 0, 0],
				alignItems: 'center',
			}],
		}} 
	  >
		<AmbientLight intensity={0.3} />
		<DirectionalLight 
			intensity={.7}
			style={{
				transform:[{
					rotateZ:45,
				}]
			}}
		/>		
        <Pano source={asset('3.jpg')}/>
        <Text
          style={{
            backgroundColor: '#777879',
            fontSize: 0.8,
            fontWeight: '400',
            layoutOrigin: [0.5, 0.5],
            paddingLeft: 0.2,
            paddingRight: 0.2,
            textAlign: 'center',
            textAlignVertical: 'center',
            transform: [{translate: [0, 0, -3]}],
          }}>
          hello
        </Text>
		<Platform MyX='0' MyY='-1.8' MyZ='-5.1' />
		<Platform MyX='0' MyY='-1.8' MyZ='0' />
		<Platform MyX='0' MyY='-1.8' MyZ='5.1' />
		<Platform MyX='5.1' MyY='-1.8' MyZ='-5.1' />
		<Platform MyX='5.1' MyY='-1.8' MyZ='0' />
		<Platform MyX='5.1' MyY='-1.8' MyZ='5.1' />
		<Platform MyX='-5.1' MyY='-1.8' MyZ='-5.1' />
		<Platform MyX='-5.1' MyY='-1.8' MyZ='0' />
		<Platform MyX='-5.1' MyY='-1.8' MyZ='5.1' />
		<Animated.View
			style={{
				transform: [
					{rotateY: this.state.yRotation},
					{translate: [-5.1, -1, -5.1]},
				]
			}}
		>
			<Model 
				source={{
					obj: asset('teapot2.obj'),
					mtl: asset('teapot2.mtl'),				
				}}
				lit
				//style={{
				//	transform: [{
				//		translate: [-5.1, -1, -5.1]
				//	}]
				//}}
			/>
			<Sound 
				loop
				source={{
					wav: asset('sound/boiling_water.mp3')
				}}
				volume={1}
			/>
		</Animated.View>
		<Model 
			source={{
				obj: asset('IronMan.obj'),
				mtl: asset('IronMan.mtl'),				
			}}
			lit
			style={{
				transform: [
					{translate: [0, 0, -5.1]},
					{scale: 0.01}
				]
			}}
		/>
		<Plane 
			dimWidth={5}
			dimHeight={5}
			texture={asset('DeckPlate.jpg')}
			lit={true}
			style={{
				transform: [
				{translate: [0, 1.8, -5]},
				{rotateX: -90}
				]
			}}
		/>
		<Box 
			dimWidth={5}
			dimDepth={5}
			dimHeight={0.1}
			texture={asset('DeckPlate.jpg')}
			lit={true}
			style={{
				transform: [{
					translate: [5.2,-1.8,.1],
				}]
			}}
		/>
		<Cylinder
			radiusTop={2}
			radiusBottom={2.20}
			dimHeight={5}
			segments={10}
			lit={true}
			style={{
				color: 'red',
				transform: [
					{rotateZ: -90},
					{translate: [1,.5,-6]},
					{scale: 0.2},
				]
			}}
		/>
		<Sphere
			radius={0.5}
			widthSegments={20}
			heightSegments={12}
			style={{
				color: 'blue',
				transform: [{
					translate: [-1, 0, -3]
				}]
			}}
			lit
		/>
		<Sphere
			radius={1.5}
			widthSegments={20}
			heightSegments={12}
			style={{
				color: 'crimson',
				transform: [{
					translate: [1, -2, -3]
				}]
			}}
		/>
		<VrButton
			style={{
				backgroundColor: this.state.btnColor,
				borderRadius: 0.05,
				margin: 0.05
			}}
			onEnter={
				() => {
					this.setState({
						btnColor: this.state.cubeColor
					})
				}
			}
			onExit={
				() => {
					this.setState({
						btnColor: 'white'
					})
				}
			}
			onClick={
				() => {
					let hexColor = Math.floor(Math.random() *  0xffffff).toString();
					hexColor = '#' + (('000000' + hexColor).slice(-6));
					this.setState({
						cubeColor: hexColor, btnColor: hexColor
					});
					cubeModule.changeCubeColor(hexColor);
				}
			}
		>
			<Text style={{
				fontSize: 0.15,
				paddingTop: 0.025,
				paddingBottom: 0.025,
				paddingLeft: 0.05,
				paddingRight: 0.05,
				textAlign: 'center',
				textAlignVertical: 'center'
			}}>
				Button
			</Text>
		</VrButton>
		{renderPhoto}
      </View>
    );
  }
};

AppRegistry.registerComponent('WelcomeToVR', () => WelcomeToVR);