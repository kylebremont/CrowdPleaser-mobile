import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { auth as SpotifyAuth, remote as SpotifyRemote, ApiScope, ApiConfig } from 'react-native-spotify-remote';

// credentials
import { clientId, redirectUri } from './config';

// navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

// screen imports
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import QueueScreen from './src/screens/QueueScreen';
import PlaylistScreen from './src/screens/PlaylistScreen';

// Api Config object, replace with your own applications client id and urls
const spotifyConfig = {
	clientID        : clientId,
	redirectURL     : redirectUri,
	tokenRefreshURL : 'http://10.0.0.12:1234/refresh',
	tokenSwapURL    : 'http://10.0.0.12:1234/swap',
	scopes          : [ ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope ]
};

class App extends Component {
	constructor() {
		super();

		this.state = {
      loggedIn: false,
      access_token: null,
      // timer stuff
      progress: 0,
      isOn: false,
      start: 0
    };

    this.playEpicSong = this.playEpicSong.bind(this);
    this.AddToQueue = this.AddToQueue.bind(this);
    this.GetNextSong = this.GetNextSong.bind(this);
    // timer stuff
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    
    this.queueElement = React.createRef();
  }

  startTimer() {
		this.setState({
			isOn     : true,
			progress : this.state.progress,
			start    : Date.now() - this.state.progress
		});
		this.timer = setInterval(
			() =>
				this.setState({
					progress : Date.now() - this.state.start
				}),
			1
		);
	}

	stopTimer() {
		this.setState({ isOn: false });
		clearInterval(this.timer);
	}

	resetTimer() {
		this.setState({ progress: 0, isOn: false });
	}
  
  // gets song info from search and sends it to the queue screen
  AddToQueue(songInfo) {
    this.queueElement.current.AddToQueue(songInfo);
  }

  GetNextSong() {
    let song = this.queueElement.current.SendNextSong();
  }

	async playEpicSong(trackUri) {
		try {
			const session = await SpotifyAuth.authorize(spotifyConfig);
			console.log(session);
			await SpotifyRemote.connect(session.token);
      await SpotifyRemote.playUri(trackUri);
      this.setState({loggedIn: true, access_token: session})
		} catch (err) {
			console.error("Couldn't authorize with or connect to Spotify", err);
		}
	}

	render() {
		return (
			<>
        <StatusBar barStyle='dark-content' />
        {/* if user is not logged in */}
        {!this.state.loggedIn && (
          <LoginScreen Connect={this.playEpicSong}/>
        )}

        {/* if user is logged in */}
        {this.state.loggedIn && (
          <NavigationContainer>
            <Tab.Navigator
            // screenOptions={({ route }) => ({
            //   tabBarIcon: ({ focused, color, size }) => {
            //     let iconName;
            //     if (route.name === 'home') {
            //       iconName = 'ios-home';
            //     } else if (route.name === 'queue') {
            //       iconName = 'ios-list';
            //     } else if (route.name === 'search') {
            //       iconName = 'ios-search';
            //     } else if (route.name === 'playlists') {
            //       iconName = 'ios-musical-notes';
            //     }
    
            //     return <Ionicons name={iconName} size={size} color={color} />;
            //   },
            // })}
              tabBarOptions={{
                activeTintColor: 'white',
                inactiveTintColor: '#D3D3D3',
                style: {
                  backgroundColor: '#808080'
                }
              }}
            >
              <Tab.Screen name='queue'>
                {props => <QueueScreen ref={this.queueElement} />}
              </Tab.Screen>
              {/* <Tab.Screen name='home'>
                {props => <HomeScreen access_token={this.state.access_token} />}
              </Tab.Screen> */}
              <Tab.Screen name='search'>
                {props => <SearchScreen access_token={this.state.access_token} AddToQueue={this.AddToQueue} />}
              </Tab.Screen>
              {/* <Tab.Screen name='playlists'>
                {props => <PlaylistScreen access_token={this.state.access_token} />}
              </Tab.Screen> */}
              
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </>
		);
	}
}

export default App;
