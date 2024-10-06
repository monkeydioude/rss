import { ActivityIndicator, Button } from "@react-native-material/core";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from "react-native";
import useAuth from "src/services/identity/useAuth";
import style from "src/style/style";
import tw from "src/style/twrnc";

const Login = (): React.ReactNode => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading, signup, signin } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {loading ?
                    <ActivityIndicator size="small" style={{ margin: 28 }} />
                    :
                    <>
                        <Button onPress={() => signup(email, password)} style={styles.button} title="Sign up" />
                        <Button onPress={() => signin(email, password)} style={styles.button} title="Log in" />
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        ...tw`flex flex-1 justify-center px-4`,
        backgroundColor: style.thirdColor
    },
    input: tw`my-1 h-10 border rounded p-2 bg-white`,
    button: {
        ...tw`my-1`,
        backgroundColor: style.primaryColor
    }
})

export default Login;
