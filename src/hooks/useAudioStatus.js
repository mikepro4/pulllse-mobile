// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setPlaybackPosition, setIsPlaying } from "./playerSlice";

// export function useAudioStatus(sound) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     let statusUpdateSubscription;

//     if (sound) {
//       const onPlaybackStatusUpdate = async (status) => {
//         if (status.didJustFinish) {
//           // Dispatch action to reset the playback position and update playing state
//           dispatch(setPlaybackPosition(0));
//           await sound.setPositionAsync(0);
//           dispatch(setIsPlaying(false));
//         } else {
//           // Dispatch action to update the playback position
//           dispatch(setPlaybackPosition(status.positionMillis));
//         }
//       };

//       // Subscribe to the playback status updates
//       statusUpdateSubscription = sound.setOnPlaybackStatusUpdate(
//         onPlaybackStatusUpdate
//       );
//     }

//     // Cleanup function to unsubscribe from the playback status updates when the component unmounts or sound changes
//     return () => {
//       if (statusUpdateSubscription) {
//         sound.setOnPlaybackStatusUpdate(null);
//       }
//     };
//   }, [sound, dispatch]);
// }
