import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {        
        backgroundColor: '#aeb6bf',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        marginTop:5,
        borderRadius: 10,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 20,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',        
        marginTop: 10,
        marginLeft:"80%",
    },
    imgUser: {
        flexDirection: 'row',
        alignItems: 'flex-end',        
        marginTop: -10,
        marginLeft:-100,
    },
    title: {
        color: '#000033',
        fontSize: 16,
        lineHeight: 22,
        maxWidth: 300,        
        marginTop: -25,   
        marginLeft:50,   
        justifyContent:'center',
        alignItems:'center',        
    },    
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 500,
        marginTop: -10,
        marginLeft: -80,
    },
});


export default styles;