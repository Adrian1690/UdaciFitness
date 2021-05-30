import React from 'react';
import { View, Text } from 'react-native';

const EntryDetail = ({ route, navigation }) => {
    return (
        <View>
            <Text>Entry detail {route.params.entryId}</Text>
        </View>
    )
}

export default EntryDetail;