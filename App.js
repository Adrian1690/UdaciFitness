import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import AddEntry from './components/AddEntry';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import History from './components/History';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { purple, white } from './utils/colors'
import Constants from 'expo-constants';


const Tab = Platform.OS === 'ios' ?
    createBottomTabNavigator()
    :
    createMaterialTopTabNavigator()

const TabNavigator = () => (
    <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let icon
                    if (route.name === 'Add Entry') {
                        icon = (
                            <FontAwesome name="plus-square" size={size} color={color} />
                        )
                    } else if (route.name === 'History') {
                        icon = (
                            <Ionicons name="ios-bookmarks" size={size} color={color} />
                        )
                    }
                    return icon
                },
            })}
            tabBarOptions={{
                activeTintColor: Platform.OS === 'ios' ? purple : white,
                style: {
                    backgroundColor: Platform.OS === 'ios' ? white : purple,
                },
                indicatorStyle: {
                    // Android tab indicator (line at the bottom of the tab)
                    backgroundColor: 'yellow',
                },
            }}
        >
            <Tab.Screen name="History" component={History} />
            <Tab.Screen name="Add Entry" component={AddEntry} />
        </Tab.Navigator>
    </NavigationContainer>
)

const UdaciStatusBar = ({backgroundColor, ...props}) => (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
)
export default class App extends React.Component {

    render() {
        return (
            <Provider store={createStore(reducer)}>
                <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
                <TabNavigator />
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})