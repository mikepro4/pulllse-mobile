import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Input } from "react-native-elements";
import { StyleSheet } from "react-native";

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { navigate } = useNavigation();

  return (
    <>
      <Text h3>{headerText}</Text>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        secureTextEntry
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button
        title={submitButtonText}
        onPress={() => {
          onSubmit(email, password);
        }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  error: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 15,
    color: "red",
  },
});
export default AuthForm;
