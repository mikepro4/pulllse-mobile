import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import {GCanvasView} from '@flyskywhy/react-native-gcanvas';


import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClockValue,
  useComputedValue
} from "@shopify/react-native-skia";



import Expo2DContext from "expo-2d-context";
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');


function App() {
  const canvas = useRef(null)
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const animationFrameId = useRef(null);
  const clock = useClockValue();
  const [points, setPoints] = useState([]);
  const pointsRef = useRef([]);
  

  initCanvas = (canvas) => {
    console.log(canvas)
    // var ctx = new Expo2DContext(gl);
    // canvas.current = ctx;
    // widthRef.current = SCREEN_WIDTH*3;
    // heightRef.current = SCREEN_HEIGHT*3;
    // setTimeout(() => {  
    //   generatePoints()
    // }, 100) 

   

  };

  const generatePoints = () => {
    let generatedPoints = []
    for (var i = 0; i < 1024; i++) {
        var pt = createPoint(
            Math.random(1) * widthRef.current,
            Math.random(1) * heightRef.current,
            i
        );
        generatedPoints.push(pt)
    }
    pointsRef.current = generatedPoints

  }

  const createPoint = (x, y, i) => {

      let point = {
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          color: "#ffffff",
      }

      return point
  }



  const frameTicker = useCallback(() => {
    if( canvas.current && pointsRef.current.length > 0  ) {
      let ctx = canvas.current
      const centerX = widthRef.current  / 2;
      const centerY = heightRef.current / 2;
      const radius = 3;
      // Start the path

      ctx.clearRect(0, 0, widthRef.current, heightRef.current);

      // ctx.beginPath();

      // ctx.arc(centerX, centerY, radius + clock.current / 10, 0, Math.PI * 2, false);
      // ctx.fillStyle = 'blue';
      // ctx.fill();
      // ctx.lineWidth = 5;
      // ctx.strokeStyle = 'red';
      // ctx.stroke();
      // ctx.closePath();

      // ctx.beginPath();
      //   ctx.arc(pointsRef.current[10].x, pointsRef.current[10].y, 20, 0, 2 * Math.PI, false); // Adjust coordinates and radius
      //   ctx.fillStyle = "white";
      //   ctx.fill();

      for (let i = 0; i < 500; i++) {
          // let point = pointsRef.current[i];

          ctx.beginPath();
          ctx.arc(pointsRef.current[i].x, pointsRef.current[i].y, radius + clock.current / 10000, 0, 2 * Math.PI, false); // Adjust coordinates and radius
          ctx.fillStyle = "white";
          ctx.fill();
      }

      ctx.flush();


    }
    
    if ( animationFrameId.current !== null) {
      // Update velocities and positions to create an oscillating effect with friction

      animationFrameId.current = requestAnimationFrame(frameTicker);
    }

  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(frameTicker);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [frameTicker]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* <GLView style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} onContextCreate={onContextCreate} /> */}

      <GCanvasView
          onCanvasCreate={initCanvas}
          isGestureResponsible={true /* Here is just for example, you can remove this line because default is true */}
          isAutoClearRectBeforePutImageData={false /* default is false, only for canvas 2d, if you want to be exactly compatible with Web, you can set it to true */}
          isResetGlViewportAfterSetWidthOrHeight={true /* default is true, generally true for canvas 2d and false for webgl 3d */}
          isEnableFboMsaa={false /* default is false, only for Android, only for canvas 2d, if you want anti-aliasing present same behavior on Android and Web, you can set it to true */ }
          devicePixelRatio={undefined /* Here is just for example, you can remove this line because default is undefined and means default is PixelRatio.get(), ref to "About devicePixelRatio" in @flyskywhy/react-native-gcanvas/README.md */}
          style={styles.gcanvas}
        />
      
      {/* <Canvas style={{ width: '100%', height: '100%', }} ref={ref} /> */}
    </View>
  );
}

export default App;
