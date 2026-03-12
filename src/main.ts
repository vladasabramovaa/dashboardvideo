// @ts-nocheck
import './style.css'
import type { Scene, Project, Version, Preset } from './types'

declare global {
  interface Window {
    _currentRatio?: string;
  }
}

// ===== WORKSPACE PROJECT DATA =====
const workspaceFolders = {
  name: "Все проекты",
  icon: "🏠",
  type: "root",
  expanded: true,
  children: [
    {
      name: "Общие проекты",
      icon: "👥",
      type: "client",
      expanded: true,
      children: [
        {
          name: "Компания Х",
          icon: "🏢",
          type: "brand",
          expanded: true,
          children: [
            {
              name: "Кампания: Русские сказки",
              icon: "🪆",
              type: "campaign",
              expanded: true,
              children: [
                { name: "Красная шапочка: Киберпанк", icon: "🎬", type: "project", id: "p1", cover: "linear-gradient(135deg, #FF6B6B 0%, #A78BFA 100%)", status: "active", modified: "05.03.2026", participants: ["Алекс", "Мерлин", "Влада"] },
                { name: "Колобок: Побег", icon: "🎬", type: "project", id: "p2", cover: "linear-gradient(135deg, #F97316 0%, #E8C547 100%)", status: "active", modified: "04.03.2026", participants: ["Алекс", "Влада"] },
                { name: "Морозко: Зимняя история", icon: "🎬", type: "project", id: "p3", cover: "linear-gradient(135deg, #06B6D4 0%, #A78BFA 100%)", status: "review", modified: "01.03.2026", participants: ["Мерлин"] },
              ]
            },
            {
              name: "Кампания: Мировые сказки",
              icon: "🌍",
              type: "campaign",
              expanded: false,
              children: [
                { name: "Золушка: Бал", icon: "🎬", type: "project", id: "p4", cover: "linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)", status: "active", modified: "28.02.2026", participants: ["Алекс", "Мерлин"] },
                { name: "Белоснежка: Пробуждение", icon: "🎬", type: "project", id: "p5", cover: "linear-gradient(135deg, #34D399 0%, #06B6D4 100%)", status: "paused", modified: "20.02.2026", participants: ["Влада"] },
              ]
            }
          ]
        },
        {
          name: "Компания Y",
          icon: "🏢",
          type: "brand",
          expanded: false,
          children: [
            {
              name: "Кампания: Восточные сказки",
              icon: "🏮",
              type: "campaign",
              expanded: true,
              children: [
                { name: "Аладдин: Новый мир", icon: "🎬", type: "project", id: "p6", cover: "linear-gradient(135deg, #E8C547 0%, #F97316 100%)", status: "active", modified: "03.03.2026", participants: ["Алекс"] },
                { name: "Синдбад: Путешествие", icon: "🎬", type: "project", id: "p7", cover: "linear-gradient(135deg, #4ECDC4 0%, #06B6D4 100%)", status: "done", modified: "15.02.2026", participants: ["Мерлин", "Влада"] },
              ]
            },
            {
              name: "Кампания: Скандинавские легенды",
              icon: "⚔️",
              type: "campaign",
              expanded: true,
              children: [
                { name: "Тор: Молот грома", icon: "🎬", type: "project", id: "p8", cover: "linear-gradient(135deg, #555 0%, #06B6D4 100%)", status: "active", modified: "02.03.2026", participants: ["Влада"] },
                { name: "Локи: Обман богов", icon: "🎬", type: "project", id: "p9", cover: "linear-gradient(135deg, #34D399 0%, #E8C547 100%)", status: "active", modified: "04.03.2026", participants: ["Алекс", "Мерлин"] },
                { name: "Фрейя: Сияние Севера", icon: "🎬", type: "project", id: "p10", cover: "linear-gradient(135deg, #F472B6 0%, #FF6B6B 100%)", status: "review", modified: "03.03.2026", participants: ["Влада"] },
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Личные проекты",
      icon: "👤",
      type: "client",
      expanded: false,
      children: [
        {
          name: "Эксперименты",
          icon: "🧪",
          type: "brand",
          expanded: true,
          children: [
            {
              name: "Стилевые тесты",
              icon: "🎨",
              type: "campaign",
              expanded: true,
              children: [
                { name: "Anime Style Test", icon: "🎬", type: "project", id: "p14", cover: "linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)", status: "active", modified: "05.03.2026", participants: ["Алекс"] },
                { name: "Noir Mood Board", icon: "🎬", type: "project", id: "p15", cover: "linear-gradient(135deg, #333 0%, #666 100%)", status: "draft", modified: "25.02.2026", participants: ["Алекс"] },
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Archived projects
const archivedProjects = [
  { name: "Иван-Царевич: Пилот", icon: "🎬", id: "a1", cover: "linear-gradient(135deg, #555 0%, #333 100%)", status: "archived", modified: "15.12.2025", participants: ["Алекс", "Мерлин"], client: "Компания Х" },
  { name: "Баба-Яга: Тизер", icon: "🎬", id: "a2", cover: "linear-gradient(135deg, #444 0%, #222 100%)", status: "archived", modified: "01.01.2026", participants: ["Влада"], client: "Компания Y" },
  { name: "Кощей: Ранняя версия", icon: "🎬", id: "a3", cover: "linear-gradient(135deg, #555 0%, #444 100%)", status: "archived", modified: "10.11.2025", participants: ["Мерлин"], client: "Компания Х" },
];

let activeProjectId = 'p1';
let editingProjectId = null;
let searchQuery = '';
const favoriteProjectIds = new Set(['p1', 'p9']);
const trashedProjects = [
  { name: "Тестовый рендер v0", icon: "🎬", id: "t1", cover: "linear-gradient(135deg, #555 0%, #333 100%)", deletedDate: "02.03.2026", participants: ["Алекс"] },
  { name: "Заготовка для клиента X", icon: "🎬", id: "t2", cover: "linear-gradient(135deg, #444 0%, #222 100%)", deletedDate: "28.02.2026", participants: ["Мерлин"] },
];
let showFavoritesOnly = false;

// ===== DATA =====
// Per-project scenes data
const projectScenes = {
  p1: [
    { id: 1, name: "Красная шапочка получает задание", desc: "Мать передаёт корзинку с кибер-пирожками. Бункер, тусклый свет, экраны на стенах.", status: "image", duration: 5 },
    { id: 2, name: "Вход в радиоактивный лес", desc: "Шапочка выходит из бункера. Механические деревья, неоновый туман, тропа светится.", status: "image", duration: 6 },
    { id: 3, name: "Встреча с волком-андроидом", desc: "На тропе появляется Волк. Голограммные глаза, обманчиво дружелюбный. Диалог.", status: "sketch", duration: 8 },
    { id: 4, name: "Волк мчится к бабушке", desc: "Волк включает турбо-режим. Механические лапы рвут землю. Скорость. Неон.", status: "sketch", duration: 4 },
    { id: 5, name: "Шапочка в глубине леса", desc: "Атмосферная сцена. Шапочка идёт среди мерцающих деревьев. Звуки леса.", status: "draft", duration: 7 },
    { id: 6, name: "Бабушкин бункер", desc: "Шапочка приходит. Дверь открыта. Что-то не так. Тревожная атмосфера.", status: "draft", duration: 5 },
    { id: 7, name: "Разоблачение волка", desc: "Диалог «какие у тебя большие глаза». Волк раскрывается. Экшн-сцена.", status: "draft", duration: 10 },
    { id: 8, name: "Финал: Победа", desc: "Шапочка побеждает волка. Бабушка спасена. Рассвет над пустошью.", status: "draft", duration: 6 },
  ],
  p2: [
    { id: 1, name: "Колобок убегает из дома", desc: "Бабка и дед замешивают тесто. Колобок оживает и катится к двери. Деревенская изба.", status: "image", duration: 5 },
    { id: 2, name: "Встреча с Зайцем", desc: "Колобок катится по тропинке. Заяц выпрыгивает из кустов. Диалог-песенка.", status: "image", duration: 6 },
    { id: 3, name: "Встреча с Волком", desc: "Тёмный лес. Волк преграждает путь. Колобок поёт песенку и убегает.", status: "sketch", duration: 7 },
    { id: 4, name: "Встреча с Медведем", desc: "Медвежья поляна. Огромный медведь. Колобок ловко уворачивается.", status: "sketch", duration: 6 },
    { id: 5, name: "Лиса-обманщица", desc: "Хитрая лиса просит сесть на носик. Колобок доверчиво соглашается.", status: "draft", duration: 8 },
    { id: 6, name: "Побег Колобка", desc: "Альтернативный финал — Колобок хитрее Лисы! Катится к закату.", status: "draft", duration: 5 },
  ],
  p3: [
    { id: 1, name: "Настенька и мачеха", desc: "Злая мачеха отправляет Настеньку в зимний лес. Метель, слёзы, холод.", status: "image", duration: 6 },
    { id: 2, name: "Встреча с Морозко", desc: "Дед Мороз появляется из вьюги. Ледяной трон. Испытание холодом.", status: "image", duration: 7 },
    { id: 3, name: "Испытание Настеньки", desc: "Морозко трижды спрашивает — тепло ли тебе, девица? Настенька терпит.", status: "sketch", duration: 8 },
    { id: 4, name: "Награда", desc: "Морозко дарит сундук с сокровищами. Настенька возвращается домой.", status: "sketch", duration: 5 },
    { id: 5, name: "Марфушка в лесу", desc: "Жадная Марфушка идёт к Морозко. Грубит, требует подарки.", status: "draft", duration: 7 },
    { id: 6, name: "Справедливый финал", desc: "Марфушка наказана. Настенька счастлива. Весна приходит.", status: "draft", duration: 6 },
  ],
  p4: [
    { id: 1, name: "Золушка у камина", desc: "Золушка убирает дом. Сёстры собираются на бал. Мечты о танцах.", status: "image", duration: 5 },
    { id: 2, name: "Появление Феи", desc: "Крёстная-фея появляется в вихре звёзд. Тыква, мыши, волшебство.", status: "image", duration: 7 },
    { id: 3, name: "Бал во дворце", desc: "Золушка входит в зал. Все замирают. Принц приглашает на танец.", status: "sketch", duration: 8 },
    { id: 4, name: "Полночь — бегство", desc: "Часы бьют 12. Золушка бежит по лестнице. Хрустальная туфелька остаётся.", status: "sketch", duration: 6 },
    { id: 5, name: "Поиски принца", desc: "Принц ходит по домам с туфелькой. Сёстры пытаются надеть.", status: "draft", duration: 7 },
    { id: 6, name: "Счастливый финал", desc: "Туфелька подходит Золушке. Свадьба, фейерверки, карета.", status: "draft", duration: 5 },
  ],
  p5: [
    { id: 1, name: "Белоснежка в замке", desc: "Королева спрашивает зеркало. Зеркало называет Белоснежку красивейшей.", status: "image", duration: 5 },
    { id: 2, name: "Побег в лес", desc: "Охотник отпускает Белоснежку. Она бежит через тёмный лес.", status: "sketch", duration: 6 },
    { id: 3, name: "Домик гномов", desc: "Белоснежка находит маленький домик. 7 гномов возвращаются с работы.", status: "sketch", duration: 7 },
    { id: 4, name: "Отравленное яблоко", desc: "Старуха-королева предлагает яблоко. Белоснежка засыпает вечным сном.", status: "draft", duration: 8 },
    { id: 5, name: "Пробуждение", desc: "Принц находит Белоснежку. Поцелуй. Она просыпается. Радость гномов.", status: "draft", duration: 6 },
  ],
  p6: [
    { id: 1, name: "Аладдин на базаре", desc: "Шумный восточный базар. Аладдин ворует хлеб. Погоня стражников.", status: "image", duration: 6 },
    { id: 2, name: "Пещера чудес", desc: "Вход в пещеру в виде тигра. Горы золота. Аладдин находит лампу.", status: "image", duration: 7 },
    { id: 3, name: "Джинн освобождён", desc: "Аладдин трёт лампу. Синий дым, Джинн появляется. Три желания.", status: "sketch", duration: 8 },
    { id: 4, name: "Принц Али", desc: "Аладдин превращается в принца. Караван слонов. Дворец принцессы.", status: "sketch", duration: 6 },
    { id: 5, name: "Полёт на ковре", desc: "Аладдин и Жасмин летят на ковре-самолёте. Звёздное небо. Романтика.", status: "draft", duration: 7 },
    { id: 6, name: "Битва с Джафаром", desc: "Злой визирь крадёт лампу. Финальная битва. Джинн свободен.", status: "draft", duration: 9 },
  ],
  p7: [
    { id: 1, name: "Синдбад выходит в море", desc: "Порт Багдада. Корабль отчаливает. Солёный ветер, паруса наполняются.", status: "image", duration: 5 },
    { id: 2, name: "Остров-кит", desc: "Команда высаживается на остров. Земля дрожит — это спина кита!", status: "image", duration: 7 },
    { id: 3, name: "Долина алмазов", desc: "Змеи охраняют алмазы. Синдбад привязывает мясо к спине. Орлы уносят.", status: "sketch", duration: 8 },
    { id: 4, name: "Великан-людоед", desc: "Пещера великана. Команда в ловушке. Синдбад придумывает план побега.", status: "draft", duration: 9 },
    { id: 5, name: "Возвращение домой", desc: "Корабль входит в порт Багдада. Синдбад богат и мудр. Закат.", status: "draft", duration: 6 },
  ],
  p8: [
    { id: 1, name: "Ковка Мьёльнира", desc: "Гномы куют молот в недрах горы. Искры, лава, раскалённый металл.", status: "image", duration: 6 },
    { id: 2, name: "Тор получает молот", desc: "Один вручает молот Тору. Молния бьёт. Тор поднимает Мьёльнир.", status: "image", duration: 5 },
    { id: 3, name: "Битва с ледяными великанами", desc: "Ётунхейм. Ледяные великаны атакуют. Тор мечет молнии.", status: "sketch", duration: 8 },
    { id: 4, name: "Потеря молота", desc: "Трюм крадёт Мьёльнир. Тор в ярости. Локи предлагает хитрый план.", status: "sketch", duration: 7 },
    { id: 5, name: "Тор в платье невесты", desc: "Тор переодевается в Фрейю. Пир у великанов. Комедийная сцена.", status: "draft", duration: 9 },
    { id: 6, name: "Возвращение Мьёльнира", desc: "Тор хватает молот. Разгром великанов. Гром и молнии. Победа.", status: "draft", duration: 7 },
  ],
  p9: [
    { id: 1, name: "Асгард: Дворец обмана", desc: "Локи на троне Асгарда. Иллюзии повсюду. Никто не подозревает.", status: "image", duration: 6 },
    { id: 2, name: "Кража яблок Идунн", desc: "Локи крадёт молодильные яблоки. Боги начинают стареть.", status: "image", duration: 7 },
    { id: 3, name: "Превращение в лосося", desc: "Боги ищут Локи. Он превращается в лосося. Погоня у водопада.", status: "sketch", duration: 8 },
    { id: 4, name: "Суд богов", desc: "Локи пойман. Боги выносят приговор. Змей капает ядом.", status: "sketch", duration: 6 },
    { id: 5, name: "Рагнарёк начинается", desc: "Локи вырывается. Ведёт армию мёртвых. Небо пылает.", status: "draft", duration: 10 },
  ],
  p10: [
    { id: 1, name: "Фрейя в саду", desc: "Волшебный сад Фолькванга. Цветы светятся. Фрейя кормит кошек.", status: "image", duration: 5 },
    { id: 2, name: "Поиски Ода", desc: "Фрейя отправляется искать мужа. Золотые слёзы падают на землю.", status: "sketch", duration: 7 },
    { id: 3, name: "Ожерелье Брисингамен", desc: "Фрейя у гномов. Торг за ожерелье. Четыре ночи — четыре гнома.", status: "sketch", duration: 8 },
    { id: 4, name: "Битва Ванов и Асов", desc: "Война богов. Фрейя выбирает павших воинов. Валькирии летят.", status: "draft", duration: 9 },
    { id: 5, name: "Сияние Севера", desc: "Фрейя зажигает северное сияние. Мир в гармонии. Финал.", status: "draft", duration: 6 },
  ],
  p14: [
    { id: 1, name: "Anime Test Scene 1", desc: "Тестовая сцена в аниме-стиле. Яркие цвета, крупные глаза.", status: "sketch", duration: 5 },
    { id: 2, name: "Anime Test Scene 2", desc: "Экшн-сцена. Динамичные линии, эффекты скорости.", status: "draft", duration: 6 },
  ],
  p15: [
    { id: 1, name: "Noir Mood Test", desc: "Тест нуарного стиля. Тени, дождь, силуэт у окна.", status: "draft", duration: 5 },
    { id: 2, name: "Noir Chase Scene", desc: "Погоня по тёмным переулкам. Свет фонарей. Мокрый асфальт.", status: "draft", duration: 7 },
  ],
};

// Per-project file trees
const projectTrees = {
  p1: {
    name: "Красная шапочка: Киберпанк", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Основная", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Пустошь", icon: "🏜", type: "episode", expanded: true,
            children: [
              { name: "Красная шапочка получает задание", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Вход в радиоактивный лес", icon: "🎬", type: "scene", sceneIdx: 1 },
              { name: "Встреча с волком-андроидом", icon: "🎬", type: "scene", sceneIdx: 2 },
          ]},
          { name: "Эпизод 2: Лес", icon: "🌲", type: "episode", expanded: false,
            children: [
              { name: "Волк мчится к бабушке", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Шапочка в глубине леса", icon: "🎬", type: "scene", sceneIdx: 4 },
          ]},
          { name: "Эпизод 3: Бункер", icon: "🏚", type: "episode", expanded: false,
            children: [
              { name: "Бабушкин бункер", icon: "🎬", type: "scene", sceneIdx: 5 },
              { name: "Разоблачение волка", icon: "🎬", type: "scene", sceneIdx: 6 },
              { name: "Финал: Победа", icon: "🎬", type: "scene", sceneIdx: 7 },
          ]}
      ]}
  ]},
  p2: {
    name: "Колобок: Побег", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Побег", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Начало пути", icon: "🏠", type: "episode", expanded: true,
            children: [
              { name: "Колобок убегает из дома", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Встреча с Зайцем", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]},
          { name: "Эпизод 2: Лесные встречи", icon: "🌲", type: "episode", expanded: false,
            children: [
              { name: "Встреча с Волком", icon: "🎬", type: "scene", sceneIdx: 2 },
              { name: "Встреча с Медведем", icon: "🎬", type: "scene", sceneIdx: 3 },
          ]},
          { name: "Эпизод 3: Финал", icon: "🦊", type: "episode", expanded: false,
            children: [
              { name: "Лиса-обманщица", icon: "🎬", type: "scene", sceneIdx: 4 },
              { name: "Побег Колобка", icon: "🎬", type: "scene", sceneIdx: 5 },
          ]}
      ]}
  ]},
  p3: {
    name: "Морозко: Зимняя история", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Испытание", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Настенька", icon: "❄️", type: "episode", expanded: true,
            children: [
              { name: "Настенька и мачеха", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Встреча с Морозко", icon: "🎬", type: "scene", sceneIdx: 1 },
              { name: "Испытание Настеньки", icon: "🎬", type: "scene", sceneIdx: 2 },
          ]},
          { name: "Эпизод 2: Справедливость", icon: "🎁", type: "episode", expanded: false,
            children: [
              { name: "Награда", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Марфушка в лесу", icon: "🎬", type: "scene", sceneIdx: 4 },
              { name: "Справедливый финал", icon: "🎬", type: "scene", sceneIdx: 5 },
          ]}
      ]}
  ]},
  p4: {
    name: "Золушка: Бал", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Мечта", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: До бала", icon: "🏠", type: "episode", expanded: true,
            children: [
              { name: "Золушка у камина", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Появление Феи", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]},
          { name: "Эпизод 2: Бал", icon: "💃", type: "episode", expanded: false,
            children: [
              { name: "Бал во дворце", icon: "🎬", type: "scene", sceneIdx: 2 },
              { name: "Полночь — бегство", icon: "🎬", type: "scene", sceneIdx: 3 },
          ]},
          { name: "Эпизод 3: Счастье", icon: "👑", type: "episode", expanded: false,
            children: [
              { name: "Поиски принца", icon: "🎬", type: "scene", sceneIdx: 4 },
              { name: "Счастливый финал", icon: "🎬", type: "scene", sceneIdx: 5 },
          ]}
      ]}
  ]},
  p5: {
    name: "Белоснежка: Пробуждение", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Зеркало", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Изгнание", icon: "🪞", type: "episode", expanded: true,
            children: [
              { name: "Белоснежка в замке", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Побег в лес", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]},
          { name: "Эпизод 2: Отравление", icon: "🍎", type: "episode", expanded: false,
            children: [
              { name: "Домик гномов", icon: "🎬", type: "scene", sceneIdx: 2 },
              { name: "Отравленное яблоко", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Пробуждение", icon: "🎬", type: "scene", sceneIdx: 4 },
          ]}
      ]}
  ]},
  p6: {
    name: "Аладдин: Новый мир", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Лампа", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Базар", icon: "🏜", type: "episode", expanded: true,
            children: [
              { name: "Аладдин на базаре", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Пещера чудес", icon: "🎬", type: "scene", sceneIdx: 1 },
              { name: "Джинн освобождён", icon: "🎬", type: "scene", sceneIdx: 2 },
          ]},
          { name: "Эпизод 2: Принц и Принцесса", icon: "🧞", type: "episode", expanded: false,
            children: [
              { name: "Принц Али", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Полёт на ковре", icon: "🎬", type: "scene", sceneIdx: 4 },
              { name: "Битва с Джафаром", icon: "🎬", type: "scene", sceneIdx: 5 },
          ]}
      ]}
  ]},
  p7: {
    name: "Синдбад: Путешествие", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Странствия", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: В море", icon: "⛵", type: "episode", expanded: true,
            children: [
              { name: "Синдбад выходит в море", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Остров-кит", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]},
          { name: "Эпизод 2: Приключения", icon: "💎", type: "episode", expanded: false,
            children: [
              { name: "Долина алмазов", icon: "🎬", type: "scene", sceneIdx: 2 },
              { name: "Великан-людоед", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Возвращение домой", icon: "🎬", type: "scene", sceneIdx: 4 },
          ]}
      ]}
  ]},
  p8: {
    name: "Тор: Молот грома", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Мьёльнир", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Ковка", icon: "⚒️", type: "episode", expanded: true,
            children: [
              { name: "Ковка Мьёльнира", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Тор получает молот", icon: "🎬", type: "scene", sceneIdx: 1 },
              { name: "Битва с ледяными великанами", icon: "🎬", type: "scene", sceneIdx: 2 },
          ]},
          { name: "Эпизод 2: Кража", icon: "🔨", type: "episode", expanded: false,
            children: [
              { name: "Потеря молота", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Тор в платье невесты", icon: "🎬", type: "scene", sceneIdx: 4 },
              { name: "Возвращение Мьёльнира", icon: "🎬", type: "scene", sceneIdx: 5 },
          ]}
      ]}
  ]},
  p9: {
    name: "Локи: Обман богов", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Хитрость", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Интриги", icon: "🐍", type: "episode", expanded: true,
            children: [
              { name: "Асгард: Дворец обмана", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Кража яблок Идунн", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]},
          { name: "Эпизод 2: Расплата", icon: "⛓️", type: "episode", expanded: false,
            children: [
              { name: "Превращение в лосося", icon: "🎬", type: "scene", sceneIdx: 2 },
              { name: "Суд богов", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Рагнарёк начинается", icon: "🎬", type: "scene", sceneIdx: 4 },
          ]}
      ]}
  ]},
  p10: {
    name: "Фрейя: Сияние Севера", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Сюжетная линия: Поиски", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1: Фолькванг", icon: "🌸", type: "episode", expanded: true,
            children: [
              { name: "Фрейя в саду", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Поиски Ода", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]},
          { name: "Эпизод 2: Ожерелье", icon: "📿", type: "episode", expanded: false,
            children: [
              { name: "Ожерелье Брисингамен", icon: "🎬", type: "scene", sceneIdx: 2 },
              { name: "Битва Ванов и Асов", icon: "🎬", type: "scene", sceneIdx: 3 },
              { name: "Сияние Севера", icon: "🎬", type: "scene", sceneIdx: 4 },
          ]}
      ]}
  ]},
  p14: {
    name: "Anime Style Test", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Тесты", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1", icon: "🎨", type: "episode", expanded: true,
            children: [
              { name: "Anime Test Scene 1", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Anime Test Scene 2", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]}
      ]}
  ]},
  p15: {
    name: "Noir Mood Board", icon: "🎬", type: "project", expanded: true,
    children: [
      { name: "Тесты", icon: "📖", type: "storyline", expanded: true,
        children: [
          { name: "Эпизод 1", icon: "🎨", type: "episode", expanded: true,
            children: [
              { name: "Noir Mood Test", icon: "🎬", type: "scene", sceneIdx: 0 },
              { name: "Noir Chase Scene", icon: "🎬", type: "scene", sceneIdx: 1 },
          ]}
      ]}
  ]},
};

// Active scenes and tree — loaded per project
let scenes = projectScenes[activeProjectId] || projectScenes.p1;
let projectTree = projectTrees[activeProjectId] || projectTrees.p1;

let activeScene: number = 0;
let activeStage = 'script';

// ===== FILE TREE RENDERING =====
function renderFileTree() {
  const container = document.getElementById('fileTree');
  container.innerHTML = renderTreeNode(projectTree, 0);
}

function renderTreeNode(node, depth) {
  const hasChildren = node.children && node.children.length > 0;
  const isScene = node.type === 'scene';
  const scene = isScene ? scenes[node.sceneIdx] : null;
  const isActive = isScene && node.sceneIdx === activeScene;
  const toggleClass = hasChildren ? (node.expanded ? 'expanded' : '') : 'leaf';
  const statusDot = isScene && scene ? `<span class="tree-status-dot ${getStatusClass(scene.status)}"></span>` : '';
  const meta = isScene && scene ? `<span class="tree-meta">${scene.duration}s</span>` :
               hasChildren ? `<span class="tree-meta">${node.children.length}</span>` : '';

  let html = `<div class="tree-node" data-type="${node.type}">`;
  html += `<div class="tree-node-row ${isActive ? 'active' : ''}"
    onclick="${isScene ? `selectScene(${node.sceneIdx})` : hasChildren ? `toggleTreeNode(this)` : ''}"
    style="padding-left: ${4 + depth * 2}px">`;
  html += `<span class="tree-toggle ${toggleClass}">▶</span>`;
  html += `<span class="tree-icon">${node.icon}</span>`;
  html += `<span class="tree-label">${isScene ? scene.name : node.name}</span>`;
  html += statusDot;
  html += meta;
  html += `</div>`;

  if (hasChildren) {
    html += `<div class="tree-children ${node.expanded ? 'expanded' : ''}">`;
    node.children.forEach(child => {
      html += renderTreeNode(child, depth + 1);
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

function toggleTreeNode(rowEl) {
  const toggle = rowEl.querySelector('.tree-toggle');
  const children = rowEl.nextElementSibling;
  if (children && children.classList.contains('tree-children')) {
    children.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
  }
}

// ===== WORKSPACE FOLDER TREE RENDERING =====
function renderWorkspaceTree() {
  const container = document.getElementById('workspaceTree');
  container.innerHTML = renderWsNode(workspaceFolders, 0);
}

function renderWsNode(node, depth) {
  if (node.type === 'project') return renderProjectCard(node, depth);

  const hasChildren = node.children && node.children.length > 0;
  const toggleClass = hasChildren ? (node.expanded ? 'expanded' : '') : 'leaf';
  const countProjects = countAllProjects(node);
  const isRoot = node.type === 'root';

  // Filter by search
  if (searchQuery && !nodeMatchesSearch(node, searchQuery)) return '';

  let html = `<div class="ws-tree-node">`;
  if (!isRoot) {
    html += `<div class="ws-tree-row" onclick="toggleWsNode(this)" style="padding-left:${4 + depth * 2}px">`;
    html += `<span class="ws-tree-toggle ${toggleClass}">▶</span>`;
    html += `<span class="ws-tree-icon">${node.icon}</span>`;
    html += `<span class="ws-tree-label">${highlightSearch(node.name)}</span>`;
    html += `<span class="ws-tree-count">${countProjects}</span>`;
    html += `</div>`;
  }
  if (hasChildren) {
    html += `<div class="ws-tree-children ${node.expanded || isRoot || searchQuery ? 'expanded' : ''}">`;
    node.children.forEach(child => { html += renderWsNode(child, isRoot ? depth : depth + 1); });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

function renderProjectCard(proj, depth) {
  if (searchQuery && !proj.name.toLowerCase().includes(searchQuery.toLowerCase())) return '';
  if (showFavoritesOnly && !favoriteProjectIds.has(proj.id)) return '';
  const isActive = proj.id === activeProjectId;
  const isFav = favoriteProjectIds.has(proj.id);
  const statusColors = { active: 'var(--accent-green)', paused: 'var(--accent-script)', review: 'var(--accent-art)', done: 'var(--accent-camera)', draft: 'var(--text-dim)' };
  const statusLabels = { active: 'Активный', paused: 'На паузе', review: 'На ревью', done: 'Завершён', draft: 'Черновик' };
  const avatarEmojis = { 'Алекс': '👨‍💻', 'Мерлин': '🧙', 'Влада': '👩‍🎨' };

  let html = `<div class="ws-project-card ${isActive ? 'active' : ''}" onclick="selectProject('${proj.id}')" style="padding-left:${4 + depth * 2}px">`;
  html += `<div class="ws-project-cover" style="background:${proj.cover}"></div>`;
  html += `<span class="ws-project-name">${highlightSearch(proj.name)}</span>`;
  html += `<span class="ws-project-status" style="background:${statusColors[proj.status] || statusColors.active}"></span>`;
  // Favorite star
  html += `<span style="font-size:11px;cursor:pointer;padding:2px;color:${isFav ? 'var(--accent-script)' : 'var(--text-dim)'};opacity:${isFav ? '1' : '0.4'}" onclick="event.stopPropagation();toggleFavorite('${proj.id}')" title="${isFav ? 'Убрать из избранного' : 'В избранное'}">${isFav ? '★' : '☆'}</span>`;
  // Edit button
  html += `<span style="font-size:10px;color:var(--text-dim);cursor:pointer;padding:2px" onclick="event.stopPropagation();openEditModal('${proj.id}')" title="Редактировать">✏️</span>`;
  // Tooltip on hover
  html += `<div class="ws-project-tooltip">`;
  html += `<div class="ws-tooltip-cover" style="background:${proj.cover}"></div>`;
  html += `<div class="ws-tooltip-title">${isFav ? '⭐ ' : ''}${proj.name}</div>`;
  html += `<div class="ws-tooltip-row"><span>📅</span> Изменён: ${proj.modified}</div>`;
  html += `<div class="ws-tooltip-row"><span>📊</span> Статус: ${statusLabels[proj.status] || 'Активный'}</div>`;
  html += `<div class="ws-tooltip-row"><span>👥</span> Участники:</div>`;
  html += `<div class="ws-tooltip-participants">`;
  (proj.participants || []).forEach(p => {
    html += `<div class="ws-tooltip-avatar" title="${p}">${avatarEmojis[p] || p[0]}</div>`;
  });
  html += `</div></div>`;
  html += `</div>`;
  return html;
}

function toggleWsNode(rowEl) {
  const toggle = rowEl.querySelector('.ws-tree-toggle');
  const children = rowEl.nextElementSibling;
  if (children && children.classList.contains('ws-tree-children')) {
    children.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
  }
}

function countAllProjects(node) {
  if (node.type === 'project') return 1;
  if (!node.children) return 0;
  return node.children.reduce((sum, c) => sum + countAllProjects(c), 0);
}

function nodeMatchesSearch(node, query) {
  const q = query.toLowerCase();
  if (node.name.toLowerCase().includes(q)) return true;
  if (node.children) return node.children.some(c => nodeMatchesSearch(c, q));
  return false;
}

function highlightSearch(text) {
  if (!searchQuery) return text;
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function selectProject(id) {
  activeProjectId = id;
  // Load per-project scenes and file tree
  if (projectScenes[id]) {
    scenes = projectScenes[id];
  }
  if (projectTrees[id]) {
    projectTree = projectTrees[id];
  }
  activeScene = 0;
  renderWorkspaceTree();
  renderSceneList();
  renderStoryboard();
}

// ===== SEARCH =====
function searchProjects(query) {
  searchQuery = query.trim();
  renderWorkspaceTree();
  renderArchiveList();
  renderTrashList();
}

// ===== ARCHIVE =====
function toggleArchive() {
  const list = document.getElementById('archiveList');
  const arrow = document.getElementById('archiveArrow');
  list.classList.toggle('expanded');
  arrow.classList.toggle('expanded');
}

function renderArchiveList() {
  const container = document.getElementById('archiveList');
  const filtered = searchQuery
    ? archivedProjects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client.toLowerCase().includes(searchQuery.toLowerCase()))
    : archivedProjects;
  document.getElementById('archiveCount').textContent = filtered.length;
  container.innerHTML = filtered.map(p => `
    <div class="ws-archived-project" onclick="restoreFromArchive('${p.id}')" title="Клик — восстановить из архива">
      <div class="ws-project-cover" style="background:${p.cover};opacity:0.5"></div>
      <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${highlightSearch(p.name)}</span>
      <span style="font-size:9px;color:var(--text-dim)">${p.modified}</span>
    </div>
  `).join('');
}

function restoreFromArchive(id) {
  const idx = archivedProjects.findIndex(p => p.id === id);
  if (idx === -1) return;
  const proj = archivedProjects.splice(idx, 1)[0];
  const firstCampaign = findFirstCampaign(workspaceFolders);
  if (firstCampaign) {
    firstCampaign.children.push({
      name: proj.name, icon: proj.icon, type: "project", id: proj.id,
      cover: proj.cover, status: "active", modified: proj.modified, participants: proj.participants
    });
  }
  renderWorkspaceTree();
  renderArchiveList();
}

// ===== FAVORITES =====
function toggleFavorite(id) {
  if (favoriteProjectIds.has(id)) {
    favoriteProjectIds.delete(id);
  } else {
    favoriteProjectIds.add(id);
  }
  updateFavoritesCount();
  renderWorkspaceTree();
}

function updateFavoritesCount() {
  document.getElementById('favoritesCount').textContent = favoriteProjectIds.size;
}

function filterWorkspace(category, el) {
  if (category === 'favorites') {
    showFavoritesOnly = !showFavoritesOnly;
    if (el) el.classList.toggle('active', showFavoritesOnly);
    renderWorkspaceTree();
  }
}

// ===== TRASH =====
function toggleTrash() {
  const list = document.getElementById('trashList');
  const arrow = document.getElementById('trashArrow');
  list.classList.toggle('expanded');
  arrow.classList.toggle('expanded');
}

function renderTrashList() {
  const container = document.getElementById('trashList');
  const filtered = searchQuery
    ? trashedProjects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : trashedProjects;
  document.getElementById('trashCount').textContent = filtered.length;
  container.innerHTML = filtered.map(p => `
    <div class="ws-archived-project" style="position:relative">
      <div class="ws-project-cover" style="background:${p.cover};opacity:0.4"></div>
      <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${highlightSearch(p.name)}</span>
      <span style="font-size:10px;cursor:pointer;padding:2px;color:var(--accent-green)" onclick="restoreFromTrash('${p.id}')" title="Восстановить">↩</span>
      <span style="font-size:10px;cursor:pointer;padding:2px;color:var(--accent-director)" onclick="deleteForever('${p.id}')" title="Удалить навсегда">✕</span>
    </div>
  `).join('');
  if (filtered.length > 0) {
    container.innerHTML += `<div style="padding:6px 8px;text-align:center"><span style="font-size:10px;color:var(--accent-director);cursor:pointer" onclick="emptyTrash()">Очистить корзину</span></div>`;
  }
}

function restoreFromTrash(id) {
  const idx = trashedProjects.findIndex(p => p.id === id);
  if (idx === -1) return;
  const proj = trashedProjects.splice(idx, 1)[0];
  const firstCampaign = findFirstCampaign(workspaceFolders);
  if (firstCampaign) {
    firstCampaign.children.push({
      name: proj.name, icon: proj.icon, type: "project", id: proj.id,
      cover: proj.cover || "linear-gradient(135deg,#555,#333)", status: "active",
      modified: proj.deletedDate, participants: proj.participants || []
    });
  }
  renderWorkspaceTree();
  renderTrashList();
}

function deleteForever(id) {
  const idx = trashedProjects.findIndex(p => p.id === id);
  if (idx !== -1) trashedProjects.splice(idx, 1);
  renderTrashList();
}

function emptyTrash() {
  trashedProjects.length = 0;
  renderTrashList();
}

function moveToTrash(id) {
  const proj = findProjectById(workspaceFolders, id);
  const parent = findProjectParent(workspaceFolders, id, null);
  if (!proj || !parent || !parent.children) return;
  parent.children = parent.children.filter(c => c.id !== id);
  const today = new Date();
  trashedProjects.push({
    name: proj.name, icon: proj.icon, id: proj.id,
    cover: proj.cover, deletedDate: `${String(today.getDate()).padStart(2,'0')}.${String(today.getMonth()+1).padStart(2,'0')}.${today.getFullYear()}`,
    participants: proj.participants
  });
  favoriteProjectIds.delete(id);
  renderWorkspaceTree();
  renderTrashList();
  updateFavoritesCount();
}

function findFirstCampaign(node) {
  if (node.type === 'campaign') return node;
  if (node.children) {
    for (const c of node.children) {
      const result = findFirstCampaign(c);
      if (result) return result;
    }
  }
  return null;
}

// ===== EDIT PROJECT MODAL =====
function findProjectById(node, id) {
  if (node.type === 'project' && node.id === id) return node;
  if (node.children) {
    for (const c of node.children) {
      const result = findProjectById(c, id);
      if (result) return result;
    }
  }
  return null;
}

function findProjectParent(node, id, parent) {
  if (node.type === 'project' && node.id === id) return parent;
  if (node.children) {
    for (const c of node.children) {
      const result = findProjectParent(c, id, node);
      if (result) return result;
    }
  }
  return null;
}

function openEditModal(id) {
  const proj = findProjectById(workspaceFolders, id);
  if (!proj) return;
  editingProjectId = id;
  document.getElementById('editProjectName').value = proj.name;
  document.getElementById('editProjectDesc').value = proj.desc || '';
  document.getElementById('editProjectStatus').value = proj.status || 'active';
  document.getElementById('editCoverPreview').style.background = proj.cover;
  document.getElementById('editCoverPreview').textContent = '';
  renderEditParticipants(proj.participants || []);
  document.getElementById('editProjectModal').classList.add('visible');
}

function closeEditModal() {
  document.getElementById('editProjectModal').classList.remove('visible');
  editingProjectId = null;
}

function renderEditParticipants(participants) {
  const container = document.getElementById('editParticipants');
  container.innerHTML = participants.map(p => `
    <div class="edit-participant-chip">
      ${p}
      <span class="edit-participant-remove" onclick="removeEditParticipant('${p}')">✕</span>
    </div>
  `).join('');
}

function addEditParticipant(name) {
  if (!name.trim() || !editingProjectId) return;
  const proj = findProjectById(workspaceFolders, editingProjectId);
  if (!proj) return;
  if (!proj.participants) proj.participants = [];
  if (!proj.participants.includes(name.trim())) {
    proj.participants.push(name.trim());
    renderEditParticipants(proj.participants);
  }
}

function removeEditParticipant(name) {
  if (!editingProjectId) return;
  const proj = findProjectById(workspaceFolders, editingProjectId);
  if (!proj || !proj.participants) return;
  proj.participants = proj.participants.filter(p => p !== name);
  renderEditParticipants(proj.participants);
}

function previewEditCover(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('editCoverPreview');
      preview.style.background = `url(${e.target.result}) center/cover`;
      preview.textContent = '';
      preview.dataset.customCover = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveEditProject() {
  if (!editingProjectId) return;
  const proj = findProjectById(workspaceFolders, editingProjectId);
  if (!proj) return;
  proj.name = document.getElementById('editProjectName').value || proj.name;
  proj.desc = document.getElementById('editProjectDesc').value;
  proj.status = document.getElementById('editProjectStatus').value;
  const preview = document.getElementById('editCoverPreview');
  if (preview.dataset.customCover) {
    proj.cover = `url(${preview.dataset.customCover}) center/cover`;
  }
  const today = new Date();
  proj.modified = `${String(today.getDate()).padStart(2,'0')}.${String(today.getMonth()+1).padStart(2,'0')}.${today.getFullYear()}`;
  closeEditModal();
  renderWorkspaceTree();
}

function archiveEditProject() {
  if (!editingProjectId) return;
  const proj = findProjectById(workspaceFolders, editingProjectId);
  const parent = findProjectParent(workspaceFolders, editingProjectId, null);
  if (!proj || !parent || !parent.children) return;
  parent.children = parent.children.filter(c => c.id !== editingProjectId);
  archivedProjects.push({
    name: proj.name, icon: proj.icon, id: proj.id,
    cover: proj.cover, status: "archived", modified: proj.modified,
    participants: proj.participants, client: "Архив"
  });
  closeEditModal();
  renderWorkspaceTree();
  renderArchiveList();
}

function trashEditProject() {
  if (!editingProjectId) return;
  moveToTrash(editingProjectId);
  closeEditModal();
}

// ===== WORKSPACE & FILES PANEL TOGGLE =====
function toggleWorkspace() {
  const panel = document.getElementById('workspacePanel');
  const app = document.getElementById('app');
  const btn = document.getElementById('expandWorkspace');
  panel.classList.toggle('collapsed');
  app.classList.toggle('workspace-collapsed');
  btn.classList.toggle('visible', panel.classList.contains('collapsed'));
  if (window._updateGridColumns) { window._updateGridColumns(); window._positionHandles(); }
}

function toggleFiles() {
  const panel = document.getElementById('sidebarFiles');
  const app = document.getElementById('app');
  const btn = document.getElementById('expandFiles');
  panel.classList.toggle('collapsed');
  app.classList.toggle('files-collapsed');
  btn.classList.toggle('visible', panel.classList.contains('collapsed'));
  if (window._updateGridColumns) { window._updateGridColumns(); window._positionHandles(); }
}

// ===== SCENE LIST (legacy compat) =====
function renderSceneList() {
  renderFileTree();
}

function getStatusIcon(st) {
  return { draft: '📝', sketch: '✏️', image: '🖼', video: '🎬' }[st] || '📝';
}
function getStatusLabel(st) {
  return { draft: 'Черновик', sketch: 'Эскиз', image: 'Кадры', video: 'Видео' }[st] || 'Черновик';
}
function getStatusClass(st) {
  return 'status-' + st;
}

function selectScene(i) {
  activeScene = i;
  renderSceneList();
  renderStoryboard();
}

function addScene() {
  scenes.push({
    id: scenes.length + 1,
    name: `Новая сцена ${scenes.length + 1}`,
    desc: "Описание...",
    status: "draft",
    duration: 5
  });
  renderSceneList();
  renderStoryboard();
}

// ===== PIPELINE STAGES =====
function switchStage(stage) {
  // Handle canvas as a special pipeline step -> opens storyboard in canvas mode
  if (stage === 'canvas') {
    switchStage('storyboard');
    switchSbMode('canvas');
    // Highlight canvas pill in pipeline
    document.querySelectorAll('.pipeline-stage').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.stage === 'canvas') el.classList.add('active');
    });
    return;
  }

  activeStage = stage;
  // Always remove canvas fullscreen when switching to any stage directly
  const appEl = document.getElementById('app');
  const sidebarRight = document.getElementById('sidebarRight');
  if (appEl) appEl.classList.remove('canvas-fullscreen');
  if (sidebarRight) sidebarRight.style.display = '';
  const toolbar = document.getElementById('sbCanvasToolbar');
  if (toolbar) toolbar.style.display = 'none';
  // Reset storyboard to dev mode when entering storyboard via pipeline
  if (stage === 'storyboard' && sbMode === 'canvas') {
    sbMode = 'dev';
    // Update button states
    ['Dev', 'Compact', 'Canvas', 'Present'].forEach(m => {
      const btn = document.getElementById('sbMode' + m + 'Btn');
      if (btn) btn.classList.remove('active');
    });
    const devBtn = document.getElementById('sbModeDevBtn');
    if (devBtn) devBtn.classList.add('active');
    // Reset title back to Сториборд
    const sbTitle = document.getElementById('sbStageTitle');
    const sbSubtitle = document.getElementById('sbStageSubtitle');
    if (sbTitle) sbTitle.innerHTML = '🎬 Сториборд';
    if (sbSubtitle) sbSubtitle.textContent = 'От слов, через эскизы, к видео.';
    renderStoryboard();
  }
  document.querySelectorAll('.stage-content').forEach(el => el.classList.remove('active'));
  document.getElementById('stage-' + stage).classList.add('active');
  document.querySelectorAll('.pipeline-stage').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.stage === stage) el.classList.add('active');
  });
}

document.querySelectorAll('.pipeline-stage').forEach(el => {
  el.addEventListener('click', () => switchStage(el.dataset.stage));
});

// ===== ASSISTANT TABS =====
document.querySelectorAll('.assistant-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.assistant-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.assistant-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
  });
});

// ===== CHIP SELECTION =====
document.addEventListener('click', (e) => {
  const chip = e.target.closest('.ctrl-chip, .setting-chip');
  if (!chip) return;

  const parent = chip.parentElement;

  if (chip.classList.contains('ctrl-chip')) {
    // Artist chips (#artistChips) = multi-select toggle
    if (parent && parent.id === 'artistChips') {
      chip.classList.toggle('selected');
      return;
    }
    // All other ctrl-chip groups = radio (one at a time)
    // Allow deselect by clicking the already-selected chip
    const wasSelected = chip.classList.contains('selected');
    parent.querySelectorAll('.ctrl-chip').forEach(c => c.classList.remove('selected'));
    if (!wasSelected) chip.classList.add('selected');
  } else if (chip.classList.contains('setting-chip')) {
    // setting-chip rows = multi-select (genre/format chips)
    chip.classList.toggle('selected');
  }
});

// ===== GENERATE BREAKDOWN =====
function generateBreakdown() {
  const text = document.getElementById('scriptText').value.trim();
  if (!text) { showToast('✍️ Введите текст сценария'); return; }

  const btn = document.getElementById('breakdownBtn');
  btn.textContent = '⚙️ Анализирую...';
  btn.disabled = true;

  // Animate the textarea border
  const ta = document.getElementById('scriptText');
  ta.style.borderColor = 'var(--accent-script)';
  ta.style.boxShadow = '0 0 0 2px rgba(232,197,71,0.15)';

  // Parse with progressive reveal simulation
  const parsed = parseScriptText(text);

  // Progressive reveal of breakdown items
  const list = document.getElementById('breakdownList');
  list.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px 0;">Анализирую структуру...</div>';

  setTimeout(() => {
    ta.style.borderColor = '';
    ta.style.boxShadow = '';
    btn.textContent = '✦ Разбить на сцены';
    btn.disabled = false;

    // Replace scenes array with parsed content
    scenes.length = 0;
    parsed.forEach(s => scenes.push(s));

    renderBreakdown();
    renderStoryboard();
    renderSceneList();

    const countEl = document.getElementById('breakdownCount');
    if (countEl) countEl.textContent = parsed.length + ' сцен';

    showToast('✦ Разбито на ' + parsed.length + ' сцен');
  }, 1100);
}

function parseScriptText(text) {
  // PRIMARY RULE: blank line between blocks = новый кадр
  // Normalize line endings, then split on any blank line (one or more empty lines)
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let chunks = normalized.split(/\n[ \t]*\n+/)
    .map(c => c.trim())
    .filter(c => c.length > 5);

  // FALLBACK A: no blank lines — each non-empty line is a chunk
  if (chunks.length <= 1) {
    chunks = normalized.split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 5);
  }

  // FALLBACK B: single long line — split by sentence pairs
  if (chunks.length <= 1) {
    const sents = normalized.match(/[^.!?…\n]+[.!?…]+/g) || [];
    chunks = [];
    for (let i = 0; i < sents.length; i += 2) {
      const g = sents.slice(i, i + 2).join(' ').trim();
      if (g.length > 10) chunks.push(g);
    }
    if (!chunks.length) chunks = [normalized.trim()];
  }

  return chunks.map((chunk, i) => ({
    name: extractSceneName(chunk, i),
    desc: chunk,
    duration: Math.max(3, Math.min(15, Math.ceil(chunk.split(/\s+/).length / 5))),
    status: 'draft',
    versions: [{ approvalStatus: 'pending' }],
    activeVersion: 0,
    activeRoles: []
  }));
}

function extractSceneName(text, index) {
  const t = text.toLowerCase();
  // Location keywords (RU + EN)
  const locations = ['лес','город','улица','дом','бункер','комната','площадь','мост','река','здание','офис','завод','рынок','парк','кухня','спальня','крыша','подвал','склад','вокзал','лаборатория','тюрьма','замок','деревня','пустыня','горы','поле','берег','пляж','торговый','центр'];
  for (const loc of locations) {
    if (t.includes(loc)) return `Сцена ${index+1}: ${loc.charAt(0).toUpperCase() + loc.slice(1)}`;
  }
  // Action keywords
  const actions = ['идёт','бежит','входит','выходит','стоит','смотрит','говорит','кричит','нападает','прячется','ищет','находит','открывает','закрывает'];
  for (const act of actions) {
    if (t.includes(act)) {
      const words = text.split(/\s+/).slice(0, 3).join(' ');
      return `Сцена ${index+1}: ${words.replace(/[.,!?]$/, '')}`;
    }
  }
  // Fallback: first 4 words
  const words = text.split(/\s+/).slice(0, 4).join(' ').replace(/[.,!?:;]$/, '');
  return words || `Сцена ${index+1}`;
}

function renderBreakdown() {
  const list = document.getElementById('breakdownList');
  list.innerHTML = scenes.map((s, i) => `
    <div class="scene-break-item fade-in" style="animation-delay:${i * 0.06}s;" id="bdi-${i}">
      <div class="scene-break-num">#${i+1}</div>
      <div style="flex:1; min-width:0;">
        <input class="breakdown-name-input" value="${s.name.replace(/"/g,'&quot;')}"
          onchange="scenes[${i}].name=this.value; renderStoryboard(); renderSceneList();"
          style="width:100%;background:transparent;border:none;border-bottom:1px solid transparent;color:var(--text);font-size:12px;font-weight:600;padding:2px 0;margin-bottom:4px;outline:none;cursor:pointer;"
          onfocus="this.style.borderBottomColor='var(--accent-script)'"
          onblur="this.style.borderBottomColor='transparent'">
        <div class="scene-break-text" id="bdt-${i}" contenteditable="true"
          style="outline:none; border-radius:4px; padding:2px 4px; margin:-2px -4px;"
          onfocus="this.style.background='var(--surface-2)'"
          onblur="this.style.background=''; scenes[${i}].desc=this.textContent.trim(); renderStoryboard();"
          >${s.desc}</div>
        <div style="margin-top:6px;display:flex;gap:4px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:var(--surface-2);color:var(--text-dim);">
            <input type="number" value="${s.duration}" min="1" max="60"
              onchange="scenes[${i}].duration=parseInt(this.value)||4"
              style="width:28px;background:transparent;border:none;color:var(--text-dim);font-size:10px;text-align:center;outline:none;"> s
          </span>
          <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:var(--surface-2);color:var(--text-dim);">Черновик</span>
          <button onclick="moveBreakdownScene(${i}, -1)" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:11px;padding:2px 5px;" title="Вверх">↑</button>
          <button onclick="moveBreakdownScene(${i}, 1)" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:11px;padding:2px 5px;" title="Вниз">↓</button>
          <button onclick="splitBreakdownScene(${i})" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:11px;padding:2px 5px;" title="Разделить на 2">✂️</button>
          <button onclick="deleteBreakdownScene(${i})" style="margin-left:auto;background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:11px;padding:2px 6px;" title="Удалить">✕</button>
        </div>
      </div>
    </div>
  `).join('') + `
    <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px;">
      <button class="action-btn" onclick="addBreakdownScene()" style="width:100%;justify-content:center;">➕ Добавить сцену вручную</button>
    </div>
    <div class="action-bar" style="margin-top:12px;">
      <button class="action-btn primary" onclick="goToStoryboard()">🎬 Перейти к сториборду (${scenes.length})</button>
      <button class="action-btn" onclick="generateBreakdown()">🔄 Перегенерировать</button>
    </div>
  `;
}

function deleteBreakdownScene(i) {
  scenes.splice(i, 1);
  renderBreakdown();
  renderStoryboard();
  renderSceneList();
  const countEl = document.getElementById('breakdownCount');
  if (countEl) countEl.textContent = scenes.length + ' сцен';
}

function addBreakdownScene() {
  const name = 'Новая сцена ' + (scenes.length + 1);
  scenes.push({ name, desc: 'Описание новой сцены...', duration: 4, status: 'draft', versions: [{ approvalStatus: 'pending' }], activeVersion: 0, activeRoles: [] });
  renderBreakdown();
  renderStoryboard();
  renderSceneList();
  // Focus the new scene name
  setTimeout(() => {
    const inputs = document.querySelectorAll('.breakdown-name-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 50);
}

function moveBreakdownScene(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= scenes.length) return;
  [scenes[i], scenes[j]] = [scenes[j], scenes[i]];
  renderBreakdown();
  renderStoryboard();
  renderSceneList();
}

function splitBreakdownScene(i) {
  const s = scenes[i];
  const sents = s.desc.match(/[^.!?…]+[.!?…]+(?:\s|$)/g);
  if (!sents || sents.length < 2) { showToast('Слишком короткий текст для разделения'); return; }
  const mid = Math.ceil(sents.length / 2);
  const part1 = sents.slice(0, mid).join('').trim();
  const part2 = sents.slice(mid).join('').trim();
  const newScene = { ...s, name: extractSceneName(part2, i + 1), desc: part2, versions: [{ approvalStatus: 'pending' }], activeVersion: 0 };
  scenes[i] = { ...s, desc: part1, name: extractSceneName(part1, i) };
  scenes.splice(i + 1, 0, newScene);
  renderBreakdown();
  renderStoryboard();
  renderSceneList();
  const countEl = document.getElementById('breakdownCount');
  if (countEl) countEl.textContent = scenes.length + ' сцен';
  showToast('✂️ Разделено на 2 сцены');
}

function goToStoryboard() {
  switchStage('storyboard');
  showToast('🎬 Сториборд: ' + scenes.length + ' кадров');
}

function updateScriptMeta() {
  const text = document.getElementById('scriptText').value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  document.getElementById('scriptWords').textContent = words + ' слов';
  document.getElementById('scriptChars').textContent = chars + ' символов';
  // Estimate scenes
  const estScenes = text.trim() ? Math.max(1, Math.round(words / 30)) : 0;
  const el = document.getElementById('scriptScenes');
  if (el) el.textContent = estScenes > 0 ? '~' + estScenes + ' сцен' : '';
}

function clearScript() {
  if (document.getElementById('scriptText').value && !confirm('Очистить сценарий?')) return;
  document.getElementById('scriptText').value = '';
  updateScriptMeta();
  document.getElementById('breakdownList').innerHTML = '<div class="empty-state" style="height:auto;padding:40px 20px;"><div class="empty-icon">✍️</div><div class="empty-desc" style="font-size:12px;">Напишите сценарий и нажмите «Разбить на сцены»</div></div>';
  const countEl = document.getElementById('breakdownCount');
  if (countEl) countEl.textContent = '';
}

function addCustomGenre(el) {
  const name = prompt('Название жанра:');
  if (!name) return;
  const chip = document.createElement('div');
  chip.className = 'setting-chip selected';
  chip.textContent = name;
  chip.onclick = function() { this.classList.toggle('selected'); };
  el.parentElement.insertBefore(chip, el);
}

// ===== STORYBOARD =====
const activeGlobalPreset = 'Cyberpunk 2077';

function getFrameStatusIcon(status) {
  if (status === 'image') return '<div class="frame-status-icon done">✅</div>';
  if (status === 'sketch') return '<div class="frame-status-icon pending">❓</div>';
  return '';
}

var sbMode: string = 'dev';
var sbSize: string = 'M';
var sbActiveTool: string = 'select';

function switchSbMode(mode) {
  sbMode = mode;
  // Update button active states
  var modeMap = { dev: 'Dev', compact: 'Compact', canvas: 'Canvas', presentation: 'Present' };
  ['Dev', 'Compact', 'Canvas', 'Present'].forEach(m => {
    const btn = document.getElementById('sbMode' + m + 'Btn');
    if (btn) btn.classList.remove('active');
  });
  var activeBtnId = 'sbMode' + (modeMap[mode] || 'Dev') + 'Btn';
  var activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) activeBtn.classList.add('active');

  const toolbar = document.getElementById('sbCanvasToolbar');
  if (toolbar) toolbar.style.display = mode === 'canvas' ? 'flex' : 'none';

  // Update stage title for canvas mode
  const sbTitle = document.getElementById('sbStageTitle');
  const sbSubtitle = document.getElementById('sbStageSubtitle');
  if (sbTitle) sbTitle.innerHTML = mode === 'canvas' ? '🎨 Канва' : '🎬 Сториборд';
  if (sbSubtitle) sbSubtitle.textContent = mode === 'canvas' ? 'Свободное пространство для раскадровки.' : 'От слов, через эскизы, к видео.';

  const appEl = document.getElementById('app');
  const workspacePanel = document.getElementById('workspacePanel');
  const sidebarRight = document.getElementById('sidebarRight');
  if (mode === 'canvas') {
    if (appEl) appEl.classList.add('canvas-fullscreen');
    if (sidebarRight) sidebarRight.style.display = 'none';
    // Highlight canvas in pipeline
    document.querySelectorAll('.pipeline-stage').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.stage === 'canvas') el.classList.add('active');
    });
  } else {
    if (appEl) appEl.classList.remove('canvas-fullscreen');
    if (mode === 'presentation') {
      if (sidebarRight) sidebarRight.style.display = 'none';
    } else {
      if (sidebarRight) sidebarRight.style.display = '';
    }
    // Highlight storyboard in pipeline when exiting canvas
    document.querySelectorAll('.pipeline-stage').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.stage === 'storyboard') el.classList.add('active');
    });
  }

  renderStoryboard();
}

// ESC to exit canvas mode
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sbMode === 'canvas') {
    switchSbMode('dev');
  }
});

function setSbTool(tool) {
  sbActiveTool = tool;
  document.querySelectorAll('.sb-tool-btn').forEach(b => b.classList.remove('active'));
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
  const btn = document.getElementById('sbTool' + capitalize(tool));
  if (btn) btn.classList.add('active');
}

function cycleApprovalStatus(sceneIdx, event) {
  event.stopPropagation();
  const s = scenes[sceneIdx];
  if (!s.versions) s.versions = [{}];
  const vi = s.activeVersion || 0;
  if (!s.versions[vi]) s.versions[vi] = {};
  const current = s.versions[vi].approvalStatus || 'pending';
  const cycle = { pending: 'approved', approved: 'rejected', rejected: 'pending' };
  s.versions[vi].approvalStatus = cycle[current];
  renderStoryboard();
}

function switchSbVersion(sceneIdx, delta, event) {
  event.stopPropagation();
  const s = scenes[sceneIdx];
  if (!s.versions) s.versions = [{}];
  const total = s.versions.length;
  s.activeVersion = ((s.activeVersion || 0) + delta + total) % total;
  renderStoryboard();
}

function toggleFrameRole(sceneIdx, role, event) {
  event.stopPropagation();
  const s = scenes[sceneIdx];
  if (!s.activeRoles) s.activeRoles = [];
  const idx = s.activeRoles.indexOf(role);
  if (idx === -1) {
    s.activeRoles.push(role);
    // Switch right panel to this role (except preset)
    if (role !== 'preset') {
      const tab = document.querySelector('.assistant-tab[data-panel="' + role + '"]');
      if (tab) tab.click();
    }
  } else {
    s.activeRoles.splice(idx, 1);
  }
  renderStoryboard();
}

function renderCanvasMode() {
  const container = document.getElementById('storyboardGrid');
  container.className = 'storyboard-free-canvas';
  container.style.gridTemplateColumns = '';

  // Auto-arrange positions if not set
  const COLS = 5, W = 148, H = 148, GAP = 20, OFFSET_X = 24, OFFSET_Y = 24;
  scenes.forEach((s, i) => {
    if (!s.canvasPos) {
      s.canvasPos = {
        x: OFFSET_X + (i % COLS) * (W + GAP),
        y: OFFSET_Y + Math.floor(i / COLS) * (H + GAP)
      };
    }
  });

  // Set container min-height based on cards
  const maxY = Math.max(...scenes.map(s => s.canvasPos.y + H + OFFSET_Y));
  container.style.minHeight = Math.max(640, maxY + 40) + 'px';

  container.innerHTML = scenes.map((s, i) => {
    if (!s.versions) s.versions = [{}];
    const vi = s.activeVersion || 0;
    const v = s.versions[vi] || {};
    const approvalStatus = v.approvalStatus || 'pending';
    const statusIcon = approvalStatus === 'approved' ? '✅' : approvalStatus === 'rejected' ? '❌' : '❓';
    const icon = s.status === 'video' ? '🎬' : s.status === 'image' ? '🖼' : s.status === 'sketch' ? '🖤' : '📝';
    const label = s.status === 'draft' ? s.desc.substring(0, 40) : s.status === 'sketch' ? 'Эскиз готов' : s.status === 'image' ? 'Изображение' : 'Видео';
    return `<div class="canvas-sq-card fade-in" id="ccard-${i}"
      style="left:${s.canvasPos.x}px; top:${s.canvasPos.y}px"
      onmousedown="canvasDragStart(event, ${i})"
      onclick="selectScene(${i})">
      <div class="canvas-sq-content">
        <span class="canvas-sq-num">#${i+1}</span>
        <div class="canvas-sq-status-badge" onclick="cycleApprovalStatus(${i}, event)">${statusIcon}</div>
        <div class="canvas-sq-icon">${icon}</div>
        <div class="canvas-sq-title">${s.name}</div>
        <div style="font-size:9px;color:var(--text-muted);margin-top:2px">${label}</div>
      </div>
      <div class="canvas-sq-footer">${s.duration}s · ${getStatusLabel(s.status)}</div>
    </div>`;
  }).join('');
}

var _drag = null;
function canvasDragStart(e, idx) {
  if (e.button !== 0) return;
  const card = document.getElementById('ccard-' + idx);
  if (!card) return;
  const container = card.parentElement;
  const rect = container.getBoundingClientRect();
  card.classList.add('dragging');
  const offsetX = e.clientX - rect.left - scenes[idx].canvasPos.x;
  const offsetY = e.clientY - rect.top - scenes[idx].canvasPos.y;
  _drag = { idx, offsetX, offsetY, card, container };
  e.preventDefault();
}
document.addEventListener('mousemove', function(e) {
  if (!_drag) return;
  const rect = _drag.container.getBoundingClientRect();
  const x = Math.max(0, e.clientX - rect.left - _drag.offsetX);
  const y = Math.max(0, e.clientY - rect.top - _drag.offsetY);
  scenes[_drag.idx].canvasPos = { x, y };
  _drag.card.style.left = x + 'px';
  _drag.card.style.top = y + 'px';
});
document.addEventListener('mouseup', function() {
  if (_drag) { _drag.card.classList.remove('dragging'); _drag = null; }
});

function renderStoryboard() {
  const grid = document.getElementById('storyboardGrid');

  if (sbMode === 'canvas') {
    renderCanvasMode();
    return;
  }

  // Clean up after canvas mode
  grid.style.minHeight = '';
  grid.className = 'storyboard-grid';
  // Re-apply current aspect ratio (CSS variable persists, grid columns may need refresh)
  if (window._currentRatio) {
    const ratioMap = { '16:9': '16/9', '9:16': '9/16', '1:1': '1/1', '4:3': '4/3', '21:9': '21/9' };
    document.documentElement.style.setProperty('--frame-ratio', ratioMap[window._currentRatio] || '16/9');
  }

  if (sbMode === 'presentation') {
    grid.className = 'storyboard-grid';
    const approved = scenes.filter(s => {
      const vi = s.activeVersion || 0;
      return s.versions && s.versions[vi] && s.versions[vi].approvalStatus === 'approved';
    });
    if (approved.length === 0) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">👁</div><div class="empty-desc" style="font-size:12px">Нет утверждённых кадров. Поставьте ✅ в режиме Разработки.</div></div>';
    } else {
      grid.innerHTML = approved.map((s, i) => {
        const origIdx = scenes.indexOf(s);
        return `
        <div class="frame-card presentation-card fade-in" style="animation-delay: ${i * 0.04}s">
          <div class="frame-header">
            <span class="frame-num">#${origIdx + 1}</span>
            <span class="frame-title">${s.name.substring(0, 20)}${s.name.length > 20 ? '...' : ''}</span>
            <div class="frame-duration" style="margin-left:auto">${s.duration}s</div>
          </div>
          <div class="frame-canvas ${s.status !== 'draft' ? 'generating' : ''}">
            <div class="placeholder">
              <div class="placeholder-icon">${getStatusIcon(s.status)}</div>
            </div>
          </div>
          <div class="frame-compact-label">${s.status === 'draft' ? s.desc.substring(0, 40) : s.status === 'sketch' ? 'Эскиз готов' : s.status === 'image' ? 'Изображение' : 'Видео'}</div>
        </div>`;
      }).join('');
    }
    applySbSize();
    return;
  }

  // Compact mode: same frame-canvas size, minimal info
  if (sbMode === 'compact') {
    grid.className = 'storyboard-grid';
    grid.innerHTML = scenes.map((s, i) => {
      if (!s.versions) s.versions = [{}];
      const vi = s.activeVersion || 0;
      const v = s.versions[vi] || {};
      const approvalStatus = v.approvalStatus || 'pending';
      const statusIcon = approvalStatus === 'approved' ? '✅' : approvalStatus === 'rejected' ? '❌' : '❓';
      return `
      <div class="frame-card ${i === activeScene ? 'active' : ''} fade-in" style="animation-delay: ${i * 0.04}s" onclick="selectScene(${i})">
        <div class="frame-header">
          <span class="frame-num">#${i+1}</span>
          <span class="frame-title">${s.name.substring(0, 20)}${s.name.length > 20 ? '...' : ''}</span>
          <div class="frame-duration" style="margin-left:auto">
            ${s.duration}s
          </div>
        </div>
        <div class="frame-canvas ${s.status !== 'draft' ? 'generating' : ''}">
          <div class="frame-approval-badge" onclick="cycleApprovalStatus(${i}, event)">${statusIcon}</div>
          <div class="placeholder">
            <div class="placeholder-icon">${getStatusIcon(s.status)}</div>
          </div>
        </div>
        <div class="frame-compact-label">${s.status === 'draft' ? s.desc.substring(0, 40) : s.status === 'sketch' ? 'Эскиз готов' : s.status === 'image' ? 'Изображение' : 'Видео'}</div>
      </div>`;
    }).join('');
    applySbSize();
    return;
  }

  grid.className = 'storyboard-grid';
  grid.innerHTML = scenes.map((s, i) => {
    if (!s.versions) s.versions = [{}];
    const vi = s.activeVersion || 0;
    const vTotal = s.versions.length;
    const v = s.versions[vi] || {};
    const approvalStatus = v.approvalStatus || 'pending';
    const statusIcon = approvalStatus === 'approved' ? '✅' : approvalStatus === 'rejected' ? '❌' : '❓';
    const verNav = vTotal > 1 ? `
      <button class="frame-ver-btn" onclick="switchSbVersion(${i}, -1, event)">&#8249;</button>
      <span class="frame-ver-indicator">${vi+1}/${vTotal}</span>
      <button class="frame-ver-btn" onclick="switchSbVersion(${i}, 1, event)">&#8250;</button>` : '';
    return `
    <div class="frame-card ${i === activeScene ? 'active' : ''} fade-in" style="animation-delay: ${i * 0.04}s" onclick="selectScene(${i})">
      <div class="frame-header">
        <span class="frame-num">#${i+1}</span>
        <span class="frame-title">${s.name.substring(0, 20)}${s.name.length > 20 ? '...' : ''}</span>
        <div style="display:flex;align-items:center;gap:3px;">
          ${verNav}
          <div class="frame-duration">
            <input type="text" value="${s.duration}" onchange="scenes[${i}].duration = parseInt(this.value)">s
          </div>
        </div>
      </div>
      <div class="frame-canvas ${v.mediaUrl ? 'has-media' : s.status !== 'draft' ? 'generating' : ''}" ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="dropMediaOnFrame(event,${i})">
        <div class="frame-badges">
          <span class="frame-badge ${v.mediaType === 'video' ? 'badge-video' : v.mediaUrl ? 'badge-color' : s.status === 'draft' ? '' : s.status === 'sketch' ? 'badge-bw' : s.status === 'image' ? 'badge-color' : 'badge-video'}">${v.mediaType === 'video' ? 'Видео' : v.mediaUrl ? 'Фото' : getStatusLabel(s.status)}</span>
        </div>
        <div class="frame-approval-badge" onclick="cycleApprovalStatus(${i}, event)">${statusIcon}</div>
        ${v.mediaUrl
          ? (v.mediaType === 'video'
            ? `<video src="${v.mediaUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;" muted loop playsinline onmouseenter="this.play()" onmouseleave="this.pause();this.currentTime=0"></video>`
            : `<img src="${v.mediaUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;" draggable="false">`)
          : `<div class="placeholder">
              <div class="placeholder-icon">${getStatusIcon(s.status)}</div>
              <div>${s.status === 'draft' ? 'Нажмите для генерации' : s.status === 'sketch' ? 'ЧБ эскиз готов' : s.status === 'image' ? 'Цветной кадр готов' : 'Видео готово'}</div>
            </div>`
        }
        <div class="frame-upload-overlay" onclick="uploadFrameMedia(${i},event)" title="Загрузить фото или видео">
          ${v.mediaUrl ? '<span style="font-size:9px;">📎 Заменить</span>' : '<span style="font-size:9px;">📎 Загрузить</span>'}
        </div>
        ${v.mediaUrl ? `<button class="frame-media-remove" onclick="removeFrameMedia(${i},event)" title="Удалить медиа">✕</button>` : ''}
      </div>
      <div class="frame-desc">
        <textarea class="frame-desc-edit" rows="2">${s.desc}</textarea>
      </div>
      <div class="frame-roles">
        ${[
          {role:'camera',   icon:'📷'},
          {role:'art',      icon:'🌍'},
          {role:'light',    icon:'💡'},
          {role:'chars',    icon:'👤'},
          {role:'objects',  icon:'📦'},
          {role:'style',    icon:'🖌'},
        ].map(r => {
          const isActive = s.activeRoles && s.activeRoles.includes(r.role);
          return '<span class="frame-role-icon' + (isActive ? ' active' : '') + '" data-role="' + r.role + '" onclick="toggleFrameRole(' + i + ',\'' + r.role + '\',event)" title="' + r.role + '">' + r.icon + '</span>';
        }).join('')}
      </div>
      <div class="frame-controls">
        <button class="frame-ctrl-btn generate-btn" onclick="generateFrame(${i}, event)" title="Сгенерировать кадр">✦ Генерировать</button>
        <button class="frame-ctrl-btn" onclick="refreshFrame(${i}, event)" title="Новая версия">🔄</button>
        <button class="frame-ctrl-btn" onclick="openFrameEditor(${i}, event)" title="Редактировать">✏️ Edit</button>
        <button class="frame-ctrl-btn delete-btn" onclick="deleteFrame(${i}, event)" title="Удалить">🗑</button>
      </div>
    </div>`;
  }).join('');
  applySbSize();
}

function generateAllSketches() {
  scenes.forEach((s, i) => {
    if (s.status === 'draft') {
      setTimeout(() => {
        scenes[i].status = 'sketch';
        renderStoryboard();
        renderSceneList();
      }, (i + 1) * 600);
    }
  });
}

// ===== TOP BAR TABS =====
document.querySelectorAll('.topbar-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.topbar-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== SLIDER VALUES =====
document.querySelectorAll('.ctrl-slider').forEach(slider => {
  slider.addEventListener('input', () => {
    const val = slider.nextElementSibling;
    if (val && val.classList.contains('ctrl-slider-val')) {
      val.textContent = slider.value;
    }
  });
});

// ===== GEN RESULT SELECTION =====
document.querySelectorAll('.gen-result').forEach(el => {
  el.addEventListener('click', () => {
    el.parentElement.querySelectorAll('.gen-result').forEach(r => r.classList.remove('selected'));
    el.classList.add('selected');
    if (!el.querySelector('.check')) {
      el.insertAdjacentHTML('beforeend', '<div class="check">✓</div>');
    }
  });
});

// ===== MODAL =====
function closeModal() {
  document.getElementById('newProjectModal').classList.remove('visible');
}
function showPreview() {
  alert('Preview: Функция предпросмотра всех сцен последовательно. В полной версии — встроенный видеоплеер.');
}
function generateKeyframes() {
  document.querySelectorAll('#genVariants .gen-result').forEach((el, i) => {
    el.classList.add('generating');
    setTimeout(() => {
      el.classList.remove('generating');
      el.style.background = `hsl(${180 + i * 30}, 40%, ${15 + i * 3}%)`;
      el.innerHTML = `<span style="color:var(--text-dim);font-size:11px">Вариант ${i+1}</span><div class="check" style="display:none">✓</div>`;
    }, 1000 + i * 500);
  });
}

// ===== PANEL RESIZE =====
(function() {
  let resizing = null;
  const MIN_WIDTH = 60;
  const MAX_WIDTH = 500;

  const panels = {
    workspace: document.getElementById('workspacePanel'),
    files: document.getElementById('sidebarFiles'),
    right: document.getElementById('sidebarRight')
  };

  // Create 3 fixed-positioned resize handles
  const handles = {};
  ['workspace', 'files', 'right'].forEach(name => {
    const h = document.createElement('div');
    h.className = 'resize-handle';
    h.dataset.resize = name;
    document.body.appendChild(h);
    handles[name] = h;

    h.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const panel = panels[name];
      if (!panel || panel.classList.contains('collapsed')) return;
      const startWidth = panel.getBoundingClientRect().width;
      resizing = { panel, target: name, startX: e.clientX, startWidth, handle: h };
      h.classList.add('active');
      document.body.classList.add('resizing');
    });
  });

  function positionHandles() {
    ['workspace', 'files', 'right'].forEach(name => {
      const panel = panels[name];
      const h = handles[name];
      if (!panel || panel.classList.contains('collapsed')) {
        h.style.display = 'none';
        return;
      }
      const rect = panel.getBoundingClientRect();
      h.style.display = 'block';
      if (name === 'right') {
        h.style.left = (rect.left - 4) + 'px';
      } else {
        h.style.left = (rect.right - 4) + 'px';
      }
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    let delta;
    if (resizing.target === 'right') {
      delta = resizing.startX - e.clientX;
    } else {
      delta = e.clientX - resizing.startX;
    }
    let newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizing.startWidth + delta));
    resizing.panel.style.width = newWidth + 'px';
    updateGridColumns();
    positionHandles();
  });

  document.addEventListener('mouseup', () => {
    if (!resizing) return;
    resizing.handle.classList.remove('active');
    document.body.classList.remove('resizing');
    resizing = null;
  });

  function updateGridColumns() {
    const app = document.getElementById('app');
    const ws = panels.workspace;
    const fl = panels.files;
    const rt = panels.right;
    const wsW = ws.classList.contains('collapsed') ? '0' : (ws.style.width || '220px');
    const flW = fl.classList.contains('collapsed') ? '0' : (fl.style.width || '260px');
    const rtW = rt.style.width || '300px';
    app.style.gridTemplateColumns = `${wsW} ${flW} 1fr ${rtW}`;
  }

  window._updateGridColumns = updateGridColumns;
  window._positionHandles = positionHandles;

  // Initial position + reposition on resize
  requestAnimationFrame(positionHandles);
  window.addEventListener('resize', positionHandles);
  // Observe panel changes
  new MutationObserver(positionHandles).observe(document.getElementById('app'), { attributes: true, subtree: true, attributeFilter: ['class'] });
})();

// ===== ALL PROJECTS SCREEN =====
let apCurrentTab = 'all';
let apContextProjectId = null;
const avatarColors = {
  'Алекс': 'linear-gradient(135deg, #4ECDC4, #06B6D4)',
  'Мерлин': 'linear-gradient(135deg, #A78BFA, #F472B6)',
  'Влада': 'linear-gradient(135deg, #F472B6, #FF6B6B)',
};
const avatarEmojisAP = { 'Алекс': '👨‍💻', 'Мерлин': '🧙', 'Влада': '👩‍🎨' };

function apGetAllProjects(node) {
  if (!node) return [];
  if (node.type === 'project') return [node];
  if (!node.children) return [];
  return node.children.flatMap(c => apGetAllProjects(c));
}

function apGetFilteredProjects() {
  const all = apGetAllProjects(workspaceFolders);
  if (apCurrentTab === 'all') return all;
  if (apCurrentTab === 'my') return all.filter(p => p.participants && p.participants.includes('Алекс'));
  if (apCurrentTab === 'team') return all.filter(p => p.participants && !p.participants.includes('Алекс'));
  if (apCurrentTab === 'deleted') return trashedProjects;
  return all;
}

function apTimeSince(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  if (diff < 7) return `${diff} дн. назад`;
  return dateStr;
}

function apDaysLeft(dateStr) {
  if (!dateStr) return 30;
  const parts = dateStr.split('.');
  if (parts.length !== 3) return 30;
  const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  const now = new Date();
  const diff = 30 - Math.floor((now - d) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function apRenderGrid() {
  const grid = document.getElementById('apGrid');
  const toolbar = document.getElementById('apToolbar');
  const projects = apGetFilteredProjects();
  const isDeleted = apCurrentTab === 'deleted';

  toolbar.style.display = isDeleted && trashedProjects.length > 0 ? 'flex' : 'none';

  // Update counts
  const all = apGetAllProjects(workspaceFolders);
  document.getElementById('apCountAll').textContent = all.length;
  document.getElementById('apCountMy').textContent = all.filter(p => p.participants && p.participants.includes('Алекс')).length;
  document.getElementById('apCountTeam').textContent = all.filter(p => p.participants && !p.participants.includes('Алекс')).length;
  document.getElementById('apCountDeleted').textContent = trashedProjects.length;

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="ap-empty" style="grid-column: 1 / -1;">
        <div class="ap-empty-icon">${isDeleted ? '🗑' : '🎬'}</div>
        <div class="ap-empty-text">${isDeleted ? 'Нет удалённых проектов' : 'Проектов пока нет'}</div>
        ${isDeleted ? '' : '<button class="ap-empty-btn" onclick="apCreateProject()">✚ Создать первый проект</button>'}
      </div>`;
    return;
  }

  grid.innerHTML = projects.map(p => {
    const cover = p.cover || 'linear-gradient(135deg, #333 0%, #555 100%)';
    const participants = p.participants || [];
    const maxShow = 3;
    const shown = participants.slice(0, maxShow);
    const extra = participants.length - maxShow;
    const dateStr = isDeleted ? p.deletedDate : p.modified;
    const daysLeft = isDeleted ? apDaysLeft(p.deletedDate) : null;

    let avatarsHtml = shown.map(name =>
      `<div class="ap-card-avatar" style="background:${avatarColors[name] || 'var(--surface-3)'}" title="${name}">${avatarEmojisAP[name] || name[0]}</div>`
    ).join('');
    if (extra > 0) avatarsHtml += `<div class="ap-card-avatar-extra">+${extra}</div>`;

    return `
      <div class="ap-card" onclick="apOpenProject('${p.id}')" data-id="${p.id}">
        <div class="ap-card-cover">
          <div class="ap-card-cover-bg" style="background:${cover}"></div>
          <div class="ap-card-actions">
            ${isDeleted ? '' : `
              <div class="ap-card-action" onclick="event.stopPropagation();apDuplicateById('${p.id}')" title="Дублировать">📋</div>
              <div class="ap-card-action" onclick="event.stopPropagation();apShareById('${p.id}')" title="Поделиться">🔗</div>
            `}
            <div class="ap-card-action" onclick="event.stopPropagation();apShowContext(event,'${p.id}',${isDeleted})" title="Ещё">⋯</div>
          </div>
          ${isDeleted ? `<div class="ap-card-deleted-badge">Удаляется через ${daysLeft} дн.</div>` : ''}
        </div>
        <div class="ap-card-body">
          <div class="ap-card-name" id="apName-${p.id}">${p.name}</div>
          <div class="ap-card-meta">Изменён: ${apTimeSince(dateStr)}</div>
          <div class="ap-card-participants">${avatarsHtml}</div>
        </div>
      </div>`;
  }).join('');
}

function apSwitchTab(tab) {
  apCurrentTab = tab;
  document.querySelectorAll('.ap-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  apRenderGrid();
}

function apOpenProject(id) {
  if (apCurrentTab === 'deleted') return;
  activeProjectId = id;
  if (projectScenes[id]) scenes = projectScenes[id];
  if (projectTrees[id]) projectTree = projectTrees[id];
  activeScene = 0;
  document.getElementById('allProjectsScreen').classList.add('hidden');
  renderWorkspaceTree();
  renderSceneList();
  renderStoryboard();
}

function apShowAllProjects() {
  document.getElementById('allProjectsScreen').classList.remove('hidden');
  apRenderGrid();
}

function apCreateProject() {
  document.getElementById('allProjectsScreen').classList.add('hidden');
  document.getElementById('newProjectModal').classList.add('visible');
}

// Context menu
function apShowContext(e, id, isDeleted) {
  e.stopPropagation();
  apContextProjectId = id;
  const menu = document.getElementById(isDeleted ? 'apContextMenuDeleted' : 'apContextMenu');
  // hide both first
  document.getElementById('apContextMenu').classList.remove('visible');
  document.getElementById('apContextMenuDeleted').classList.remove('visible');
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  menu.classList.add('visible');
}

function apHideContext() {
  document.getElementById('apContextMenu').classList.remove('visible');
  document.getElementById('apContextMenuDeleted').classList.remove('visible');
}
document.addEventListener('click', apHideContext);

function apRenameProject() {
  if (!apContextProjectId) return;
  const el = document.getElementById('apName-' + apContextProjectId);
  if (!el) return;
  const proj = findProjectById(workspaceFolders, apContextProjectId);
  if (!proj) return;
  const input = document.createElement('input');
  input.className = 'ap-card-name-input';
  input.value = proj.name;
  el.replaceWith(input);
  input.focus();
  input.select();
  const save = () => {
    proj.name = input.value.trim() || proj.name;
    apRenderGrid();
    renderWorkspaceTree();
  };
  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); if (e.key === 'Escape') { input.value = proj.name; input.blur(); } });
}

function apDuplicateProject() { apDuplicateById(apContextProjectId); }
function apDuplicateById(id) {
  const proj = findProjectById(workspaceFolders, id);
  const parent = findProjectParent(workspaceFolders, id, null);
  if (!proj || !parent || !parent.children) return;
  const clone = JSON.parse(JSON.stringify(proj));
  clone.id = 'p' + Date.now();
  clone.name = proj.name + ' (копия)';
  const today = new Date();
  clone.modified = `${String(today.getDate()).padStart(2,'0')}.${String(today.getMonth()+1).padStart(2,'0')}.${today.getFullYear()}`;
  parent.children.push(clone);
  apRenderGrid();
  renderWorkspaceTree();
}

function apShareProject() { apShareById(apContextProjectId); }
function apShareById(id) {
  alert('Ссылка скопирована: https://aiv.app/project/' + id);
}

function apDeleteProject() {
  if (!apContextProjectId) return;
  moveToTrash(apContextProjectId);
  apRenderGrid();
}

function apRestoreDeletedProject() {
  if (!apContextProjectId) return;
  restoreFromTrash(apContextProjectId);
  apRenderGrid();
}

function apDeleteForeverProject() {
  if (!apContextProjectId) return;
  deleteForever(apContextProjectId);
  apRenderGrid();
}

function apClearAllDeleted() {
  if (!confirm('Удалить все проекты из корзины навсегда?')) return;
  emptyTrash();
  apRenderGrid();
}

// Search
function apOpenSearch() {
  document.getElementById('apSearchOverlay').classList.add('visible');
  const input = document.getElementById('apSearchInput');
  input.value = '';
  input.focus();
  apFilterSearch('');
}
function apCloseSearch() {
  document.getElementById('apSearchOverlay').classList.remove('visible');
}
function apFilterSearch(query) {
  const results = document.getElementById('apSearchResults');
  const all = apGetAllProjects(workspaceFolders);
  const q = query.toLowerCase().trim();
  if (!q) {
    results.innerHTML = '<div class="ap-search-empty">Начните вводить название проекта</div>';
    return;
  }
  const filtered = all.filter(p => p.name.toLowerCase().includes(q) || (p.participants || []).some(n => n.toLowerCase().includes(q)));
  if (filtered.length === 0) {
    results.innerHTML = '<div class="ap-search-empty">Ничего не найдено</div>';
    return;
  }
  results.innerHTML = filtered.map(p => `
    <div class="ap-search-result" onclick="apCloseSearch();apOpenProject('${p.id}')">
      <div class="ap-search-result-cover" style="background:${p.cover};border-radius:4px"></div>
      <div class="ap-search-result-name">${p.name}</div>
      <div class="ap-search-result-meta">${p.modified || ''}</div>
    </div>
  `).join('');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('apSearchOverlay').classList.contains('visible')) {
    apCloseSearch();
  }
});

// ===== PRESET SYSTEM =====
const roleEmojis = { director: '🎬', camera: '📷', art: '🎨', light: '💡', chars: '👤', objects: '📦' };
let presets = JSON.parse(localStorage.getItem('aiv_presets') || '[]');
let comboPresets = JSON.parse(localStorage.getItem('aiv_combo_presets') || '[]');
let currentPresetPanel = null;

function togglePreset(el) {
  el.classList.toggle('active');
  const wrap = el.closest('.preset-block').querySelector('.preset-dropdown-wrap');
  wrap.classList.toggle('visible', el.classList.contains('active'));
}

function openSavePresetModal(panelId) {
  currentPresetPanel = panelId;
  document.getElementById('presetNameInput').value = '';
  document.getElementById('savePresetModal').classList.add('visible');
  setTimeout(() => document.getElementById('presetNameInput').focus(), 100);
}

function closeSavePresetModal() {
  document.getElementById('savePresetModal').classList.remove('visible');
  currentPresetPanel = null;
}

function savePreset() {
  const name = document.getElementById('presetNameInput').value.trim();
  if (!name || !currentPresetPanel) return;
  const panel = document.getElementById('panel-' + currentPresetPanel);
  const params = collectPanelParams(panel);
  const preset = {
    id: Date.now().toString(),
    name,
    type: 'single',
    panel: currentPresetPanel,
    params,
    createdAt: new Date().toISOString()
  };
  presets.push(preset);
  localStorage.setItem('aiv_presets', JSON.stringify(presets));
  refreshPresetDropdowns();
  closeSavePresetModal();
}

function collectPanelParams(panel) {
  const params = {};
  panel.querySelectorAll('.ctrl-group').forEach(group => {
    const label = group.querySelector('.ctrl-label');
    if (!label) return;
    const key = label.textContent.trim();
    const chips = group.querySelectorAll('.ctrl-chip.selected');
    if (chips.length > 0) {
      params[key] = Array.from(chips).map(c => c.textContent.trim());
    }
    const slider = group.querySelector('.ctrl-slider');
    if (slider) params[key + '_slider'] = slider.value;
    const input = group.querySelector('.ctrl-input');
    if (input) params[key + '_input'] = input.value;
    const select = group.querySelector('.ctrl-select');
    if (select) params[key + '_select'] = select.value;
  });
  return params;
}

function refreshPresetDropdowns() {
  document.querySelectorAll('.preset-block').forEach(block => {
    const panelId = block.dataset.panel;
    const dd = block.querySelector('.preset-dropdown');
    const panelPresets = presets.filter(p => p.panel === panelId);
    dd.innerHTML = '<option value="">Выберите пресет...</option>';
    panelPresets.forEach(p => {
      dd.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
    dd.innerHTML += '<option value="__new__">+ Создать новый пресет</option>';
  });
}

function applyPreset(selectEl) {
  const id = selectEl.value;
  if (id === '__new__') {
    const panelId = selectEl.closest('.preset-block').dataset.panel;
    openSavePresetModal(panelId);
    selectEl.value = '';
    return;
  }
  if (!id) return;
  const preset = presets.find(p => p.id === id);
  if (!preset) return;
  // Visual feedback
  selectEl.closest('.preset-block').style.borderColor = 'var(--accent-camera)';
  setTimeout(() => selectEl.closest('.preset-block').style.borderColor = '', 600);
}

function applyComboPreset(name) {
  // Visual feedback
}

// Combo preset modal
function openComboPresetModal() {
  document.getElementById('comboPresetNameInput').value = '';
  document.querySelectorAll('.preset-modal-role').forEach(r => r.classList.remove('checked'));
  document.getElementById('comboPresetModal').classList.add('visible');
  setTimeout(() => document.getElementById('comboPresetNameInput').focus(), 100);
}

function closeComboPresetModal() {
  document.getElementById('comboPresetModal').classList.remove('visible');
}

function saveComboPreset() {
  const name = document.getElementById('comboPresetNameInput').value.trim();
  if (!name) return;
  const roles = [];
  document.querySelectorAll('#comboRoleCheckboxes .preset-modal-role.checked input').forEach(cb => {
    roles.push(cb.value);
  });
  if (roles.length === 0) return;
  const params = {};
  roles.forEach(r => {
    const panel = document.getElementById('panel-' + r);
    if (panel) params[r] = collectPanelParams(panel);
  });
  const combo = {
    id: Date.now().toString(),
    name,
    type: 'combo',
    roles,
    params,
    createdAt: new Date().toISOString()
  };
  comboPresets.push(combo);
  localStorage.setItem('aiv_combo_presets', JSON.stringify(comboPresets));
  renderComboDock();
  closeComboPresetModal();
}

function renderComboDock() {
  const scroll = document.getElementById('dockPresetsScroll');
  if (!scroll) return;
  const saved = comboPresets.map(c => `
    <div class="dock-preset-card" data-preset="${c.id}" onclick="selectDockPreset(this)" oncontextmenu="event.preventDefault(); if(confirm('Удалить пресет «${c.name}»?')) { comboPresets = comboPresets.filter(x=>x.id!=='${c.id}'); localStorage.setItem('aiv_combo_presets',JSON.stringify(comboPresets)); renderComboDock(); }">
      <div class="dp-icon">${roleEmojis[c.roles[0]] || '⚡'}</div>
      <div class="dock-preset-name">${c.name}</div>
      <div class="dock-preset-roles">${c.roles.map(r => roleEmojis[r] || r).join(' ')}</div>
    </div>
  `).join('');
  scroll.querySelectorAll('.dock-preset-card[data-preset]:not([data-preset="tarantino90"]):not([data-preset="noir"]):not([data-preset="cyberpunk"]):not([data-preset="droneepic"]):not([data-preset="goldenhour"]):not([data-preset="bladerunner"])').forEach(c => c.remove());
  scroll.insertAdjacentHTML('beforeend', saved);
}

// Dock preset selection
function selectDockPreset(el) {
  el.closest('.dock-presets-scroll').querySelectorAll('.dock-preset-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  // Visual feedback
  el.style.transform = 'translateY(-4px)';
  setTimeout(() => el.style.transform = '', 200);
}

// Close modals on overlay click
document.querySelectorAll('.preset-modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => {
    if (e.target === ov) ov.classList.remove('visible');
  });
});

refreshPresetDropdowns();

// ===== STORYBOARD TOOLBAR =====
function sbToolbarSelect(btn) {
  btn.parentElement.querySelectorAll('.sb-toolbar-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setSbSize(size, btn) {
  sbSize = size;
  btn.parentElement.querySelectorAll('.sb-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applySbSize();
}
function applySbSize() {
  const grid = document.getElementById('storyboardGrid');
  if (!grid) return;
  // Fixed card width per ratio + size (height auto via aspect-ratio CSS)
  const cardSizes = {
    '16:9': { S: 220, M: 300, L: 400 },
    '9:16': { S: 160, M: 225, L: 300 },
    '1:1':  { S: 180, M: 240, L: 320 },
    '4:3':  { S: 200, M: 270, L: 360 },
    '21:9': { S: 280, M: 380, L: 500 },
  };
  const ratio = window._currentRatio || '16:9';
  const sizes = cardSizes[ratio] || cardSizes['16:9'];
  const w = sizes[sbSize] || sizes.S;
  grid.style.gridTemplateColumns = `repeat(auto-fill, ${w}px)`;
}

function switchSbTab(tab) {
  document.getElementById('sbTabPresets').classList.remove('active-accent');
  document.getElementById('sbTabPresets').classList.remove('active');
  document.getElementById('sbTabPrompts').classList.remove('active-accent');
  document.getElementById('sbTabPrompts').classList.remove('active');
  document.getElementById('sbTab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active-accent');
}

// ===== TEMPO CURVE =====
const tcPoints = [
  { x: 0, y: 30 },
  { x: 93, y: 30 },
  { x: 187, y: 30 },
  { x: 280, y: 30 }
];
const TC_MIN_Y = 5, TC_MAX_Y = 55;
const TC_MIN_TEMPO = 0.25, TC_MAX_TEMPO = 2.0;

function yToTempo(y) {
  const t = 1 - (y - TC_MIN_Y) / (TC_MAX_Y - TC_MIN_Y);
  return (TC_MIN_TEMPO + t * (TC_MAX_TEMPO - TC_MIN_TEMPO)).toFixed(1);
}

function updateTempoCurve() {
  const pts = tcPoints;
  // Catmull-Rom to cubic bezier approximation
  const svgLine = document.getElementById('tempoCurveLine');
  const svgFill = document.getElementById('tempoCurveFill');
  const circles = document.querySelectorAll('.tempo-curve-point');

  circles.forEach((c, i) => {
    c.setAttribute('cx', pts[i].x);
    c.setAttribute('cy', pts[i].y);
  });

  // Build smooth path using cubic bezier
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  svgLine.setAttribute('d', d);
  svgFill.setAttribute('d', d + ` L ${pts[pts.length-1].x},60 L ${pts[0].x},60 Z`);

  // Update labels
  pts.forEach((p, i) => {
    const label = document.getElementById('tcLabel' + i);
    if (label) label.textContent = yToTempo(p.y) + 'x';
  });
}

function resetTempoCurve() {
  tcPoints.forEach(p => p.y = 30);
  updateTempoCurve();
}

// Drag interaction
let tcDragging = null;
const tcSvg = document.getElementById('tempoCurveSvg');

if (tcSvg) {
  tcSvg.addEventListener('mousedown', e => {
    const circle = e.target.closest('.tempo-curve-point');
    if (!circle) return;
    tcDragging = parseInt(circle.dataset.index);
    circle.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (tcDragging === null) return;
    const svg = tcSvg;
    const rect = svg.getBoundingClientRect();
    const svgY = ((e.clientY - rect.top) / rect.height) * 60;
    tcPoints[tcDragging].y = Math.max(TC_MIN_Y, Math.min(TC_MAX_Y, svgY));
    updateTempoCurve();
  });

  document.addEventListener('mouseup', () => {
    if (tcDragging !== null) {
      document.querySelectorAll('.tempo-curve-point').forEach(c => c.classList.remove('dragging'));
      tcDragging = null;
    }
  });

  // Double-click to reset
  tcSvg.addEventListener('dblclick', e => {
    const circle = e.target.closest('.tempo-curve-point');
    if (circle) {
      const idx = parseInt(circle.dataset.index);
      tcPoints[idx].y = 30;
      updateTempoCurve();
    }
  });

  updateTempoCurve();
}

// ===== INIT =====
apRenderGrid(); // render All Projects screen first
renderWorkspaceTree();
renderArchiveList();
renderTrashList();
updateFavoritesCount();
renderSceneList();
renderStoryboard();

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  const icon = isLight ? '☀️' : '🌙';
  ['themeBtn', 'themeBtnMain'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = icon;
  });
}

function applyStyleToAll() {
  const selectedChips = [...document.querySelectorAll('#panel-style .ctrl-chip.selected')].map(c => c.textContent).join(', ');
  document.querySelectorAll('.storyboard-grid .frame-card').forEach(card => {
    let tag = card.querySelector('.style-applied-tag');
    if (!tag) {
      tag = document.createElement('div');
      tag.className = 'style-applied-tag';
      tag.style.cssText = 'font-size:9px;color:var(--accent-art);padding:2px 6px;background:rgba(167,139,250,0.1);border-radius:4px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      card.querySelector('.frame-meta')?.appendChild(tag);
    }
    tag.textContent = '🖌 ' + (selectedChips || 'Стиль применён');
  });
  const btn = event.target;
  btn.textContent = '✓ Применено ко всем';
  setTimeout(() => btn.textContent = 'Применить ко всем кадрам', 2000);
}

function addArtistChip() {
  const input = document.getElementById('artistInput');
  const name = input.value.trim();
  if (!name) return;
  const chip = document.createElement('div');
  chip.className = 'ctrl-chip selected';
  chip.style.cssText = '--ctrl-accent: var(--accent-art)';
  chip.textContent = name;
  chip.onclick = function() { this.classList.toggle('selected'); };
  document.getElementById('artistChips').appendChild(chip);
  input.value = '';
}

function loadRefPreview(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const info = e.target.closest('.char-info');
    const preview = info.querySelector('.char-ref-preview, .obj-ref-preview');
    preview.querySelector('img').src = ev.target.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function addCharCard() {
  const name = prompt('Имя персонажа (будет @имя):');
  if (!name) return;
  const desc = prompt('Описание персонажа:') || '';
  _addRefCard('charList', '👤', name, desc, 'char-ref-preview');
}

function addLocationCard() {
  const name = prompt('Название локации (будет @имя):');
  if (!name) return;
  const desc = prompt('Описание локации:') || '';
  _addRefCard('locationList', '📍', name, desc, 'char-ref-preview');
}

function _addRefCard(listId, emoji, name, desc, previewClass) {
  const card = document.createElement('div');
  card.className = 'character-card';
  card.innerHTML = `
    <div class="char-avatar">${emoji}</div>
    <div class="char-info" style="flex:1">
      <div class="char-name">@${name}</div>
      <div class="char-desc">${desc}</div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:4px;cursor:pointer;">
        <input type="file" accept="image/*" style="display:none;" onchange="loadRefPreview(event)">
        <span style="font-size:10px;color:var(--text-dim);border:1px dashed var(--border);border-radius:4px;padding:3px 8px;">📎 Фото-референс</span>
      </label>
      <div class="${previewClass}" style="display:none;margin-top:4px;position:relative;"><img style="width:100%;border-radius:4px;object-fit:cover;max-height:80px;"/><button onclick="this.parentElement.style.display='none'" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;cursor:pointer;">✕</button></div>
    </div>`;
  document.getElementById(listId).appendChild(card);
}

function addObjectCard() {
  const name = prompt('Название объекта (будет использоваться как @имя):');
  if (!name) return;
  const desc = prompt('Описание объекта:') || '';
  const card = document.createElement('div');
  card.className = 'character-card';
  const objId = 'objRef_' + Date.now();
  card.innerHTML = `
    <div class="char-avatar">📦</div>
    <div class="char-info" style="flex:1">
      <div class="char-name">@${name}</div>
      <div class="char-desc">${desc}</div>
      <div id="${objId}_preview" style="display:none; margin-top:6px; position:relative;">
        <img id="${objId}_img" style="width:100%; border-radius:6px; border:1px solid var(--border); object-fit:cover; max-height:80px;" />
        <button onclick="document.getElementById('${objId}_preview').style.display='none'" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:18px;height:18px;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">✕</button>
      </div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:4px;cursor:pointer;">
        <input type="file" accept="image/*" style="display:none;" onchange="(function(e){const r=new FileReader();r.onload=ev=>{document.getElementById('${objId}_img').src=ev.target.result;document.getElementById('${objId}_preview').style.display='block'};r.readAsDataURL(e.target.files[0])})(event)">
        <span style="font-size:10px;color:var(--text-dim);border:1px dashed var(--border);border-radius:4px;padding:3px 8px;">📎 Фото-референс</span>
      </label>
    </div>`;
  document.getElementById('objectList').appendChild(card);
}

function loadLocationRef(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('locationRefImg').src = ev.target.result;
    document.getElementById('locationRefPreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}
function removeLocationRef() {
  document.getElementById('locationRefImg').src = '';
  document.getElementById('locationRefPreview').style.display = 'none';
}

// ===== FRAME MEDIA UPLOAD =====
function uploadFrameMedia(idx, event) {
  if (event) event.stopPropagation();
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    loadMediaIntoFrame(idx, file);
  };
  input.click();
}

function dropMediaOnFrame(event, idx) {
  event.preventDefault();
  event.stopPropagation();
  const canvas = event.currentTarget;
  canvas.classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    showToast('⚠️ Поддерживаются только фото и видео'); return;
  }
  loadMediaIntoFrame(idx, file);
}

function loadMediaIntoFrame(idx, file) {
  const isVideo = file.type.startsWith('video/');
  const s = scenes[idx];
  if (!s.versions) s.versions = [{}];
  const vi = s.activeVersion || 0;
  if (!s.versions[vi]) s.versions[vi] = {};

  if (isVideo) {
    // Use object URL for video (data URL would be too large)
    // Revoke old URL if exists
    if (s.versions[vi].mediaObjectUrl) URL.revokeObjectURL(s.versions[vi].mediaObjectUrl);
    const url = URL.createObjectURL(file);
    s.versions[vi].mediaUrl = url;
    s.versions[vi].mediaObjectUrl = url;
    s.versions[vi].mediaType = 'video';
    s.versions[vi].mediaName = file.name;
    s.status = 'image';
    renderStoryboard();
    showToast('🎬 Видео загружено в кадр #' + (idx+1));
  } else {
    // Use FileReader for images (so it survives re-render)
    const reader = new FileReader();
    reader.onload = function(ev) {
      s.versions[vi].mediaUrl = ev.target.result;
      s.versions[vi].mediaType = 'image';
      s.versions[vi].mediaName = file.name;
      delete s.versions[vi].mediaObjectUrl;
      s.status = 'image';
      renderStoryboard();
      showToast('🖼 Фото загружено в кадр #' + (idx+1));
    };
    reader.readAsDataURL(file);
  }
}

function removeFrameMedia(idx, event) {
  if (event) event.stopPropagation();
  const s = scenes[idx];
  if (!s.versions) return;
  const vi = s.activeVersion || 0;
  const v = s.versions[vi];
  if (!v) return;
  if (v.mediaObjectUrl) URL.revokeObjectURL(v.mediaObjectUrl);
  delete v.mediaUrl;
  delete v.mediaType;
  delete v.mediaName;
  delete v.mediaObjectUrl;
  s.status = 'draft';
  renderStoryboard();
  showToast('🗑 Медиа удалено из кадра #' + (idx+1));
}

// ===== FRAME EDITOR =====
let fedSceneIdx: number | null = null;

function openFrameEditor(idx, event) {
  if (event) event.stopPropagation();
  fedSceneIdx = idx;
  const s = scenes[idx];
  document.getElementById('fedTitle').textContent = `Кадр #${idx+1} — ${s.name}`;
  document.getElementById('fedDesc').value = s.desc || '';
  document.getElementById('fedDuration').value = s.duration || 4;

  if (!s.versions) s.versions = [{}];
  const vi = s.activeVersion || 0;
  const v = s.versions[vi] || {};
  const approvalStatus = v.approvalStatus || 'pending';
  const approvalLabels = { pending: '❓ Ожидает', approved: '✅ Утверждён', rejected: '❌ Отклонён' };
  document.getElementById('fedApprovalState').textContent = approvalLabels[approvalStatus];
  document.getElementById('fedVersionInfo').textContent = `Версия ${vi+1} из ${s.versions.length}`;

  const placeholder = document.getElementById('fedPlaceholder');
  const imgEl = document.getElementById('fedImage');
  const genEl = document.getElementById('fedGenerating');
  genEl.style.display = 'none';

  if (v.imageDataUrl) {
    placeholder.style.display = 'none';
    imgEl.src = v.imageDataUrl;
    imgEl.style.display = 'block';
  } else {
    placeholder.style.display = 'flex';
    imgEl.style.display = 'none';
  }

  fedRefreshPrompt();
  document.getElementById('frameEditorModal').classList.add('visible');
  setTimeout(() => {
    const ta = document.getElementById('fedDesc');
    if (ta) ta.focus();
    setupMentionAutocomplete();
  }, 100);
}

function closeFrameEditor() {
  if (fedSceneIdx !== null) {
    const desc = document.getElementById('fedDesc').value;
    const dur = parseInt(document.getElementById('fedDuration').value);
    scenes[fedSceneIdx].desc = desc;
    if (!isNaN(dur)) scenes[fedSceneIdx].duration = dur;
    renderStoryboard();
  }
  document.getElementById('frameEditorModal').classList.remove('visible');
  const drop = document.getElementById('fedMentionDrop');
  if (drop) drop.style.display = 'none';
  fedSceneIdx = null;
}

function generateFromEditor() {
  if (fedSceneIdx === null) return;
  const gen = document.getElementById('fedGenerating');
  const placeholder = document.getElementById('fedPlaceholder');
  const imgEl = document.getElementById('fedImage');
  placeholder.style.display = 'none';
  imgEl.style.display = 'none';
  gen.style.display = 'flex';
  gen.style.flexDirection = 'column';
  gen.style.alignItems = 'center';

  const palettes = [
    ['#0f3460','#e94560'], ['#1a1a2e','#4ecdc4'], ['#16213e','#a78bfa'],
    ['#0d1117','#f97316'], ['#0a0a1a','#34d399'], ['#1e1e2e','#f472b6'],
    ['#0f1923','#fbbf24'], ['#150e28','#60a5fa']
  ];
  const [c1, c2] = palettes[fedSceneIdx % palettes.length];
  const delay = 1800 + Math.random() * 800;

  setTimeout(() => {
    gen.style.display = 'none';
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 360;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 640, 360);
    grd.addColorStop(0, c1); grd.addColorStop(1, c2);
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 640, 360);

    // Decorative circles
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(480, 80, 120, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(160, 280, 80, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(scenes[fedSceneIdx].name, 320, 170);
    ctx.font = '12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('✦ AI Generated · Кадр #' + (fedSceneIdx+1), 320, 196);

    const dataUrl = canvas.toDataURL('image/png');
    const vi = scenes[fedSceneIdx].activeVersion || 0;
    if (!scenes[fedSceneIdx].versions) scenes[fedSceneIdx].versions = [{}];
    if (!scenes[fedSceneIdx].versions[vi]) scenes[fedSceneIdx].versions[vi] = {};
    scenes[fedSceneIdx].versions[vi].imageDataUrl = dataUrl;
    scenes[fedSceneIdx].status = 'sketch';

    imgEl.src = dataUrl; imgEl.style.display = 'block';
    placeholder.style.display = 'none';
    renderStoryboard();
    showToast('✦ Кадр #' + (fedSceneIdx+1) + ' сгенерирован');
  }, delay);
}

function fedApprove(status) {
  if (fedSceneIdx === null) return;
  const s = scenes[fedSceneIdx];
  if (!s.versions) s.versions = [{}];
  const vi = s.activeVersion || 0;
  if (!s.versions[vi]) s.versions[vi] = {};
  s.versions[vi].approvalStatus = status;
  const labels = { pending: '❓ Ожидает', approved: '✅ Утверждён', rejected: '❌ Отклонён' };
  document.getElementById('fedApprovalState').textContent = labels[status];
  renderStoryboard();
  showToast(labels[status]);
}

function fedAddVersion() {
  if (fedSceneIdx === null) return;
  const s = scenes[fedSceneIdx];
  if (!s.versions) s.versions = [{}];
  s.versions.push({});
  s.activeVersion = s.versions.length - 1;
  document.getElementById('fedVersionInfo').textContent = `Версия ${s.activeVersion+1} из ${s.versions.length}`;
  document.getElementById('fedImage').style.display = 'none';
  document.getElementById('fedPlaceholder').style.display = 'flex';
  showToast('Создана версия ' + s.versions.length);
}

function fedRefreshPrompt() {
  const descEl = document.getElementById('fedDesc');
  const desc = descEl ? descEl.value : (fedSceneIdx !== null ? scenes[fedSceneIdx].desc : '');
  const prompt = buildFramePrompt(fedSceneIdx, desc);
  const box = document.getElementById('fedPromptBox');
  if (box) box.textContent = prompt;
}

function buildFramePrompt(idx, customDesc) {
  const parts = [];
  const desc = customDesc || (idx !== null && scenes[idx] ? scenes[idx].desc : '');
  if (desc) parts.push(desc);

  const cameraChips = [...document.querySelectorAll('#panel-camera .ctrl-chip.selected')].map(c => c.textContent.trim());
  if (cameraChips.length) parts.push('Camera: ' + cameraChips.join(', '));

  const weatherChips = [...document.querySelectorAll('#panel-art .ctrl-chip.selected')].map(c => c.textContent.trim());
  if (weatherChips.length) parts.push('Setting: ' + weatherChips.join(', '));

  const styleChips = [...document.querySelectorAll('#panel-style .ctrl-chip.selected')].map(c => c.textContent.trim());
  if (styleChips.length) parts.push('Style: ' + styleChips.join(', '));

  const lightChips = [...document.querySelectorAll('#panel-light .ctrl-chip.selected')].map(c => c.textContent.trim());
  if (lightChips.length) parts.push('Lighting: ' + lightChips.join(', '));

  const artistChips = [...document.querySelectorAll('#artistChips .ctrl-chip.selected')].map(c => c.textContent.trim());
  if (artistChips.length) parts.push('in the style of ' + artistChips.join(', '));

  return parts.filter(Boolean).join('. ') || 'Добавьте описание и настройте параметры в панели справа';
}

function copyFedPrompt() {
  const text = document.getElementById('fedPromptBox').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('📋 Промпт скопирован'));
}

// ===== @MENTION AUTOCOMPLETE =====
let _mentionSetup: boolean = false;
function setupMentionAutocomplete() {
  const ta = document.getElementById('fedDesc');
  const drop = document.getElementById('fedMentionDrop');
  if (!ta || !drop || _mentionSetup) return;
  _mentionSetup = true;

  ta.addEventListener('input', function() {
    const val = this.value;
    const cursor = this.selectionStart;
    const textBefore = val.substring(0, cursor);
    const atMatch = textBefore.match(/@(\w*)$/);

    if (!atMatch) { drop.style.display = 'none'; fedRefreshPrompt(); return; }

    const query = atMatch[1].toLowerCase();
    const mentions = getMentionables();
    const filtered = mentions.filter(m => m.toLowerCase().includes(query));

    if (!filtered.length) { drop.style.display = 'none'; return; }

    drop.innerHTML = filtered.map(m =>
      `<div class="mention-item" onmousedown="event.preventDefault(); insertMention('${m.replace(/'/g,"\\'")}')">@${m}</div>`
    ).join('');
    drop.style.display = 'block';
    fedRefreshPrompt();
  });

  ta.addEventListener('keydown', e => {
    if (e.key === 'Escape') drop.style.display = 'none';
  });

  ta.addEventListener('blur', () => {
    setTimeout(() => { drop.style.display = 'none'; fedRefreshPrompt(); }, 200);
  });
}

function getMentionables() {
  const chars = [...document.querySelectorAll('#charList .char-name')].map(el => el.textContent.replace('@','').trim());
  const locs = [...document.querySelectorAll('#locationList .char-name')].map(el => el.textContent.replace('@','').trim());
  const objs = [...document.querySelectorAll('#objectList .char-name')].map(el => el.textContent.replace('@','').trim());
  return [...chars, ...locs, ...objs].filter(Boolean);
}

function insertMention(name) {
  const ta = document.getElementById('fedDesc');
  const drop = document.getElementById('fedMentionDrop');
  const val = ta.value;
  const cursor = ta.selectionStart;
  const before = val.substring(0, cursor).replace(/@(\w*)$/, '@' + name + ' ');
  const after = val.substring(cursor);
  ta.value = before + after;
  ta.selectionStart = ta.selectionEnd = before.length;
  if (drop) drop.style.display = 'none';
  ta.focus();
  fedRefreshPrompt();
}

// ===== GENERATE FRAME (from card) =====
function generateFrame(idx, event) {
  if (event) event.stopPropagation();
  const s = scenes[idx];
  const cards = document.querySelectorAll('#storyboardGrid .frame-card');
  const card = cards[idx];
  if (card) {
    const canvasEl = card.querySelector('.frame-canvas');
    if (canvasEl) canvasEl.classList.add('generating');
    const ph = card.querySelector('.placeholder');
    if (ph) { ph.querySelector('.placeholder-icon').textContent = '⚙️'; ph.querySelector('div:not(.placeholder-icon)').textContent = 'Генерация...'; }
  }

  const delay = 1600 + Math.random() * 900;
  setTimeout(() => {
    s.status = 'sketch';
    renderStoryboard();
    showToast('✦ Кадр #' + (idx+1) + ' сгенерирован');
  }, delay);
}

function deleteFrame(idx, event) {
  if (event) event.stopPropagation();
  if (!confirm(`Удалить кадр #${idx+1} "${scenes[idx].name}"?`)) return;
  scenes.splice(idx, 1);
  if (activeScene >= scenes.length) activeScene = Math.max(0, scenes.length - 1);
  renderStoryboard();
  renderSceneList();
  showToast('🗑 Кадр удалён');
}

function refreshFrame(idx, event) {
  if (event) event.stopPropagation();
  const s = scenes[idx];
  if (!s.versions) s.versions = [{}];
  s.versions.push({});
  s.activeVersion = s.versions.length - 1;
  if (s.status === 'draft') {
    generateFrame(idx, event);
  } else {
    s.status = 'sketch';
    renderStoryboard();
    showToast('🔄 Новая версия кадра #' + (idx+1));
  }
}

// ===== EXPORT MODAL =====
function showExportModal() {
  document.getElementById('exportModal').classList.add('visible');
  document.getElementById('exportPromptsList').style.display = 'none';
}

function closeExportModal() {
  document.getElementById('exportModal').classList.remove('visible');
}

function exportPrompts() {
  const lines = scenes.map((s, i) => {
    const prompt = buildFramePrompt(i, s.desc);
    return `=== Кадр #${i+1}: ${s.name} ===\n${prompt}`;
  }).join('\n\n');
  document.getElementById('exportPromptsContent').textContent = lines;
  document.getElementById('exportPromptsList').style.display = 'block';
}

function copyExportPrompts() {
  const text = document.getElementById('exportPromptsContent').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('📋 Все промпты скопированы'));
}

function exportJson() {
  const data = {
    project: document.getElementById('projectName').value,
    exportedAt: new Date().toISOString(),
    scenes: scenes.map((s, i) => ({
      id: i+1, name: s.name, duration: s.duration, desc: s.desc,
      status: s.status, prompt: buildFramePrompt(i, s.desc)
    }))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = (document.getElementById('projectName').value || 'project') + '.json';
  a.click(); URL.revokeObjectURL(url);
  showToast('📄 JSON скачан'); closeExportModal();
}

function exportHtml() {
  const name = document.getElementById('projectName').value || 'Storyboard';
  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>${name}</title>
<style>body{font-family:system-ui,sans-serif;background:#08080C;color:#E8E8F0;padding:40px;margin:0}
h1{margin-bottom:8px;font-size:24px}p{color:#888;margin-bottom:32px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
.card{background:#15151F;border:1px solid #1E1E2E;border-radius:14px;overflow:hidden}
.canvas{aspect-ratio:16/9;background:linear-gradient(135deg,#1a1a2e,#4ecdc4);display:flex;align-items:center;justify-content:center;font-size:40px}
.info{padding:14px}.num{font-size:10px;color:#555;margin-bottom:4px}
.title{font-weight:600;font-size:14px;margin-bottom:6px}
.prompt{font-size:10px;color:#666;font-family:monospace;line-height:1.5;margin-top:6px;border-top:1px solid #1E1E2E;padding-top:6px}
.badge{display:inline-block;font-size:9px;padding:2px 7px;border-radius:4px;background:#1a1a2e;color:#4ecdc4;margin-bottom:6px}
</style></head><body>
<h1>🥑 ${name}</h1><p>Экспортировано ${new Date().toLocaleDateString('ru-RU')}</p>
<div class="grid">${scenes.map((s,i)=>`<div class="card">
<div class="canvas">${s.status==='draft'?'📝':s.status==='sketch'?'🖤':'🖼'}</div>
<div class="info"><div class="num">#${i+1} · ${s.duration}s</div>
<div class="badge">${s.status}</div>
<div class="title">${s.name}</div>
<div class="prompt">${buildFramePrompt(i,s.desc)}</div></div></div>`).join('')}
</div></body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name + '-storyboard.html';
  a.click(); URL.revokeObjectURL(url);
  showToast('🌐 HTML скачан'); closeExportModal();
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => { t.style.opacity = '0'; }, 2400);
}

// ===== KELVIN SLIDER LIVE =====
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('#panel-light .ctrl-slider');
  const valEl = document.querySelector('#panel-light .ctrl-slider-val');
  if (slider && valEl) {
    slider.addEventListener('input', function() {
      const k = Math.round(1500 + (this.value / 100) * 10500);
      valEl.textContent = k + 'K';
    });
  }
});

// ===== ASPECT RATIO LIVE =====
document.querySelector && document.querySelector('.aspect-select') && document.querySelector('.aspect-select').addEventListener('change', function() {
  applyAspectRatio(this.value);
});

function applyAspectRatio(val) {
  const ratioMap = { '16:9': '16/9', '9:16': '9/16', '1:1': '1/1', '4:3': '4/3', '21:9': '21/9' };
  document.documentElement.style.setProperty('--frame-ratio', ratioMap[val] || '16/9');
  window._currentRatio = val;
  applySbSize();
  showToast('📐 ' + val);
}

// ===== SCRIPT FILE UPLOAD =====
function uploadScriptFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.md,.fdx';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('scriptText').value = ev.target.result;
      showToast('📄 Загружен: ' + file.name);
    };
    reader.readAsText(file, 'UTF-8');
  };
  input.click();
}

// ===== LOCALSTORAGE AUTO-SAVE =====
function saveState() {
  try {
    localStorage.setItem('aiv_scenes_v2', JSON.stringify(scenes));
    const pn = document.getElementById('projectName');
    if (pn) localStorage.setItem('aiv_project_name', pn.value);
  } catch(e) {}
}

// Auto-save every 60 seconds
setInterval(saveState, 60000);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveState(); });