import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface LocationSuggestion {
  place_id: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value: string;
  onSelect: (location: { address: string; latitude: number; longitude: number }) => void;
  placeholder?: string;
}

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onSelect,
  placeholder = 'Search location...',
}) => {
  const { theme } = useTheme();
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchPlaceSuggestions = useCallback(async (searchText: string) => {
    if (!searchText.trim() || !GOOGLE_PLACES_API_KEY) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchText)}&key=${GOOGLE_PLACES_API_KEY}&components=country:in`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();

      if (data.predictions && data.predictions.length > 0) {
        const suggestionsWithCoords = await Promise.all(
          data.predictions.map(async (prediction: any) => {
            try {
              const placeDetailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${GOOGLE_PLACES_API_KEY}&fields=geometry`
              );
              const placeDetails = await placeDetailsResponse.json();

              return {
                place_id: prediction.place_id,
                description: prediction.description,
                latitude: placeDetails.result?.geometry?.location?.lat || 0,
                longitude: placeDetails.result?.geometry?.location?.lng || 0,
              };
            } catch {
              return {
                place_id: prediction.place_id,
                description: prediction.description,
                latitude: 0,
                longitude: 0,
              };
            }
          })
        );

        setSuggestions(suggestionsWithCoords);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    setShowSuggestions(true);
    fetchPlaceSuggestions(text);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setInput(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    onSelect({
      address: suggestion.description,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: theme.border,
            backgroundColor: theme.backgroundSecondary,
          },
        ]}
      >
        <Feather name="map-pin" size={18} color={BrandColors.primary} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={handleInputChange}
          editable={!!GOOGLE_PLACES_API_KEY}
        />
        {loading && <ActivityIndicator size="small" color={BrandColors.primary} />}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View
          style={[
            styles.suggestionsContainer,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.suggestionItem,
                  {
                    borderBottomColor: theme.border,
                  },
                ]}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Feather name="map-pin" size={14} color={BrandColors.primary} />
                <View style={styles.suggestionText}>
                  <ThemedText style={styles.suggestionMain}>
                    {item.description.split(',')[0]}
                  </ThemedText>
                  <ThemedText style={[styles.suggestionSecondary, { color: theme.textSecondary }]}>
                    {item.description.split(',').slice(1).join(',')}
                  </ThemedText>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}

      {!GOOGLE_PLACES_API_KEY && (
        <ThemedText style={[styles.warningText, { color: BrandColors.danger }]}>
          Google Places API key not configured
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    ...Typography.body,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    maxHeight: 300,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionMain: {
    ...Typography.body,
    fontWeight: '500',
  },
  suggestionSecondary: {
    ...Typography.small,
  },
  warningText: {
    ...Typography.small,
    marginTop: Spacing.sm,
  },
});
