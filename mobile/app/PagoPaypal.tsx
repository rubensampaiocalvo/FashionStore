import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PagoPaypal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pagar = async () => {
    if (!email.includes("@")) {
      Alert.alert("Email inválido");
      return;
    }

    Alert.alert("Pago realizado con PayPal ✅");
    await AsyncStorage.removeItem("carrito");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🟦 Pago con PayPal</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={pagar}>
        <Text style={{ color: "white" }}>Iniciar sesión y pagar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#003087",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});