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

export default function Carrito() {
  const [carrito, setCarrito] = useState<any[]>([]);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    const data = await AsyncStorage.getItem("carrito");

    if (data) {
      const parsed = JSON.parse(data);

      // añadir cantidad si no existe
      const conCantidad = parsed.map((p: any) => ({
        ...p,
        cantidad: p.cantidad || 1,
      }));

      setCarrito(conCantidad);
    }
  };

  const guardarCarrito = async (nuevo: any[]) => {
    setCarrito(nuevo);
    await AsyncStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  // SUMAR
  const sumar = (index: number) => {
    const nuevo = [...carrito];

    if (nuevo[index].cantidad < nuevo[index].stock) {
      nuevo[index].cantidad++;
      guardarCarrito(nuevo);
    } else {
      Alert.alert("No hay más stock");
    }
  };

  // RESTAR
  const restar = (index: number) => {
    const nuevo = [...carrito];

    if (nuevo[index].cantidad > 1) {
      nuevo[index].cantidad--;
      guardarCarrito(nuevo);
    }
  };

  // ELIMINAR
  const eliminar = (index: number) => {
    const nuevo = carrito.filter((_, i) => i !== index);
    guardarCarrito(nuevo);
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const pagar = () => {
    Alert.alert("Pago realizado ✅");
    AsyncStorage.removeItem("carrito");
    setCarrito([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🛒 Carrito</Text>

      <FlatList
        data={carrito}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>

            <Text>Precio: € {item.precio}</Text>
            <Text>Stock: {item.stock}</Text>

            <View style={styles.cantidadRow}>
              <TouchableOpacity onPress={() => restar(index)}>
                <Text style={styles.btn}>➖</Text>
              </TouchableOpacity>

              <Text style={styles.cantidad}>
                {item.cantidad}
              </Text>

              <TouchableOpacity onPress={() => sumar(index)}>
                <Text style={styles.btn}>➕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => eliminar(index)}
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
        style={styles.pagar}
        onPress={pagar}
      >
        <Text style={{ color: "white" }}>
          Pagar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#eee",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },

  cantidadRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  btn: {
    fontSize: 22,
    marginHorizontal: 10,
  },

  cantidad: {
    fontSize: 18,
  },

  eliminar: {
    color: "red",
    marginTop: 5,
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  pagar: {
    backgroundColor: "black",
    padding: 15,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 10,
  },
});