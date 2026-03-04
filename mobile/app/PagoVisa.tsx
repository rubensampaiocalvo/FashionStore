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

export default function PagoVisa() {
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");

  const pagar = async () => {
    if (numero.length < 16 || cvv.length < 3) {
      Alert.alert("Datos inválidos");
      return;
    }

    Alert.alert("Pago realizado con Visa ✅");
    await AsyncStorage.removeItem("carrito");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Pago con Visa</Text>

      <TextInput
        placeholder="Número de tarjeta"
        style={styles.input}
        keyboardType="numeric"
        value={numero}
        onChangeText={setNumero}
      />

      <TextInput
        placeholder="Fecha MM/AA"
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        placeholder="CVV"
        style={styles.input}
        keyboardType="numeric"
        value={cvv}
        onChangeText={setCvv}
      />

      <TouchableOpacity style={styles.button} onPress={pagar}>
        <Text style={{ color: "white" }}>Confirmar Pago</Text>
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
    backgroundColor: "#1a1f71",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});