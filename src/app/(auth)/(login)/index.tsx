import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import TextBold from "@/src/styles/TextBold";
import { authService } from "@/src/api";
import useLoginDataStorage from "@/src/hooks/customStorageHook";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "expo-router";

interface ApiError {
  message: string;
  status: number;
}

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { storeLoginData, loginData } = useLoginDataStorage();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (loginData) {
      router.push("/(main)/(home)");
    }
  }, [loginData]);
 
  const handleLogin = async () => {
    setLoading(true);
    setError('');
  
    // Validate phone number (basic validation)
    const phoneRegex = /^\d{10}$/;
  
    if (!phone || !password) {
      setError('Phone number and password are required');
      showToast('error', 'Please enter both phone number and password');
      setLoading(false);
      return;
    }
  
    if (!phoneRegex.test(phone)) {
      setError('Invalid phone number format');
      showToast('error', 'Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }
  
    try {
      // Call the authService login method
      const response = await authService.login(phone, password);
      
      if (response.success && response.data) {
        // Create a loginData object with the received driver data
        const LoginData = {
          id: response.data.driver.id.toString(),
          name: response.data.driver.name,
          phone: response.data.driver.mobileNo,
          token: response.data.access_token
        };
        
        await storeLoginData(LoginData);
        showToast('success', 'Login successful');
        router.push("/(main)/(home)");
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.log(error,"error")
      const apiError = error as ApiError;
      setError(apiError.message || 'Login failed');
      showToast('error', apiError.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {loginData ? (
          <TextBold style={styles.heading}>Hi, {loginData.name?.split(' ')[0]}!</TextBold>
        ) : (
          <TextBold style={styles.heading}>Log in</TextBold>
        )}

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor="#aaa"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginText}>Log In</Text>
          )}
        </TouchableOpacity>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color:'#3461FD',
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: "#007BFF",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#95c3ff",
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  signupLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default Login;