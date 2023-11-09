import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { togglePlayer } from "../../redux/slices/tabSlice";
import {
  toggleMix,
  toggleNotification,
  setEdited,
  uploadAudio,
  resetPulseRecording,
} from "../../redux";

import Icon from "../../components/icon";
import Logo from "../../components/icon/logo";
import Button from "../../components/button";

const PlayerHeader = () => {
  const navigation = useNavigation();
  const player = useSelector((state) => state.player);
  const pulseRecording = useSelector((state) => state.pulseRecording);
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [activeMix, setActiveMix] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [saving, setSaving] = useState(false);
  const opacity = useSharedValue(0);
  const dispatch = useDispatch();

  const showInitialAnimation = () => {
    opacity.value = withDelay(
      100,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
      })
    );
  };

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    showInitialAnimation();
    setInitialAnimation(false);
  }, []);

  useEffect(() => {
    setActiveMix(player.mixEnabled);
  }, [player.mixEnabled]);

  const renderSaveButton = () => {
    if (player.originalPulse) {
      return (
        <Button
          label="Save"
          icon="save"
          status={player.edited}
          loading={saving}
          onPressIn={() => {
            // alert("Save")
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
              dispatch(setEdited(false));
            }, 2000);
            // dispatch(togglePlayer(false))
          }}
        />
      );
    } else {
      return (
        <View style={{ paddingRight: 20 }}>
          <Button
            label="Post"
            iconRight="arrow_right"
            purple={true}
            status={player.edited}
            loading={saving}
            onPressIn={() => {
              alert("Save");
              dispatch(uploadAudio({ pulseRecording }));
              dispatch(resetPulseRecording());
              // setSaving(true)
              // setTimeout(() => {
              //     setSaving(false)
              //     dispatch(setEdited(false))
              // }, 2000)
              // dispatch(togglePlayer(false))
            }}
          />
        </View>
      );
    }
  };

  const renderDuplicateButton = () => {
    if (player.originalPulse) {
      return (
        <Button
          label="Duplicate"
          icon="duplicate"
          loading={duplicating}
          activeOpacity={0.1}
          onPressIn={() => {
            setDuplicating(true);
            setTimeout(() => {
              dispatch(
                toggleNotification({
                  notificationActive: true,
                  notificationMessage: "Pulse duplicated",
                  notificationIntent: "success",
                })
              );
              setDuplicating(false);
            }, 500);
          }}
        />
      );
    }
  };

  const renderMoreButton = () => {
    if (player.originalPulse) {
      return (
        <Button
          icon="more"
          onPressIn={() => {
            // dispatch(togglePlayer(false))
            alert("More");
          }}
        />
      );
    }
  };

  return (
    <View style={styles.header}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Button
          icon="arrow_back"
          onPressIn={() => {
            dispatch(toggleMix(false));
            dispatch(togglePlayer(false));
            dispatch(setEdited(false));
          }}
        />

        <View style={styles.headerButtons}>
          <Button
            label="Mix"
            active={activeMix}
            icon="atom"
            onPressIn={() => {
              setActiveMix(!activeMix);
              dispatch(toggleMix(!activeMix));
              // alert("Mix")
              // dispatch(togglePlayer(false))
            }}
          />
          {renderDuplicateButton()}

          {renderSaveButton()}
        </View>

        {renderMoreButton()}
      </Animated.View>
    </View>
  );
};

export default PlayerHeader;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    // paddingHorizontal: 10,
    position: "relative",
    left: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    // paddingHorizontal: 20,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 10,
    flex: 1,
  },
});
