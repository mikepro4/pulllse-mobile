import React, { useState, useEffect, useCallback, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, fetchUserInfo, fetchUserAudios } from "./src/redux";
import {Dimensions, StyleSheet, View, Text, TouchableOpacity, ScrollView} from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import MainFlow from "./src/screens/";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { togglePlayer, toggleDrawer } from "./src/redux";

import Drawer from "./src/components/drawer";
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const App = () => {
  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const app = useSelector((state) => state.app);
  const ref = useRef()

  const fetchUserDetails = async () => {
    const userIdFromStorage = await AsyncStorage.getItem("userId");
    dispatch(togglePlayer(true));

    if (userIdFromStorage) {
      dispatch(fetchUserInfo({ userId: userIdFromStorage }));
      dispatch(fetchUserAudios({ userId: userIdFromStorage }));
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [storedUserInfo._id]);

  useEffect(() => {
    if(app.drawerOpen) {

      const isActive = ref.current.isActive();
      if (isActive) {
        ref.current.scrollTo(0);
      } else {
        ref.current.scrollTo(-SCREEN_HEIGHT/2);
      }
    }
    
  }, [app.drawerOpen]);


  const close = useCallback(() => {
    dispatch(toggleDrawer({ drawerOpen: false, drawerType: null, drawerData: null }));
    const isActive = ref.current.isActive();
      if (isActive) {
        ref.current.scrollTo(0);
      } else {
        ref.current.scrollTo(-200);
      }
  }, []);


  return (
    <NavigationContainer
      screenOptions={{
        cardStyle: { backgroundColor: "black" },
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" barStyle="dark-content" position="absolute" top={0} left={0} right={0} />

        {app.drawerOpen && <TouchableOpacity style={{ flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10}} onPress={close} /> }
        <Drawer ref={ref}>
          <ScrollView style={{ flex: 1, backgroundColor: 'orange', height: 3000 }} >

          <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elit est, blandit ac scelerisque ac, gravida vitae justo. Duis dapibus placerat egestas. Fusce ac velit nibh. Proin vel enim at nisi commodo aliquam ac vel purus. Morbi et tempus dui, nec varius justo. Nullam pharetra nibh ut consectetur luctus. Nullam ipsum dolor, scelerisque vel finibus vel, dapibus vel ligula. Suspendisse iaculis vitae sapien nec ullamcorper. Phasellus ut ultricies ex. Quisque a tellus odio. Sed porttitor tellus id dignissim fringilla. Vestibulum egestas nisi vitae tempor volutpat.

Vivamus nulla ex, vestibulum eget felis ac, luctus vehicula neque. Mauris molestie risus nunc, et feugiat erat condimentum ut. Pellentesque accumsan sapien aliquam est pretium, ac egestas lorem posuere. Vivamus sed quam feugiat nulla molestie vehicula a eu magna. Suspendisse quis mi mattis, luctus justo ornare, tincidunt nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas ac tempor urna. Fusce a metus ante. Mauris vehicula ante orci, quis pharetra diam tempor nec. Etiam tincidunt dolor ante, non consequat sem semper id.

Praesent sed sem nunc. Pellentesque aliquet metus ante, eu vestibulum quam fermentum molestie. Sed tempus, arcu eu sollicitudin dapibus, augue est placerat velit, eu commodo arcu metus quis sapien. Quisque blandit viverra dapibus. Curabitur feugiat tellus quis malesuada scelerisque. Mauris faucibus nisi et risus egestas, non efficitur justo pretium. Cras metus quam, tristique porta metus vel, ultricies finibus massa. Etiam dictum molestie feugiat. Vestibulum pharetra suscipit quam quis semper. Sed viverra elit sed gravida porta. Nunc vehicula orci et lobortis suscipit. Nam euismod augue sed accumsan porta. Nullam gravida ac sem mattis dictum.

Praesent dapibus risus et mi malesuada ornare. Fusce in semper turpis, iaculis dapibus risus. Curabitur maximus sit amet diam non finibus. Donec eu pellentesque sapien. Maecenas sem orci, mollis non varius sed, semper in ante. Aliquam ac libero est. Suspendisse potenti. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean tristique massa ipsum, ut lobortis eros molestie nec. Aliquam fermentum odio sit amet dolor blandit vehicula. Vivamus mollis, diam non lacinia vestibulum, sem turpis consequat lorem, a posuere dolor leo sit amet augue. Ut et nibh placerat, varius nibh id, eleifend sapien.

Curabitur efficitur semper sapien. Fusce fringilla pretium tristique. Duis vehicula imperdiet orci. Pellentesque vel malesuada mauris. Donec interdum non lacus ut cursus. Suspendisse posuere, nulla non porta dignissim, turpis elit suscipit augue, vel pellentesque ipsum tellus vitae ex. Nullam fringilla, dui vitae euismod placerat, ligula tortor aliquam urna, sit amet rutrum arcu turpis non ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elit est, blandit ac scelerisque ac, gravida vitae justo. Duis dapibus placerat egestas. Fusce ac velit nibh. Proin vel enim at nisi commodo aliquam ac vel purus. Morbi et tempus dui, nec varius justo. Nullam pharetra nibh ut consectetur luctus. Nullam ipsum dolor, scelerisque vel finibus vel, dapibus vel ligula. Suspendisse iaculis vitae sapien nec ullamcorper. Phasellus ut ultricies ex. Quisque a tellus odio. Sed porttitor tellus id dignissim fringilla. Vestibulum egestas nisi vitae tempor volutpat.

Vivamus nulla ex, vestibulum eget felis ac, luctus vehicula neque. Mauris molestie risus nunc, et feugiat erat condimentum ut. Pellentesque accumsan sapien aliquam est pretium, ac egestas lorem posuere. Vivamus sed quam feugiat nulla molestie vehicula a eu magna. Suspendisse quis mi mattis, luctus justo ornare, tincidunt nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas ac tempor urna. Fusce a metus ante. Mauris vehicula ante orci, quis pharetra diam tempor nec. Etiam tincidunt dolor ante, non consequat sem semper id.

Praesent sed sem nunc. Pellentesque aliquet metus ante, eu vestibulum quam fermentum molestie. Sed tempus, arcu eu sollicitudin dapibus, augue est placerat velit, eu commodo arcu metus quis sapien. Quisque blandit viverra dapibus. Curabitur feugiat tellus quis malesuada scelerisque. Mauris faucibus nisi et risus egestas, non efficitur justo pretium. Cras metus quam, tristique porta metus vel, ultricies finibus massa. Etiam dictum molestie feugiat. Vestibulum pharetra suscipit quam quis semper. Sed viverra elit sed gravida porta. Nunc vehicula orci et lobortis suscipit. Nam euismod augue sed accumsan porta. Nullam gravida ac sem mattis dictum.

Praesent dapibus risus et mi malesuada ornare. Fusce in semper turpis, iaculis dapibus risus. Curabitur maximus sit amet diam non finibus. Donec eu pellentesque sapien. Maecenas sem orci, mollis non varius sed, semper in ante. Aliquam ac libero est. Suspendisse potenti. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean tristique massa ipsum, ut lobortis eros molestie nec. Aliquam fermentum odio sit amet dolor blandit vehicula. Vivamus mollis, diam non lacinia vestibulum, sem turpis consequat lorem, a posuere dolor leo sit amet augue. Ut et nibh placerat, varius nibh id, eleifend sapien.

Curabitur efficitur semper sapien. Fusce fringilla pretium tristique. Duis vehicula imperdiet orci. Pellentesque vel malesuada mauris. Donec interdum non lacus ut cursus. Suspendisse posuere, nulla non porta dignissim, turpis elit suscipit augue, vel pellentesque ipsum tellus vitae ex. Nullam fringilla, dui vitae euismod placerat, ligula tortor aliquam urna, sit amet rutrum arcu turpis non ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elit est, blandit ac scelerisque ac, gravida vitae justo. Duis dapibus placerat egestas. Fusce ac velit nibh. Proin vel enim at nisi commodo aliquam ac vel purus. Morbi et tempus dui, nec varius justo. Nullam pharetra nibh ut consectetur luctus. Nullam ipsum dolor, scelerisque vel finibus vel, dapibus vel ligula. Suspendisse iaculis vitae sapien nec ullamcorper. Phasellus ut ultricies ex. Quisque a tellus odio. Sed porttitor tellus id dignissim fringilla. Vestibulum egestas nisi vitae tempor volutpat.

Vivamus nulla ex, vestibulum eget felis ac, luctus vehicula neque. Mauris molestie risus nunc, et feugiat erat condimentum ut. Pellentesque accumsan sapien aliquam est pretium, ac egestas lorem posuere. Vivamus sed quam feugiat nulla molestie vehicula a eu magna. Suspendisse quis mi mattis, luctus justo ornare, tincidunt nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas ac tempor urna. Fusce a metus ante. Mauris vehicula ante orci, quis pharetra diam tempor nec. Etiam tincidunt dolor ante, non consequat sem semper id.

Praesent sed sem nunc. Pellentesque aliquet metus ante, eu vestibulum quam fermentum molestie. Sed tempus, arcu eu sollicitudin dapibus, augue est placerat velit, eu commodo arcu metus quis sapien. Quisque blandit viverra dapibus. Curabitur feugiat tellus quis malesuada scelerisque. Mauris faucibus nisi et risus egestas, non efficitur justo pretium. Cras metus quam, tristique porta metus vel, ultricies finibus massa. Etiam dictum molestie feugiat. Vestibulum pharetra suscipit quam quis semper. Sed viverra elit sed gravida porta. Nunc vehicula orci et lobortis suscipit. Nam euismod augue sed accumsan porta. Nullam gravida ac sem mattis dictum.

Praesent dapibus risus et mi malesuada ornare. Fusce in semper turpis, iaculis dapibus risus. Curabitur maximus sit amet diam non finibus. Donec eu pellentesque sapien. Maecenas sem orci, mollis non varius sed, semper in ante. Aliquam ac libero est. Suspendisse potenti. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean tristique massa ipsum, ut lobortis eros molestie nec. Aliquam fermentum odio sit amet dolor blandit vehicula. Vivamus mollis, diam non lacinia vestibulum, sem turpis consequat lorem, a posuere dolor leo sit amet augue. Ut et nibh placerat, varius nibh id, eleifend sapien.

Curabitur efficitur semper sapien. Fusce fringilla pretium tristique. Duis vehicula imperdiet orci. Pellentesque vel malesuada mauris. Donec interdum non lacus ut cursus. Suspendisse posuere, nulla non porta dignissim, turpis elit suscipit augue, vel pellentesque ipsum tellus vitae ex. Nullam fringilla, dui vitae euismod placerat, ligula tortor aliquam urna, sit amet rutrum arcu turpis non ex.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elit est, blandit ac scelerisque ac, gravida vitae justo. Duis dapibus placerat egestas. Fusce ac velit nibh. Proin vel enim at nisi commodo aliquam ac vel purus. Morbi et tempus dui, nec varius justo. Nullam pharetra nibh ut consectetur luctus. Nullam ipsum dolor, scelerisque vel finibus vel, dapibus vel ligula. Suspendisse iaculis vitae sapien nec ullamcorper. Phasellus ut ultricies ex. Quisque a tellus odio. Sed porttitor tellus id dignissim fringilla. Vestibulum egestas nisi vitae tempor volutpat.

Vivamus nulla ex, vestibulum eget felis ac, luctus vehicula neque. Mauris molestie risus nunc, et feugiat erat condimentum ut. Pellentesque accumsan sapien aliquam est pretium, ac egestas lorem posuere. Vivamus sed quam feugiat nulla molestie vehicula a eu magna. Suspendisse quis mi mattis, luctus justo ornare, tincidunt nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas ac tempor urna. Fusce a metus ante. Mauris vehicula ante orci, quis pharetra diam tempor nec. Etiam tincidunt dolor ante, non consequat sem semper id.

Praesent sed sem nunc. Pellentesque aliquet metus ante, eu vestibulum quam fermentum molestie. Sed tempus, arcu eu sollicitudin dapibus, augue est placerat velit, eu commodo arcu metus quis sapien. Quisque blandit viverra dapibus. Curabitur feugiat tellus quis malesuada scelerisque. Mauris faucibus nisi et risus egestas, non efficitur justo pretium. Cras metus quam, tristique porta metus vel, ultricies finibus massa. Etiam dictum molestie feugiat. Vestibulum pharetra suscipit quam quis semper. Sed viverra elit sed gravida porta. Nunc vehicula orci et lobortis suscipit. Nam euismod augue sed accumsan porta. Nullam gravida ac sem mattis dictum.

Praesent dapibus risus et mi malesuada ornare. Fusce in semper turpis, iaculis dapibus risus. Curabitur maximus sit amet diam non finibus. Donec eu pellentesque sapien. Maecenas sem orci, mollis non varius sed, semper in ante. Aliquam ac libero est. Suspendisse potenti. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean tristique massa ipsum, ut lobortis eros molestie nec. Aliquam fermentum odio sit amet dolor blandit vehicula. Vivamus mollis, diam non lacinia vestibulum, sem turpis consequat lorem, a posuere dolor leo sit amet augue. Ut et nibh placerat, varius nibh id, eleifend sapien.

Curabitur efficitur semper sapien. Fusce fringilla pretium tristique. Duis vehicula imperdiet orci. Pellentesque vel malesuada mauris. Donec interdum non lacus ut cursus. Suspendisse posuere, nulla non porta dignissim, turpis elit suscipit augue, vel pellentesque ipsum tellus vitae ex. Nullam fringilla, dui vitae euismod placerat, ligula tortor aliquam urna, sit amet rutrum arcu turpis non ex.
          </Text>
          </ScrollView>
        </Drawer>

        <MainFlow />
      </GestureHandlerRootView>

    </NavigationContainer>
  );
};

export default MainApp = () => {
  const [fontsLoaded] = useFonts({
    "aeonik-regular": require("./assets/fonts/Aeonik-Regular.ttf"),
    "aeonik-medium": require("./assets/fonts/Aeonik-Medium.ttf"),
    "aeonik-light": require("./assets/fonts/Aeonik-Light.ttf"),
    "london-regular": require("./assets/fonts/London-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Provider store={store}>
        {__DEV__ && <FlipperAsyncStorage />}
        <App />
      </Provider>
    </View>
  );
};
