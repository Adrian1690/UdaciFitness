import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { receiveEntries, addEntry } from '../actions';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';
//import UdaciFitnessCalendar from 'udacifitness-calendar';
import { Agenda  as UdaciFitnessCalendar} from 'react-native-calendars';
import { white } from '../utils/colors';
import DateHeader from './DateHeader';
import MetricCard from './MetricCard';
import { AsyncStorage } from 'react-native';

class History extends React.Component {

    state = {
        ready: false,
        calendarDateSelected: timeToString()
    }

    componentDidMount() {
        AsyncStorage.clear();
        //console.log('hereee');
        const { dispatch } = this.props

        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                //console.log(entries)
                if(!entries[timeToString()]){
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })
            .then(() => this.setState(() => ({ready: true})))

    }

    renderItem = ({today, dayString, ...metrics}) => (
            <View style={styles.item}>
            {
                today ?
                    <View>
                        <DateHeader date={dayString} />
                        <Text style={styles.noDataText}>
                            {today}
                        </Text>
                    </View>
                :
                    <TouchableOpacity onPress={() => this.props.navigation.navigate(
                        'EntryDetail',
                        { entryId: dayString}
                        )}>
                        <MetricCard
                            date={dayString}
                            metrics={metrics}
                        />
                    </TouchableOpacity>
            }
            </View>
    )

    renderEmptyDate = day => {
        const date = new Date(day).toISOString().split('T')[0]
        return (
            <View style={styles.item}>
                <DateHeader date={date} />
                <Text style={styles.noDataText}>
                    You didn't log any data on this day.
                </Text>
            </View>
        )
    }

    render(){
        const { entries } = this.props;
        const { ready } = this.state;

        if(ready === false){
            return <ActivityIndicator />
        }

        return (
            <UdaciFitnessCalendar
                //onDayPress={(day)=>this.setState({calendarDateSelected: day.dateString})}
                //onDayChange={(day)=>this.setState({calendarDateSelected: day.dateString})}
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
            />
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios' ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
            width: 0,
            height: 3
        }
    },
    noDataText: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20
    }
})
const mapStateToProps = entries => {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)