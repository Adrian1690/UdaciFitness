import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddEntry from './components/AddEntry';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import History from './components/History';
export default class App extends React.Component {

    render() {
        return (
            <Provider store={createStore(reducer)}>
                <View style={styles.container}>
                    <View style={{height: 400, marginTop: 100}}>
                        <History />
                    </View>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})