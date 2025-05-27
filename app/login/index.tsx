import api from "@/res/services/api";
import conversao from "@/res/services/conversao";
import { VersaoApp } from "@/res/services/functions";
import { ReactNode, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuthSession } from "./ctx";


interface LoginResult {
    token: string,
    menus: Menu[],
}

export interface Menu {
    codigo: string,
    descricao: string,
    versao: string,
}

export default function Login(): ReactNode {

    const { signIn } = useAuthSession();
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [load, setLoad] = useState(false);
    let Login = usuario.toLowerCase();
    let Password = senha;

    const handleLogin = async () => {
        const data = {
            Login,
            Password,
            VersaoApp,
            //SerialKey,
        };

        if (usuario.length === 0) {
            setMensagem("Informe o usuário.");
            setLoad(false);
            return;
        }

        if (senha.length === 0) {
            setMensagem("Informe a senha.");
            setLoad(false);
            return;
        }

        setLoad(true);
        const response = await api.post('/Login', JSON.stringify(data));
        
        if (response.data === "401" || response.duration === 403 || response.status === 401
            || response.data == null) {
            setMensagem("Login ou senha inválida.");
            setLoad(false);
            return;
        }
        if (response.status === 400) {
            Alert.alert("Atenção", String(response.data));
            setLoad(false);
            return;
        }
        if (response.data === "999" || response.status === 999) {
            setLoad(false);
            //<Redirect href="/../SemInternet" />;
            setMensagem("Não conseguiu acesso ao servidor.");
            return;
        }

        if (response.data != null && response.ok) {
            setMensagem("");
            setUsuario('');
            setSenha('');
            setLoad(false);
            const resp = conversao<LoginResult>(response.data);

            if (resp.token.length > 10) {                
                await login(String(resp.token), usuario);                
            }
        }
    };

    const login = async (tok: string, usu: string): Promise<void> => {
        const t: string = String(tok);
        const l: string = String(usu);
        signIn(t, l);
    };


    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/luftlogo.png')} />
            <Text style={styles.title}>Coleta Ecobox!</Text>
            <TextInput placeholder="Usuario" style={styles.input} onChangeText={texto => setUsuario(texto)} value={usuario} />
            <TextInput
                placeholder="Senha"
                secureTextEntry
                style={styles.input}
                onChangeText={texto => setSenha(texto)} value={senha}
            />
            {load ? (
                <ActivityIndicator size={24} color='#00008b' />
            ) : (
                <Button title="Logar" onPress={handleLogin} />
            )}
            {mensagem &&
                <View style={styles.critica}>
                    <Text>{mensagem}</Text>
                </View>
            }
            {VersaoApp &&
                <Text>
                    Versao{VersaoApp}
                </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#aeb6bf',
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: "center",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor:"#f8f9f9",
        padding: 10,
        margin: 10,
        borderRadius: 4,
    },
    button: {
        width: "80%",
    },
    critica: {
        backgroundColor: 'red',
        justifyContent: 'center',
    }
});
