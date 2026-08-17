import type { Playable } from '../types'
// Манифест лежит в корне проекта. Импортируется на этапе сборки:
// добавил запись в playables.json → пересборка (или HMR в dev) подхватит.
import raw from '../../playables.json'

// Сортировка по убыванию id: у кого число больше — тот выше в гриде.
export const playables = (raw as Playable[]).slice().sort((a, b) => b.id - a.id)
