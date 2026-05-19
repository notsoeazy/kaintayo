/* 
Usage: 
<AnimatedSplash onDone={handleSplashDone} />
*/

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Colors, FontFamily, FontSize, Spacing } from '@/styles/theme';

interface Props {
  isAppReady: boolean;
  onDone: () => void;
}

const { width } = Dimensions.get('window');
const RING = width * 0.62;

export function AnimatedSplash({ isAppReady, onDone }: Props) {
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);

  const ringsScale = useSharedValue(0.4);
  const ringsOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.75);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(22);
  const overlayOpacity = useSharedValue(1);

  const outerRotate = useSharedValue(0);
  const middleRotate = useSharedValue(0);
  const middleScale = useSharedValue(1);
  const innerScale = useSharedValue(0.95);

  useEffect(() => {
    // Entrance animations
    ringsOpacity.value = withTiming(1, { duration: 500 });
    ringsScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });

    // Logo
    logoOpacity.value = withDelay(150, withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    }));
    logoScale.value = withDelay(150, withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    }));

    // Wordmark
    textOpacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    textY.value = withDelay(550, withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    }));

    outerRotate.value = withRepeat(
      withTiming(360, { duration: 18000, easing: Easing.linear }),
      -1,
      false
    );
    middleRotate.value = withRepeat(
      withTiming(-360, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );

    // Loop pulsing animations
    middleScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.94, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    innerScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.92, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Minimum display time timer
    const timer = setTimeout(() => {
      setIsMinTimePassed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Exit animation triggered
  useEffect(() => {
    if (isMinTimePassed && isAppReady) {
      overlayOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) scheduleOnRN(onDone);
      });
    }
  }, [isMinTimePassed, isAppReady, onDone]);

  const ringsStyle = useAnimatedStyle(() => ({
    opacity: ringsOpacity.value,
    transform: [{ scale: ringsScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerRotate.value}deg` }],
  }));

  const middleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${middleRotate.value}deg` },
      { scale: middleScale.value },
    ],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>

      <Animated.View style={[styles.ringsContainer, ringsStyle]}>
        <Animated.View style={[styles.ringOuter, outerStyle]} />
        <Animated.View style={[styles.ringMiddle, middleStyle]} />
        <Animated.View style={[styles.ringInner, innerStyle]} />
      </Animated.View>

      <Animated.Image
        source={require('../assets/images/splash-icon.png')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.wordmark, textStyle]}>
        KainTayo
      </Animated.Text>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  ringsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: RING * 1.65,
    height: RING * 1.65,
    borderRadius: RING * 0.45,
    borderWidth: 3.5,
    borderStyle: 'dashed',
    borderColor: Colors.blush,
    opacity: 0.75,
  },
  ringMiddle: {
    position: 'absolute',
    width: RING * 1.30,
    height: RING * 1.30,
    borderRadius: RING * 0.35,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: Colors.primary,
    opacity: 0.18,
    backgroundColor: Colors.blush,
  },
  ringInner: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING * 0.28,
    backgroundColor: Colors.blush,
    opacity: 0.28,
  },
  logo: {
    width: 200,
    height: 200,
  },
  wordmark: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.xxl * 1.2,
    color: Colors.primary,
    letterSpacing: 1,
    marginTop: -Spacing.lg,
  },
});
