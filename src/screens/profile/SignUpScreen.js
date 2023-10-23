import SignUpHeader from "./SignUpHeader";
import { StyleSheet, Text, View, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AuthForm from "../../components/AuthFrom";
import { signup, clearErrorMessage } from "../../redux";
import { useSelector, useDispatch } from "react-redux";

const SignUpScreen = () => {
  const { errorMessage } = useSelector((state) => state.user);
  const state = useSelector((state) => state.user);
  console.log(state);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(clearErrorMessage());
      };
    }, [])
  );

  return (
    <View>
      <View style={styles.header}>
        <SignUpHeader />
      </View>
      <View style={{ marginTop: 150 }}>
        <AuthForm
          userShow
          headerText="Sign Up For Tracker"
          errorMessage={errorMessage}
          submitButtonText="Sign Up"
          onSubmit={(email, password, userName) =>
            dispatch(
              signup({
                email,
                password,
                userName,
                navigation,
              })
            )
          }
        />
      </View>
      <Button
        title="Go to SignIn"
        onPress={() => {
          navigate("Signin");
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default SignUpScreen;
