import { create } from 'zustand';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

export interface Track {
  id: string;
  uri: string;
  title: string;
  artist: string;
  duration: number;
  filename: string;
}

export type EffectPreset = 'normal' | '8d' | 'slowed' | 'reverb' | 'sped_up' | 'deep' | 'chipmunk' | 'echo';

interface PlayerState {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  speed: number;
  pitch: number;
  activeEffect: EffectPreset;
  isShuffle: boolean;
  repeatMode: 'off' | 'one' | 'all';
  sound: Audio.Sound | null;
  wallpaperUri: string | null;
  isLoading: boolean;

  loadLibrary: () => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (vol: number) => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  setPitch: (pitch: number) => Promise<void>;
  setEffect: (effect: EffectPreset) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setWallpaper: (uri: string | null) => void;
}

const EFFECT_PRESETS: Record<EffectPreset, { rate: number; pitch: number }> = {
  normal:    { rate: 1.0,  pitch: 1.0 },
  '8d':      { rate: 1.0,  pitch: 0.95 },
  slowed:    { rate: 0.75, pitch: 0.85 },
  reverb:    { rate: 0.92, pitch: 0.9 },
  sped_up:   { rate: 1.4,  pitch: 1.15 },
  deep:      { rate: 0.85, pitch: 0.7 },
  chipmunk:  { rate: 1.3,  pitch: 1.4 },
  echo:      { rate: 0.95, pitch: 0.95 },
};

async function loadAudioPermissions(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

async function getAllTracks(): Promise<Track[]> {
  const hasPermission = await loadAudioPermissions();
  if (!hasPermission) return [];

  const media = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.audio,
    first: 500,
  });

  return media.assets.map((asset) => ({
    id: asset.id,
    uri: asset.uri,
    title: asset.filename.replace(/\.[^.]+$/, ''),
    artist: 'Unknown',
    duration: asset.duration,
    filename: asset.filename,
  }));
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  tracks: [],
  currentTrack: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  volume: 1.0,
  speed: 1.0,
  pitch: 1.0,
  activeEffect: 'normal',
  isShuffle: false,
  repeatMode: 'off',
  sound: null,
  wallpaperUri: null,
  isLoading: false,

  loadLibrary: async () => {
    const tracks = await getAllTracks();
    set({ tracks });
  },

  playTrack: async (track: Track) => {
    const { sound: oldSound } = get();
    if (oldSound) {
      await oldSound.unloadAsync();
    }

    set({ isLoading: true, currentTrack: track });

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.uri },
      { shouldPlay: true, volume: get().volume, rate: get().speed },
    );

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        set({
          position: status.positionMillis,
          duration: status.durationMillis || 0,
          isPlaying: status.isPlaying,
        });
        if (status.didJustFinish) {
          get().nextTrack();
        }
      }
    });

    set({ sound, isLoading: false });
  },

  togglePlayPause: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  },

  seekTo: async (position: number) => {
    const { sound } = get();
    if (sound) await sound.setPositionAsync(position);
  },

  setVolume: async (vol: number) => {
    const { sound } = get();
    set({ volume: vol });
    if (sound) await sound.setVolumeAsync(vol);
  },

  setSpeed: async (speed: number) => {
    const { sound } = get();
    set({ speed, activeEffect: 'normal' });
    if (sound) await sound.setRateAsync(speed, true);
  },

  setPitch: async (pitch: number) => {
    set({ pitch });
  },

  setEffect: async (effect: EffectPreset) => {
    const preset = EFFECT_PRESETS[effect];
    const { sound } = get();
    set({ activeEffect: effect, speed: preset.rate, pitch: preset.pitch });
    if (sound) await sound.setRateAsync(preset.rate, true);
  },

  nextTrack: async () => {
    const { tracks, currentTrack, isShuffle, repeatMode } = get();
    if (tracks.length === 0) return;

    if (repeatMode === 'one' && currentTrack) {
      await get().playTrack(currentTrack);
      return;
    }

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    let nextIndex: number;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }

    if (nextIndex === 0 && repeatMode === 'off' && !isShuffle) return;
    await get().playTrack(tracks[nextIndex]);
  },

  prevTrack: async () => {
    const { tracks, currentTrack, position } = get();
    if (tracks.length === 0) return;

    if (position > 3000) {
      await get().seekTo(0);
      return;
    }

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    await get().playTrack(tracks[prevIndex]);
  },

  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),

  cycleRepeat: () =>
    set((s) => ({
      repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
    })),

  setWallpaper: (uri) => set({ wallpaperUri: uri }),
}));
