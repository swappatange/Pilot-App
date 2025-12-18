import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  ScrollView,
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
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
    setApiKeyAvailable(!!apiKey);
    console.log('[LocationPicker] API Key Available:', !!apiKey);
  }, []);

  const fetchPlaceSuggestions = useCallback(async (searchText: string) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!searchText.trim() || !apiKey) {
      setSuggestions([]);
      console.log('[LocationPicker] Clearing - Text:', searchText, 'Key available:', !!apiKey);
      return;
    }

    setLoading(true);
    console.log('[LocationPicker] Fetching suggestions for:', searchText);
    
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchText)}&key=${apiKey}&components=country:in`;
      console.log('[LocationPicker] Calling API...');
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('[LocationPicker] API Response:', data.status, data.predictions?.length);

      if (data.predictions && data.predictions.length > 0) {
        const suggestionsWithCoords = await Promise.all(
          data.predictions.slice(0, 5).map(async (prediction: any) => {
            try {
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${apiKey}&fields=geometry`;
              const placeDetailsResponse = await fetch(detailsUrl);
              const placeDetails = await placeDetailsResponse.json();

              const lat = placeDetails.result?.geometry?.location?.lat || 0;
              const lng = placeDetails.result?.geometry?.location?.lng || 0;
              
              console.log('[LocationPicker] Got coords:', prediction.description, lat, lng);

              return {
                place_id: prediction.place_id,
                description: prediction.description,
                latitude: lat,
                longitude: lng,
              };
            } catch (err) {
              console.log('[LocationPicker] Error getting details:', err);
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
        console.log('[LocationPicker] No predictions found');
      }
    } catch (error) {
      console.error('[LocationPicker] Fetch error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (text.trim().length > 0) {
      setShowSuggestions(true);
      debounceTimer.current = setTimeout(() => {
        fetchPlaceSuggestions(text);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    console.log('[LocationPicker] Selected:', suggestion);
    setInput(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    onSelect({
      address: suggestion.description,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
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
          onBlur={handleBlur}
          editable={apiKeyAvailable}
          autoCapitalize="none"
          autoCorrect={false}
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
          <ScrollView scrollEnabled={suggestions.length > 3} nestedScrollEnabled={true}>
            {suggestions.map((item, index) => (
              <Pressable
                key={item.place_id}
                style={[
                  styles.suggestionItem,
                  {
                    borderBottomColor: theme.border,
                    borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
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
            ))}
          </ScrollView>
        </View>
      )}

      {!apiKeyAvailable && (
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
    zIndex: 1000,
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
    minHeight: 40,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    maxHeight: 250,
    overflow: 'hidden',
    marginTop: -1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
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
