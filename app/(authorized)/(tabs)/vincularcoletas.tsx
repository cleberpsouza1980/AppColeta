import PageHeader from '@/components/header';
import React, { useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useAuthSession } from '../../login/ctx';

interface ColetaConferidas {
  seq: number,
  caixa: string,
  delivery: string,
}

export default function VincularColetas() {
  const { login } = useAuthSession();
  const [coletaConferidas, setColetaConferidas] = useState<ColetaConferidas[]>([]);
  const [posLidoCaixa, setPostLidoCaixa] = useState(false);
  const [textoLeitura, setTextoLeitura] = useState('Informe a delivery');
  const [etiqueta, setEtiqueta] = useState('');
  const [messagemError, setMessagemError] = useState('');
  const [load, setLoad] = useState(false);
  const [caixaLida, setCaixaLida] = useState('');
  const [deliveryLida, setDeliveyLida] = useState('');
  const refInput = React.useRef<TextInput>(null);

  //let EtiquetaLida: ColetaConferidas = { seq: 0, delivery: "", caixa: "" }


  function KeyPressPromisse() {
    if (etiqueta.length < 4)
      return;

    if (!posLidoCaixa) {
      setDeliveyLida(etiqueta);
      setTextoLeitura("Informe a caixa");
      setPostLidoCaixa(!posLidoCaixa);
      LimparCampos();
      return;
    }
    else {
      setCaixaLida(etiqueta);
    }
    if (deliveryLida !== "" && caixaLida !== "") {
      GravarLista();
      LimparDadosColeta();
      setPostLidoCaixa(!posLidoCaixa);
    }
  }

  const LimparCampos = () => {
    setEtiqueta('');
    setMessagemError('');
  }

  const LimparDadosColeta = () => {
    setCaixaLida('');
    setDeliveyLida('');      
  }

  function GravarLista() {
    let ArrayColeta = [...coletaConferidas];

    ArrayColeta.push({
      seq: ArrayColeta.length + 1,
      delivery: deliveryLida,
      caixa: caixaLida,
    });

    setColetaConferidas(ArrayColeta);
  }

  function ConfirmarColeta() {
    setLoad(true);
  }

  return (
    <View>
      <PageHeader title={!login ? '' : login} hashandleGoBack={false} />
      <View style={styles.container}>
        <Text style={styles.textMensagemPrincipal}>COLETAS VINCULADAS</Text>
      </View>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.inputEtiqueta}
          ref={refInput}
          value={etiqueta}
          showSoftInputOnFocus={false}
          editable={true}
          allowFontScaling={false}
          placeholder={textoLeitura}
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
        />
      </View>
      {messagemError &&
        <View style={styles.objectSameRow}>
          <Text style={styles.critica}> {messagemError}</Text>
        </View>
      }
      <View>
        <View style={styles.rowHeader}>
          <Text>Modelo</Text>
          <Text>Excluir?</Text>
        </View>
      </View>
      {coletaConferidas.length > 0 ? (
        <View>
          <ScrollView style={styles.textoScroll}>
            {
              coletaConferidas.map((x: ColetaConferidas) => {
                return (
                  <View key={x.seq}>
                    {ItensColetaPromisse(x)}
                  </View>
                )
              })
            };
          </ScrollView>
        </View>
      ) : null}
      <View style={styles.styleButton}>
        {load ? (
          <ActivityIndicator size={24} color='#191970' />
        ) : (
          <Button title="Registrar" color="#191970" onPress={ConfirmarColeta} />
        )}
      </View>
    </View>

  );

  function ItensColetaPromisse(item: ColetaConferidas) {
    return (
      (item &&
        <View style={styles.rowGrid}>
          <Text>{item.seq}</Text>
          <Text>{item.delivery}</Text>
          <Text>{item.caixa}</Text>
          <TouchableOpacity key={item.seq}>
            <CheckBox style={styles.pic}
              checkedIcon="dot-trash-o"
              uncheckedIcon="trash-o"
              onPress={() => toggleChecked(item.delivery)}
            />
          </TouchableOpacity>
        </View>
      ));
  }

  function toggleChecked(delivey: string) {
    console.log("toggleChecked");
    let arr = coletaConferidas.filter(function (item) {
      return item.delivery !== delivey
    })
    //setTotalLido(arr.length);
    setColetaConferidas(arr);
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
  containerInput: {
    marginTop: -35,
  },
  textoScroll: {
    textAlign: 'center',
    backgroundColor: '#F8F8FF',
    padding: -5,
    width: '100%',
    borderRadius: 5,
    marginTop: -20,
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
