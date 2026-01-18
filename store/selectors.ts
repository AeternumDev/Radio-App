import { createSelector } from 'reselect';
import { HomeItem, NotificationItem, Settings, TodoListItem } from '../mock';
import type { Track, RadioStation } from '../lib/models';

export interface RootState {
    homeItems: HomeItem[]
    lists: TodoListItem[]
    notifications: NotificationItem[]
    settings: Settings
    currentTrack: Track | null
    radioStations: RadioStation[]
    selectedStation: RadioStation | null
    playingStation: RadioStation | null
    isPlaying: boolean
  }
  
export const createAppSelector = createSelector.withTypes<RootState>()

export const selectHomeItems = createAppSelector(
    [
      state => state.homeItems
    ],
    homeItems => homeItems
  )

export const selectLists = createAppSelector(
    [
        state => state.lists
    ],
    lists => lists
)

export const selectNotifications = createAppSelector(
    [
        state => state.notifications
    ],
    notifications => notifications
)

export const selectSettings = createAppSelector(
    [
        state => state.settings
    ],
    settings => settings
)

export const selectCurrentTrack = createAppSelector(
    [
        state => state.currentTrack
    ],
    currentTrack => currentTrack
)

export const selectRadioStations = createAppSelector(
    [
        state => state.radioStations
    ],
    radioStations => radioStations
)

export const selectSelectedStation = createAppSelector(
    [
        state => state.selectedStation
    ],
    selectedStation => selectedStation
)

export const selectPlayingStation = createAppSelector(
    [
        state => state.playingStation
    ],
    playingStation => playingStation
)

export const selectIsPlaying = createAppSelector(
    [
        state => state.isPlaying
    ],
    isPlaying => isPlaying
)
