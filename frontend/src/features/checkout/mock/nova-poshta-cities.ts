import { type NovaPoshtaCity } from '../model/nova-poshta';

/**
 * Local Nova Poshta directory: a few major cities with sample branches and
 * parcel lockers. Shaped like `Address.searchSettlements` + `getWarehouses`
 * results so the lookup can move to the Nova Poshta API without UI changes.
 */
export const NOVA_POSHTA_CITIES: readonly NovaPoshtaCity[] = [
  {
    id: 'kyiv',
    name: { uk: 'Київ', en: 'Kyiv' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: {
          uk: 'вул. Пирогівський шлях, 135',
          en: '135 Pyrohivskyi Shliakh St',
        },
      },
      {
        type: 'branch',
        number: 5,
        address: { uk: 'вул. Федорова, 32', en: '32 Fedorova St' },
      },
      {
        type: 'branch',
        number: 12,
        address: {
          uk: 'вул. Січових Стрільців, 12',
          en: '12 Sichovykh Striltsiv St',
        },
      },
      {
        type: 'branch',
        number: 47,
        address: { uk: 'просп. Перемоги, 67', en: '67 Peremohy Ave' },
      },
      {
        type: 'locker',
        number: 5501,
        address: {
          uk: 'вул. Хрещатик, 22 (ТЦ «Глобус»)',
          en: '22 Khreshchatyk St (Globus mall)',
        },
      },
      {
        type: 'locker',
        number: 5523,
        address: { uk: 'просп. Бажана, 16', en: '16 Bazhana Ave' },
      },
    ],
  },
  {
    id: 'lviv',
    name: { uk: 'Львів', en: 'Lviv' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: { uk: 'вул. Городоцька, 359', en: '359 Horodotska St' },
      },
      {
        type: 'branch',
        number: 9,
        address: { uk: 'вул. Шевченка, 60', en: '60 Shevchenka St' },
      },
      {
        type: 'branch',
        number: 23,
        address: {
          uk: 'просп. Червоної Калини, 62',
          en: '62 Chervonoi Kalyny Ave',
        },
      },
      {
        type: 'locker',
        number: 6101,
        address: { uk: 'вул. Під Дубом, 7Б', en: '7B Pid Dubom St' },
      },
      {
        type: 'locker',
        number: 6114,
        address: { uk: 'вул. Стрийська, 30', en: '30 Stryiska St' },
      },
    ],
  },
  {
    id: 'odesa',
    name: { uk: 'Одеса', en: 'Odesa' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: { uk: 'вул. Базова, 16', en: '16 Bazova St' },
      },
      {
        type: 'branch',
        number: 4,
        address: { uk: 'вул. Дерибасівська, 8', en: '8 Derybasivska St' },
      },
      {
        type: 'branch',
        number: 28,
        address: { uk: 'просп. Шевченка, 4', en: '4 Shevchenka Ave' },
      },
      {
        type: 'locker',
        number: 7201,
        address: { uk: 'вул. Генуезька, 5', en: '5 Henuezka St' },
      },
    ],
  },
  {
    id: 'kharkiv',
    name: { uk: 'Харків', en: 'Kharkiv' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: { uk: 'вул. Польова, 67', en: '67 Polova St' },
      },
      {
        type: 'branch',
        number: 10,
        address: { uk: 'просп. Науки, 9', en: '9 Nauky Ave' },
      },
      {
        type: 'branch',
        number: 34,
        address: { uk: 'вул. Сумська, 71', en: '71 Sumska St' },
      },
      {
        type: 'locker',
        number: 8105,
        address: {
          uk: 'просп. Героїв Харкова, 144',
          en: '144 Heroiv Kharkova Ave',
        },
      },
    ],
  },
  {
    id: 'dnipro',
    name: { uk: 'Дніпро', en: 'Dnipro' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: {
          uk: 'вул. Маршала Малиновського, 114',
          en: '114 Marshala Malynovskoho St',
        },
      },
      {
        type: 'branch',
        number: 7,
        address: {
          uk: 'просп. Дмитра Яворницького, 52',
          en: '52 Dmytra Yavornytskoho Ave',
        },
      },
      {
        type: 'locker',
        number: 9302,
        address: {
          uk: 'вул. Січеславська Набережна, 15А',
          en: '15A Sicheslavska Naberezhna St',
        },
      },
    ],
  },
  {
    id: 'ivano-frankivsk',
    name: { uk: 'Івано-Франківськ', en: 'Ivano-Frankivsk' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: { uk: 'вул. Сахарова, 50', en: '50 Sakharova St' },
      },
      {
        type: 'branch',
        number: 6,
        address: { uk: 'вул. Незалежності, 33', en: '33 Nezalezhnosti St' },
      },
      {
        type: 'locker',
        number: 4410,
        address: { uk: 'вул. Галицька, 2', en: '2 Halytska St' },
      },
    ],
  },
  {
    id: 'vinnytsia',
    name: { uk: 'Вінниця', en: 'Vinnytsia' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: { uk: 'вул. Батозька, 2Г', en: '2H Batozka St' },
      },
      {
        type: 'branch',
        number: 15,
        address: { uk: 'вул. Соборна, 64', en: '64 Soborna St' },
      },
      {
        type: 'locker',
        number: 3207,
        address: { uk: 'вул. Келецька, 78В', en: '78V Keletska St' },
      },
    ],
  },
  {
    id: 'uzhhorod',
    name: { uk: 'Ужгород', en: 'Uzhhorod' },
    points: [
      {
        type: 'branch',
        number: 1,
        address: { uk: 'вул. Собранецька, 89', en: '89 Sobranetska St' },
      },
      {
        type: 'branch',
        number: 3,
        address: { uk: 'пл. Петефі, 9', en: '9 Petefi Sq' },
      },
      {
        type: 'locker',
        number: 2105,
        address: { uk: 'вул. Минайська, 16', en: '16 Mynaiska St' },
      },
    ],
  },
];
