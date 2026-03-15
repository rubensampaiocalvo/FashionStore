import React from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Producto(){

const router = useRouter();
const params = useLocalSearchParams();

if(!params.producto){
return(
<View style={styles.container}>
<Text>Error cargando producto</Text>
</View>
)
}

const item = JSON.parse(params.producto as string);

const comprar = async () => {

const carritoGuardado = await AsyncStorage.getItem("carrito");
let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

carrito.push(item);

await AsyncStorage.setItem("carrito", JSON.stringify(carrito));

Alert.alert("Producto añadido al carrito");

router.push("/Carrito");

}

return(

<View style={styles.container}>

<Text style={styles.nombre}>
{item.nombre}
</Text>

<Text style={styles.descripcion}>
{item.descripcion}
</Text>

<Text style={styles.precio}>
€ {item.precio}
</Text>

<TouchableOpacity
style={styles.boton}
onPress={comprar}
>

<Text style={{color:"white"}}>
Añadir al carrito
</Text>

</TouchableOpacity>

</View>

)

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
marginTop:40
},

nombre:{
fontSize:26,
fontWeight:"bold",
marginBottom:20
},

descripcion:{
fontSize:16,
marginBottom:20
},

precio:{
fontSize:20,
color:"green",
marginBottom:30
},

boton:{
backgroundColor:"black",
padding:15,
borderRadius:8,
alignItems:"center"
}

})