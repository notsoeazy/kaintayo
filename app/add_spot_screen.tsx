import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Region, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ChevronLeft, MapPin, Map as MapIcon, Check } from 'lucide-react-native';
import { Colors, Spacing } from '@/styles/theme';
import { styles } from '@/styles/screens/add_spot_screen.styles';
import { uploadImageToFirebase } from '@/lib/firebase_storage_service';
import { addPlace } from '@/lib/firestore_service';
import { useFeedStore } from '@/store/feed_store';
import { useAuthStore } from '@/store/auth_store';
import { useTranslation } from '@/hooks/useTranslation';
import { SuccessFeedbackModal } from '@/components/SuccessFeedbackModal';
import { FormField } from '@/components/form/FormField';
import { AppTextInput } from '@/components/form/AppTextInput';
import { PriceRangeInput } from '@/components/form/PriceRangeInput';
import { CategoryPicker } from '@/components/form/CategoryPicker';
import { ImagePickerField } from '@/components/form/ImagePickerField';
import type { FoodCategory } from '@/types';

// NAGA CITY, CAMARINES SUR
const NAGA_REGION = {
  latitude: 13.6218,
  longitude: 123.1948,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface FormStep1 {
  name: string;
  description: string;
  categories: FoodCategory[];
  priceMin: string;
  priceMax: string;
  photoUri: string | null;
}

interface FormStep2 {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

export default function AddSpotScreen() {
  const { user } = useAuthStore();
  const { fetchPlaces } = useFeedStore();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [step1, setStep1] = useState<FormStep1>({
    name: '',
    description: '',
    categories: [],
    priceMin: '',
    priceMax: '',
    photoUri: null,
  });

  const [step2, setStep2] = useState<FormStep2>({
    latitude: null,
    longitude: null,
    address: '',
  });

  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  // GET LOCATION
  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      const location = await Location.getCurrentPositionAsync({});
      setStep2((s) => ({
        ...s,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    } catch (err) {
      console.log('Error getting location:', err);
    }
  };

  // Trigger location request when entering Step 2
  React.useEffect(() => {
    if (step === 2 && step2.latitude === null) {
      requestLocation();
    }
  }, [step]);

  // IMAGE PICKER
  const pickImage = () => {
    Alert.alert(
      t.addSpot.imagePickerTitle,
      t.addSpot.imagePickerMessage,
      [
        { text: t.addSpot.cameraOption, onPress: launchCamera },
        { text: t.addSpot.galleryOption, onPress: launchGallery },
        { text: t.addSpot.imagePickerCancel, style: 'cancel' },
      ]
    );
  };

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.addSpot.permissionDenied, t.addSpot.cameraPermissionMsg);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setStep1((s) => ({ ...s, photoUri: result.assets[0].uri }));
    }
  };

  const launchGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.addSpot.permissionDenied, t.addSpot.galleryPermissionMsg);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setStep1((s) => ({ ...s, photoUri: result.assets[0].uri }));
    }
  };

  // CATEGORY TOGGLE
  const toggleCategory = (id: FoodCategory) => {
    setStep1((s) => ({
      ...s,
      categories: s.categories.includes(id)
        ? s.categories.filter((c) => c !== id)
        : [...s.categories, id],
    }));
  };

  // VALIDATION for step 1
  const isStep1Valid =
    step1.name.trim().length > 0 &&
    step1.categories.length > 0 &&
    step1.priceMin.length > 0 &&
    step1.priceMax.length > 0 &&
    Number(step1.priceMin) > 0 &&
    Number(step1.priceMax) >= Number(step1.priceMin);

  // CENTER MARKER
  const onRegionChangeComplete = (region: Region) => {
    setStep2((s) => ({ ...s, latitude: region.latitude, longitude: region.longitude }));
  };

  // UPLOAD IMAGE
  const uploadPhoto = async (uri: string, uid: string): Promise<string> => {
    return uploadImageToFirebase(uri, uid);
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!user) {
      setError(t.addSpot.loginRequired);
      return;
    }
    if (step2.latitude === null || step2.longitude === null) {
      setError(t.addSpot.tapMapError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let photoUrl: string | undefined;
      if (step1.photoUri) {
        try {
          photoUrl = await uploadPhoto(step1.photoUri, user.uid);
        } catch (uploadErr) {
          // Continue without photo
          console.error('[AddSpot] Image upload failed:', uploadErr);
        }
      }

      await addPlace({
        name: step1.name.trim(),
        description: step1.description.trim(),
        categories: step1.categories,
        priceMin: Number(step1.priceMin),
        priceMax: Number(step1.priceMax),
        latitude: step2.latitude,
        longitude: step2.longitude,
        googleMapsUrl: `https://maps.google.com/?q=${step2.latitude},${step2.longitude}`,
        address: step2.address.trim(),
        photoUrl,
        createdBy: user.uid,
        isSeeded: false,
      });

      await fetchPlaces();
      setIsSuccessVisible(true);
    } catch (err) {
      console.error('[AddSpot] Submit failed:', err);
      setError(t.addSpot.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (step === 2 ? setStep(1) : router.back())}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 1 ? t.addSpot.title : t.addSpot.locationStepTitle}
        </Text>
        <Text style={styles.stepIndicator}>{step}/2</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {step === 1 ? (
          // STEP 1 — DETAILS
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ImagePickerField
              photoUri={step1.photoUri}
              promptText={t.addSpot.cameraPromptText}
              onPress={pickImage}
            />

            <FormField label={t.addSpot.placeNameLabel}>
              <AppTextInput
                placeholder={t.addSpot.placeNameHint}
                value={step1.name}
                onChangeText={(v) => setStep1((s) => ({ ...s, name: v }))}
                maxLength={80}
              />
            </FormField>

            <FormField label={t.addSpot.descriptionLabel}>
              <AppTextInput
                placeholder={t.addSpot.descriptionHint}
                value={step1.description}
                onChangeText={(v) => setStep1((s) => ({ ...s, description: v }))}
                multiline
                maxLength={120}
              />
            </FormField>

            <FormField
              label={`${t.addSpot.foodCategoryLabel} ${t.addSpot.foodCategoryHint}`}
            >
              <CategoryPicker
                selected={step1.categories}
                onToggle={toggleCategory}
              />
            </FormField>

            <FormField label={t.addSpot.priceRangeLabel}>
              <PriceRangeInput
                minLabel={t.addSpot.priceMinLabel}
                maxLabel={t.addSpot.priceMaxLabel}
                minValue={step1.priceMin}
                maxValue={step1.priceMax}
                onMinChange={(v) => setStep1((s) => ({ ...s, priceMin: v }))}
                onMaxChange={(v) => setStep1((s) => ({ ...s, priceMax: v }))}
              />
            </FormField>
          </ScrollView>
        ) : (
          // STEP 2 — LOCATION
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <FormField label={t.addSpot.locationStepTitle}>
              <Text style={styles.mapHint}>{t.addSpot.mapInstruction}</Text>

              {/* LOCATION PREVIEW CARD */}
              <TouchableOpacity
                style={[
                  styles.locationCard,
                  step2.latitude !== null && styles.locationCardPinned,
                ]}
                activeOpacity={0.8}
                onPress={() => setIsMapModalVisible(true)}
              >
                <View style={styles.locationCardInner}>
                  <MapPin
                    size={28}
                    color={step2.latitude !== null ? Colors.secondary : Colors.muted}
                    strokeWidth={1.5}
                  />
                  {step2.latitude !== null ? (
                    <Text style={styles.locationCardCoords}>
                      {step2.latitude.toFixed(5)}, {step2.longitude!.toFixed(5)}
                    </Text>
                  ) : (
                    <Text style={styles.locationCardText}>
                      {t.addSpot.noPinnedLocation}
                    </Text>
                  )}
                  <View style={styles.openMapButton}>
                    <MapIcon size={16} color={Colors.text} />
                    <Text style={styles.openMapButtonText}>{t.addSpot.openMapButton}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </FormField>

            <FormField label={t.addSpot.addressLabel}>
              <AppTextInput
                placeholder={t.addSpot.addressHint}
                value={step2.address}
                onChangeText={(v) => setStep2((s) => ({ ...s, address: v }))}
                maxLength={120}
              />
            </FormField>
          </ScrollView>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {step === 1 ? (
            <TouchableOpacity
              style={[styles.nextButton, !isStep1Valid && styles.disabledButton]}
              onPress={() => isStep1Valid && setStep(2)}
              disabled={!isStep1Valid}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>{t.addSpot.nextButton}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.submitButtonText}>{t.addSpot.submitButton}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* FULL SCREEN MAP MODAL */}
      <Modal
        visible={isMapModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsMapModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: Colors.bg }}>
          {/* SAFE AREA HEADER */}
          <View style={[styles.modalHeader, { paddingTop: insets.top + Spacing.sm }]}>
            <TouchableOpacity
              onPress={() => setIsMapModalVisible(false)}
              style={{ padding: Spacing.sm }}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t.addSpot.locationStepTitle}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* MAP WITH CENTER MARKER */}
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={
                step2.latitude
                  ? {
                      latitude: step2.latitude,
                      longitude: step2.longitude!,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }
                  : NAGA_REGION
              }
              onRegionChangeComplete={onRegionChangeComplete}
              showsUserLocation={true}
              showsMyLocationButton={true}
            />

            {/* FIXED CENTER PIN OVERLAY */}
            <View pointerEvents="none" style={styles.centerPinOverlay}>
              <MapPin size={40} color={Colors.secondary} strokeWidth={2} />
              <View style={styles.centerPinDot} />
            </View>
          </View>

          {/* FOOTER WITH HINT + CONFIRM */}
          <View style={[styles.modalFooter, { paddingBottom: insets.bottom + Spacing.md }]}>
            <Text style={styles.modalFooterHint}>{t.addSpot.dragMapHint}</Text>
            <TouchableOpacity
              style={[styles.submitButton, { flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
              onPress={() => setIsMapModalVisible(false)}
              activeOpacity={0.8}
            >
              <Check size={20} color={Colors.surface} />
              <Text style={styles.submitButtonText}>{t.addSpot.confirmButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS FEEDBACK MODAL */}
      <SuccessFeedbackModal
        visible={isSuccessVisible}
        title={t.addSpot.thanksTitle}
        message={t.addSpot.thanksMessage}
        buttonLabel={t.addSpot.okButton}
        onClose={() => {
          setIsSuccessVisible(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
