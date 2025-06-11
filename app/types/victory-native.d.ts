declare module 'victory-native' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface VictoryPieProps {
    data: Array<{ x: string; y: number }>;
    colorScale?: string[];
    width?: number;
    height?: number;
    innerRadius?: number;
    labelRadius?: number | ((props: { innerRadius: number }) => number);
    style?: {
      labels?: { fill: string };
    };
    labelComponent?: React.ReactElement;
  }

  interface VictoryLabelProps {
    text?: string | ((props: { datum: { x: string; y: number } }) => string);
    style?: TextStyle;
  }

  export class VictoryPie extends Component<VictoryPieProps> {}
  export class VictoryLabel extends Component<VictoryLabelProps> {}
} 