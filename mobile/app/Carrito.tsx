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
  const router = useRouter();
  const [carrito, setCarrito] = useState<any[]>([]);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    const data = await AsyncStorage.getItem("carrito");
    if (data) setCarrito(JSON.parse(data));
  };

  const eliminarProducto = async (index: number) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    await AsyncStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const total = carrito.reduce(
    (sum, item) => sum + parseFloat(item.precio),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🛒 Carrito</Text>

      {carrito.length === 0 ? (
        <Text style={styles.vacio}>Tu carrito está vacío</Text>
      ) : (
        <>
          <FlatList
            data={carrito}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.nombre}>{item.nombre}</Text>
                    <Text style={styles.precio}>€ {item.precio}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.eliminarBtn}
                    onPress={() => eliminarProducto(index)}
                  >
                    <Text style={styles.eliminarTexto}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Text style={styles.total}>
            Total: € {total.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={styles.visa}
            onPress={() => router.push("/PagoVisa")}
          >
            <Text style={styles.botonTexto}>Pagar con Visa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.paypal}
            onPress={() => router.push("/PagoPaypal")}
          >
            <Text style={styles.botonTexto}>Pagar con PayPal</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  vacio: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },

  precio: {
    color: "green",
    marginTop: 4,
  },

  eliminarBtn: {
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  eliminarTexto: {
    color: "white",
    fontWeight: "bold",
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  visa: {
    backgroundColor: "#1a1f71",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  paypal: {
    backgroundColor: "#003087",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  botonTexto: {
    color: "white",
    fontWeight: "bold",
  },
});