import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore, EffectPreset } from '../store/playerStore';
import { COLORS, SPACING, FONTS } from '../config/theme';

const EFFECTS: { key: EffectPreset; icon: string; label: string; desc: string; color: string[] }[] = [
  { key: 'normal', icon: 'musical-notes', label: 'Normal', desc: 'Lecture standard', color: COLORS.gradient1 },
  { key: '8d', icon: 'globe', label: '8D Audio', desc: 'Effet spatial immersif', color: ['#00D4FF', '#A855F7'] },
  { key: 'slowed', icon: 'hourglass', label: 'Slowed', desc: 'Ralenti & réverbéré', color: ['#667eea', '#764ba2'] },
  { key: 'reverb', icon: 'radio', label: 'Reverb', desc: 'Réverbération ambiante', color: ['#f093fb', '#f5576c'] },
  { key: 'sped_up', icon: 'rocket', label: 'Sped Up', desc: 'Accéléré & boosté', color: ['#FF9F43', '#FF6B6B'] },
  { key: 'deep', icon: 'water', label: 'Deep Voice', desc: 'Voix grave profonde', color: ['#434343', '#000000'] },
  { key: 'chipmunk', icon: 'sparkles', label: 'Chipmunk', desc: 'Voix aiguë rapide', color: ['#a8edea', '#fed6e3'] },
  { key: 'echo', icon: 'repeat', label: 'Echo', desc: 'Effet écho spatial', color: ['#D4AF37', '#FFD700'] },
];

export default function EffectsScreen() {
  const { activeEffect, setEffect, speed, pitch, setSpeed, setPitch, currentTrack } = usePlayerStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🎛️ Effets Audio</Text>
      <Text style={styles.subtitle}>
        {currentTrack ? `Appliqué à: ${currentTrack.title}` : 'Sélectionne un morceau d\'abord'}
      </Text>

      {/* Effect Presets */}
      <Text style={styles.sectionLabel}>Préréglages</Text>
      <View style={styles.effectsGrid}>
        {EFFECTS.map((effect) => {
          const isActive = activeEffect === effect.key;
          return (
            <TouchableOpacity
              key={effect.key}
              style={[styles.effectCard, isActive && styles.effectCardActive]}
              onPress={() => setEffect(effect.key)}
              activeOpacity={0.7}
            >
              <LinearGradient colors={effect.color} style={styles.effectIconBg}>
                <Ionicons name={effect.icon as any} size={24} color="#FFF" />
              </LinearGradient>
              <Text style={[styles.effectLabel, isActive && styles.effectLabelActive]}>{effect.label}</Text>
              <Text style={styles.effectDesc}>{effect.desc}</Text>
              {isActive && (
                <View style={styles.activeIndicator}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Controls */}
      <Text style={styles.sectionLabel}>Contrôle Personnalisé</Text>
      <View style={styles.customSection}>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Vitesse: {speed.toFixed(2)}x</Text>
          <View style={styles.sliderButtons}>
            {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.sliderBtn, Math.abs(speed - s) < 0.01 && styles.sliderBtnActive]}
                onPress={() => setSpeed(s)}
              >
                <Text style={[styles.sliderBtnText, Math.abs(speed - s) < 0.01 && styles.sliderBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Pitch: {pitch.toFixed(2)}</Text>
          <View style={styles.sliderButtons}>
            {[0.5, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.sliderBtn, Math.abs(pitch - p) < 0.01 && styles.sliderBtnActive]}
                onPress={() => setPitch(p)}
              >
                <Text style={[styles.sliderBtnText, Math.abs(pitch - p) < 0.01 && styles.sliderBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Combo Presets */}
      <Text style={styles.sectionLabel}>Combinaisons</Text>
      <View style={styles.combosContainer}>
        <TouchableOpacity style={styles.comboCard} onPress={() => { setSpeed(0.8); setPitch(0.9); }}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.comboGradient}>
            <Text style={styles.comboIcon}>🌙</Text>
            <Text style={styles.comboTitle}>Chill Night</Text>
            <Text style={styles.comboSub}>0.8x • Pitch 0.9</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comboCard} onPress={() => { setSpeed(1.5); setPitch(1.2); }}>
          <LinearGradient colors={['#FF9F43', '#FF6B6B']} style={styles.comboGradient}>
            <Text style={styles.comboIcon}>🔥</Text>
            <Text style={styles.comboTitle}>Workout Mix</Text>
            <Text style={styles.comboSub}>1.5x • Pitch 1.2</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comboCard} onPress={() => { setSpeed(0.65); setPitch(0.75); }}>
          <LinearGradient colors={['#2d3436', '#636e72']} style={styles.comboGradient}>
            <Text style={styles.comboIcon}>🎧</Text>
            <Text style={styles.comboTitle}>Phonk Slowed</Text>
            <Text style={styles.comboSub}>0.65x • Pitch 0.75</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comboCard} onPress={() => { setSpeed(1.8); setPitch(1.4); }}>
          <LinearGradient colors={['#00b894', '#00cec9']} style={styles.comboGradient}>
            <Text style={styles.comboIcon}>⚡</Text>
            <Text style={styles.comboTitle}>Hyper Pop</Text>
            <Text style={styles.comboSub}>1.8x • Pitch 1.4</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.xl, paddingBottom: 120 },
  title: { fontSize: FONTS.xxl, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.sm },
  subtitle: { color: COLORS.textSecondary, fontSize: FONTS.regular, marginBottom: SPACING.xl },
  sectionLabel: { color: COLORS.textSecondary, fontSize: FONTS.regular, fontWeight: '600', marginBottom: SPACING.md, marginTop: SPACING.lg },
  effectsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  effectCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  effectCardActive: { borderColor: COLORS.secondary, backgroundColor: 'rgba(168,85,247,0.1)' },
  effectIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  effectLabel: { color: COLORS.text, fontSize: FONTS.medium, fontWeight: '600' },
  effectLabelActive: { color: COLORS.secondary },
  effectDesc: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  activeIndicator: { position: 'absolute', top: SPACING.md, right: SPACING.md },
  customSection: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg },
  sliderRow: { marginBottom: SPACING.lg },
  sliderLabel: { color: COLORS.text, fontSize: FONTS.regular, fontWeight: '500', marginBottom: SPACING.sm },
  sliderButtons: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  sliderBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: COLORS.surfaceLight, minWidth: 48, alignItems: 'center' },
  sliderBtnActive: { backgroundColor: COLORS.primary },
  sliderBtnText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  sliderBtnTextActive: { color: '#FFF' },
  combosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  comboCard: { width: '48%', borderRadius: 16, overflow: 'hidden', marginBottom: SPACING.sm },
  comboGradient: { padding: SPACING.lg, alignItems: 'center' },
  comboIcon: { fontSize: 28, marginBottom: SPACING.sm },
  comboTitle: { color: '#FFF', fontSize: FONTS.medium, fontWeight: 'bold' },
  comboSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
});
