// DOM要素の取得
const commandList = document.getElementById("commandList");
const commandCount = document.getElementById("commandCount");
const searchBox = document.getElementById("globalSearch");
const convenienceList = document.getElementById("convenienceList");
const favoriteList = document.getElementById("favoriteList");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const colorList = document.getElementById("colorList");
const colorSearch = document.getElementById("colorSearch");
const colorCount = document.getElementById("colorCount");
const dinoList = document.getElementById("dinoList");
const dinoSearch = document.getElementById("dinoSearch");
const dinoCount = document.getElementById("dinoCount");
const dinoTameFilter = document.getElementById("dinoTameFilter");
const dinoLevelInput = document.getElementById("dinoLevelInput");

// データ存在チェック
const commandData = typeof commands !== "undefined" ? commands : [];
const colorData = typeof colors !== "undefined" ? colors : [];
const dinoData = typeof dinos !== "undefined" ? dinos : [];

// localStorage キー定義
const STORAGE_KEYS = {
    FAVORITES: "asa_admin_favorites_v1",
    HISTORY: "asa_admin_history_v1"
};
const MAX_HISTORY_ITEMS = 50;

// 状態管理
let favorites = loadFavorites();
let copyHistory = loadHistory();
let selectedTameMode = "all";

// 件数表示
if (commandCount) {
    commandCount.textContent = commandData.length;
}
if (colorCount) {
    colorCount.textContent = `${colorData.length}色`;
}
if (dinoCount) {
    dinoCount.textContent = `${dinoData.length}体`;
}

// ===== localStorage 読み書き =====

function loadFavorites() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("お気に入りの読み込みに失敗:", e);
        return [];
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
        console.error("お気に入りの保存に失敗:", e);
    }
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("コピー履歴の読み込みに失敗:", e);
        return [];
    }
}

function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(copyHistory));
    } catch (e) {
        console.error("コピー履歴の保存に失敗:", e);
    }
}

// コマンドの一意識別キー生成
function getCommandKey(cmd) {
    return `${cmd.name}::${cmd.command}`;
}

function isFavorite(cmd) {
    return favorites.includes(getCommandKey(cmd));
}

function toggleFavorite(cmd) {
    const key = getCommandKey(cmd);
    if (favorites.includes(key)) {
        favorites = favorites.filter(item => item !== key);
    } else {
        favorites.push(key);
    }
    saveFavorites();
    refreshCommandViews();
}

// ===== コマンドカード生成（一覧・便利・お気に入り共通） =====

function createCommandCard(cmd) {
    const card = document.createElement("div");
    card.className = "command-card";

    const header = document.createElement("div");
    header.className = "card-header";

    const title = document.createElement("h3");
    title.textContent = `⚡ ${cmd.name}`;

    header.appendChild(title);

    if (cmd.category) {
        const badge = document.createElement("span");
        badge.className = "category-badge";
        badge.textContent = cmd.category;
        header.appendChild(badge);
    }

    const desc = document.createElement("p");
    desc.textContent = cmd.description;

    const code = document.createElement("code");
    code.textContent = cmd.command;

    const btnWrap = document.createElement("div");
    btnWrap.className = "card-actions";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "📋 コピー";
    copyBtn.addEventListener("click", () => copyCommand(cmd.command, cmd.name));

    const favActive = isFavorite(cmd);
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = `fav-btn${favActive ? " active" : ""}`;
    favBtn.textContent = favActive ? "⭐ お気に入り済み" : "☆ お気に入り";
    favBtn.addEventListener("click", () => toggleFavorite(cmd));

    btnWrap.append(copyBtn, favBtn);
    card.append(header, desc, code, btnWrap);
    return card;
}

// ===== 各画面の描画 =====

function renderCommands(data) {
    if (!commandList) return;
    commandList.innerHTML = "";

    if (data.length === 0) {
        commandList.innerHTML = "<p>該当するコマンドが見つかりません</p>";
        return;
    }

    data.forEach(cmd => {
        commandList.appendChild(createCommandCard(cmd));
    });
}

function renderConvenience() {
    if (!convenienceList) return;
    convenienceList.innerHTML = "";

    const convenienceCommands = commandData.filter(cmd => cmd.category === "便利");

    if (convenienceCommands.length === 0) {
        convenienceList.innerHTML = "<p>便利コマンドはありません。</p>";
        return;
    }

    convenienceCommands.forEach(cmd => {
        convenienceList.appendChild(createCommandCard(cmd));
    });
}

function renderFavorites() {
    if (!favoriteList) return;
    favoriteList.innerHTML = "";

    const favCommands = commandData.filter(cmd => isFavorite(cmd));

    if (favCommands.length === 0) {
        favoriteList.innerHTML = "<p>お気に入りに登録されたコマンドはありません。</p>";
        return;
    }

    favCommands.forEach(cmd => {
        favoriteList.appendChild(createCommandCard(cmd));
    });
}

function addHistory(commandText, label = "") {
    const now = new Date();
    const formattedTime = now.toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    copyHistory.unshift({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        command: commandText,
        label: label,
        copiedAt: formattedTime
    });

    if (copyHistory.length > MAX_HISTORY_ITEMS) {
        copyHistory = copyHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "";

    if (copyHistory.length === 0) {
        historyList.innerHTML = "<p>コピー履歴はまだありません。</p>";
        return;
    }

    copyHistory.forEach(entry => {
        const item = document.createElement("div");
        item.className = "history-item";

        const meta = document.createElement("div");
        meta.className = "history-meta";

        const infoText = document.createElement("span");
        infoText.textContent = entry.label
            ? `⚡ ${entry.label} ・ ${entry.copiedAt}`
            : `🕒 ${entry.copiedAt}`;

        const reCopyBtn = document.createElement("button");
        reCopyBtn.type = "button";
        reCopyBtn.textContent = "📋 再コピー";
        reCopyBtn.addEventListener("click", () => copyCommand(entry.command, entry.label));

        meta.append(infoText, reCopyBtn);

        const code = document.createElement("code");
        code.textContent = entry.command;

        item.append(meta, code);
        historyList.appendChild(item);
    });
}

function refreshCommandViews() {
    const keyword = searchBox ? searchBox.value.trim().toLowerCase() : "";

    const filtered = keyword
        ? commandData.filter(cmd =>
            cmd.name.toLowerCase().includes(keyword) ||
            cmd.description.toLowerCase().includes(keyword) ||
            cmd.command.toLowerCase().includes(keyword) ||
            (cmd.category && cmd.category.toLowerCase().includes(keyword))
        )
        : commandData;

    renderCommands(filtered);
    renderConvenience();
    renderFavorites();
}

function renderColors(filteredColors = colorData) {
    if (!colorList) return;

    if (filteredColors.length === 0) {
        colorList.innerHTML = "<p>該当するカラーが見つかりません。</p>";
        return;
    }

    colorList.innerHTML = '<div class="color-grid"></div>';
    const grid = colorList.querySelector(".color-grid");

    filteredColors.forEach(color => {
        const card = document.createElement("div");
        card.className = "color-card";

        const box = document.createElement("div");
        box.className = "color-box";
        box.style.background = color.hex;

        const info = document.createElement("div");
        info.className = "color-info";

        const idEl = document.createElement("div");
        idEl.className = "color-id";
        idEl.textContent = `ID ${color.id} (${color.hex})`;

        const nameEl = document.createElement("div");
        nameEl.className = "color-name";
        nameEl.textContent = color.name;

        info.append(idEl, nameEl);

        const actions = document.createElement("div");
        actions.className = "color-actions";

        const idCopyBtn = document.createElement("button");
        idCopyBtn.type = "button";
        idCopyBtn.className = "mini-btn";
        idCopyBtn.textContent = `ID: ${color.id}`;
        idCopyBtn.addEventListener("click", () => {
            copyCommand(String(color.id), `カラーID ${color.id} (${color.name})`);
        });

        const cmdCopyBtn = document.createElement("button");
        cmdCopyBtn.type = "button";
        cmdCopyBtn.className = "mini-btn";
        cmdCopyBtn.textContent = "色変更Cmd";
        const dinoColorCmd = `cheat SetTargetDinoColor 0 ${color.id}`;
        cmdCopyBtn.addEventListener("click", () => {
            copyCommand(dinoColorCmd, `SetTargetDinoColor 0 ${color.id}`);
        });

        actions.append(idCopyBtn, cmdCopyBtn);
        card.append(box, info, actions);
        grid.appendChild(card);
    });
}

// ===== 生物検索・描画 =====

function getDinoLevel() {
    if (!dinoLevelInput) return 150;
    const parsed = parseInt(dinoLevelInput.value, 10);
    if (Number.isNaN(parsed) || parsed < 1) return 1;
    return parsed;
}

function getDinoBpClass(dino) {
    if (dino.bpClass && dino.bpClass.trim()) {
        return dino.bpClass.trim();
    }
    const cleanName = dino.en.replace(/[^a-zA-Z0-9]/g, "");
    return `${cleanName}_Character_BP_C`;
}

function buildGmSummonCommand(dino, level) {
    const bpClass = getDinoBpClass(dino);
    return `GMSummon "${bpClass}" ${level}`;
}

function getFilteredDinos() {
    const keyword = dinoSearch ? dinoSearch.value.trim().toLowerCase() : "";

    return dinoData.filter(dino => {
        if (selectedTameMode === "tameable" && !dino.tameable) return false;
        if (selectedTameMode === "untameable" && dino.tameable) return false;

        if (!keyword) return true;

        return (
            dino.ja.toLowerCase().includes(keyword) ||
            dino.en.toLowerCase().includes(keyword) ||
            dino.map.toLowerCase().includes(keyword) ||
            dino.diet.toLowerCase().includes(keyword) ||
            dino.temperament.toLowerCase().includes(keyword) ||
            (dino.bpClass && dino.bpClass.toLowerCase().includes(keyword)) ||
            (dino.note && dino.note.toLowerCase().includes(keyword))
        );
    });
}

function renderDinos() {
    if (!dinoList) return;
    const filtered = getFilteredDinos();
    const level = getDinoLevel();
    dinoList.innerHTML = "";

    if (filtered.length === 0) {
        dinoList.innerHTML = "<p>該当する生物が見つかりません。</p>";
        return;
    }

    const grid = document.createElement("div");
    grid.className = "dino-grid";

    filtered.forEach(dino => {
        const card = document.createElement("div");
        card.className = "dino-card";

        const titleRow = document.createElement("div");
        titleRow.className = "dino-title-row";

        const nameWrap = document.createElement("div");
        const jaEl = document.createElement("span");
        jaEl.className = "dino-name-ja";
        jaEl.textContent = `🦕 ${dino.ja}`;

        const enEl = document.createElement("span");
        enEl.className = "dino-name-en";
        enEl.textContent = `(${dino.en})`;

        nameWrap.append(jaEl, enEl);

        const tameBadge = document.createElement("span");
        tameBadge.className = "category-badge";
        tameBadge.textContent = dino.tameable ? "テイム可能" : "テイム不可";

        titleRow.append(nameWrap, tameBadge);

        const tags = document.createElement("div");
        tags.className = "dino-tags";

        const mapTag = document.createElement("span");
        mapTag.className = "dino-tag";
        mapTag.textContent = `🗺️ ${dino.map}`;

        const dietTag = document.createElement("span");
        dietTag.className = "dino-tag";
        dietTag.textContent = `🍖 ${dino.diet}`;

        const tempTag = document.createElement("span");
        tempTag.className = "dino-tag";
        tempTag.textContent = `⚡ ${dino.temperament}`;

        tags.append(mapTag, dietTag, tempTag);

        card.append(titleRow, tags);

        if (dino.note) {
            const noteEl = document.createElement("div");
            noteEl.className = "dino-note";
            noteEl.textContent = `備考: ${dino.note}`;
            card.appendChild(noteEl);
        }

        const summonCmd = buildGmSummonCommand(dino, level);
        const cmdCode = document.createElement("code");
        cmdCode.className = "dino-cmd-preview";
        cmdCode.textContent = summonCmd;
        card.appendChild(cmdCode);

        const actions = document.createElement("div");
        actions.className = "dino-actions";

        const copyNameBtn = document.createElement("button");
        copyNameBtn.type = "button";
        copyNameBtn.className = "mini-btn";
        copyNameBtn.textContent = "英語名をコピー";
        copyNameBtn.addEventListener("click", () => {
            copyCommand(dino.en, `${dino.ja} (${dino.en})`);
        });

        const copySummonBtn = document.createElement("button");
        copySummonBtn.type = "button";
        copySummonBtn.className = "mini-btn";
        copySummonBtn.textContent = "GMSummonコピー";
        copySummonBtn.addEventListener("click", () => {
            copyCommand(summonCmd, `GMSummon ${dino.ja} Lv.${level}`);
        });

        actions.append(copyNameBtn, copySummonBtn);
        card.appendChild(actions);

        grid.appendChild(card);
    });

    dinoList.appendChild(grid);
}

// ===== イベント登録 =====

if (searchBox) {
    searchBox.addEventListener("input", refreshCommandViews);
}

if (colorSearch) {
    colorSearch.addEventListener("input", () => {
        const keyword = colorSearch.value.trim().toLowerCase();
        const filtered = !keyword
            ? colorData
            : colorData.filter(color =>
                String(color.id) === keyword ||
                String(color.id).includes(keyword) ||
                color.name.toLowerCase().includes(keyword) ||
                color.hex.toLowerCase().includes(keyword)
            );
        renderColors(filtered);
    });
}

if (dinoSearch) {
    dinoSearch.addEventListener("input", renderDinos);
}

if (dinoLevelInput) {
    dinoLevelInput.addEventListener("input", renderDinos);
}

if (dinoTameFilter) {
    dinoTameFilter.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            dinoTameFilter.querySelectorAll(".filter-chip").forEach(el => el.classList.remove("active"));
            chip.classList.add("active");
            selectedTameMode = chip.dataset.tame || "all";
            renderDinos();
        });
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
        if (copyHistory.length === 0) return;
        copyHistory = [];
        saveHistory();
        renderHistory();
    });
}

async function copyCommand(command, label = "") {
    try {
        await navigator.clipboard.writeText(command);
        addHistory(command, label);
        alert(`コピーしました:\n${command}`);
    } catch (err) {
        console.error("コピーに失敗しました:", err);
        alert("コピーに失敗しました");
    }
}

// メニュー・ページ切り替え
const menuButtons = document.querySelectorAll(".menu-btn");
const pages = document.querySelectorAll(".page");

menuButtons.forEach(button => {
    button.addEventListener("click", () => {
        menuButtons.forEach(btn => btn.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active-page"));

        button.classList.add("active");

        const pageName = button.dataset.page;
        const targetPage = document.getElementById(pageName + "Page");
        if (targetPage) {
            targetPage.classList.add("active-page");
        }
    });
});

// ===== 初回描画 =====
refreshCommandViews();
renderHistory();
renderColors();
renderDinos();