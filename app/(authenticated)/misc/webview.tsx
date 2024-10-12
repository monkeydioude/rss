import { useLocalSearchParams } from "expo-router";
import React from "react";
import { WebView } from 'react-native-webview';
import { WebViewParams } from "src/services/linking";

const CookieWebView = (): React.ReactNode => {
    const { uri } = useLocalSearchParams<WebViewParams>();
    return (
        <WebView source={{ uri }} />
    )
};

export default CookieWebView;
