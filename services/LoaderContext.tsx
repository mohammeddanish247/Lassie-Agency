import AnimatedLottieView from 'lottie-react-native';
import React, { createContext, memo, PropsWithChildren, useContext, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

// Define the shape of the context
type ResponseContextProps = {
  showSuccess: (text?: string) => void;
  showLoading: (value: boolean) => void;
};

type SuccessState = { show: boolean; text: string };

const ResponseContext = createContext<ResponseContextProps | null>(null);

// ResponseProvider component
export default function ResponseProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<SuccessState>({ show: false, text: "" });

  // Function to show success overlay
  const showSuccess = (text?: string) => {
    setSuccess({ show: true, text: text || "" });
  };

  // Function to hide success overlay
  const onHideSuccess = () => {
    setSuccess({ show: false, text: "" });
  };

  // Function to toggle loading state
  const showLoading = (value: boolean) => {
    setLoading(value);
  };

  return (
    <ResponseContext.Provider value={{ showSuccess, showLoading }}>
      {children}
      <LoadingProvider loading={loading} />
      <SuccessProvider success={success} onHide={onHideSuccess} />
    </ResponseContext.Provider>
  );
}

// SuccessProvider for showing success animations
const SuccessProvider = memo(({ success, onHide }: { success: SuccessState; onHide: () => void }) => {
  if (!success.show) return null;

  return (
    <>
      {/* Background overlay */}
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          opacity: 0.95,
          backgroundColor: "#5A5A5A",
        }}
      />
      {/* Success content */}
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          flex: 1,
          marginHorizontal: 10,
          marginVertical: 50,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedLottieView
            loop={false}
            autoPlay
            style={{
              height: 150,
              width: 150,
              marginBottom: 10,
            }}
            source={require("../assets/animations/successCheckmark.json")}
          />
          <Text style={{ fontSize: 25, color: "white", marginBottom: 10, fontWeight: "800" }}>
            Success
          </Text>
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 20,
              textAlign: "center",
            }}
          >
            {success.text}
          </Text>
        </View>

        <Pressable
          onPress={onHide}
          style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}
        >
          <Text
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </>
  );
});

SuccessProvider.displayName = 'SuccessProvider';

// LoadingProvider for showing loading indicator
const LoadingProvider = memo(({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <>
      {/* Background overlay */}
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          opacity: 0.70,
          backgroundColor: "#000",
        }}
      />
      {/* Loading content */}
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          marginHorizontal: 10,
          marginVertical: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            paddingHorizontal: 70,
            padding: 30,
            paddingTop: 25,
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="black" />
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Loading...</Text>
        </View>
      </View>
    </>
  );
});

LoadingProvider.displayName = 'LoadingProvider';

// Hook to use the context
export function useLoader() {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error("useLoader must be used within a ResponseProvider");
  }
  return context;
}