import React, { useLayoutEffect, memo} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import { addEntry } from '../actions';
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import TextButton from './TextButton';

const EntryDetail = ({ metrics, route, navigation, ...props }) => {

    const { entryId } = route.params

    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    useLayoutEffect ( () => {
        navigation.setOptions({
            title: `${day}/${month}/${year}`
        })
    }, [entryId])

    const reset = () => {
        const { remove, goBack, entryId } = props

        remove();
        goBack();
        removeEntry(entryId)
    }

    return (
        <View style={styles.container}>
            <MetricCard metrics={metrics} />
            <TextButton onPress={reset} style={{margin: 20}}>
                RESET
            </TextButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        padding: 15
    }
})

const mapStateToProps = (state, { route }) => {
    const { entryId } = route.params;

    return {
        entryId,
        metrics: state[entryId][0]
    }
}

const mapDispatchToProps = (dispatch, { route, navigation }) => {
    const { entryId } = route.params;

    return {
        remove: () => dispatch(addEntry({
            [entryId]: timeToString() === entryId
                ? getDailyReminderValue()
                : []
        })),
        goBack: () => navigation.goBack()
    }
}

const shouldRender = (prevProps, nextProps) => {
    return !(nextProps.metrics && !nextProps.metrics.today)
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(EntryDetail, shouldRender));