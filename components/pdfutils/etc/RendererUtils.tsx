"use client";

import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Caladea",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/caladea/Caladea-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/caladea/Caladea-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/caladea/Caladea-Italic.ttf",
      fontStyle: "italic", // Ini kunci agar fontStyle: "italic" bekerja
    },
    {
      src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/caladea/Caladea-BoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: "Caladea",
  },
  section: { padding: 10 },
  header: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export const ListKeyValue = ({
  data,
  rightvalue,
}: {
  data: {
    key: string;
    value: string | undefined | null;
    style?: any;
    currency?: boolean;
  }[];
  rightvalue?: boolean;
}) => (
  <View>
    {data.map((d, i) => (
      <View
        key={i}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          ...(d.style && { ...d.style }),
        }}
      >
        <Text style={{ width: 100 }}>{d.key}</Text>
        <Text style={{ width: 10 }}>:</Text>
        {d.currency ? (
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Text style={{ width: 20 }}>Rp. </Text>
            <Text style={{ textAlign: "right" }}>{d.value}</Text>
          </View>
        ) : (
          <Text style={{ flex: 1, ...(rightvalue && { textAlign: "right" }) }}>
            {d.value}
          </Text>
        )}
      </View>
    ))}
  </View>
);

export const ListUnorderMin = ({
  data,
}: {
  data: { value: string | undefined | null; style?: any }[];
}) => (
  <View>
    {data.map((d, i) => (
      <View
        key={i}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          ...(d.style && { ...d.style }),
        }}
      >
        <Text style={{ width: 10 }}>-</Text>
        <Text style={{ flex: 1 }}>{d.value}</Text>
      </View>
    ))}
  </View>
);
