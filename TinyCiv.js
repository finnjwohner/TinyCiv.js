let gameStarted = false;

let year = 0;
let gold = 2000;
let population = 1;
let army = 0;

let buildResearchCost = 2500;
let unitResearchCost = 2500;

const navBtns = document.querySelectorAll('main nav button');
const startBtn = document.querySelector('main nav button.start-button');
const yearBtn = document.querySelector('main nav button.year-button');
const resignBtn = document.querySelector('main nav button.resign-button');
const info = document.querySelector('div.info');
const infoText = document.querySelector('div.info h2');
const log = document.querySelector('div.log');
const game = document.querySelector('.game');
const gameMessage = document.querySelector('.game h2');
const buildingsCon = document.querySelector('.buttons .buildings');
const unitsCon = document.querySelector('.buttons .units');
const buildingResearchBtn = document.querySelector('#research-building');
const unitResearchBtn = document.querySelector('#research-unit');

startBtn.addEventListener('click', StartGame);
resignBtn.addEventListener('click', Resign);
yearBtn.addEventListener('click', NextYear);

buildingResearchBtn.addEventListener('click', ResearchBuilding);
unitResearchBtn.addEventListener('click', ResearchUnit);

class Building {
    constructor(name, description, price, unlocked = false) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.unlocked = unlocked
        this.amount = 0;
        this.button;
        this.ownedText;
    }
}

class Unit {
    constructor(name, description, price, armyRating, unlocked = false) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.unlocked = unlocked;
        this.armyRating = armyRating;
        this.amount = 0;
        this.ownedText;
    }
}

let buildings = [];
let units = [];

function ResetBuys() {
    buildings = [new Building("Granary", "A granary provides +1 population per year.", 1200, true),
                new Building("Market", "A market provides +100 gold per population every year", 800, true),
                new Building("Windmill", "A market provides +100 gold per population every year", 2000, false)];
    units = [new Unit("Warrior", "The warrior provides +1 army.", 800, 1, true),
            new Unit("Archer", "The archer provides +2 army.", 1200, 2, false),
            new Unit("Knight", "The knight provides +4 army.", 2000, 4, false),];
}

function CreateButton(object, parent) {
    btn = document.createElement("button");
    parent.appendChild(btn);

    descDiv = document.createElement("div");
    descDiv.classList.add("description");
    btn.appendChild(descDiv);

    ownedText = document.createElement("h3");
    ownedText.innerHTML = `${object.amount} Owned`;
    object.ownedText = ownedText;
    descDiv.appendChild(ownedText);

    descText = document.createElement("p");
    descText.innerHTML = object.description;
    descDiv.appendChild(descText);

    object.button = btn;

    btnText = document.createElement("p");
    btnText.innerHTML = `${object.name} <span>(${FormatGold(object.price)} Gold)</span>`

    btn.appendChild(btnText);

    btn.onclick = () => {
        if (gold >= object.price) {
            gold -= object.price;
            object.amount++;
            object.ownedText.innerHTML = `${object.amount} Owned`;
            if(object.armyRating == undefined) {
                object.price += Math.round(object.price / 2);
                object.price = Math.ceil(object.price / 100) * 100;
            } else {
                army += object.armyRating;
            }
            object.button.children[1].innerHTML = `${object.name} <span>(${FormatGold(object.price)} Gold)</span>`;
            AddLog(`${object.name} bought for ${FormatGold(object.price)} Gold.`);
            SetInfoText();
        } else {
            SetMessage(`The empire cannot afford a ${object.name}.`, true);
        }
    }
}

function ResearchBuilding() {
    Research(true);
}

function ResearchUnit() {
    Research(false);
}

function Research(building = true) {
    if (!gameStarted) { return; }

    btn = unitResearchBtn;
    buyableArray = units;
    researchCost = unitResearchCost;
    parentElement = unitsCon;
    itemString = "unit";
    if(building) {
        btn = buildingResearchBtn;
        buyableArray = buildings;
        researchCost = buildResearchCost;
        parentElement = buildingsCon;
        itemString = "building";
    }

    canResearch = false;
    researchIndex = undefined;
    for(i = 0; i < buyableArray.length; i++) {
        if(!buyableArray[i].unlocked) {
            canResearch = true;
            researchIndex = i;
            break;
        }
    }

    if(canResearch) {
        if(gold >= researchCost) {
            if(building) {
                buildings[researchIndex].unlocked = true;
                buildResearchCost *= 2;
                btn.innerHTML = `Research A New Building <span>(${FormatGold(buildResearchCost)} Gold)</span>`;
            } else {
                units[researchIndex].unlocked = true;
                unitResearchCost *= 2;
                btn.innerHTML = `Research A New Unit <span>(${FormatGold(unitResearchCost)} Gold)</span>`;
            }
            CreateButton(buyableArray[researchIndex], parentElement);
            AddLog(`${buyableArray[researchIndex].name} researched for ${FormatGold(researchCost)} Gold.`);
            gold -= researchCost;
            SetInfoText();
        } else {
            SetMessage(`The empire cannot afford to research a new ${itemString}.`, true);
        }
    } else {
        SetMessage(`There are no more ${itemString}s to research.`, true);
    }
}

function StartGame() {
    if (!gameStarted) {
        gameStarted = true;

        // Set values to their defaults
        year = 0;
        gold = 2000;
        population = 1;
        army = 0;

        buildResearchCost = 2500;
        unitResearchCost = 2500;
        buildingResearchBtn.innerHTML = `Research A New Building <span>(${FormatGold(buildResearchCost)} Gold)</span>`;
        unitResearchBtn.innerHTML = `Research A New Unit <span>(${FormatGold(unitResearchCost)} Gold)</span>`;

        ResetBuys();

        // Get & delete all existing log paragraph elements
        logPs = log.children;
        logPsLength = logPs.length;
        for (i = 0; i < logPsLength; i++) {
            logPs[0].remove();
        }

        // Get & reset all existing buildings
        buildingsBtns = buildingsCon.children;
        buildingsLength = buildingsBtns.length - 2;
        for (i = 0; i < buildingsLength; i++) {
            buildingsBtns[2].remove();
        }
        buildings.forEach(building => {
            if (building.unlocked) {
                CreateButton(building, buildingsCon);
            }
        })

        // Get & reset all existing units
        unitsBtns = unitsCon.children;
        unitsLength = unitsBtns.length - 2;
        for (i = 0; i < unitsLength; i++) {
            unitsBtns[2].remove();
        }
        units.forEach(unit => {
            if (unit.unlocked) {
                CreateButton(unit, unitsCon);
            }
        })

        SetInfoText();

        navBtns.forEach(navBtn => {
            navBtn.style.display = 'inline-block';
        });

        info.style.visibility = 'visible';
        info.style.maxHeight = '300px';
        info.style.opacity = 1;

        game.style.opacity = 1;

        AddLog("New Game started.");
    }
}

function Resign() {
    if(gameStarted) {
        gameStarted = false;

        navBtns.forEach(navBtn => {
            navBtn.style.display = 'none';
        })

        document.querySelector('.start-button').style.display = 'inline-block';
        info.style.maxHeight = 0;
        info.style.visibility = 'hidden';
        info.style.opacity = 1;

        game.style.opacity = 0;
    }
}

function NextYear() {
    year++;
    population += buildings[0].amount;
    gold += (buildings[1].amount * 100) * population;
    gameMessage.style.color = 'black';
    gameMessage.innerHTML = `Year ${year} started.`;
    SetInfoText();
}

function SetMessage(message, alert = false) {
    gameMessage.innerHTML = message;
    if(alert) {
        gameMessage.style.color = 'red';
    } else {
        gameMessage.style.color = 'black';
    }
}

function AddLog(message) {
    logP = document.createElement("p");
    logP.innerHTML = `<span>Year ${year}</span> ${message}`;
    log.appendChild(logP);
    gameMessage.style.color = 'black';
    gameMessage.innerHTML = message;
    log.scrollBy(0, '100px');
    log.scrollTop = log.scrollHeight;
}

function SetInfoText() {
    infoText.innerHTML = `Turn ${year} / Gold: ${FormatGold(gold)} / Population: ${population} / Army: ${army}`;
}

function FormatGold(rawGold) {
    goldString = rawGold.toString();
    output = "";

    if(goldString.length % 3 != 0) {
        output = goldString.slice(0, goldString.length % 3);
        goldString = goldString.slice(goldString.length % 3, goldString.length);
        
        if(goldString.length > 0) {
            output += ",";
        }
    }
    
    length = goldString.length / 3;
    for(i = 0; i < length; i++) {
        output += goldString.slice(0, 3);
        goldString = goldString.slice(3, goldString.length);

        if(goldString.length > 0) {
            output += ",";
        }
    }

    return output;
}