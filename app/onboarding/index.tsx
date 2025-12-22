import React, { useCallback, useEffect } from "react";
import { Dimensions, View, ViewToken } from "react-native";
import Animated, {
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";
import Button from "./components/Button";
import ListItem from "./components/ListItem";
import PaginationElement from "./components/PaginationElement";
import { pages } from "./data";
import { onboardingStore } from "./store/onboardingStore";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Onboarding() {
  const snap = useSnapshot(onboardingStore);
  const savedIndex = snap.slideIndex;
  const x = useSharedValue(savedIndex * SCREEN_WIDTH);
  const currentIndex = useSharedValue(savedIndex);
  const ref = useAnimatedRef<Animated.FlatList<any>>();

  // Restore scroll position when returning to this screen
  useEffect(() => {
    if (savedIndex > 0 && ref.current) {
      // Small delay to ensure FlatList is ready
      const timer = setTimeout(() => {
        ref.current?.scrollToIndex({
          index: savedIndex,
          animated: false,
        });
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => (x.value = e.contentOffset.x),
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems?.[0]?.index ?? 0;
      onboardingStore.slideIndex = index;
      currentIndex.value = index;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
