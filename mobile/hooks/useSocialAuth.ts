import { useSSO } from "@clerk/clerk-expo"
import { useState } from "react"
import { Alert } from "react-native"

function useSocialAuth() {
    const [isLoading, setIsLoading] = useState<"oauth_google" | "oauth_apple" | null>(null)
    const { startSSOFlow } = useSSO()

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        setIsLoading(strategy)
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy })
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
            }
        } catch (error) {
            console.log('ERROR in social auth: ', error);
            const provider = strategy === "oauth_google" ? "Google" : "Apple"
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again`)
        } finally {
            setIsLoading(null)
        }

    }

    return { isLoading, handleSocialAuth }
}

export default useSocialAuth