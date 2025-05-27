import PageHeader from '@/components/header';
import Loading from "@/components/loadingscreen/loading";
import undefined from "@/components/ui/TabBarBackground";
import api from "@/res/services/api";
import conversao from "@/res/services/conversao";
import { useIsFocused } from "@react-navigation/core";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";
import { CheckBox } from 'react-native-elements';
import { useAuthSession } from "../login/ctx";
import { resp } from "../types/types";


export interface DetalheCaixasColeta {
    modeloCaixa: string,
    codigoEanCaixa: string,
    situacaoCaixa: string,
    descCaixa: string,
    codigoCaixa: number,
    logger: string,
    serie: string,
    //qtd: number,
    idColetaItens: number,
    faixa: string,
}

export interface CaixasConferidas {
    seq: number,
    serie: string,
    modelo: string,
    qtd: number,
    user: string | null,
    nuCoordenacao: number,
    idColetaItens: number,
    faixa: string,
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


    const params = useLocalSearchParams<{ caixa: string, coleta: string, faixa: string, qtd: string }>();

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
            setCaixaEco(cx[1].descCaixa);
            setQtdCaixa(Number(params.qtd));
            return;
        }
        else {
            //console.log(JSON.stringify(response.data));            
            let msg2 = conversao<resp>(response.data);
            console.log(msg2);
            Alert.alert("Atenção", String(msg2.menssage));
            //setMessagemError(String(msg.menssage));
            return;
        }
    };

    function KeyPressPromisse() {
        let NovaEtiqueta : string;

        if (etiqueta.length === 0) {
            return;
        }

        setMessagemError('');

        if (etiqueta.length < 6) {
            LimparCampos();
            Vibration.vibrate(PATTERN);
            return;
        }
        NovaEtiqueta = etiqueta;

        if(NovaEtiqueta.length > 79)
            NovaEtiqueta = NovaEtiqueta.replace('https://www.luftlogistics.com:8801/PortalTransporte/LogerShield/Index/Codigo=','');

        LimparCampos();

        let ObjEqt = caixas.find(et => {
            if (et.codigoEanCaixa.trim() === NovaEtiqueta.trim() && et.faixa.trim() === params.faixa.trim())
                return et;
        });

        if (ObjEqt === undefined) {
            LimparCampos();
            setMessagemError('Caixa não localizada. ' + NovaEtiqueta);
            Vibration.vibrate(PATTERN);
            return;
        }

        if (ConfirmaPassagem()) {
            Alert.alert("Atenção", "Já atingiu a quantidade.");
            return;
        }

        let exSerie = caixasConferidas.findIndex(et => {
            if (et.serie === ObjEqt.serie)
                return et.serie;
        });

        if (exSerie >= 0) {
            LimparCampos();
            setMessagemError('Etiqueta já lida. ' + NovaEtiqueta);
            Vibration.vibrate(PATTERN);
            return;
        }
        VerificaTodosConferidos(ObjEqt);
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

        ArrayCaixas.push({
            seq: ArrayCaixas.length + 1,
            serie: caixa.serie,
            modelo: caixa.descCaixa,
            qtd: 1,
            user: login,
            nuCoordenacao: Number(params.coleta),
            idColetaItens: Number(caixa.idColetaItens),
            faixa: caixa.faixa
        });

        setCaixasConferidas(ArrayCaixas);
        //console.log("ArrayCaixas " + ArrayCaixas.forEach(p => p.serie));
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

        const res = await api.post("/ColetaEcobox//GravarConferencia", JSON.stringify(caixasConferidas));

        response = conversao<resp>(res.data);

        setLoad(false);
        Alert.alert("Conferência", response.menssage);

        if (response.code === 1)
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
                                    setEtiqueta(text.trim());
                                }}
                                onSubmitEditing={(event) => {
                                    event.persist();
                                    KeyPressPromisse();
                                }}
                                autoFocus={true}
                                onBlur={() => {
                                    refInput.current?.focus();
                                }}
                                maxLength={120}
                            >
                            </TextInput>
                        </View>
                        {messagemError &&
                            <View style={styles.objectSameRow}>
                                <Text style={styles.critica}> {messagemError}</Text>
                            </View>
                        }

                        <View>
                            <View style={styles.rowHeader}>
                                <Text>#Seq</Text>
                                <Text>Série</Text>
                                <Text>Modelo</Text>
                                <Text>Excluir?</Text>
                            </View>
                        </View>
                        {caixasConferidas.length > 0 ? (
                            <View>
                                <ScrollView style={styles.textoScroll}>
                                    {
                                        caixasConferidas.map((x: CaixasConferidas) => {
                                            return (
                                                <View key={x.seq}>
                                                    {ItensCaixasPromisse(x)}
                                                </View>
                                            )
                                        })
                                    };
                                </ScrollView>
                            </View>
                        ) : null}
                        <View style={styles.styleButton}>
                            <Button title="Voltar" color="black" onPress={Voltar} />
                            {load ? (
                                <ActivityIndicator size={24} color='#191970' />
                            ) : (
                                <Button title="Registrar" color="#191970" onPress={ConfirmarPassagem} />
                            )}
                        </View>
                    </View>
                )
            }
        </View >
    );

    function ItensCaixasPromisse(item: CaixasConferidas) {
        return (
            (item &&
                <View style={styles.rowGrid}>
                    <Text>{item.seq}</Text>
                    <Text>{item.serie}</Text>
                    <Text>{item.modelo}</Text>
                    <TouchableOpacity key={item.seq}>
                        <CheckBox style={styles.pic}
                            checkedIcon="dot-trash-o"
                            uncheckedIcon="trash-o"
                            onPress={() => toggleChecked(item.serie)}
                        />
                    </TouchableOpacity>
                </View>
            ));
    }

    function toggleChecked(serie: string) {
        console.log("toggleChecked");
        let arr = caixasConferidas.filter(function (item) {
            return item.serie !== serie
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
        marginTop: '-132%',
        padding: -15,
        width: '100%',
        height: '100%',
    },
    containerInput: {
        marginTop: -35,
    },
    textMensagemPrincipal: {
        backgroundColor: '#e28f46',
        marginTop: '-15%',
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
        marginTop: -20,
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
        width: 20,
        height: 20,
        marginTop: -20,
    },
    rowGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        borderColor: '#dcdcdc',
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft: 25,
        height: 52,
        fontStyle: 'normal',
    },
    rowHeader: {
        flexDirection: 'row',
        borderColor: '#707b7c',
        backgroundColor: '#ccd1d1',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 20,
        width: '100%',
    }
});

