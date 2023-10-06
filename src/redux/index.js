import { setupListeners } from "@reduxjs/toolkit/query";
import { userReducer } from "./slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { recordsReducer } from "./slices/recordingsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    audio: recordsReducer,
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

export { clearErrorMessage } from "./slices/userSlice";
export { addRecording } from "./slices/recordingsSlice";
