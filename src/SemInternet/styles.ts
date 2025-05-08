import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,  
    },
    imagem:{    
        height:300,
        width:290,
        marginLeft:50,  
        borderRadius:8,
        justifyContent:'center',       
        marginTop:70,      
      },
      texto:{        
        justifyContent:'center',       
        marginTop:30, 
        marginLeft:70,     
      },
      textoBotao:{        
        textAlign:'left',        
        fontSize:20,  
        marginLeft:-25,               
        marginTop:-1, 
        marginRight:-50, 
      },
      botao:{
        height:50,
        width:20,
        paddingVertical:15,
        paddingHorizontal:115,        
        backgroundColor:'#00B5C7',
        marginTop:10,
        borderRadius:5,
        marginLeft:70,
        
      }
});

export default styles;