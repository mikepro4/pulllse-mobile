import { StyleSheet, Text, View, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AuthForm from "../../components/AuthFrom";
import React from "react";
import { signin } from "../../redux";

const SignIn = ({ navigate }) => {
  const { errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
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
          navigate("SignUpScreen");
        }}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
