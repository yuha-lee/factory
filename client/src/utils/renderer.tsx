import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";
import Checkbox from "../components/Checkbox";
import FlatList from "../components/FlatList";
import Icon from "../components/Icon";
import Image from "../components/Image";
import Modal from "../components/Modal";
import Picker from "../components/Picker";
import Popover from "../components/Popover";
import ProgressBar from "../components/ProgressBar";
import ScrollView from "../components/ScrollContainer";
import Slider from "../components/Slider";
import Spinner from "../components/Spinner";
import Text from "../components/Text";
import TestInput from "../components/TextInput";
import Toggle from "../components/Toggle";
import Tooltip from "../components/Tooltip";
import uuid from 'react-native-uuid';

const componentMap: Record<string, React.ComponentType<any>> = {
  Avatar, Button, Card, Container, Checkbox, FlatList, Icon, Image, Modal,
  Picker, Popover, ProgressBar, ScrollView, Slider, Spinner,
  Text, TestInput, Toggle, Tooltip
};

const actionEventMap: Record<string, string> = {
  Button: 'onPress',
  Icon: 'onPress',
  ToggleSwitch: 'onValueChange',
  Checkbox: 'onValueChange',
  TextInput: 'onChangeText',
  Picker: 'onValueChange',
  Slider: 'onValueChange',
};

export type ComponentDefinition = {
  type: string;
  props?: Record<string, any>;
  action?: any;
  children?: React.ReactNode;
};

export function renderComponent(def: ComponentDefinition, onAction: (action: any) => void) {
  const { type, action, children } = def;
  const Component = componentMap[type];
  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  let props = { ...def.props };
  if (action) {
    const event = actionEventMap[type] || 'onPress';
    props = {
      ...props,
      [event]: (...args: any[]) => onAction(action)
    }
  }

  let renderedChildren: React.ReactNode = null;

  if (Array.isArray(children)) {
    renderedChildren = children.map(childDef => renderComponent(childDef, onAction));
  } else if (children && typeof children === 'object' && 'type' in children) {
    renderedChildren = renderComponent(children as ComponentDefinition, onAction);
  } else {
    renderedChildren = children as React.ReactNode;
  }

  return <Component key={uuid.v4()} {...props}>
    {renderedChildren}
  </Component>;
}
