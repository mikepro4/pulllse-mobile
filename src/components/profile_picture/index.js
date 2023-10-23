import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { deleteImage, uploadImage } from "../../redux";

const ProfilePicture = ({ imageLink, userId }) => {
  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

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
        if (imageLink) {
          const baseUrl =
            "https://my-photo-bucket-111.s3.us-east-2.amazonaws.com/";
          return link.replace(baseUrl, "");
        }
      }
      if (imageLink) {
        dispatch(deleteImage(removeBaseUrl(imageLink)));
      }
      //   setImage(result.assets[0].uri);
      dispatch(
        uploadImage({
          blob: fileContent,
        })
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={storedUserInfo._id === userId ? pickImage : null}
      activeOpacity={storedUserInfo._id === userId ? 0.2 : 1}
    >
      <View style={styles.container}>
        {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
        {imageLink ? (
          <Image
            source={{ uri: imageLink }}
            style={{ width: 100, height: 100, borderRadius: 1000 }}
          />
        ) : (
          <Text>Pick Image</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfilePicture;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 1000,
    backgroundColor: "grey",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
