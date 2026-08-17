export interface Playable {
  /** Уникальное число. Чем больше — тем выше в гриде (сортировка по убыванию). */
  id: number
  /** Отображаемое название. */
  name: string
  /** Путь к html-файлу (URL от корня сайта), напр. "/playables/tap-blast.html". */
  html: string
  /** Путь к иконке (URL от корня сайта), напр. "/playables/tap-blast.svg". */
  icon: string
}
