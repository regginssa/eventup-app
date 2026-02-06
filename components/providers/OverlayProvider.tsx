import { createContext, useContext, useState } from "react";
import { View } from "react-native";

const OverlayContext = createContext({
  show: (_: any) => {},
  hide: () => {},
});

export const useOverlay = () => useContext(OverlayContext);

const OverlayProvider = ({ children }: any) => {
  const [node, setNode] = useState<null | any>(null);

  const show = (content: any) => setNode(content);
  const hide = () => setNode(null);

  return (
    <OverlayContext.Provider value={{ show, hide }}>
      {children}

      {node && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999999,
            elevation: 999999,
          }}
        >
          {node}
        </View>
      )}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;
