import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [productos, setProductos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://10.0.2.2:3000/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const cargarUsuario = async () => {
      const user = await AsyncStorage.getItem("usuario");
      if (user) setUsuario(JSON.parse(user));
    };
    cargarUsuario();
  }, []);

  const añadirAlCarrito = async (producto: any) => {
    if (!usuario) {
      Alert.alert("Debes iniciar sesión");
      return;
    }

    const carritoGuardado = await AsyncStorage.getItem("carrito");
    let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    carrito.push(producto);

    await AsyncStorage.setItem("carrito", JSON.stringify(carrito));

    Alert.alert("Producto añadido al carrito 🛒");
    router.push("/Carrito");
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {usuario ? (
          <>
            <Text style={styles.userText}>👤 {usuario.nombre}</Text>

            <TouchableOpacity onPress={() => router.push("/Carrito")}>
              <Ionicons name="cart-outline" size={26} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={cerrarSesion}>
              <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.push("/Login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/Registro")}>
              <Text style={styles.link}>Registro</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.titulo}>🛍️ FashionShop</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id_producto.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text style={styles.precio}>€ {item.precio}</Text>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => añadirAlCarrito(item)}
            >
              <Text style={{ color: "white" }}>Comprar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  link: { color: "blue", fontWeight: "bold" },
  logout: { color: "red", fontWeight: "bold" },
  userText: { fontWeight: "bold" },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },

  nombre: { fontSize: 18, fontWeight: "bold" },
  precio: { marginTop: 5, color: "green", fontWeight: "bold" },

  buyButton: {
    marginTop: 10,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});