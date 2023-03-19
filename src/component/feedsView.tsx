import { Divider, Stack } from '@react-native-material/core'
import React from 'react'
import { Linking, ScrollView, Text, View } from 'react-native'
import { RSSItem } from '../data_struct'
import tw from 'twrnc';

type Props = {
  feeds: RSSItem[],
}

export default ({ feeds }: Props): JSX.Element => (
  <View style={{flex: 1}}>
    <ScrollView className='h-full'>
      <Stack fill spacing={2}>
        {feeds.map((item: RSSItem, idx: number): JSX.Element => (
          <View key={idx} style={tw`pb-1`}>
            {idx > 0 && 
              <Divider />
            }
            <Text style={tw`font-medium text-base p-1`} onPress={() => Linking.openURL(item.link)}>{item.title}</Text>
          </View>
        ))}
      </Stack>
    </ScrollView>
  </View>
)