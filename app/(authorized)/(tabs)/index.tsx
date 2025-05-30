import PageHeader from '@/components/header';
import Loading from '@/components/loadingscreen/loading';
import api from '@/res/services/api';
import conversao from '@/res/services/conversao';
import { dataFormatada } from '@/res/services/functions';
import { router } from 'expo-router';
import 'expo-router/entry';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthSession } from '../../login/ctx';


export interface ColetasDia {
  numColeta: number,
  cliente: string,
  data_Coleta: Date,
}

export default function AcessarColetas() {
  const { login } = useAuthSession();
  const [loadTela, setLoadTela] = useState(false);
  const [coletaDia, setColetaDia] = useState<ColetasDia[]>([]);

  let imgtruck = require('@/assets/images/caminhaoFinalizado.png');
  let imgRefresh = require('@/assets/images/refresh.png');

  useEffect(() => {
    ProcessarRetornoDaAPI();
  }, []);

  async function ProcessarRetornoDaAPI() {

    setLoadTela(true);
    console.log("Lendo API");

    let response = await api.get('/ColetaEcobox?_user=' + login);

    setLoadTela(false);

    if (response.data === "999") {
      router.push({
        pathname: '/../SemInternet',
      });
    }
    
    if (response.status === 401) {
      router.push({
        pathname: '/../login',
      });
    }

    if (response === undefined)
      return;

    if (response.data != null && response.ok) {
      setColetaDia(conversao<[ColetasDia]>(response.data))
    }
  }
  function CarregarDetalhes(id: number) {
    router.push({
      pathname: '/../detalhecoleta',
      params: { coleta: id },
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
              <TouchableOpacity style={styles.btnRefresh} onPress={ProcessarRetornoDaAPI}>
                <Image
                  source={imgRefresh}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.textoScroll}>
              <View>
                {
                  coletaDia.map((p: ColetasDia) => {
                    return (
                      <View key={p.numColeta}>
                        {ItensColetaPromisse(p)}
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


  function ItensColetaPromisse(item: ColetasDia) {
    return (
      <View>
        <TouchableOpacity key={item.numColeta} onPress={() => CarregarDetalhes(item.numColeta)}>
          <View key={item.numColeta}>
            <Image
              key={item.numColeta}
              style={{ width: 40, height: 31, marginBottom: 20 }}
              source={imgtruck}>
            </Image><Text style={styles.nameTxt}>{item.numColeta} </Text>
          </View>
          <Text style={styles.mblTxt}>
            {item.cliente + "  " + dataFormatada(item.data_Coleta)}
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
    marginTop: '-132%',
    padding: -15,
    width: '100%',
    height: '100%',
  },
  textMensagemPrincipal: {
    backgroundColor: '#e28f46',
    marginTop: '-15%',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-between',
    fontSize: 20,
    color: '#fafafa',
    fontWeight: 'bold',
    marginBottom: 10,
    flexDirection: 'row',
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
  },
  btnRefresh: {
    marginTop: -35,
    marginLeft: '92%',
    flexDirection: 'row',
  },
});
