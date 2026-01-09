import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import useSocialAuth from '@/hooks/useSocialAuth'

const AuthScreen = () => {
  const { isLoading, handleSocialAuth } = useSocialAuth()
  return (
    <View className='px-8 flex-1 justify-center items-center bg-white'>
      {/* DEMO IMAGE  */}
      <Image source={require("../../assets/images/auth-image.png")}
        className='size-96'
        resizeMode='contain'
      />
      {/* LOGIN BUTTON  */}
      <View className='gap-2 mt-3'>
        {/* GOOGLE SIGN IN  */}
        <TouchableOpacity
          className='flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2'
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading !== null}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2 // this is for android
          }}>
          {isLoading === "oauth_google" ?
            (<ActivityIndicator size={"small"} color={"#4285f4"} />)
            :
            (
              <View className='flex-row items-center justify-center'>
                <Image source={require("../../assets/images/google.png")} className='size-10 mr-3' resizeMode='contain' />
                <Text className='text-black font-medium text-base'>Continue with Google</Text>
              </View>
            )}

        </TouchableOpacity>

        {/* Apple SIGN IN  */}
        <TouchableOpacity
          className='flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3'
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading !== null}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2 // this is for android
          }}>
          {isLoading === "oauth_apple" ?
            (<ActivityIndicator size={"small"} color={"#4285f4"} />)
            :
            (
              <View className='flex-row items-center justify-center'>
                <Image source={require("../../assets/images/apple.png")} className='size-8 mr-3' resizeMode='contain' />
                <Text className='text-black font-medium text-base'>Continue with Apple</Text>
              </View>
            )}
        </TouchableOpacity>
      </View>

      <Text className='text-center text-gray-500 text-xs leading-4 mt-6 px-2'>
        By signing up, you agree to our
        <Text className='text-blue-500'>Terms</Text>
        {", "}

        <Text className='text-blue-500'>Privacy Policy</Text>
        {", and "}
        <Text className='text-blue-500'>Cookie Use</Text>
      </Text>
    </View>
  )
}

export default AuthScreen