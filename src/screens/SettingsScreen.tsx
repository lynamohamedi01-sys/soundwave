import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, SPACING, FONTS } from '../config/theme';

export default function SettingsScreen() {
  const { wallpaperUri, setWallpaper, loadLibrary, tracks } = usePlayerStore();

  const pickWallpaper = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Autorise l\'accès à tes photos pour changer le fond d\'écran.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setWallpaper(result.assets[0].uri);
    }
  };

  const removeWallpaper = () => {
    setWallpaper(null);
  };

  const refreshLibrary = async () => {
    await loadLibrary();
    Alert.alert('Mis à jour', `${tracks.length} morceaux trouvés`);
  };

  const settingsItems = [
    { icon: 'musical-notes', label: 'Rafraîchir la bibliothèque', desc: `${tracks.length} morceaux actuels`, onPress: refreshLibrary, color: COLORS.primary },
    { icon: 'image', label: 'Changer le fond d\'écran', desc: wallpaperUri ? 'Fond personnalisé actif' : 'Par défaut', onPress: pickWallpaper, color: COLORS.secondary },
    ...(wallpaperUri ? [{ icon: 'trash', label: 'Supprimer le fond d\'écran', desc: 'Revenir au fond par défaut', onPress: removeWallpaper, color: COLORS.error } as const] : []),
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>⚙️ Options</Text>

      {/* Wallpaper Preview */}
      <View style={styles.wallpaperSection}>
        <Text style={styles.sectionLabel}>Fond d'écran actuel</Text>
        {wallpaperUri ? (
          <View style={styles.wallpaperPreview}>
            <View style={styles.wallpaperPlaceholder}>
              <Ionicons name="image" size={40} color={COLORS.secondary} />
              <Text style={styles.wallpaperText}>Fond personnalisé</Text>
            </View>
          </View>
        ) : (
          <View style={styles.wallpaperPreview}>
            <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.wallpaperGradient}>
              <Ionicons name="color-palette" size={40} color={COLORS.textMuted} />
              <Text style={styles.wallpaperText}>Fond par défaut</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Settings Items */}
      <Text style={styles.sectionLabel}>Paramètres</Text>
      {settingsItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.settingItem} onPress={item.onPress} activeOpacity={0.7}>
          <View style={[styles.settingIcon, { backgroundColor: `${item.color}20` }]}>
            <Ionicons name={item.icon as any} size={22} color={item.color} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingDesc}>{item.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      ))}

      {/* About */}
      <Text style={styles.sectionLabel}>À propos</Text>
      <View style={styles.aboutCard}>
        <LinearGradient colors={COLORS.gradient1} style={styles.aboutGradient}>
          <Text style={styles.aboutIcon}>🎵</Text>
          <Text style={styles.aboutTitle}>SoundWave</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDesc}>
            Lecteur MP3 local avec effets audio avancés. {'\n'}
            8D Audio • Slowed • Reverb • Speed Control {'\n'}
            Fait avec ❤️ par Lynaah
          </Text>
        </LinearGradient>
      </View>

      {/* Features */}
      <View style={styles.featuresGrid}>
        {[
          { icon: ' headphones', label: '8D Audio' },
          { icon: '⏱️', label: 'Speed Control' },
          { icon: '🌊', label: 'Reverb' },
          { icon: '🎨', label: 'Wallpapers' },
          { icon: '🔀', label: 'Shuffle' },
          { icon: '🔁', label: 'Repeat' },
        ].map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.xl, paddingBottom: 120 },
  title: { fontSize: FONTS.xxl, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.sm },
  sectionLabel: { color: COLORS.textSecondary, fontSize: FONTS.regular, fontWeight: '600', marginBottom: SPACING.md, marginTop: SPACING.xl },
  wallpaperSection: {},
  wallpaperPreview: { borderRadius: 16, overflow: 'hidden', height: 120 },
  wallpaperPlaceholder: { flex: 1, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  wallpaperGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wallpaperText: { color: COLORS.textSecondary, fontSize: FONTS.regular, marginTop: SPACING.sm },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: 12, padding: SPACING.lg, marginBottom: SPACING.sm,
  },
  settingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingInfo: { flex: 1, marginLeft: SPACING.md },
  settingLabel: { color: COLORS.text, fontSize: FONTS.medium, fontWeight: '500' },
  settingDesc: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  aboutCard: { borderRadius: 16, overflow: 'hidden' },
  aboutGradient: { padding: SPACING.xl, alignItems: 'center' },
  aboutIcon: { fontSize: 48, marginBottom: SPACING.sm },
  aboutTitle: { color: '#FFF', fontSize: FONTS.xl, fontWeight: 'bold' },
  aboutVersion: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  aboutDesc: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.regular, textAlign: 'center', marginTop: SPACING.md, lineHeight: 22 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.lg },
  featureItem: { width: '30%', alignItems: 'center', paddingVertical: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: 12 },
  featureIcon: { fontSize: 24, marginBottom: SPACING.xs },
  featureLabel: { color: COLORS.textSecondary, fontSize: 11 },
});
