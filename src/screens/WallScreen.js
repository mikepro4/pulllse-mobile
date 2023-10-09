import { StyleSheet, Text, View, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signout } from "../redux";

import React, { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserImage, deleteImage, uploadImage } from "../redux";

const WallScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const img = useSelector((state) => state.image.image);

  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchUserImage());
    setImage(img.imageLink);
  }, [img.imageLink]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const fileContent = await response.arrayBuffer();

      function removeBaseUrl(link) {
        if (img.imageLink) {
          const baseUrl =
            "https://my-photo-bucket-111.s3.us-east-2.amazonaws.com/";
          return link.replace(baseUrl, "");
        }
      }
      if (img.imageLink) {
        dispatch(deleteImage(removeBaseUrl(img.imageLink)));
      }

      dispatch(
        uploadImage({
          blob: fileContent,
        })
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={{ alignItems: "center" }}>
        <Text>WallScreen</Text>
        <Button
          title="Sign Out"
          onPress={() => {
            dispatch(signout({ navigate }));
          }}
        />

        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {(image || img.imageLink) && (
          <Image
            source={{ uri: image || img.imageLink }}
            style={{ width: 200, height: 200, borderRadius: 1000 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WallScreen;

const styles = StyleSheet.create({});
