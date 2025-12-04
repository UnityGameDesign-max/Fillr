import React, { useCallback } from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./components/Button";
import ListItem from "./components/ListItem";
import PaginationElement from "./components/PaginationElement";
import { pages } from "./data";

export default function Onboarding() {
  const x = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const ref = useAnimatedRef<Animated.FlatList<any>>();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => (x.value = e.contentOffset.x),
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    currentIndex.value = viewableItems?.[0]?.index ?? 0;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.FlatList
        ref={ref}
        data={pages}
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <ListItem item={item} index={index} x={x} />
        )}
        keyExtractor={(_, i) => String(i)}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View className="flex-col gap-2 items-center px-2 pb-5">
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={currentIndex}
          length={pages.length}
          flatListRef={ref}
        />
      </View>
    </SafeAreaView>
  );
}
