import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Button } from 'react-native';

class HomeScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		console.log(this.props.access_token);
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Image style={styles.logo} source={require('../../assets/logo.png')} />
				<View style={styles.loginButtonBackground}>
					<Button
						title="Login to Spotify"
						onPress={() => this.props.Connect('spotify:track:2BSbCCbaSCzkOEZa6N5901')}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container : {
		flex            : 1,
		backgroundColor : '#696969'
	},

	logo      : {
		height    : 300,
		width     : 300,
		alignSelf : 'center',
		marginTop : 20
	}
});

export default HomeScreen;
