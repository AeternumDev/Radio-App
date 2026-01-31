import { createSelector } from 'reselect';

import { HomeItem, TodoListItem } from '../mock';
import type { Track, RadioStation, Notification, Settings } from '@/lib/models';

export interface RootState {
    homeItems: HomeItem[]
    lists: TodoListItem[]
    notifications: Notification[]
    settings: Settings
    currentTrack: Track | null
    radioStations: RadioStation[]
    selectedStation: RadioStation | null
  }
  
export const createAppSelector = createSelector.withTypes<RootState>()

// export const selectHomeItems = createAppSelector(
//     [
//       state => state.homeItems
//     ],
//     homeItems => homeItems
//   )
export const selectHomeItems = (state: RootState) => state.homeItems;

export const selectLists = createAppSelector(
    [
        state => state.lists
    ],
    lists => lists
)

// export const selectNotifications = createAppSelector(
//     [
//         state => state.notifications
//     ],
//     notifications => notifications
// )
export const selectNotifications = (state: RootState) => state.notifications;

export const selectSettings = createAppSelector(
    [
        state => state.settings
    ],
    settings => settings
)

// export const selectCurrentTrack = createAppSelector(
//     [
//         state => state.currentTrack
//     ],
//     currentTrack => currentTrack
// )
export const selectCurrentTrack = (state: RootState) => state.currentTrack;

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
