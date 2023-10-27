import {
    BlurMask,
    Canvas,
    Extrapolate,
    Group,
    interpolate,
    Path,
    runTiming,
    Skia,
    SweepGradient,
    useComputedValue,
    useTouchHandler,
    useValue,
    vec,
  } from '@shopify/react-native-skia';
  import { StatusBar } from 'expo-status-bar';
  import React from 'react';
  
  import { Dimensions } from 'react-native';
  
  const { width, height } = Dimensions.get('window');
  
  const MAX_DISTANCE_FROM_CENTER = Math.sqrt(
    (width / 2) ** 2 + (height / 2) ** 2
  );
  
  function logarithmicSpiral({ angle, index }) {
    const a = index / 4;
    const k = 0.005;
    return {
      x: a * Math.exp(k * angle) * Math.cos(angle * index),
      y: a * Math.exp(k * angle) * Math.sin(angle * index),
    };
  }
  
  function App() {
    const progress = useValue(0);
  
    const finalAngle = useValue(Math.PI * Math.random());
    const initialAngle = useValue(Math.PI / 2);
  
    const path = useComputedValue(() => {
      const circles = Skia.Path.Make();
  
      for (let index = 0; index < 1500; index++) {
        const { x: initialX, y: initialY } = logarithmicSpiral({
          angle: initialAngle.current,
          index,
        });
        const { x: finalX, y: finalY } = logarithmicSpiral({
          angle: finalAngle.current,
          index,
        });
  
        const x = interpolate(
          progress.current,
          [0, 1],
          [initialX, finalX],
          Extrapolate.CLAMP
        );
        const y = interpolate(
          progress.current,
          [0, 1],
          [initialY, finalY],
          Extrapolate.CLAMP
        );
  
        const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);
  
        const radius = interpolate(
          distanceFromCenter,
          [0, MAX_DISTANCE_FROM_CENTER],
          [1.2, 0.2],
          Extrapolate.CLAMP
        );
  
        circles.addCircle(x, y, radius);
      }
  
      return circles;
    }, [progress, initialAngle, finalAngle]);
  
    const touchHandler = useTouchHandler({
      onStart: () => {
        progress.current = 0;
        runTiming(progress, 1, { duration: 2500 }, (current) => {
          if (current === 1) {
            initialAngle.current = finalAngle.current;
            progress.current = 0;
            finalAngle.current = Math.PI * 2 * Math.random();
          }
        });
      },
    });
  
    return (
      <>
        <StatusBar style="light" />
        <Canvas
          style={{ flex: 1, backgroundColor: '#0C0718' }}
          onTouch={touchHandler}
        >
          <Group
            transform={[
              {
                translateX: width / 2,
              },
              {
                translateY: height / 2,
              },
            ]}
          >
            <Path path={path} />
            <SweepGradient
              c={vec(0, 0)}
              colors={['cyan', 'magenta', 'yellow', 'cyan']}
            />
            <BlurMask blur={5} style="solid" />
          </Group>
        </Canvas>
      </>
    );
  }
  
  export { App };
  