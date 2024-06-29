import React, { Component } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface SwipeableRowProps {
  children: React.ReactNode;
  onLeftAction?: () => void;
  onRightAction?: () => void;
  leftActionText?: string;
  rightActionText?: string;
  leftActionColor?: string;
  rightActionColor?: string;
}

class SwipeableRow extends Component<SwipeableRowProps> {
  private swipeableRow: Swipeable | null = null;

  close = () => {
    this.swipeableRow?.close();
  };

  renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const { leftActionText = "Archive", leftActionColor = "green" } =
      this.props;
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton
        style={[styles.leftAction, { backgroundColor: leftActionColor }]}
        onPress={() => {
          this.close();
          this.props.onLeftAction?.();
        }}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          {leftActionText}
        </Animated.Text>
      </RectButton>
    );
  };

  renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const { rightActionText = "Delete", rightActionColor = "red" } = this.props;
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 0, 1],
    });
    return (
      <RectButton
        style={[styles.rightAction, { backgroundColor: rightActionColor }]}
        onPress={() => {
          this.close();
          this.props.onRightAction?.();
        }}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          {rightActionText}
        </Animated.Text>
      </RectButton>
    );
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={(ref) => (this.swipeableRow = ref)}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            this.props.onLeftAction?.();
          } else if (direction === "right") {
            this.props.onRightAction?.();
          }
        }}
      >
        <View>{children}</View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    justifyContent: "center",
  },
  rightAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    padding: 20,
  },
});

export default SwipeableRow;
