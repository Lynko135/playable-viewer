import type { Playable } from '../types'
// Манифест лежит в корне проекта. Импортируется на этапе сборки:
// добавил запись в playables.json → пересборка (или HMR в dev) подхватит.
import raw from '../../playables.json'

export const playables = raw as Playable[]
