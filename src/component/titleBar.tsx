import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';

type Props = {
  label: string,
}

export default ({ label }: Props): JSX.Element => (
  <View style={tw`pt-10 items-center bg-purple-600`}>
    <Text style={tw`text-3xl text-white`}>{label}</Text>
  </View>
)