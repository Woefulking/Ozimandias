export const WALK_SPEED = 1;
export const RUN_SPEED = 3;

export const KEY_MAP = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'sprint',
  Space: 'up',
  ControlLeft: 'down',
};

export const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  up: false,
  down: false,
};

export const POEM = [
  {
    text: 'I met a traveller from an antique land, Who said: ',
    translation: 'Навстречу путник мне из древней шел земли. И молвил:',
    audio: '/assets/audio/1.mp3',
  },
  {
    text: '`Two vast and trunkless legs of stone stand in the desert.',
    translation: 'Cредь песков — минувших дней руина. Стоят две каменных ноги от исполина',
    audio: '/assets/audio/2.mp3',
  },
  {
    text: 'Near them, on the sand, half sunk, a shattered visage lies',
    translation: 'Лежит разбитый лик во прахе невдали',
    audio: '/assets/audio/3.mp3',
  },
  {
    text: 'Whose frown, And wrinkled lip, and sneer of cold command',
    translation: 'Сурово сжатый рот, усмешка гордой власти',
    audio: '/assets/audio/4.mp3',
  },
  {
    text: 'Tell that its sculptor well those passions read. Which yet survive.',
    translation: 'Твердит, как глубоко ваятель понял страсти. Что пережить могли солгавший им язык',
    audio: '/assets/audio/5.mp3',
  },
  {
    text: 'Stamped on these lifeless things. The hand that mocked them and the heart that fed',
    translation: 'Служившую им длань и сердце — их родник',
    audio: '/assets/audio/6.mp3',
  },
  {
    text: 'And on the pedestal these words appear',
    translation: 'А вкруг подножия слова видны в граните:',
    audio: '/assets/audio/7.mp3',
  },
  {
    text: '"My name is Ozymandias, king of kings:',
    translation: '«Я — Озимандия, великий царь царей.',
    audio: '/assets/audio/8.mp3',
  },
  {
    text: 'Look on my works, ye Mighty, and despair!"',
    translation: 'Взгляните на мои деянья и дрожите!»',
    audio: '/assets/audio/9.mp3',
  },
  {
    text: 'Nothing beside remains. Round the decay. Of that colossal wreck,',
    translation: 'Кругом нет ничего. Истлевший мавзолей',
    audio: '/assets/audio/10.mp3',
  },
  {
    text: 'boundless and bare. The lone and level sands stretch far away.',
    translation:
      'Пустыней окружен. Гуляет ветр свободный. И стелются пески, безбрежны и бесплодны.',
    audio: '/assets/audio/11.mp3',
  },
];
