import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function Carrito() {

  const [carrito, setCarrito] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {

    const data = await AsyncStorage.getItem("carrito");

    if (data) {
      setCarrito(JSON.parse(data));
    }

  };

  const guardar = async (nuevo: any[]) => {

    setCarrito(nuevo);

    await AsyncStorage.setItem(
      "carrito",
      JSON.stringify(nuevo)
    );

  };

  const eliminar = (index: number) => {

    const nuevo = carrito.filter(
      (_, i) => i !== index
    );

    guardar(nuevo);

  };

  const sumar = (index: number) => {

    const nuevo = [...carrito];

    if (!nuevo[index].cantidad) {
      nuevo[index].cantidad = 1;
    }

    nuevo[index].cantidad++;

    guardar(nuevo);

  };

  const restar = (index: number) => {

    const nuevo = [...carrito];

    if (nuevo[index].cantidad > 1) {
      nuevo[index].cantidad--;
    }

    guardar(nuevo);

  };

  const total = carrito.reduce(
    (sum, item) =>
      sum +
      item.precio *
        (item.cantidad || 1),
    0
  );

  const pagarVisa = () => {
    Alert.alert("Pago con Visa ✅");
  };

  const pagarPaypal = () => {
    Alert.alert("Pago con PayPal ✅");
  };

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        🛒 Carrito
      </Text>

      <FlatList
        data={carrito}
        keyExtractor={(_, i) =>
          i.toString()
        }
        renderItem={({ item, index }) => (

          <View style={styles.card}>

            <Text style={styles.nombre}>
              {item.nombre}
            </Text>

            <Text>
              Precio: € {item.precio}
            </Text>

            <View style={styles.row}>

              <TouchableOpacity
                onPress={() =>
                  restar(index)
                }
              >
                <Text style={styles.btn}>
                  ➖
                </Text>
              </TouchableOpacity>

              <Text>
                {item.cantidad || 1}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  sumar(index)
                }
              >
                <Text style={styles.btn}>
                  ➕
                </Text>
              </TouchableOpacity>

            </View>

            <TouchableOpacity
              onPress={() =>
                eliminar(index)
              }
            >
              <Text style={styles.eliminar}>
                Eliminar
              </Text>
            </TouchableOpacity>

          </View>

        )}
      />

      <Text style={styles.total}>
        Total: € {total.toFixed(2)}
      </Text>

      <TouchableOpacity
        style={styles.visa}
        onPress={pagarVisa}
      >
        <Text style={styles.pago}>
          Pagar con Visa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.paypal}
        onPress={pagarPaypal}
      >
        <Text style={styles.pago}>
          Pagar con PayPal
        </Text>
      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

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

  card:{
    backgroundColor:"#eee",
    padding:15,
    marginBottom:10,
    borderRadius:10
  },

  nombre:{
    fontWeight:"bold",
    fontSize:18
  },

  row:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:10,
    gap:10
  },

  btn:{
    fontSize:22
  },

  eliminar:{
    color:"red",
    marginTop:5
  },

  total:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:20
  },

  visa:{
    backgroundColor:"#1a1f71",
    padding:15,
    borderRadius:10,
    marginTop:10,
    alignItems:"center"
  },

  paypal:{
    backgroundColor:"#003087",
    padding:15,
    borderRadius:10,
    marginTop:10,
    alignItems:"center"
  },

  pago:{
    color:"white",
    fontWeight:"bold"
  }

});