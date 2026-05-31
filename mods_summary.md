# 殺戮尖塔2 模組整合包 V4.0 模組清單

## 必装前置

| 模組資料夾 | 模組名稱 (ID) | 作者 | 版本 | 依賴 | 影響玩法 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| ModConfig | 皮皮配置: ModConfig (ModConfig) | 皮一下就很凡@Bilibili | 0.2.3 |  | 否 | 通用模组配置框架 \| Universal Mod Configuration Framework 在游戏设置页嵌入「模组配置」标签页，其他模组通过 API 注册配置项即可自动显示。支持开关、滑条、下拉框、快捷键绑定、文本输入、按钮、颜色选择器等控件。 Injects a "Mods" tab into the game settings screen. Other mods register config entries via API — toggles, sliders, dropdowns, keybinds, text inputs, buttons, and color pickers rendered automatically. |
| 前置 | CustomMenu (CustomMenu) | 桐生飞羽左 | 0.1.0 | ModConfig | 否 | A mod that replaces main menu scene and music |
| 卡牌艺术编辑器 | Card Art Editor (card_art_editor) | ysg05 | 0.1.0 |  | 否 | Adds a card art editor button to the card inspection screen. Supports local image and GIF upload, adjustable cropping, and shareable art pack import/export. |
| 基础库2 | RitsuLib (STS2 0.103.2 compat) (STS2-RitsuLib) | OLC | 0.3.0 |  | 否 | A shared Slay the Spire 2 mod framework library providing reusable patching, persistence, lifecycle, localization, and utility APIs for other mods. |
| 基础库v3.1.3 | BaseLib (BaseLib) | Alchyr | v3.1.3 |  | 否 | Modding utility for Slay the Spire 2 |
| 模组依赖库 | 帕秋莉库 (Patchoulib) | Reddo | 1.4 | BaseLib | 是 | 个人工具库，集成了一些常用Patch防止撞车。 |
| 皮肤管理器 | STS2 Skin Manager (Sts2SkinManager) | inggom | 0.12.1 |  | 否 | Manage character skin, card skin, and mixed (spine + extras) mods from one in-game panel on the Character Select screen. Hover to preview, rename inline, toggle, and layer with priority. The whole UI is wrapped in a collapsible Skin Manager toggle so it stays out of the way until you need it. |
## 功能类

| 模組資料夾 | 模組名稱 (ID) | 作者 | 版本 | 依賴 | 影響玩法 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| GM管理器 | Ascender's Sandbox (Ascenders Sandbox) | Juls88 | v1.1.1 |  | 是 | Take full control of your run with the Ascender's Sandbox'. This mod adds a dedicated "Sandbox" tab directly into your in-game settings, allowing you to toggle god mode, multiply your gold, or adjust your starting stats on the fly. |
| 上帝模式 | STS2 God Mod (sts2_god_mod) | Jason Song | 1.7.1-beta |  | 是 | God Mod is a utility and cheat-style mod for Slay the Spire 2 designed for testing, sandbox play, and faster run setup. It lets you quickly change game state, test builds, and skip repetitive preparation. God Mod 是一个面向 Slay the Spire 2 的工具型 / 作弊型模组，主要用于测试、沙盒玩法和快速起局。它让你可以快速修改游戏状态、测试构筑，并跳过重复性的准备流程。 |
| 伤害计量表 | 皮皮统计: Skada (DamageMeter) | 皮一下就很凡@Bilibili | 1.14.4 |  | 否 | 谁尽力?谁犯罪?谁的打法不团队?伤害、格挡、助攻、卡牌效率……17种战斗统计全覆盖，数据仪表盘一键复盘。开黑必装，全平台通用。 Who carried? Who slacked? 17 combat stat categories, dashboard, co-op ready. Cross-platform. |
| 倒带 | 皮皮倒带: Rewind (Rewind) | 皮一下就很凡@Bilibili | 0.26.10 |  | 否 | 皮皮倒带 — 公平撤回，不是作弊。回合倒带、房间检查点回退、公平模式、NoUndo勋章、种子查看。 \| Fair Undo, not cheating. Turn Rewind, room checkpoints, Fair Mode, NoUndo Badge, Seed Viewer. |
| 全池奖励 | Full Pool Rewards (FullPoolRewards) | benja + Codex | 1.0.3 |  | 是 | Replaces random card rewards with the current character's full card pool. |
| 六能启动 | Six Energy Start (SixEnergyStart) | benja + Codex | 1.0.1 |  | 是 | Forces every character to start runs with 6 energy instead of 3. |
| 加载存档随机更新种子 | SL Random (sl-random) | ByQsA | 1.0.0 |  | 是 | Updates random seed when loading a saved game |
| 加速游戏 | 皮皮极速: SpeedX (SpeedX) | 皮一下就很凡@Bilibili | 0.11.7 |  | 否 | 皮皮极速 — 最高20倍速！跳过动画/横幅、自动结束回合、自动拾取、自动前进，按F9自定义一切。 \| Up to 20x speed! Auto-end turn, auto-loot, auto-proceed, skip animations. F9 to customize. |
| 卡牌编辑器 | Card Editor (card_editor) | Renovice | 5.4 |  | 是 | In-game card editor + compendium-style browser. Edit costs, keywords, numbers, enchantments/afflictions, and add extra effects. Includes presets to save/load profiles. |
| 卡牌顾问 | StS2 Card Advisor (Sts2CardAdvisor) | inggom | v1.13.0 |  | 否 | 카드 보상 선택 화면에서 덱 시너지를 기반으로 추천 점수/등급을 표시합니다. |
| 卡组追踪器 | Slay the Spire 2 Deck Tracker (sts2decktracker) | 999dulgi | 1.2.1 |  | 否 | A deck tracker mod for Slay the Spire 2. |
| 命运预览 | RandomVision (RandomVision) |  | 0.2.0 |  | 否 | Transparent previews for deterministic event outcomes and Crystal Sphere. |
| 增益延续 | Powers Persist (PowersPersist) | Peyton Nowlin | v0.1.0 | BaseLib | 是 | Buffs and debuffs persist on the player across combats. Resets on save-and-quit. Optional toggles: remove power cards from the deck on play, skip persisting debuff-type powers, and skip persisting powers gained outside of combat (events). |
| 多人模式倒带 | 皮皮快连: QuickLink (QuickLink) | 皮一下就很凡@Bilibili | 0.9.8 |  | 是 | 皮皮快连：Steam联机快速回退。房主一键回到历史节点，队友自动回房、自动准备。 \| Steam multiplayer quick rewind with host-selected checkpoints, auto-rejoin, and auto-ready. |
| 多人模式展示玩家手牌 | Show Player Hand Cards (STS2-ShowPlayerHandCards) | OLC | 0.6.2 | STS2-RitsuLib | 否 | Show teammate hand cards next to the multiplayer player list in real-time, with hover to view full card details |
| 战利品一键获得 | STS2LootRewards (STS2LootRewards) | RxL | 1.0.0 |  | 否 | Adds Potion, Relic, and Gold reward buttons to the pause menu. |
| 战斗中添加、移除、升级卡牌 | STS2CardsMod (STS2CardsMod) | DidntKnew | 1.0.0 |  | 否 | Adds Add, Remove, and Upgrade card buttons directly to the pause menu. |
| 战斗撤销 | StS2 Undo (Sts2UndoMod) | inggom | v0.0.11-beta |  | 是 | 전투 진입 시점부터 종료 전까지 카드 한 장 / 한 턴 단위로 되돌릴 수 있게 합니다. 사망 후에는 되돌릴 수 없습니다. |
| 战斗日志 | Combat Log (STS2CombatLogMod) | Thebuda4 | 1.5.0 |  | 否 | Logs detailed combat actions and run statistics. In-game combat log with hoverable special text. |
| 战斗顾问 | STS2 Advisor (STS2Advisor) | gundam11 | 1.0 |  | 否 | 战斗顾问mod |
| 手柄游玩 | SlayWithController (SlayWithController) | Caelus | 1.3.4 |  | 否 | A Slay the Spire 2 mod focused on improving controller support and quality of life for controller players. |
| 提高联机人数上限 | RemoveMultiplayerPlayerLimit (RemoveMultiplayerPlayerLimit) | Rain_G | 0.1.7 |  | 是 | Raise multiplayer player cap from 4 to 16. Harmony-free rewrite with Steamworks.NET. |
| 救援队友 | 救援队友 (rescue) | TongsKing | 1.0 |  | 是 | 可以攻击队友尸体救援队友 |
| 显示能量伤害、总显示、故障球 | AutoCalculate (AutoCalculate) | KaZaRI | v0.0.1 |  | 否 | Shows incoming enemy damage, player block, and final damage during combat. |
| 更多卡牌奖励（3张→5张） | MoreCardRewards (MoreCardRewards) | Emo Used HM01 | v1.5.0 |  | 是 | Increases card reward choices from 3 to 5. |
| 更多存档 | MoreSaves (MoreSaves) | Hypersycos | 0.1.0 |  | 否 |  |
| 更好的地图 | Map Enhance Mod (sts2_map_mod) | Jason Song | 0.8.1 |  | 否 | 地图增强模组 \| Map enhancement for the STS2 map 按房间类型给地图节点上色，提供路线分析、未来房间预测、小地图预览、自定义地图画笔颜色、设置页实时预览、可调透明度与亮度，以及 F8 快速开关，帮助你更快看清路线与关键节点。 Adds room-type map tinting, route analysis, future-room predictions, mini-map overview, custom map brush colors, live settings previews, adjustable opacity/brightness, and an F8 quick toggle so routes are easier to read at a glance. |
| 更好的尖塔 | BetterSpire2 (BetterSpire2) | jdr | v1.82.3 |  | 是 | QoL mod: incoming damage totals, multi-hit labels, hand viewer, hold-R restart, skip splash, multiplayer kick/scaling |
| 更好的开局（开局获得三枚遗物蛋，所有卡升级） | Upgrade All Cards (UpgradeAllCards) | JiesiLuo | 1.0.0 |  | 是 | Automatically upgrades all starting cards and any new cards added to your deck during a run. |
| 本局卡牌放逐 | 本局卡牌放逐 (RunCardBanisher) | ryuki | v0.2 |  | 是 | 开局选择卡牌并将其从本局游戏中彻底移出，之后不能以抽牌、奖励、商店、转化或其他常见生成方式再次获得。 |
| 格挡值不重置 | Block Mod (BlockMod) | Peyton Nowlin | 1.0.0 |  | 是 | The player's block is never lost at the start of a turn (innate Barricade for every character). Enemies are unaffected. |
| 模组同步检查器 | MOD Sync Checker / 模组同步检测器 (ModSyncChecker) | K2 & Xiatingfeng | 2.3.7 |  | 否 | Compare your mod list with teammates before co-op. Supports exporting/importing MOD profiles to quickly sync with friends.  与队友联机前快速对比 MOD 列表，支持导出/导入 MOD 配置文件，方便与好友同步模组。 |
| 添加、移除、更换遗物 | FlexibleRelics (FlexibleRelics) | DeathPoker | v1.0.0 | BaseLib | 是 | Add, remove, or swap relics mid-run via an in-game manager UI. |
| 玩家颜色区分 | PlayerColors (PlayerColors) | Masaicker | v1.0.5 |  | 否 | Distinguish players by color when sharing the same character in multiplayer.  多人模式下使用相同角色时，通过颜色区分玩家。 |
| 神谕（AI分析） | STS2 Oracle (sts2-oracle-mod) | oracle | 1.0.1 |  | 否 | Strategic advisor — highlights recommended map routes with ranked overlays. |
| 移除牌组 | RemoveFromDeck (RemoveFromDeck) | Masaicker | v1.0.2 |  | 否 | Press Delete to remove cards from deck. 按Delete键删除牌组卡牌。 |
| 药水掉落几率显示 | StS2 Potion Drop Chance (Sts2PotionDropChance) | inggom | v0.5.0 |  | 否 | 맵 화면에서 일반/엘리트/Unknown 노드 옆에 포션 드롭 확률을 배지로 표시. 본인 클라이언트에만 표시되며 다른 플레이어/게임 상태에 영향 없음 (read-only). |
| 解锁全部 | Unlock All (UnlockAllMod) | local-dev | 0.1.0 |  | 是 | Unlocks all characters, timeline epochs, cards, relics, potions, events and ascensions. |
| 训练场 | Training Area (TrainingArea) | Ling Samuel | v1.1.0 |  | 是 | Training Area for Slay the Spire 2 |
| 赠送队友金币 | Gold Gift (GoldGift) | saika0721 | 1.0.0 |  | 是 | 联机时向队友赠送金币。点击队友头像打开详情面板，点 Gift Gold 按钮，输入金额即可赠送，双方金币实时同步。 |
| 赠送队友金币 | Gold Gift (-) | saika0721 | 1.0.0 |  | 否 | 联机时向队友赠送金币。点击队友头像打开详情面板，点 Gift Gold 按钮，输入金额即可赠送，双方金币实时同步。 |
| 跳过瓦库（选择头环） | Skip Vakuu Boon (codex.skip_vakuu) | Local | 0.1.0 |  | 是 | Adds a permanent skip option to Ancient Vakuu's boons, allowing you to skip without receiving any relic. |
| 选牌规划器 | 本局选牌规划 (RunCardPlanner) | ryuki | v0.1-phase1 |  | 是 | 浏览全部卡牌、维护目标卡清单，并支持保存与应用预设。 |
| 遗物稀有度展示 | Relic Rarity Display (RelicRarityDisplay) | Aiadan | 1.1 |  | 否 | Colors relics based on their rarity. |
| 魔药稀有度显示 | Potion Rarity Display (PotionRarityDisplay) | Aiadan | 1.1 |  | 否 | Colors potions based on their rarity. |
## 玩法扩展类

| 模組資料夾 | 模組名稱 (ID) | 作者 | 版本 | 依賴 | 影響玩法 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| AI队友 | sts2AITeammate (sts2AITeammate) | Sally | 1.0.2 |  | 是 | AI Teammate is an experimental Slay the Spire 2 mod that adds AI-controlled teammates to a local fake-multiplayer run. |
| 东方project先古之民 | 古老灵魂 (OldenSouls) | leddele | 1.0.0 | BaseLib | 是 | 来自旧作?的先古之民们。需要 BaseLib 支持。 |
| 伪装 | Guise (Guise) | Tbonex28b | v1.05 |  | 否 | Play as your favorite monsters. 16 unique skins across all 5 characters, each with their own animations, sound effects, and passive abilities. Select your skin on the character select screen. |
| 储君加强 | 更强的储君 (ProRegent) | 硬币落地无声 | 1.2.1 |  | 是 | 加强储君强度的mod，增加了储君的铸剑与星辉的联动性，使其在游戏中更具乐趣。 |
| 先古之民扩展包 | SnakeKing (SnakeKing) | Author | v0.0.0 | BaseLib | 是 | Slay the Spire 2 character mod created from a template for use with BaseLib |
| 先古之民扩展包 | TimeEaterTest (TimeEaterTest) | Juzimao | v0.0.0 | BaseLib | 是 | Slay the Spire 2 character mod created from a template for use with BaseLib |
| 出售模组 | Sell mod (BasicMod) | Kaiz | v0.0.19 | BaseLib | 是 | Sell mod - created from a Alchyr/ModTemplate-StS2 for use with BaseLib |
| 出牌对话 | SpeechTheSpire (SpeechTheSpire) | ClockCycas | v0.3.0 |  | 是 | 出牌与休息点选项时显示角色气泡；休息点台词在 PCK 的 localization/*/rest_site_speech.json（表 rest_site_speech）可改；故障机器人十六进制、储君叹号等规则不变。 |
| 单人游玩多人模式 | Solo Multiplayer (SoloMultiplayer) | Dx | v0.1.0 |  | 是 | Adds a local solo-controlled multiplayer standard run mode with 2-4 characters. |
| 卡牌合成升级 | Triple Reward (TripleCard) | Doneyqy123456 | v0.2.4 |  | 是 | When your deck gains three matching eligible cards, all three are consumed into one Replay 1 copy. The fused card is upgraded only if all three consumed copies were upgraded. A card reward from the next higher rarity is granted; if already highest rarity, a highest-rarity reward is granted instead. |
| 卡牌大改造 | Card Overhaul (CardOverhaul) | Bengal | 1.0.6 | BaseLib (>=3.1.2), ModConfig (>=0.2.3) | 是 | Complete card overhaul: Added enchantments slots, Prefix and Suffixes for cards, infinite smithing upgrades, Card Holographic effects, and rare-card sparkles. |
| 厄运提前降临 | Early Doom (EarlyDoom) | Pretense | 1.0.3 |  | 是 | Triggers Doom at the end of your turn instead of the end of the enemies turn. |
| 可互动君王之剑 | BetterSovereignBlade (BetterSovereignBlade) | SparkUiX | 0.0.2 |  | 是 | 更改了君王之剑的动画效果 |
| 可升级遗物 | RelicPlusMod / 遗物升级模组 (RelicPlusMod) | AXjun2333 | v0.0.0 | BaseLib | 是 | Relic upgrade mod for Slay the Spire 2 / 《Slay the Spire 2》遗物升级模组。Requires BaseLib. Supports in-game configurable upgrade rates when ModConfig is installed. |
| 商店盗窃 | ShopTheftMod (ShopTheftMod) | xxxA | v0.0.1 |  | 是 | 一个商店偷窃mod,使用右键50%的概率偷到卡牌遗物,失败要交给商人一张牌,试试你的手气吧 |
| 商店老虎机 | All-In (All-In) | cielo | 1.0 | BaseLib | 否 | Slot machines in the merchant shop |
| 塔露谷物语 | Base Camp (STS2BaseCamp) | STS2BaseCamp | 0.4.0 |  | 是 | A base camp management system with farming, potion warehouse, and pet raising. Raise pets that grant combat buffs! |
| 多人互动卡组 | Calypso'sHappyHour / 卡里普索的欢乐时光 (CalypsosHappyHour) | Yuri'sCat Calypso | v1.1.4 |  | 否 | Adds 30+ co-op cards and a new Rest Site option to make multiplayer more fun. 添加30张+和好友交互相关的卡牌，以及额外篝火选项，让联机更加有趣。 |
| 废墟图书馆 | Library Of Ruina (LibraryOfRuina) | ShuiMuNianHua | v0.5.5 |  | 是 | LibraryOfRuina Mod. Adds new relics, new monster intents, and more detailed intent descriptions for existing monsters. |
| 影之诗 | 塔之诗·超凡世界 (STSVWB) | HypnosPD | 0.1.34 | STS2-RitsuLib | 是 | WIP 参考影之诗·超凡世界创作的STS2模组。 增添了一些新的内容，改变了一些游戏玩法机制。 目前处于早期开发阶段，欢迎提出建议和反馈！ 测试群:594452454 |
| 成龙历险记十二符咒 | 12Talisman (12Talisman) | silent night | v0.0.1 |  | 是 | Slay the Spire 2 mod that adds the 12 talisman relics. |
| 时间中的帽子（遗物） | A Hat In Time - Hats (ZAHatInTimeHats) | [img]res://images/packed/sprite_fonts/silent_energy_icon.png[/img] | v1.1.1 | BaseLib | 是 | Adds the [blue]Hats[/blue] from [blue]A Hat in Time[/blue] as [gold]Relics[/gold] |
| 智能商店 | Smart Shop (sts2-smart-shop) | Warboss Dakka | 0.1.0 |  | 否 | Sell potions, pawn relics, and bridge small gold gaps at the merchant. |
| 更好的绘画 | BetterDrawing (BetterDrawing) | zhan__wu | 0.1.2 |  | 是 | A better drawing mod |
| 欲途 | LustTravel2 (LustTravel2) | 香烤奶油 & WRXinYue | 0.10.3 | STS2-RitsuLib | 是 | LustTravel2 mod for Slay the Spire 2 |
| 欲途 | LustTravel2 Patch (LustTravel2_Patch) | 香烤奶油 & WRXinYue | 0.10.0 | STS2-RitsuLib, LustTravel2 | 否 | Patch mod for LustTravel2 |
| 睡一觉 | SleepItOff (SleepItOff) | QiYues | 1.0 |  | 是 | 睡眠时退休一张卡 |
| 移除门扉 | Never Encounter Door Maker (NeverEncounterDoorMaker) | Skxmo | 1.0.0.1 |  | 是 | Player wont encounter door maker boss in the game |
| 第四幕最终攀登 | Act 4: Final Ascent (Act4FinalAscent) | iKenster | 0.1.2e |  | 是 | Act 4: Final Ascent adds The Architect as a full Act 4 boss encounter. |
| 第四幕钢铁大陆 | 霞沢美游[Kasumizawa Miyu] (Miyu_character) | 潜入aw | 1.0.3.8.12.0 | STS2-RitsuLib | 是 | 来自SRT学院的 霞沢美游,在路上捡到[gold]意外光滑的石头[/gold]所以[gold]敏捷[/gold]+1 [sine][pink][url=https://space.bilibili.com/1552616472?spm_id_from=333.40164.0.0]bili:潜入aw[/url][/pink][/sine],有建议可以在评论区评论,看看能不能改 |
| 致命厄运 | LethalDoom (LethalDoom) | RxL | 1.0.0 |  | 是 | Adds a new card Lethal Doom for the Necrobinder. |
| 赌博 | Transform Or Banish (TransformOrBanish) | Bengal | 1.01 | BaseLib | 是 | Adds paid Transform and Banish buttons to card rewards so you can reroll bad picks or blacklist cards for the rest of the run. |
| 遗物奖励选择 | Relic Reward Choice (RelicRewardChoice) | Bengal | 1.7.0 | BaseLib, ModConfig | 是 | Choose from X relic options after killing elites AND in treasure chest rooms, where X is the value you configure by using the ModConfig mod |
| 门匠重做 | DoormakerRework (DoormakerRework) | hex3 | 1.0.0 | BaseLib | 是 | A minor rework to Doormaker, changing his on-draw card consumption effect into an on-play effect. |
| 静默猎手卡组拓展 | 史上最好的猎手卡牌扩展 \| Ultimate Silent Card Expansion (UltimateSilentCardExpansion) | 原始小金人 | 0.2.2 | BaseLib | 是 | 为静默猎手添加31张新卡牌 \| Adds 31 new cards for The Silent |
## 皮肤美化类

| 模組資料夾 | 模組名稱 (ID) | 作者 | 版本 | 依賴 | 影響玩法 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| 临战爱丽丝-鸡煲卡面美化 | Alice Defect Card Art (AliceDefectCard) | Administrator | 1.0.0 |  | 否 | Defect card portrait replacements exported by CardArtEditor. |
| 临战爱丽丝-鸡煲皮肤 | Alice Defect Skin (AliceDefectSkin) | Codex port from ExtraFeminizationMod | 0.1.27 |  | 否 | Ports the Alice Defect skin from the Slay the Spire 1 ExtraFeminizationMod pack to Slay the Spire 2. Replaces Defect combat skin, portrait, selection text, selection background, rest-site animation, selection sound, and death animation while the mod is enabled. |
| 临战爱丽丝-鸡煲皮肤 | Sound Replacer (SoundReplacer) | Codex local tool | 0.3.8 |  | 否 | Replaces STS2 sound events with bundled ogg/wav/mp3 files. |
| 亡灵契约师卡面美化（漫画版） | 尖塔棺者卡图娘化 (NecrobinderFemPortraits) | 失地骑士Hatk&LingEnd | v0.1.0 |  | 否 | 棺者卡图替换Mod |
| 伊内斯（静默猎手） | Ines Silent (InesSilent) | thunninoi | v1.0.2 | BaseLib | 否 | Ines from Arknights as The Silent |
| 储君卡面美化 | 尖塔储君卡图娘化 (RegentFemPortraits) | 失地骑士HATK&LingEnd | v0.6.0 |  | 否 | 储君卡图替换 mod |
| 储君娘化皮肤 | regentSkin (regentSkin) | FeliNyx;anaertailin | 0.0.1 |  | 否 | Skin |
| 储君娘化（最新版） | Mesugaki_Regent (Mesugaki) | Seic_Oh(セイクオ),Dodobird | 0.1.1 |  | 否 | Zako Zako~♡ X(Twitter) : @Seic_Oh @DodoBird0615 |
| 储君战斗特效 | 万象辉星[RegentFX] (RegentFX) | Vitech | 0.3.0 |  | 否 | 为储君的部分卡牌按照卡面还原了特效。Q群1042906424。 Author:Vitech,SSSuika,lt_littlekk  Special thanks:Dior, OLC, Reme |
| 储君替换祥子v2 | 储君替换祥子 (Togawa_Sakiko) |  | v0.0.0 |  | 否 |  |
| 储君美化语音包 | VoiceModFramework (voicemod) | Yatima | 1.0.0 |  | 否 | Character voice line framework for Slay the Spire 2. Provides automatic voice playback and subtitle display. Place a voicepack.json in any other mod folder to add voices for additional characters. |
| 先古之民美化 | AncientRetexture (ancientretexture) | yatima | 1.0.0 |  | 否 | Replaces Ancient event backgrounds with custom illustrations |
| 十足虫娘化 | decimillipede-feminization (decimillipede-feminization) | kiteseven77 | 0.0.1 |  | 否 | 残杀千足虫娘化，目前仅有立绘替换 |
| 千鹤-铁甲战士皮肤 | Chizuru Ironclad Skin (ChizuruIroncladSkin) | Pelleas | v0.1.1 |  | 否 | Chizuru skin for Ironclad, with CZN Mod Config, optimized combat presentation, voice, effects, and defeat CG. |
| 商人美化（可爱版） | Merchant2CuteII (Merchant2CuteII) | LinXce | v1.5.0 |  | 否 | Provides a cute merchantII |
| 天魔之声选姬-亡灵契约师皮肤 | Necrobinder Osty Vaalmonica Mod (NecrobinderOstyVaalmonicaMod) | Hr.R | 0.9.2 |  | 否 | Replace the Necrobinder and Osty template to Vaalmonica Char |
| 奥契丝 亡灵契约师皮肤 | Necrobinder Osty Anim Mod (NecrobinderOstyAnimMod) | Linko&Huiyu | 1.0.0 |  | 否 | When Necrobinder plays an attack animation, Osty also plays an attack animation if Osty is alive. |
| 奥契丝 亡灵契约师皮肤 | Necrobinder Osty Visuals Mod (NecrobinderOstyVisualsMod) | Linko&Huiyu | 1.0.0 |  | 否 | 影之诗奥契丝与洛伊德替换亡灵契约师与奥斯提皮肤模组 |
| 奥契丝 亡灵契约师皮肤 | Rest Site Fondle Cursor Mod (RestSiteFondleCursorMod) | Linko&Huiyu | 1.0.0 |  | 否 | Changes the cursor to a custom fondle icon when the mouse hovers over the upper half of a character in the campfire scene. |
| 布巴亡灵契约师皮肤 | Booba Necrobinder Mod (Booba-Necrobinder-Mod) | 
ARTIST : JINROU
https://x.com/rkem741

ANIMATOR : crazyskull
https://x.com/insanus_calva

DEVELOPER : Iyan-Kim
https://x.com/IyanE_VRC_
 | v1.0.7 |  | 否 | You can use the Booba Necrobinder. |
| 明日方舟凯尔希-亡灵契约师皮肤 | Kaltsit Necrobinder (KaltsitNecrobinder) | fxhere | 1.1.4 | BaseLib | 否 | replace necrobinder with kaltsit |
| 明日方舟皮肤包 | ArknightsChenIronclad (ArknightsChenIronclad) | fxhere | v0.0.0 |  | 否 | replaces Ironclad's textures with Chen's from Arknights |
| 明日方舟皮肤包 | KaltsitNecrobinder (KaltsitNecrobinder) | fxhere | v0.0.0 |  | 否 | replaces Necrobinder's textures with Kaltsit's from Arknights |
| 明日方舟皮肤包 | ArknightsLingRegent (ArknightsLingRegent) | fxhere | v0.0.0 |  | 否 | replaces Regent's textures with Ling's from Arknights |
| 明日方舟皮肤包 | ArknightsFroStarSilent (ArknightsFroStarSilent) | fxhere | v0.0.0 |  | 否 | replaces Silent's textures with Fro-Star's from Arknights |
| 明日方舟皮肤包 | ArknightsLeiziDefect (ArknightsLeiziDefect) | fxhere | v0.0.0 |  | 否 | replaces Defect's textures with Leizi's from Arknights |
| 明日方舟陈-铁甲战士皮肤 | Chen Ironclad (ChenIronclad) | thunninoi | v1.0.2 | BaseLib | 否 | Chen The Dawnstreak from Arknights as The Ironclad |
| 明日方舟魔王-鸡煲皮肤 | Civilight Eterna as The Defect (CEdefect) | thunninoi | v1.0.0 | BaseLib | 否 | T̶h̶e̶r̶e̶s̶a̶ Civilight Eterna from Arknights as The Defect |
| 星铁Q版-原版全角色皮肤 | StarRail (StarRail) | 我杏美如画 | 0.1.0 |  | 否 | 星替换战士，猫猫替换猎宝，遐蝶替换骨妹，小黑塔替换鸡煲，刻律德菈替换储君。使用bilibili@比逗逗丶mod模版制作，图源@小熊貓max80072，免费发布在bilibili，Nexus mods |
| 梅铃卡组美化包 | MeiLin Texture Pack (StS2_MeiLinTexturePack) | Geoffery Powell | v1.0.0 | MeiLinMod | 否 | Card art texture pack for MeiLinMod. |
| 泉-铁甲战士皮肤 | Sdorica-Iz (Slay the Sdorica-IzumiSP) | Izumi | v0.999 |  | 否 | 来自龙神教派的永生者为何想进塔？ 泉sp替换铁血战士 选人界面添加额外语音  如果你喜欢我的mod，欢迎加群1101589015( OwO ) |
| 流浪龙姬替换铁甲战士 | 流浪龙姬 (IRnineIroncladReskin) | 伊琳玖IRnine | 1.1.0 |  | 否 | 感谢使用龙娘伊琳玖铁甲战士皮肤mod 该mod为完全免费在B站发布 发布者：伊琳玖IRnine 如果您付费购买了此MOD请尽量退款 |
| 猫娘商人皮肤 | 商人“阿塔” (ATA_Merchant) | OLC, 阿塔Official | 0.1.3 |  | 否 | 常规商人美化：将商人替换为可爱和风猫猫！ 本mod由 OLC 制作，角色形象由阿塔Official原创 美术资源由百南芋绘制（已委托并获得使用权） 相关内容版权归阿塔Official所有（All rights reserved） 本作品采用 CC BY-NC-ND 4.0 协议授权 转载请注明出处，禁止修改、二次创作及商业用途 |
| 赤刃女武神-铁甲战士皮肤 | 机娘“阿塔” (ATA_IronClad) | OLC, 阿塔Official | 0.1.5 |  | 否 | 铁甲战士角色美化：将铁甲战士替换为机娘“阿塔”，并替换大多数卡图 本mod由 OLC 制作，角色形象由阿塔Official原创 美术资源由百南芋 / Coria / INGOTzw / 闪光菠萝皮等画师绘制（已委托并获得使用权） 相关内容版权归阿塔Official所有（All rights reserved） 本作品采用 CC BY-NC-ND 4.0 协议授权 转载请注明出处，禁止修改、二次创作及商业用途 |
| 迷迭香-储君皮肤ModV8 | 迷迭香-储君皮肤Mod (RosmontisSkinForRegent) | bilibili : 傀儡师_lite | v0.0.2 | SkinManagerAndSkinPanelMod | 否 | 以明日方舟中的角色迷迭香的形象替换储君的皮肤模组，包含迷迭香的原皮和两套皮肤，以及作为敌人形态出现的虚实之握。 |
| 迷迭香-储君皮肤ModV8 | 皮肤管理器与皮肤面板 (SkinManagerAndSkinPanelMod) | 傀儡师_lite | v0.0.1 |  | 否 | 该Mod可以提供统一替换、管理杀戮尖塔2原版角色spine模型的接口，同时在提供一个在选择角色界面切换皮肤的面板。 |
| 铁甲战士瑟瑟卡面 | 杀戮尖塔2战士全卡面娘化 (杀戮尖塔2战士全卡面娘化) | mashu | 1.0.0 |  | 否 | 杀戮尖塔2战士全卡面娘化 card pack |
| 铁甲战士美化皮肤 | ironcladSkin (ironcladSkin) | anaertailin_FeliNyx | 0.0.1 |  | 否 | Skin |
| 银龙奥卡（板甲） | Plate Mail Orca (Orca-Plate Mail) | 独角渡鸦 | 0.0.1 |  | 否 | 将战士替换为银龙Orca【板甲】 |
| 间桐樱替换大区 | 间桐樱替换区 (MonsterReplacer) | MonsterReplacer | 1.0.0 | BaseLib | 否 | 怪物替换 |
| 鸡煲动漫皮肤 | The Defect - Card art mod (TheDefectCardArtMod) | KD-DD | v0.12 |  | 否 | Test version. Just enjoy the lovely version of the Defect！ 测试版本，试试这版可爱的鸡煲吧？ |
| 鸡煲美化皮肤 | 鸡煲 娘化 SFW3.27 (defect_sfw) | anertailin_FeliNyx_洛艸_poema | 0.0.1 |  | 否 | Skin |
## 角色扩展类

| 模組資料夾 | 模組名稱 (ID) | 作者 | 版本 | 依賴 | 影響玩法 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| 十六夜咲夜 | 十六夜咲夜 (TH_Sakuya) | Reddo | 1.8 | BaseLib, Patchoulib | 是 | 增加了一个来自东方Project的新角色，十六夜咲夜。 拥有107张角色卡牌(含多人游戏卡牌与先古牌)，7件新事件、15件新遗物和5瓶新药水。 |
| 卡芙卡 | Kafka (Kafka) | 草食系妹控 | v0.12.2 |  | 是 | 崩坏：星穹铁道 卡芙卡 自定义角色MOD。以触电、引爆、追击、改写四大机制编织命运之网。 |
| 女仆 | The Maid (TheMaid) | Genius Fox | v0.0.0 | BaseLib | 是 | She doesn't want to climb but her master said so. Well, architect has soy sauce at his room so it's not a big dal |
| 安卡希雅 | AcaciaMod (Acacia) | Acacia | 1.0 | BaseLib | 是 | Mod 描述 |
| 封兽鵺 | Houjuu Nue (NueMod) | Unknown | v0.9.5 | BaseLib (>=v3.1.4) | 是 | A new character from the Touhou Project! |
| 小鸟游星野 | StS2Hoshino (StS2Hoshino) | joy1999 | v0.0.12 | BaseLib | 是 | Slay the Spire 2 BlueArchive Hoshino character mod |
| 恩奇都 | EnkiduMod (EnkiduMod) | wfxt | v0.0.8 | BaseLib | 是 | EnkiduMod for Slay the Spire 2 |
| 摩多罗 | 摩多罗 - 秘神角色模组 (MataraMod) | leddele | 1.0.0 | BaseLib | 是 | 来自《东方天空璋》的秘神摩多罗隐岐奈，包含独特的季节与门扉机制。需要 BaseLib 支持。 |
| 斯卡蒂 | SK (SK) | YL | 1.0 | BaseLib | 是 | Mod 描述 |
| 明日方舟安洁莉娜 | CrimsonScepter_Angelina_Mod (CrimsonScepter_Angelina_Mod) | 绯红权杖攻略组 | v0.1.10 | BaseLib | 是 | 绯红权杖攻略组出品的明日方舟角色安洁莉娜的Mod |
| 林克 | LinkuraMod (LinkuraMod) | KCFindstr | 0.2.0 | STS2-RitsuLib | 是 | Adds contents inspired by Link! Like! LoveLive!. Special thanks: @密友 |
| 梅铃 | MeiLinMod (MeiLinMod) | lozalia | v0.2.5 | BaseLib | 是 | MeiLin playable character mod for Slay the Spire 2. |
| 死亡细胞枭首者 | Deadcells mod (Deadcells) | [CSTG]GongJuYin | v0.1.5 | BaseLib | 是 | v0.103.2版本适配，暂时将原有的卡图、遗物等图片添加进游戏中（后续可能会重新制作）。 |
| 死神 | ZS测试Mod (zsproject) | zswzxc | 0.4 | BaseLib | 是 | Mod 描述 |
| 火焰猫燐 | 火焰猫燐 (TH_Rin) | Reddo | 1.4 | BaseLib, Patchoulib | 是 | 加入了来自东方Project的角色，火焰猫燐。 拥有101张角色卡牌(含多人游戏卡牌与先古牌)，81张尸体衍生牌、5个新事件、15件新遗物和5瓶新药水以及1个新怪物。 |
| 爱丽丝 | 爱丽丝·玛格特洛伊德 (TH_Alice) | Reddo | 2.1 | BaseLib | 是 | 加入了来自东方Project的角色，七色的人偶师爱丽丝。 拥有95张角色卡牌(含多人游戏卡牌与先古牌)，6个新事件，10个新遗物与3瓶新药水。 |
| 神绮 | 神绮sama (ShinkiMod) | leddele | 1.0.0 | BaseLib | 是 | 神！ |
| 索拉 | CyanrainSora (CyanrainSora) | Author | v0.0.0 | BaseLib | 是 | Slay the Spire 2 character mod created from a template for use with BaseLib |
| 红雾 | KaLi mod (KaLi_mod) | LingYin | 0.9.8.3 |  | 是 | 血雾弥漫，尸横遍野！ 作者B站账号:UID:1842244278 |
| 良秀 | Ryoshu (Ryoshu) | 帽子 | 0.3.2 |  | 是 | 良秀 |
| 若叶睦 | Mutsumi (MzmChar) | 巫游 | 0.1.5 | BaseLib | 是 | 若叶睦 / Wakaba Mutsumi character mod. |
| 莫德凯撒（铁男） | 莫德凯撒 (Mordekaiser) | ice snow | 0.1.7 |  | 是 | A mod |
| 蕾米莉亚 | Remilia (Remilia) | Feiyap | v0.0.1 | BaseLib | 是 | 蕾米莉亚MOD |
| 藤原妹红 | The Immortal（藤原妹红） (MokouMod) | Autmn | v1.0.4 | BaseLib (>=v3.1.4) | 是 | A mod featuring Fujiwara no Mokou from Touhou Project. |
| 西行寺幽幽子 | 西行寺幽幽子 (TH_Yuyuko) | Reddo | 1.4 | BaseLib, Patchoulib | 是 | 加入了来自东方Project的新角色，天衣无缝的亡灵：西行寺幽幽子。 拥有111张角色卡牌(含多人游戏卡牌与先古牌)，6个新事件，15件新遗物与5瓶新药水。 |
| 观者 | Watcher (Watcher) | lamali | v1.4.3 | BaseLib | 是 | The Watcher - ports the original character to Sts2  Credits: chaendizzle - Calm, Divinity and Wrath SFX / VFX Snumodder - Korean localization NoFires - Chinese localization Continuous and Nitablade - Russian localization iwasreturnsolomon-svg - Japanese localization Valnar38 - Italian localization Cany0udance - for helping me port the animations Pet-Slime - Energy counter Vfx |
| 诺提拉 | Notira (Notira) | Ridress | 0.0.1 | BaseLib | 是 | 玩galgame的 |
| 露娜 | LunaDelta (LunaDelta) | KujouNao | v1.7.9 | BaseLib | 是 | A MOD FOR A MAGIC |
| 食指代行者 李箱 | The Index Nursefather Yi Sang (RienSang) | Eka | v1.0.2 | BaseLib, LimbusCore | 是 | The Index Nursefather Yi Sang character mod, based on Limbus Company. |
| 食指代行者 李箱 | Limbus Core (LimbusCore) | Eka | v1.0.2 | BaseLib | 是 | This mod handles the Sanity System and generic Powers from Limbus Company. |
| 魂魄妖梦 | 魂魄妖梦 (TH_Youmu) | Reddo | 1.2 | BaseLib, Patchoulib | 是 | 加入了来自东方Project的角色，半人半灵的庭师，魂魄妖梦。 拥有101张角色卡牌(含多人游戏卡牌与先古牌)，6个新事件，18件新遗物与4瓶新药水。 |
| 鸣潮漂泊者 | 漂泊者角色模组 (rover) | MC-druy | 1.2.0 | BaseLib | 是 | 添加了一位角色 |
| 黑夜君临追踪者 | 追踪者角色mod (wylder) | kashenmir | 1.0 | BaseLib | 是 | 添加了全新角色:追踪者 |