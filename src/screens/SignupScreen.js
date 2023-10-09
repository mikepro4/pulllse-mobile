import { StyleSheet, Text, View, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AuthForm from "../components/AuthFrom";
import { signup, clearErrorMessage } from "../redux";
import { useSelector, useDispatch } from "react-redux";

const SignUpScreen = () => {
  const { errorMessage } = useSelector((state) => state.user);
  const state = useSelector((state) => state.user);

  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(clearErrorMessage());
      };
    }, [])
  );

  return (
    <SafeAreaView>
      <View>
        <AuthForm
          headerText="Sign Up For Tracker"
          errorMessage={errorMessage}
          submitButtonText="Sign Up"
          onSubmit={(email, password) =>
            dispatch(signup({ email, password, navigate }))
          }
        />
        <Button
          title="Go to SignIn"
          onPress={() => {
            navigate("Signin");
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 200,
  },
});

export default SignUpScreen;
