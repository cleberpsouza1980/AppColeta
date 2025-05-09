import api from "@/res/services/api";
import conversao from "@/res/services/conversao";
import PageHeader from "@/src/components/header";
import Loading from "@/src/components/loadingscreen/loading";
import { useIsFocused } from "@react-navigation/core";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthSession } from "../login/ctx";

export interface CaixasColeta {
    idCaixa: number,
    caixa: string,
    temperaturaCaixa: string
}

let caixaImg = require('@/assets/caixa.png');

export default function DetalheColeta() {

    const { login } = useAuthSession();
    const [loadTela, setLoadTela] = useState(false);
    const [caixas, setCaixas] = useState<CaixasColeta[]>([]);
    const isFocused = useIsFocused();

    const params = useLocalSearchParams<{ coleta: string }>();

    useEffect(() => {
        if (isFocused)
            ProcessarRetornoDaAPI();
    }, []);

    async function ProcessarRetornoDaAPI() {
        setLoadTela(true);

        let response = await api.get('/ColetaEcobox/BuscarCaixasColeta?_numColeta=' + params.coleta);

        setLoadTela(false);

        if (response.data === "999") {
            router.replace('/../SemInternet');
        }

        if (response === undefined)
            return;

        if (response.data != null && response.ok) {
            setCaixas(conversao<[CaixasColeta]>(response.data))
        }
    }

    function CarregarDetalhes(id: number) {
        router.push({
            pathname: '/../detalhecaixa',
            params: { caixa: id },
        });
    }
    return (
        <View>
            {loadTela ? (
                <Loading visible={loadTela} />
            ) :
                (
                    <View>
                        <PageHeader title={!login ? '' : login} hashandleGoBack={false} />
                        <View style={styles.container}>
                            <Text style={styles.textMensagemPrincipal}>COLETAS</Text>
                        </View>
                        <ScrollView style={styles.textoScroll}>
                            <View>
                                {
                                    caixas.map((p: CaixasColeta) => {
                                        return (
                                            <View key={p.idCaixa}>
                                                {ItensCaixaPromisse(p)}
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                )}
        </View>
    );


    function ItensCaixaPromisse(item: CaixasColeta) {
        return (
            <View>
                <TouchableOpacity key={item.idCaixa} onPress={() => CarregarDetalhes(item.idCaixa)}>
                    <View key={item.caixa}>
                        <Image
                            key={item.idCaixa}
                            style={{ width: 40, height: 31, marginBottom: 20 }}
                            source={caixaImg}>
                        </Image><Text style={styles.nameTxt}>{item.idCaixa} </Text>
                    </View>
                    <Text style={styles.mblTxt}>
                        {item.temperaturaCaixa}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#aeb6bf',
        marginVertical: 20,
        marginTop: -470,
        padding: -15,
        width: '100%',
        height: '100%',
    },
    textMensagemPrincipal: {
        backgroundColor: '#e28f46',
        marginTop: -60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        textAlign: 'center',
        fontSize: 20,
        color: '#fafafa',
        fontWeight: 'bold',
    },
    textoScroll: {
        textAlign: 'center',
        backgroundColor: '#F8F8FF',
        padding: 15,
        width: '100%',
        borderRadius: 5,
        marginTop: -50,
    },
    nameTxt: {
        marginTop: -60,
        marginLeft: 40,
        fontWeight: '600',
        color: '#191970',
        fontSize: 30,
    },
    mblTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#D8BFD8',
        fontSize: 15,
        flexDirection: 'row',
    }
});
