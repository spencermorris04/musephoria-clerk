import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicPlayerState {
  currentTime: number;
  maxWatchedTime: number;
  duration: number;
}

const initialState: MusicPlayerState = {
  currentTime: 0,
  maxWatchedTime: 0,
  duration: 0,
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      if (action.payload > state.maxWatchedTime) {
        state.maxWatchedTime = action.payload;
      }
    },
    setMaxWatchedTime: (state, action: PayloadAction<number>) => {
      state.maxWatchedTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    resetPlayer: (state) => {
      state.currentTime = 0;
      state.maxWatchedTime = 0;
      state.duration = 0;
    },
  },
});

export const { setCurrentTime, setMaxWatchedTime, setDuration, resetPlayer } = musicPlayerSlice.actions;