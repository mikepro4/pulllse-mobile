import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPlaybackPosition, setIsPlaying } from "../redux";

const usePlaybackStatusUpdate = (sound) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // To prevent state update if the component is unmounted

    const onPlaybackStatusUpdate = async (status) => {
      if (!isMounted) return;

      if (status.didJustFinish) {
        dispatch(setPlaybackPosition(0));
        await sound.setPositionAsync(0);
        dispatch(setIsPlaying(false));
      } else {
        dispatch(setPlaybackPosition(status.positionMillis));
      }
    };

    if (sound) {
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [sound, dispatch]); // Add dispatch to the dependency array

  // Custom hooks can return values, but it's not needed here unless you have additional logic
};

export default usePlaybackStatusUpdate;
