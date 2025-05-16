import api from "@/res/services/api";
import conversao from "@/res/services/conversao";
import PageHeader from "@/src/components/header";
import Loading from "@/src/components/loadingscreen/loading";
import undefined from "@/src/components/ui/TabBarBackground";
import { useIsFocused } from "@react-navigation/core";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";
import { CheckBox } from 'react-native-elements';
import { useAuthSession } from "../login/ctx";
import { resp } from "../types/types";


export interface DetalheCaixasColeta {
    ModeloCaixa: string,
    CodigoEanCaixa: string,
    SituacaoCaixa: string,
    DescCaixa: string,
    CodigoCaixa: number,
    Logger: string,
    Serie: string,
    Qtd: number,    
}

export interface CaixasConferidas {
    Seq: number,
    Serie: string,
    Modelo: string,
    Qtd: number,
    User: string | null,
    NuCoordenacao: number,
}

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
];

export default function DetalheCaixa() {
    const { login } = useAuthSession();
    const [etiqueta, setEtiqueta] = useState('');
    const [messagemError, setMessagemError] = useState('');
    const [loadTela, setLoadTela] = useState(false);
    const [caixas, setCaixas] = useState<DetalheCaixasColeta[]>([]);
    const [caixasConferidas, setCaixasConferidas] = useState<CaixasConferidas[]>([]);
    const [totalLido, setTotalLido] = useState(0);
    const [qtdCaixa, setQtdCaixa] = useState(0);
    const [caixaEco, setCaixaEco] = useState('');
    const [load, setLoad] = useState(false);

    const refInput = React.useRef<TextInput>(null);
    const isFocused = useIsFocused();


    const params = useLocalSearchParams<{ caixa: string, coleta: string }>();

    useEffect(() => {
        if (isFocused)
            ProcessarRetornoDaAPI();
    }, []);


    async function ProcessarRetornoDaAPI() {
        setLoadTela(true);
        let response = await api.get('/ColetaEcobox/BuscarDetalheCaixasColetaEcobox?_idCaixa=' + params.caixa + '&_numColeta=' + params.coleta);

        setLoadTela(false);

        if (response.data === "999") {
            router.push({
                pathname: '/../SemInternet',
            });
            return;
        }

        if (response.data === "401") {
            router.push({
                pathname: '/../login',
            });
            return;
        }

        if (response === undefined)
            return;


        if (response.data != null && response.ok) {
            let cx = conversao<DetalheCaixasColeta[]>(response.data);
            setCaixas(cx);
            setCaixaEco(cx[1].DescCaixa);
            setQtdCaixa(cx[1].Qtd);
            return;
        }
        else {
            //console.log(JSON.stringify(response.data));            
            let msg2 = conversao<resp>(response.data);
            console.log(msg2);
            Alert.alert("Atenção", String(msg2.Menssage));
            //setMessagemError(String(msg.menssage));
            return;
        }
    };

    function KeyPressPromisse() {

        if (etiqueta.length === 0) {
            return;
        }

        setMessagemError('');

        if (etiqueta.length < 6) {
            LimparCampos();
            Vibration.vibrate(PATTERN);
            return;
        }

        if (etiqueta.length > 18) {
            setEtiqueta(etiqueta.replace("https://www.luftlogistics.com:8801/PortalTransporte/LogerShield/Index/Codigo=", ""));
        }

        let IdxEqt = caixas.find(et => {
            if (et.CodigoEanCaixa === etiqueta)
                return et.Serie;
        });

        if (IdxEqt === undefined) {
            LimparCampos();
            setMessagemError('Caixa não localizada.');
            Vibration.vibrate(PATTERN);
            return;
        }

        if (ConfirmaPassagem()) {
            Alert.alert("Atenção", "Já atingiu a quantidade.");
            return;
        }

        let exSerie = caixasConferidas.findIndex(et => {
            if (et.Serie === IdxEqt.Serie)
                return et.Serie;
        });

        if (exSerie > 0) {
            LimparCampos();
            setMessagemError('Etiqueta já lida.');
            Vibration.vibrate(PATTERN);
            return;
        }


        VerificaTodosConferidos(IdxEqt);
    }

    async function VerificaTodosConferidos(caixa: DetalheCaixasColeta) {
        let total = totalLido;

        total++;
        setTotalLido(total);

        if (total > 0) {
            GravarLista(caixa);
            LimparCampos();
        }
        LimparCampos();
    }

    function GravarLista(caixa: DetalheCaixasColeta) {
        let ArrayCaixas = [...caixasConferidas];

        console.log("serie " + caixa.Serie);
        console.log("ArrayCaixas Ltg " + ArrayCaixas.length);
        ArrayCaixas.push({
            Seq: ArrayCaixas.length + 1,
            Serie: caixa.Serie,
            Modelo: caixa.DescCaixa,
            Qtd: 1,
            User: login,
            NuCoordenacao: Number(params.coleta)
        });

        setCaixasConferidas(ArrayCaixas);
        console.log("ArrayCaixas " + ArrayCaixas.forEach(p => p.Serie));
    }

    const Voltar = () => {
        router.replace('/');
    };

    const LimparCampos = () => {
        setEtiqueta('');
        setMessagemError('');
    }

    const ConfirmaPassagem = () => {
        if (qtdCaixa === totalLido) {
            LimparCampos();
            return true;
        }
        return false;
    }

    async function ConfirmarPassagem() {
        let response: resp;

        if (caixasConferidas.length === 0) {
            console.log("Não tem Caixas Conferidas");
            return;
        }

        if (!ConfirmaPassagem()) {
            Alert.alert("Atenção", "Ainda não atingiu a quantidade de caixas.");
            return;
        }

        setLoad(true);
        console.log(JSON.stringify(caixasConferidas));

        const res = await api.post("/ColetaEcobox//GravarConferencia", JSON.stringify(caixasConferidas));

        console.log(JSON.stringify(res.data));

        response = conversao<resp>(res.data);

        setLoad(false);
        Alert.alert("Conferência", response.Menssage);

        if(response.Code === 1)        
            router.replace('/');        
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
                            {caixaEco &&
                                <Text style={styles.textMensagemPrincipal}>{caixaEco}-Total:{totalLido}/{qtdCaixa}</Text>
                            }
                        </View>

                        <View style={styles.containerInput}>
                            <TextInput
                                style={styles.inputEtiqueta}
                                ref={refInput}
                                value={etiqueta}
                                showSoftInputOnFocus={false}
                                editable={true}
                                allowFontScaling={false}
                                placeholder='Etiqueta Caixa'
                                placeholderTextColor='#bbb'
                                onChangeText={(text) => {
                                    setEtiqueta(text);
                                }}
                                onSubmitEditing={(event) => {
                                    event.persist();
                                    KeyPressPromisse();
                                }}
                                autoFocus={true}
                                onBlur={() => {
                                    refInput.current?.focus();
                                }}
                                maxLength={20}
                            >
                            </TextInput>
                        </View>
                        <View style={styles.objectSameRow}>
                            <Text style={styles.critica}> {messagemError}</Text>
                        </View>
                        <View>
                            <Text style={{ marginTop: 10, fontSize: 12, alignItems: 'center', justifyContent: 'center' }}> Lista de Caixas Bipadas:</Text>
                        </View>
                        <View>
                            <View style={styles.rowHeader}>
                                <Text>#Seq</Text>
                                <Text>Série</Text>
                                <Text>Modelo</Text>
                                <Text>Excluir?</Text>
                            </View>
                            : <View></View>
                        </View>
                        <ScrollView style={styles.textoScroll}>
                            <View>
                                {caixasConferidas != null ? (
                                    caixasConferidas.map((x: CaixasConferidas) => {
                                        return (
                                            <View key={x.Seq}>
                                                {ItensCaixasPromisse(x)}
                                            </View>
                                        )
                                    })) : null};
                            </View>
                        </ScrollView>
                        <View style={styles.styleButton}>
                            <Button title="Voltar" color="black" onPress={Voltar} />
                            {load ? (
                                <ActivityIndicator size={24} color='#191970' />
                            ) : (
                                <Button title="Registrar" color="#191970" onPress={ConfirmarPassagem} />
                            )}
                        </View>
                    </View>
                )}
        </View>
    );

    function ItensCaixasPromisse(item: CaixasConferidas) {
        return (
            <View>
                <View style={styles.rowGrid}>
                    <Text>{item.Seq}</Text>
                    <Text>{item.Serie}</Text>
                    <Text>{item.Modelo}</Text>
                    <TouchableOpacity key={item.Serie}>
                        <View>
                            <CheckBox style={styles.pic}
                                checkedIcon="dot-trash-o"
                                uncheckedIcon="trash-o"
                                onPress={() => toggleChecked(item.Serie)}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    function toggleChecked(nota: string) {
        let arr = caixasConferidas.filter(function (item) {
            return item.Serie !== nota
        })
        setTotalLido(arr.length);
        setCaixasConferidas(arr);
    }
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
    containerInput: {
        marginTop: -35,
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
        padding: -5,
        width: '100%',
        borderRadius: 5,
        marginTop: 1,
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
    },
    inputEtiqueta: {
        borderColor: '#000000',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        height: 36,
        width: '75%',
        marginLeft: 5,
        marginTop: -10,
        fontSize: 13,
    },
    objectSameRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        marginTop: -20,
    },
    critica: {
        backgroundColor: 'red',
        justifyContent: 'center',
        textAlign: 'center',
        marginLeft: '20%',
        marginTop: 25,
    },
    styleButton: {
        flexDirection: 'row',
        marginLeft: '2%',
        borderRadius: 5,
        paddingHorizontal: -10,
        justifyContent: 'space-around',
        color: 'black',
    },
    pic: {
        borderRadius: 15,
        width: 30,
        height: 30,
    },
    rowGrid: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#dcdcdc',
        justifyContent: 'space-between',
        marginTop: -10,
        marginLeft: 25,
    },
    rowHeader: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#707b7c',
        backgroundColor: '#ccd1d1',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -20,
        width: '100%',
    }
});

