import { setupListeners } from "@reduxjs/toolkit/query";
import { userReducer } from "./slices/userSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { recordsReducer } from "./slices/recordingsSlice";
import { imageReducer } from "./slices/imageSlice";
import { tabReducer } from "./slices/tabSlice";
import { signout } from "./thunks/userThunk";

const rootReducer = combineReducers({
  user: userReducer,
  audio: recordsReducer,
  image: imageReducer,
  tab: tabReducer
});

const resettableReducer = (state, action) => {
  // Use the .fulfilled property of the signout action to get the correct action type
  if (action.type === signout.fulfilled.type) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer: resettableReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

setupListeners(store.dispatch);

export * from "./thunks/userThunk";
export * from "./thunks/audioThunk";

export * from "./thunks/imageThunk";

export { clearErrorMessage } from "./slices/userSlice";
export { addRecording } from "./slices/recordingsSlice";
export { addImage } from "./slices/imageSlice";
