import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Home, Map, Shuffle, User, Plus } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/components/custom_tab_bar.styles';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10);

  const renderTab = (route: any, index: number) => {
    const isFocused = state.index === index;
    const title = descriptors[route.key].options.title ?? route.name;
    const color = isFocused ? Colors.primary : Colors.muted;
    const stroke = isFocused ? 2.5 : 2;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
    };

    return (
      <View style={styles.tabSlot} key={route.key}>
        <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.65}>
          {index === 0 && <Home size={24} color={color} strokeWidth={stroke} />}
          {index === 1 && <Map size={24} color={color} strokeWidth={stroke} />}
          {index === 2 && <Shuffle size={24} color={color} strokeWidth={stroke} />}
          {index === 3 && <User size={24} color={color} strokeWidth={stroke} />}
          
          <Text style={[styles.tabLabel, { color }]}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      {/* Home */}
      {renderTab(state.routes[0], 0)}
      
      {/* Map */}
      {renderTab(state.routes[1], 1)}

      {/* Center FAB Slot */}
      <View style={styles.tabSlot} key="fab">
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push('/add_spot_screen')}
            activeOpacity={0.8}
          >
            <Plus size={28} color={Colors.black} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Randomizer */}
      {renderTab(state.routes[2], 2)}
      
      {/* Profile */}
      {renderTab(state.routes[3], 3)}
    </View>
  );
}
