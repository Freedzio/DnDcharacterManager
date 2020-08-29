import React from 'react';
import { View, Spinner } from 'native-base';

export default function LoadingContainer(props: Props) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
            {
                props.ready ?
                    <View style={{ flex: 1 }}>
                        {props.children}
                    </View> : <Spinner />
            }
        </View>
    )
}

interface Props {
    ready: boolean,
    children: any
}