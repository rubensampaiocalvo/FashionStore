import React, { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Alert
} from "react-native";

export default function Admin(){

const [nombre,setNombre]=useState("")
const [descripcion,setDescripcion]=useState("")
const [precio,setPrecio]=useState("")
const [stock,setStock]=useState("")

const añadirProducto = async () => {

try{

const response = await fetch("http://10.0.2.2:3000/productos",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nombre,
descripcion,
precio,
stock
})

})

const text = await response.text()

let data

try{
data = JSON.parse(text)
}catch{
console.log("Respuesta servidor:",text)
}

Alert.alert("Producto añadido correctamente")

setNombre("")
setDescripcion("")
setPrecio("")
setStock("")

}catch(error){

console.log(error)
Alert.alert("Error creando producto")

}

}

return(

<View style={styles.container}>

<Text style={styles.titulo}>
Panel Administrador
</Text>

<TextInput
placeholder="Nombre producto"
style={styles.input}
value={nombre}
onChangeText={setNombre}
/>

<TextInput
placeholder="Descripción"
style={styles.input}
value={descripcion}
onChangeText={setDescripcion}
/>

<TextInput
placeholder="Precio"
style={styles.input}
value={precio}
onChangeText={setPrecio}
keyboardType="numeric"
/>

<TextInput
placeholder="Stock"
style={styles.input}
value={stock}
onChangeText={setStock}
keyboardType="numeric"
/>

<TouchableOpacity
style={styles.boton}
onPress={añadirProducto}
>

<Text style={{color:"white"}}>
Añadir producto
</Text>

</TouchableOpacity>

</View>

)

}

const styles=StyleSheet.create({

container:{
flex:1,
padding:20,
marginTop:40
},

titulo:{
fontSize:24,
fontWeight:"bold",
marginBottom:20
},

input:{
borderWidth:1,
padding:10,
marginBottom:15,
borderRadius:8
},

boton:{
backgroundColor:"black",
padding:15,
borderRadius:8,
alignItems:"center"
}

})