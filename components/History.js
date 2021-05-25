import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { receiveEntries, addEntry } from '../actions';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';

const History = props => {
    const { dispatch } = props

    useEffect( () => {

        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                if(!entries[timeToString()]){
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })

    }, [])

    return (
        <View>
            <Text>{JSON.stringify(props)}</Text>
        </View>
    )
}

const mapStateToProps = entries => {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)