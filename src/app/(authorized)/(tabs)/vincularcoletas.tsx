import PageHeader from '@/src/components/header';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthSession } from '../../login/ctx';


export default function VincularColetas() {
  const { login } = useAuthSession();
  console.log("Entrou1");
  return (
    <View>
      <PageHeader title={!login ? '' : login} hashandleGoBack={false} />
      <View style={styles.container}>
        <Text style={styles.textMensagemPrincipal}>COLETAS VINCULADAS</Text>
      </View>
    </View>

  );
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
    textAlign:'center',
    fontSize:20,
    color:'#fafafa',
    fontWeight: 'bold',
  },
});
