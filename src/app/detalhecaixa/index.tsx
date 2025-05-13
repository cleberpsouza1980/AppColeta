import api from "@/res/services/api";
import conversao from "@/res/services/conversao";
import PageHeader from "@/src/components/header";
import Loading from "@/src/components/loadingscreen/loading";
import { useIsFocused } from "@react-navigation/core";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from "react-native";
import { useAuthSession } from "../login/ctx";



export interface DetalheCaixasColeta {
    modeloCaixa: string,
    codigoEanCaixa: string,
    situacaoCaixa: string,
    codigoCaixa: number,
    logger: string,
    serie: string,
    qtd: number
}

export interface CaixasConferidas {
    seq: number,
    serie: string,
    qtd: number
}

export interface ErrorSolicitarCaixas {
    code: number,
    message: string,
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
    const [error, setError] = useState<ErrorSolicitarCaixas>();
    const [caixasConferidas, setCaixasConferidas] = useState<CaixasConferidas[]>([]);
    const [totalLido, setTotalLido] = useState(0);
    const refInput = React.useRef<TextInput>(null);
    const isFocused = useIsFocused();
    const qtdLida = 0
    let qtdCaixa = 0, CaixaEco = "";

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
        if (response === undefined)
            return;


        if (response.data != null && response.ok) {
            setCaixas(conversao<DetalheCaixasColeta[]>(response.data));
            CaixaEco = caixas[1].codigoEanCaixa;
            qtdCaixa = caixas[1].qtd;
        }
        else {
            setError(conversao<ErrorSolicitarCaixas>(response.data))
            Alert.alert("Atenção", error?.message);
        }
    };

    function KeyPressPromisse() {

        if (etiqueta.length === 0) {
            return;
        }

        setMessagemError('');

        if (etiqueta.length < 6) {
            setEtiqueta('');
            Vibration.vibrate(PATTERN);
            return;
        }

        let IdxEqt = caixas.findIndex(et => {
            if (et.codigoEanCaixa === etiqueta)
                return et.serie;
        });

        if (IdxEqt < 0) {
            setEtiqueta('');
            setMessagemError('Caixa não localizada.');
            Vibration.vibrate(PATTERN);
            return;
        }
        VerificaTodosConferidos(IdxEqt);
    }

    async function VerificaTodosConferidos(serie: number) {
        let total = totalLido;

        total++;
        setTotalLido(total);


        if (total > 0) {
            GravarLista(serie);
            setEtiqueta('');
        }
        setEtiqueta('');
    }

    function GravarLista(serie: number) {
        let ArrayCaixas = [...caixasConferidas];

        ArrayCaixas.push({
            seq: ArrayCaixas.length + 1,
            serie: etiqueta,
            qtd: 1,
        });

        setCaixasConferidas(ArrayCaixas.reverse());
        console.log("ArrayCaixas " + ArrayCaixas.forEach(p => p.serie));
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
                            <Text style={styles.textMensagemPrincipal}>{caixas[1].codigoEanCaixa}-Total:{qtdLida}/{caixas[1].qtd}</Text>
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
                        <Text style={{ marginTop: 2, fontSize: 12, alignItems: 'center', justifyContent: 'center' }}> Lista de Caixas Bipadas:</Text>
                        <ScrollView style={styles.textoScroll}>
                            <View>
                                {caixasConferidas.map((x: CaixasConferidas) => {
                                    return (
                                        <View key={x.seq}>
                                            {ItensCaixasPromisse(x)}
                                        </View>
                                    )
                                })};
                            </View>
                        </ScrollView>
                        <View style={styles.styleButton}>
                            <Button title="Voltar" color="black" />
                            <Button title="Registrar" color="#191970" />
                        </View>
                    </View>
                )}
        </View>
    );

    function ItensCaixasPromisse(item: CaixasConferidas) {
        return (
            <TouchableOpacity key={item.serie}>
                <View>

                    <CheckBox style={_style.pic}
                        checkedIcon="dot-trash-o"
                        uncheckedIcon="trash-o"
                        onPress={() => toggleChecked(item.serie)}
                    />
                </View>
            </TouchableOpacity>)
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
        padding: 15,
        width: '100%',
        borderRadius: 5,
        marginTop: 5,
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
        marginTop: 340,
        marginLeft: '2%',
        borderRadius: 5,
        paddingHorizontal: -10,
        justifyContent: 'space-around',
        color: 'black',
    }
});

