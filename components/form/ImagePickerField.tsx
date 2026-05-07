/* 
Usage: 
<ImagePickerField
  photoUri={step1.photoUri}
  promptText={t.addSpot.cameraPromptText}
  onPress={pickImage}
/>
*/

import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';

interface ImagePickerFieldProps {
  photoUri: string | null;
  promptText: string;
  onPress: () => void;
}

export function ImagePickerField({ photoUri, promptText, onPress }: ImagePickerFieldProps) {
  return (
    <TouchableOpacity style={styles.imagePicker} onPress={onPress} activeOpacity={0.8}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.selectedImage} resizeMode="cover" />
      ) : (
        <>
          <Camera size={40} color={Colors.muted} strokeWidth={1.5} />
          <Text style={styles.imagePickerText}>{promptText}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    height: 180,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  imagePickerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
});
