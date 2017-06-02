/**
 * ### ACTIONS ###
 * PLAY
 * PAUSE
 * NEXT
 * PREVIOUS
 * STOP
 * SEEK
 * PROGRESS
 * REMAINING
 * SHUFFLE
 * CROSSFADE
 * REPEAT
 * LIKE
 * UNLIKE
 * ARTWORK_FULL
 * THEME
 * SEARCH
 * LOADING
 * ONLINE
 * SAVE
 * REMOVE
 * CREATE_PLAYLIST
 * UPDATE_PLAYLIST
 * DELETE_PLAYLIST
 * ADD_TO_PLAYLIST
 * REMOVE_FROM_PLAYLIST
 *
 * ### STATE ###
 * {
 *   theme: 'light | dark',
 *   queue: [],
 *   history: [],
 *   match: [],
 *   saved: [],
 *   playlist: [],
 *   crossfade: 0, // MAX: 12
 *   remaining: Boolean, // false -> song length, true -> -remaining
 *   artworkFull: Boolean,
 *   playing: Boolean,
 *   shuffle: Boolean,
 *   repeat: 'OFF|ONE|ALL',
 *   current: null | Object, // state update 1 second interval, reselect at bay
 *   online: Boolean, // even tho adding offline capability is possible, I will *NOT* do that
 *   loading: Boolean,
 * }
 */
