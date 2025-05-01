import React from 'react';
import { FlatList as ReactNativeFlatList, FlatListProps } from 'react-native';

export default function FlatList<ItemT>(props: FlatListProps<ItemT>) {
  return <ReactNativeFlatList {...props} />;
}