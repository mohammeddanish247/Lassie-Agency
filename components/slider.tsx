import React from 'react';
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type SlideItem = {
  id: string | number;
  image: ImageSourcePropType | { uri: string };
  // Add other properties as needed (e.g., title, description)
};

interface ImageSliderProps {
  slides: SlideItem[];
  autoPlay?: boolean;
  loop?: boolean;
  height?: number;
  showPagination?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const ImageSlider: React.FC<ImageSliderProps> = ({
  slides,
  autoPlay = true,
  loop = true,
  height = screenWidth * 0.6, // Default to 60% of screen width
  showPagination = false,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        loop={loop}
        width={screenWidth}
        height={height}
        autoPlay={autoPlay}
        data={slides}
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setActiveIndex(index)}
        mode="parallax"
				modeConfig={{
					parallaxScrollingOffset: 140,
				}}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image 
              source={item.image} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* {showPagination && (
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: index === activeIndex ? 1 : 0.5 }
              ]}
            />
          ))}
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '100%',
    borderRadius: 20
  },
  // pagination: {
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   bottom: 20,
  //   alignSelf: 'center',
  // },
  // dot: {
  //   width: 18,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: 'white',
  //   marginHorizontal: 4,
  // },
});

export default ImageSlider;