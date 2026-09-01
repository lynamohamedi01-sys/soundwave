import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, SPACING, FONTS } from '../config/theme';

export default function PlayerScreen() {
  const {
    currentTrack, isPlaying, position, duration, volume, speed,
    activeEffect, isShuffle, repeatMode,
    togglePlayPause, seekTo, setVolume, nextTrack, prevTrack,
    toggleShuffle, cycleRepeat, setEffect,
  } = usePlayerStore();

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-note-outline" size={80} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Aucun morceau en lecture</Text>
        <Text style={styles.emptySubtext}>Sélectionne un morceau depuis la bibliothèque</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Album Art Placeholder */}
      <View style={styles.artContainer}>
        <LinearGradient colors={COLORS.gradient1} style={styles.art}>
          <Ionicons name="musical-notes" size={80} color="rgba(255,255,255,0.8)" />
        </LinearGradient>
      </View>

      {/* Track Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.trackArtist}>{currentTrack.artist || 'Unknown'}</Text>
        {activeEffect !== 'normal' && (
          <View style={styles.effectBadge}>
            <Text style={styles.effectBadgeText}>⚡ {activeEffect.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient colors={COLORS.gradient1} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.controlBtn}>
          <Ionicons name={isShuffle ? 'shuffle' : 'shuffle-outline'} size={22} color={isShuffle ? COLORS.primary : COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity onPress={prevTrack} style={styles.controlBtn}>
          <Ionicons name="play-skip-back" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn} activeOpacity={0.7}>
          <LinearGradient colors={COLORS.gradient1} style={styles.playBtnGradient}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextTrack} style={styles.controlBtn}>
          <Ionicons name="play-skip-forward" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={cycleRepeat} style={styles.controlBtn}>
          <Ionicons
            name={repeatMode === 'off' ? 'repeat-outline' : repeatMode === 'one' ? 'repeat' : 'repeat'}
            size={22}
            color={repeatMode !== 'off' ? COLORS.primary : COLORS.textMuted}
          />
          {repeatMode === 'one' && <Text style={styles.repeatOne}>1</Text>}
        </TouchableOpacity>
      </View>

      {/* Volume */}
      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={18} color={COLORS.textMuted} />
        <View style={styles.volumeBar}>
          <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
        </View>
        <Ionicons name="volume-high" size={18} color={COLORS.textMuted} />
      </View>

      {/* Speed Control */}
      <View style={styles.speedContainer}>
        <Text style={styles.speedLabel}>Vitesse</Text>
        <View style={styles.speedButtons}>
          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.speedBtn, speed === s && styles.speedBtnActive]}
              onPress={() => usePlayerStore.getState().setSpeed(s)}
            >
              <Text style={[styles.speedBtnText, speed === s && styles.speedBtnTextActive]}>{s}x</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Effects */}
      <View style={styles.effectsRow}>
        {(['normal', '8d', 'slowed', 'reverb', 'sped_up', 'deep', 'chipmunk', 'echo'] as const).map((e) => (
          <TouchableOpacity
            key={e}
            style={[styles.quickEffectBtn, activeEffect === e && styles.quickEffectActive]}
            onPress={() => setEffect(e)}
          >
            <Text style={[styles.quickEffectText, activeEffect === e && styles.quickEffectTextActive]}>
              {e === 'normal' ? 'Normal' : e === '8d' ? '8D' : e === 'slowed' ? 'Slowed' : e === 'reverb' ? 'Reverb' : e === 'sped_up' ? 'Fast' : e === 'deep' ? 'Deep' : e === 'chipmunk' ? 'High' : 'Echo'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.large, marginTop: SPACING.lg },
  emptySubtext: { color: COLORS.textMuted, fontSize: FONTS.regular, marginTop: SPACING.sm },
  artContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  art: { width: 200, height: 200, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  infoContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  trackTitle: { color: COLORS.text, fontSize: FONTS.xl, fontWeight: 'bold' },
  trackArtist: { color: COLORS.textSecondary, fontSize: FONTS.regular, marginTop: SPACING.xs },
  effectBadge: { marginTop: SPACING.sm, backgroundColor: 'rgba(255,107,107,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  effectBadgeText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  progressContainer: { marginBottom: SPACING.lg },
  progressBar: { height: 4, backgroundColor: COLORS.surfaceLight, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xs },
  timeText: { color: COLORS.textMuted, fontSize: 12 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xl, marginBottom: SPACING.xl },
  controlBtn: { padding: SPACING.sm },
  playBtn: { width: 64, height: 64, borderRadius: 32 },
  playBtnGradient: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  repeatOne: { position: 'absolute', top: 2, right: 4, color: COLORS.primary, fontSize: 8, fontWeight: 'bold' },
  volumeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg, gap: SPACING.sm },
  volumeBar: { flex: 1, height: 4, backgroundColor: COLORS.surfaceLight, borderRadius: 2, overflow: 'hidden' },
  volumeFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  speedContainer: { marginBottom: SPACING.lg },
  speedLabel: { color: COLORS.textSecondary, fontSize: FONTS.regular, marginBottom: SPACING.sm },
  speedButtons: { flexDirection: 'row', gap: SPACING.sm },
  speedBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.surface },
  speedBtnActive: { backgroundColor: COLORS.primary },
  speedBtnText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  speedBtnTextActive: { color: '#FFF' },
  effectsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  quickEffectBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  quickEffectActive: { backgroundColor: 'rgba(168,85,247,0.2)', borderColor: COLORS.secondary },
  quickEffectText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' },
  quickEffectTextActive: { color: COLORS.secondary },
});
