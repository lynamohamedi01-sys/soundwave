import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore, Track } from '../store/playerStore';
import { COLORS, SPACING, FONTS } from '../config/theme';
import PlayerScreen from './PlayerScreen';
import SettingsScreen from './SettingsScreen';
import EffectsScreen from './EffectsScreen';

type Tab = 'library' | 'player' | 'effects' | 'settings';

export default function HomeScreen() {
  const [tab, setTab] = useState<Tab>('library');
  const { tracks, currentTrack, loadLibrary, wallpaperUri, playTrack, isPlaying } = usePlayerStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLibrary();
  }, []);

  const filtered = tracks.filter(
    (t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.filename.toLowerCase().includes(search.toLowerCase()),
  );

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const renderTrack = ({ item }: { item: Track }) => {
    const isActive = currentTrack?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.trackItem, isActive && styles.trackActive]}
        onPress={() => playTrack(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isActive ? COLORS.gradient1 : ['transparent', 'transparent']}
          style={styles.trackGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.trackIcon}>
            <Ionicons
              name={isActive && isPlaying ? 'musical-notes' : 'musical-note'}
              size={20}
              color={isActive ? '#FFF' : COLORS.primary}
            />
          </View>
          <View style={styles.trackInfo}>
            <Text style={[styles.trackTitle, isActive && styles.trackTitleActive]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.trackMeta} numberOfLines={1}>
              {formatTime(item.duration * 1000)}
            </Text>
          </View>
          {isActive && (
            <Ionicons name="play" size={16} color="#FFF" style={{ marginRight: SPACING.md }} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={wallpaperUri ? { uri: wallpaperUri } : undefined}
      style={styles.container}
      blurRadius={20}
    >
      <LinearGradient colors={['rgba(13,13,26,0.95)', 'rgba(13,13,26,0.85)']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={{ color: COLORS.primary }}>♪</Text> SoundWave
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {tab === 'library' && (
            <>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher..."
                  placeholderTextColor={COLORS.textMuted}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.sectionTitle}>
                {tracks.length} morceaux trouvés
              </Text>
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={renderTrack}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="musical-notes-outline" size={60} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>Aucun morceau trouvé</Text>
                    <Text style={styles.emptySubtext}>Ouvre SoundWave pour scanner ta bibliothèque</Text>
                  </View>
                }
              />
            </>
          )}

          {tab === 'player' && <PlayerScreen />}
          {tab === 'effects' && <EffectsScreen />}
          {tab === 'settings' && <SettingsScreen />}
        </View>

        {/* Mini Player */}
        {currentTrack && tab !== 'player' && (
          <TouchableOpacity style={styles.miniPlayer} onPress={() => setTab('player')} activeOpacity={0.8}>
            <LinearGradient colors={COLORS.gradient1} style={styles.miniPlayerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#FFF" />
              <View style={styles.miniPlayerInfo}>
                <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentTrack.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {([
            { key: 'library', icon: 'library', label: 'Biblio' },
            { key: 'player', icon: 'play-circle', label: 'Lecteur' },
            { key: 'effects', icon: 'flash', label: 'Effets' },
            { key: 'settings', icon: 'settings', label: 'Options' },
          ] as const).map((t) => (
            <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
              <Ionicons
                name={tab === t.key ? (t.icon as any) : `${t.icon}-outline` as any}
                size={22}
                color={tab === t.key ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md },
  logo: { fontSize: FONTS.xxl, fontWeight: 'bold', color: COLORS.text },
  content: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  searchInput: { flex: 1, color: COLORS.text, marginLeft: SPACING.sm, fontSize: FONTS.regular },
  sectionTitle: { color: COLORS.textSecondary, fontSize: FONTS.regular, marginHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: 120 },
  trackItem: { borderRadius: 12, marginBottom: SPACING.sm, overflow: 'hidden' },
  trackActive: { borderRadius: 12 },
  trackGradient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: SPACING.md },
  trackIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,107,107,0.15)', justifyContent: 'center', alignItems: 'center' },
  trackInfo: { flex: 1, marginLeft: SPACING.md },
  trackTitle: { color: COLORS.text, fontSize: FONTS.medium, fontWeight: '500' },
  trackTitleActive: { color: '#FFF' },
  trackMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.large, marginTop: SPACING.lg },
  emptySubtext: { color: COLORS.textMuted, fontSize: FONTS.regular, marginTop: SPACING.sm },
  miniPlayer: { position: 'absolute', bottom: 80, left: SPACING.lg, right: SPACING.lg, borderRadius: 16, overflow: 'hidden' },
  miniPlayerGradient: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  miniPlayerInfo: { flex: 1 },
  miniPlayerTitle: { color: '#FFF', fontSize: FONTS.regular, fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingBottom: 20,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { fontSize: 10, color: COLORS.textMuted },
  tabLabelActive: { color: COLORS.primary },
});
