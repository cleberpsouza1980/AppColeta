import { Text } from "@/src/components/Themed";
import { Redirect, Stack } from "expo-router";
import { ReactNode } from "react";
import { useAuthSession } from "../login/ctx";

export default function RootLayout(): ReactNode {
    const {token, isLoading} = useAuthSession();
  
    if (isLoading) {
      return <Text>Loading...</Text>;
    }
    
    console.log("Token Inicio" + token);
    
    
    if (!token) {
      // console.log("Solicitar login ");
      return <Redirect href="/../login" />;
    }
  
    return (
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }