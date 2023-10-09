import { setupListeners } from "@reduxjs/toolkit/query";
import { userReducer } from "./slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { recordsReducer } from "./slices/recordingsSlice";
import { imageReducer } from "./slices/imageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    audio: recordsReducer,
    image: imageReducer,
  },
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
