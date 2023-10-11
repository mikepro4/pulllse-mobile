import { StyleSheet, Text, View, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import AuthForm from "../components/AuthFrom";
import { signin, clearErrorMessage } from "../redux";
import { useSelector, useDispatch } from "react-redux";

const LoginScreen = () => {
  const { errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

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
          userShow={false}
          headerText="Sing In To Your Account"
          errorMessage={errorMessage}
          submitButtonText="Sign In"
          onSubmit={(email, password) =>
            dispatch(signin({ email, password, navigate }))
          }
        />
        <Button
          title="Go to SignUp"
          onPress={() => {
            navigate("Signup");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
