import { useAuth } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"
import { useEffect, useState } from "react"
import { View, ActivityIndicator } from "react-native"

export default function SSOCallback() {
    const { isLoaded, isSignedIn } = useAuth()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            setReady(true)
        }
    }, [isLoaded])

    if (!ready) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (isSignedIn) {
        return <Redirect href="/(tabs)" />
    }

    return <Redirect href="/(auth)" />
}
