import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, TouchableHighlight, Image } from 'react-native';

class SearchScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchData   : [],
			access_token : props.access_token
		};

		this.HandleSearchChange = this.HandleSearchChange.bind(this);
		this.GenerateSearchResults = this.GenerateSearchResults.bind(this);
	}

	GenerateSearchResults() {
		return (
			<FlatList
				style={{ marginBottom: 20 }}
				data={this.state.searchData}
				renderItem={({ item, separators }) => (
					<TouchableHighlight
						style={styles.searchList}
						onPress={() =>
							this.props.AddToQueue({
								name     : item.name,
								artist   : item.artists[0].name,
								image    : item.album.images[0].url,
								uri      : item.uri,
								duration : item.duration_ms,
								liked    : false
							})}
						underlayColor="#575757"
						onShowUnderlay={separators.highlight}
						onHideUnderlay={separators.unhighlight}
					>
						<View style={styles.resultRow}>
							<Image source={{ uri: item.album.images[0].url }} style={styles.albumArt} />
							<View style={styles.resultCol}>
								<Text style={styles.songTitle}>{item.name}</Text>
								<Text style={styles.songArtist}>{item.artists[0].name}</Text>
							</View>
						</View>
					</TouchableHighlight>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}

	HandleSearchChange(search) {
		if (search.length > 0) {
			fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=15`, {
				headers : {
					Authorization : `Bearer ${this.state.access_token}`
				}
			})
				.then((res) => res.json())
				.then(
					(result) => {
						this.setState({ searchData: result.tracks.items });
					},
					(error) => {
						console.error(error);
					}
				);
		} else {
			this.setState({ searchData: [] });
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<TextInput
					style={styles.searchBox}
					placeholder="search"
					placeholderTextColor="white"
					onChange={(search) => this.HandleSearchChange(search.nativeEvent.text)}
				/>
				{this.GenerateSearchResults()}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container  : {
		flex            : 1,
		backgroundColor : '#696969'
	},

	searchBox  : {
		height          : 35,
		backgroundColor : 'gray',
		color           : 'white',
		textAlign       : 'left',
		paddingLeft     : 20,
		marginLeft      : 20,
		marginRight     : 20,
		marginTop       : 10,
		borderRadius    : 12,
		borderColor     : 'gray',
		borderWidth     : 1
	},

	searchList : {
		marginLeft  : 20,
		marginRight : 20,
		marginTop   : 10
	},

	songTitle  : {
		fontSize    : 18,
		color       : 'white',
		paddingLeft : 10
	},

	songArtist : {
		fontSize    : 15,
		color       : '#B3B3B3',
		paddingLeft : 10
	},

	albumArt   : {
		height : 64,
		width  : 64
	},

	resultRow  : {
		flex          : 1,
		flexDirection : 'row'
	},

	resultCol  : {
		flex           : 1,
		flexDirection  : 'column',
		justifyContent : 'space-around'
	}
});

export default SearchScreen;
