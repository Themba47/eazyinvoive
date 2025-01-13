import React from "react";
import {
  Button,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

const ReusableModalPicker = ({
  visible,
  onClose,
  options,
  onSelect,
  title,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent]}>
          <Text style={styles.modalTitle}>
				{title} 
				<Button title="X" onPress={() => {onClose();}} />
			</Text>
          <FlatList
            nestedScrollEnabled={true}
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[styles.optionText]}>{item.label || item.job_name || item.client_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
	 marginTop: 50, // Adds margin from the top, adjust as needed
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
  },
});

export default ReusableModalPicker;
