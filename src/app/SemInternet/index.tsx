import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import _style from './styles';


let _image = require('@/assets/images/SemInternet.png');


function index() {


    function Home() {
        router.push({
            pathname: '/../login',
        });
    }

    return (
        <View style={_style.container}>
            <Image style={_style.imagem} source={_image} />
            <Text style={_style.texto}>Verifique sua conexão de internet.</Text>
            <TouchableOpacity style={_style.botao} onPress={Home}>
                <View>
                    <Text style={_style.textoBotao}>
                        Login
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default index;