import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const OrderCreationScreen = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id
  console.log('User ID:', userId);
  const navigation = useNavigation();
  const route = useRoute();
  const { stationaryId } = route.params || {};

  if (!stationaryId) {
    Alert.alert('Error', 'No stationary selected. Please try again.');
    navigation.goBack();
  }

  console.log('Navigated to CreateOrder with stationaryId:', stationaryId);

  const [document, setDocument] = useState(null);
  const [preferences, setPreferences] = useState({
    size: null,
    color: null,
    numberofCopies: '',
    sides: null,
    urgency: null,
  });
  const [notes, setNotes] = useState('');
  const [dropdownStates, setDropdownStates] = useState({
    sizeOpen: false,
    colorOpen: false,
    sidesOpen: false,
    urgencyOpen: false,
  });

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
  
      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'No document selected.');
        return;
      }
  
      const selectedDocument = result.assets[0];
      console.log('Selected document:', selectedDocument);
  
      const formData = new FormData();
      formData.append('file', {
        uri: selectedDocument.uri,
        type: 'application/pdf',
        name: selectedDocument.name || 'document.pdf'
      });
  
      console.log('Uploading document...');
      const uploadResponse = await axios.post(
        'http://10.0.2.2:5000/api/uploads/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data, headers) => {
            return data; // Don't transform the data
          },
        }
      );
  
      console.log('Upload response:', uploadResponse.data);
      setDocument({ uri: uploadResponse.data.fileUrl, name: selectedDocument.name });
      Alert.alert('Success', 'Document uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };    

  const handleSubmitOrder = async () => {

    console.log('Submitting order with data', {
      userId,
      stationaryId,
      document,
      documents: document.uri,
      preferences,
      notes,
    })

    if (!userId || !document || !document.uri || !preferences.size || !preferences.color || !preferences.numberofCopies || !preferences.sides || !preferences.urgency) {
      Alert.alert('Error', 'Please fill all required fields and upload a document.');
      return;
    }
  
    const orderPayload = {
      userId,
      stationaryId,
      documents: [document.uri], // S3 URL
      notes,
      preferences: {
        size: preferences.size,
        color: preferences.color.toLowerCase(),
        numberofCopies: Number(preferences.numberofCopies),
        sides: preferences.sides.toLowerCase(),
        urgency: preferences.urgency.toLowerCase(),
      },
    };
  
    console.log('Submitting order payload:', orderPayload);
  
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/orders', orderPayload);
      Alert.alert('Success', 'Order created successfully!');
      console.log('Order Response:', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order. Please try again later.');
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Order</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentUpload}>
        <Text style={styles.uploadText}>
          {document ? 'Document Selected' : 'Upload Document'}
        </Text>
      </TouchableOpacity>

      <DropDownPicker
        open={dropdownStates.sizeOpen}
        value={preferences.size}
        items={[
          { label: 'A4', value: 'A4' },
          { label: 'A3', value: 'A3' },
        ]}
        setOpen={(open) => setDropdownStates({ ...dropdownStates, sizeOpen: open })}
        setValue={(callback) =>
          setPreferences((prev) => ({ ...prev, size: callback(prev.size) }))
        }
        placeholder="Select Size"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex= {5}
      />

      <DropDownPicker
        open={dropdownStates.colorOpen}
        value={preferences.color}
        items={[
          { label: 'Color', value: 'color' },
          { label: 'Black & White', value: 'b&w' },
        ]}
        setOpen={(open) => setDropdownStates({ ...dropdownStates, colorOpen: open })}
        setValue={(callback) =>
          setPreferences((prev) => ({ ...prev, color: callback(prev.color) }))
        }
        placeholder="Select Color"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={4}
      />

      <DropDownPicker
        open={dropdownStates.sidesOpen}
        value={preferences.sides}
        items={[
          { label: 'Single', value: 'single' },
          { label: 'Double', value: 'double' },
        ]}
        setOpen={(open) => setDropdownStates({ ...dropdownStates, sidesOpen: open })}
        setValue={(callback) =>
          setPreferences((prev) => ({ ...prev, sides: callback(prev.sides) }))
        }
        placeholder="Select Sides"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3}
      />

      <DropDownPicker
        open={dropdownStates.urgencyOpen}
        value={preferences.urgency}
        items={[
          { label: 'Normal', value: 'normal' },
          { label: 'Urgent', value: 'urgent' },
        ]}
        setOpen={(open) => setDropdownStates({ ...dropdownStates, urgencyOpen: open })}
        setValue={(callback) =>
          setPreferences((prev) => ({ ...prev, urgency: callback(prev.urgency) }))
        }
        placeholder="Select Urgency"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2}
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Copies"
        keyboardType="numeric"
        value={preferences.numberofCopies}
        onChangeText={(text) => setPreferences({ ...preferences, numberofCopies: text })}
        zIndex={1}
      />

      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Additional Notes (Optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
        <Text style={styles.submitText}>Submit Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  notes: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#34A853',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderCreationScreen;
