import React from 'react';
import { FlatList as RNFlatList, FlatListProps } from 'react-native';

export function FlatList<ItemT>(props: FlatListProps<ItemT>) {
  return <RNFlatList {...props} />;
}