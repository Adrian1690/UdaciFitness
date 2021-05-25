import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { receiveEntries, addEntry } from '../actions';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';
import UdaciFitnessCalendar from 'udacifitness-calendar';
import { Agenda as UdaciFitnessCalendar } from 'react-native-calendars';
class History extends React.Component {

    componentDidMount() {
        //console.log('hereee');
        const { dispatch } = this.props
        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                if(!entries[timeToString()]){
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })

    }

    renderItem = ({ today, ...metrics }, formattedDate, key) => (
        <View>
            {
                today ?
                    <Text>{JSON.stringify(today)}</Text>
                    :
                    <Text>{JSON.stringify(metrics)}</Text>
            }
        </View>
    )

    renderEmptyDate = (formattedDate) => {
        return (
            <View>
                <Text>No data for this day</Text>
            </View>
        )
    }

    render(){
        const { entries } = this.props;
        return (
            <UdaciFitnessCalendar
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
            />
        )
    }
}

const mapStateToProps = entries => {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)