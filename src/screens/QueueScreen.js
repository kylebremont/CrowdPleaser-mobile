import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableHighlight, Image } from 'react-native';

class QueueScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			queue        : [],
			access_token : props.access_token,
			current_song : []
		};

		this.AddToQueue = this.AddToQueue.bind(this);
		this.HandleLike = this.HandleLike.bind(this);
		this.SendNextSong = this.SendNextSong.bind(this);
		this.GetCurrentlyPlaying = this.GetCurrentlyPlaying.bind(this);
		this.GenerateQueue = this.GenerateQueue.bind(this);
		this.GenerateQueue = this.GenerateQueue.bind(this);
	}

	// gets called from app.js when a song is selected from the search
	AddToQueue(songInfo) {
		let tempQueue = this.state.queue;
		for (let i = 0; i < tempQueue.length; i++) {
			if (tempQueue[i].name === songInfo.name && tempQueue[i].artist === songInfo.artist) {
				return;
			}
		}
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

	GetCurrentlyPlaying() {
		fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
			headers : {
				Authorization : `Bearer ${this.state.access_token}`
			}
		})
			.then((res) => res.json())
			.then(
				(result) => {
					this.setState({ current_song: result });
				},
				(error) => {
					console.error(error);
				}
			);
	}

	GenerateQueue() {
		return (
			<View>
				<Text style={styles.screenTitle}>up next</Text>
				<FlatList
					style={{ marginBottom: 250 }}
					data={this.state.queue}
					renderItem={({ item, index, separators }) => (
						<TouchableHighlight
							style={styles.queueList}
							onPress={() => this.HandleLike()}
							underlayColor="#575757"
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
		);
	}

	GenerateCurrentlyPlaying() {
		return (
			<View style={styles.currentlyPlayingRow}>
				<Image
					source={{ uri: this.state.current_song.item.album.images[0].url }}
					style={styles.currentlyPlayingArt}
				/>
				<View style={styles.currentlyPlayingCol}>
					<Text style={styles.currentlyPlayingTitle}>{this.state.current_song.item.name}</Text>
					<Text style={styles.currentlyPlayingArtist}>
						{this.state.current_song.item.album.artists[0].name}
					</Text>
				</View>
			</View>
		);
	}

	componentDidMount() {
		this.GetCurrentlyPlaying();
	}

	HandleLike() {
		console.log('liked!');
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				{this.state.current_song.length !== 0 && this.GenerateCurrentlyPlaying()}
				{this.GenerateQueue()}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container              : {
		flex            : 1,
		backgroundColor : '#696969'
	},

	screenTitle            : {
		textAlign    : 'center',
		color        : 'white',
		fontSize     : 30,
		fontWeight   : '500',
		marginTop    : 15,
		marginBottom : 15
	},

	queueList              : {
		marginLeft  : 15,
		marginRight : 20,
		marginTop   : 10
	},

	queueRow               : {
		flex          : 1,
		flexDirection : 'row'
	},

	queueCol               : {
		flex           : 1,
		flexDirection  : 'column',
		justifyContent : 'space-around'
	},

	songTitle              : {
		fontSize    : 18,
		color       : 'white',
		paddingLeft : 10
	},

	songArtist             : {
		fontSize    : 15,
		color       : '#B3B3B3',
		paddingLeft : 10
	},

	albumArt               : {
		height : 64,
		width  : 64
	},

	orderNumber            : {
		color        : 'white',
		fontSize     : 20,
		paddingRight : 15,
		paddingTop   : 20,
		width        : '14%',
		textAlign    : 'center'
	},

	currentlyPlayingRow    : {
		flexDirection     : 'row',
		alignItems        : 'center',
		borderBottomColor : '#B3B3B3',
		borderBottomWidth : 1,
		// marginLeft        : 15,
		marginTop         : 15
	},

	currentlyPlayingCol    : {
		flex           : 1,
		flexDirection  : 'column',
		justifyContent : 'center'
	},

	currentlyPlayingArt    : {
		width        : 150,
		height       : 150,
		marginLeft   : 15,
		marginBottom : 15
	},

	currentlyPlayingArtist : {
		color       : '#B3B3B3',
		fontSize    : 17,
		paddingLeft : 10
	},

	currentlyPlayingTitle  : {
		color       : 'white',
		fontSize    : 20,
		paddingLeft : 10
	}
});

export default QueueScreen;
