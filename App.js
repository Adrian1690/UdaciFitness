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
import { createStackNavigator } from '@react-navigation/stack';
import EntryDetail from './components/EntryDetail';

const Tab = Platform.OS === 'ios' ?
    createBottomTabNavigator()
    :
    createMaterialTopTabNavigator()

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let icon
                if (route.name === 'AddEntry') {
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
        <Tab.Screen name="AddEntry" component={AddEntry} />
    </Tab.Navigator>
)

const UdaciStatusBar = ({ backgroundColor, ...props }) => (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
)

const Stack = createStackNavigator();

const MainNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen name="EntryDetail"
                component={EntryDetail}
                options={{
                    headerTintColor: white,
                    headerStyle: {
                        backgroundColor: purple
                    }
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
)
export default class App extends React.Component {

    render() {
        return (
            <Provider store={createStore(reducer)}>
                <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
                <MainNavigator />
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})