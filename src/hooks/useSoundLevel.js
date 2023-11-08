// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import RNSoundLevel from "react-native-sound-level";
// import { addPulseRecording } from "./yourReduxSlice"; // Import your action from the slice where it is defined

// export function useSoundLevel(sound, recording) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // This function will be called with sound level data
//     const handleNewFrame = (data) => {
//       if (data.id) {
//         setSoundLevels((prevLevels) => [...prevLevels, data]);
//       }
//     };

//     // Subscribe to new frame data
//     RNSoundLevel.onNewFrame = handleNewFrame;

//     // Start the sound level monitoring
//     RNSoundLevel.start();

//     return async () => {
//       // Stop the sound level monitoring
//       RNSoundLevel.stop();

//       if (sound) {
//         await sound.unloadAsync();

//         // Dispatch action to add the pulse recording
//         dispatch(
//           addPulseRecording({
//             // Assuming duration and soundLevels are available in this hook's closure
//             // Otherwise, they need to be passed to the hook or managed within it
//             duration,
//             type: "recording",
//             soundLevels,
//             link: recording ? recording.getURI() : "",
//           })
//         );
//       }
//     };
//   }, [sound, recording, dispatch]);

//   // You can also manage soundLevels state within the hook if it's not being passed from outside
// }
