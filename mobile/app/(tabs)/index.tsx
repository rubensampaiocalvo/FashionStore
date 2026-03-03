import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [productos, setProductos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  // Cargar productos
  useEffect(() => {
    fetch("http://10.0.2.2:3000/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  // Cargar usuario guardado
  useEffect(() => {
    const cargarUsuario = async () => {
      const user = await AsyncStorage.getItem("usuario");
      if (user) {
        setUsuario(JSON.parse(user));
      }
    };
    cargarUsuario();
  }, []);

  const cerrarSesion = async () => {
    await AsyncStorage.clear();
    setUsuario(null);
  };

  return (
    <View style={styles.container}>
<View style={styles.topButtons}>
  {usuario ? (
    <>
      <Text style={styles.userText}>👤 {usuario.nombre}</Text>

      <TouchableOpacity onPress={() => router.push("../Carrito")}>
        <Ionicons name="cart-outline" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={cerrarSesion}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </>
  ) : (
    <>
      <TouchableOpacity onPress={() => router.push("../Login")}>
        <Text style={styles.link}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../Registro")}>
        <Text style={styles.link}>Registro</Text>
      </TouchableOpacity>
    </>
  )}
</View>
<TouchableOpacity
  style={styles.buyButton}
  onPress={() => alert("Producto añadido al carrito")}
>
  <Text style={{ color: "white" }}>Añadir al carrito</Text>
</TouchableOpacity>

      <Text style={styles.titulo}>🛍️ FashionShop</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id_producto.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text style={styles.precio}>€ {item.precio}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },

  topButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginBottom: 10,
    alignItems: "center",
  },

  link: { color: "blue", fontWeight: "bold" },

  logout: { color: "red", fontWeight: "bold" },

  userText: { fontWeight: "bold", marginRight: 10 },

  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  nombre: { fontSize: 18, fontWeight: "bold" },

  precio: { marginTop: 5, color: "green" },
});