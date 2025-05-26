import { Text } from "@/components/Themed";
import { Redirect, Stack } from "expo-router";
import { ReactNode } from "react";
import { useAuthSession } from "../login/ctx";

export default  function RootLayout() : ReactNode  {
  const { token,logou, isLoading } = useAuthSession();
  //const token2 = await AsyncStorage.getItem('@token');

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log("Token Inicio" + token);

  if (!token && !logou) {    
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