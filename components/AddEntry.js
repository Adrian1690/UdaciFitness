import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
//import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { white, purple } from '../utils/colors';
import { NavigationActions } from '@react-navigation/compat';

const SubmitBtn = ({ onPress }) => (
    <TouchableOpacity
        style={Platform.OS === 'ios' ? styles.iosSubmitButton : styles.androidSubmitButton}
        onPress={onPress}
    >
        <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
)
class AddEntry extends Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    }

    increment = metric => {
        const { max, step } = getMetricMetaInfo(metric);

        this.setState(state => {
            const count = state[metric] + step;

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = metric => {
        const { step } = getMetricMetaInfo(metric);

        this.setState(state => {
            const count = state[metric] - step;

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }

    submit = () => {
        const key =  timeToString();
        const entry = [{...this.state, dayString: key}]

        this.props.dispatch(addEntry({
            [key]: entry
        }))

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))

        this.toHome()

        submitEntry({ key, entry });

        // Clearn local notification
    }

    reset = () => {
        const key =  timeToString();

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        this.toHome()

        removeEntry(key)
    }

    toHome = () => {
        this.props.navigation.dispatch(NavigationActions.back({
            key: 'AddEntry'
        }))
    }

    render(){
        const metaInfo =  getMetricMetaInfo();
        const { alreadyLogged } = this.props

        if(alreadyLogged){
            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton style={{padding: 10}} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {/*<DateHeader date={(new Date()).toLocaleDateString()} />*/}

            {
                    Object.keys(metaInfo).map(key => {
                        const { getIcon, type, ...rest } = metaInfo[key];
                        const value =  this.state[key]

                        return (
                            <View key={key} style={styles.row}>
                                {getIcon()}
                                {
                                    type === 'slider' ?
                                        <UdaciSlider
                                            value={value}
                                            onChange={value => this.slide(key, value) }
                                            {...rest}
                                        />
                                        :
                                        <UdaciSteppers
                                            value={value}
                                            onIncrement={() => this.increment(key)}
                                            onDecrement={() => this.decrement(key)}
                                            {...rest}
                                        />
                                 }
                            </View>
                        )
                    })
                }
                <SubmitBtn onPress={this.submit} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    iosSubmitButton: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitButton: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
        marginLeft: 30
    }
})

const mapStateToProps = state => {
    const key = timeToString();

    //console.log(key)
    //console.log(state[key][0])
    //console.log(state[key].today)
    return {
        alreadyLogged: state[key][0] && typeof state[key][0].today === 'undefined'
    }
}
export default connect(mapStateToProps)(AddEntry);