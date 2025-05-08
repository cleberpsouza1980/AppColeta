import { Slot } from "expo-router";
import { ReactNode } from "react";
import AuthProvider from "./login/ctx";

//Exemplo codigo https://medium.com/@david.ryan.hall/setting-up-a-basic-login-flow-for-an-expo-application-0b62b2b3e448

export default function RootLayout(): ReactNode {
  
  return (
    // <Stack
    //   screenOptions={{
    //     headerShown: false
    //   }}
    // >
    //   <Stack.Screen name="(tabs)" />
    // </Stack>
    <AuthProvider>
      <Slot />
    </AuthProvider>

  );
}