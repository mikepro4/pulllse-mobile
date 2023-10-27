import { setupListeners } from "@reduxjs/toolkit/query";
import { userReducer } from "./slices/userSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { recordsReducer } from "./slices/recordingsSlice";
import { imageReducer } from "./slices/imageSlice";
import { pulseReducer } from "./slices/pulseSlice";
import { tabReducer } from "./slices/tabSlice";
import { appReducer } from "./slices/appSlice";
import { playerReducer } from "./slices/playerSlice";
import { signout } from "./thunks/userThunk";
import reduxFlipper from "redux-flipper";

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  audio: recordsReducer,
  image: imageReducer,
  tab: tabReducer,
  pulse: pulseReducer,
  player: playerReducer
});

const resettableReducer = (state, action) => {
  // Use the .fulfilled property of the signout action to get the correct action type
  if (action.type === signout.fulfilled.type) {
    state = undefined;
  }
  return rootReducer(state, action);
};

let middleware;

if (__DEV__) {
  middleware = (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }).concat(reduxFlipper());
} else {
  middleware = (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    });
}

export const store = configureStore({
  reducer: resettableReducer,
  middleware: middleware,
});

setupListeners(store.dispatch);

export * from "./thunks/userThunk";
export * from "./thunks/audioThunk";
export * from "./thunks/followSubscribeThunk";
export * from "./thunks/imageThunk";
export * from "./thunks/pulseThunk";

export { clearErrorMessage } from "./slices/userSlice";
export { addRecording } from "./slices/recordingsSlice";
export { addImage } from "./slices/imageSlice";
export { togglePlayer } from "./slices/tabSlice";
export { toggleDrawer, toggleNotification } from "./slices/appSlice";

export {
  toggleMix,
  togglePostScreen,
  togglePostScreenSuccess,
  setLayers,
  changeLayerParam,
  setActiveLayer
} from "./slices/playerSlice";