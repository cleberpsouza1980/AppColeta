import React from "react";
import { View } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { Modal } from 'react-native-paper';


function loading(visible: any) {
    return (
        <View>
            <Modal style={{ backgroundColor: "#FFFF" }} visible={visible} >
                <Spinner
                    size="large"
                    color={"#99d9ea"}
                    visible={true}
                />
            </Modal>
        </View>

    );

}


export default loading

