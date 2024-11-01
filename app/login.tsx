import { ActivityIndicator, Button } from "@react-native-material/core";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from "react-native";
import i18n from "src/i18n";
import useAuth from "src/services/identity/useAuth";
import toast from "src/services/toast";
import style from "src/style/style";
import tw from "src/style/twrnc";

const Login = (): React.ReactNode => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [displayPassword2, setDisplayPassword2] = useState(false);
    const { loading, signup, signin } = useAuth();

    const onPressSignup = useCallback(async () => {
        if (!displayPassword2) {
            setDisplayPassword2(true);
            return;
        }
        if (password !== password2) {
            toast.err(i18n.en.SIGN_UP_PASSWORDS_DONT_MATCH);
            return;
        }
        await signup(email, password);
        setDisplayPassword2(false);
    }, [email, password, password2, displayPassword2]);

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
                {displayPassword2 &&
                    <TextInput
                        style={{
                            ...styles.input,
                        }}
                        autoCapitalize="none"
                        placeholder="Re-enter password"
                        onChangeText={setPassword2}
                        secureTextEntry
                    />
                }
                {loading ?
                    <ActivityIndicator size="small" style={{ margin: 28 }} />
                    :
                    <>
                        <Button onPress={onPressSignup} style={styles.button} title="Sign up" />
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
