import { useState } from "react";
import { Button, Text, View } from "react-native";
import { useAuthSession } from "../../login/ctx";

export default function Index() {
  const {signOut, login} = useAuthSession();
  const [tokenInUi, setTokenInUi] = useState<null|string|undefined>(null);

  const logout = () => {
     signOut();
  }

  const callApi = async () => {
    setTokenInUi(login);
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#aeb6bf'
      }}
    >
      <Text>Login</Text>
      <Button title={"Logoff"} onPress={logout}/>
      <View style={{
        paddingTop: 20
      }} />      
      <Text>Ver Login</Text>
      <Button title={"Usuário"} onPress={callApi} />
      {tokenInUi &&
        <Text>{`Usuário ${tokenInUi}`}</Text>
      }
    </View>
  );
}