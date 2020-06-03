import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableHighlight, Image } from 'react-native';

class QueueScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			queue : []
		};

		this.AddToQueue = this.AddToQueue.bind(this);
		this.HandleLike = this.HandleLike.bind(this);
		this.SendNextSong = this.SendNextSong.bind(this);
	}

	// gets called from app.js when a song is selected from the search
	AddToQueue(songInfo) {
		let tempQueue = this.state.queue;
		tempQueue.push(songInfo);
		this.setState({ queue: tempQueue });
	}

	// sends the queue up to app.js
	SendNextSong() {
		let next = this.state.queue[0];
		let queue = this.state.queue;
		queue.shift();
		this.setState({ queue }, () => {
			return next;
		});
		// return next;
	}

	HandleLike() {
		console.log('liked!');
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View>
					<Text style={styles.screenTitle}>up next</Text>
					<FlatList
						style={{ marginBottom: 70 }}
						data={this.state.queue}
						renderItem={({ item, index, separators }) => (
							<TouchableHighlight
								style={styles.queueList}
								onPress={() => this.HandleLike()}
								onShowUnderlay={separators.highlight}
								onHideUnderlay={separators.unhighlight}
							>
								<View style={styles.queueRow}>
									<Text style={styles.orderNumber}>{index + 1}</Text>
									<Image source={{ uri: item.image }} style={styles.albumArt} />
									<View style={styles.queueCol}>
										<Text style={styles.songTitle}>{item.name}</Text>
										<Text style={styles.songArtist}>{item.artist}</Text>
									</View>
								</View>
							</TouchableHighlight>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container   : {
		flex            : 1,
		backgroundColor : '#696969'
	},

	screenTitle : {
		textAlign  : 'center',
		color      : 'white',
		fontSize   : 30,
		fontWeight : '500',
		marginTop  : 15
	},

	queueList   : {
		marginLeft  : 15,
		marginRight : 20,
		marginTop   : 20
	},

	queueRow    : {
		flex          : 1,
		flexDirection : 'row'
	},

	queueCol    : {
		flex           : 1,
		flexDirection  : 'column',
		justifyContent : 'space-around'
	},

	songTitle   : {
		fontSize    : 18,
		color       : 'black',
		paddingLeft : 10
	},

	songArtist  : {
		fontSize    : 15,
		color       : '#D3D3D3',
		paddingLeft : 10
	},

	albumArt    : {
		height : 64,
		width  : 64
	},

	orderNumber : {
		color        : '#D3D3D3',
		fontSize     : 20,
		paddingRight : 15,
		paddingTop   : 20,
		width        : '14%',
		textAlign    : 'center'
	}
});

export default QueueScreen;
