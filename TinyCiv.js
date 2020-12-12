//// HTML Inputs ////
/// Nav Inputs ///
const navNewGameBtn = document.querySelector(".new-game-btn");
const navNextYearBtn = document.querySelector(".next-year-btn");
const navResignBtn = document.querySelector(".resign-btn");
/// Setup Inputs ///
// Ethnicity buttons
const ethnAfricanBtn = document.querySelector(".african-btn");
const ethnEuroBtn = document.querySelector(".euro-btn");
const ethnAsianBtn = document.querySelector(".asian-btn");
// Empire Name Input
const empireNameInput = document.querySelector(".empire-name-input");
// Start Game Button
const startGameBtn = document.querySelector(".start-game-btn");
//// HTML Displays ////
/// Info Displays ///
const infoEmpireName = document.querySelector(".info-empire-name");
const infoText = document.querySelector(".info-text");
const infoLog = document.querySelector(".info-log");
const infoMsg = document.querySelector(".info-msg");
/// Main Containers ///
const conGame = document.querySelector(".game");
const conSetup = document.querySelector(".setup");
// Secondary Containers
const conBuyBuildings = document.querySelector(".buy-buildings-panel");
const conBuyUnits = document.querySelector(".buy-units-panel");
// Buttons
const researchBuildingBtn = document.querySelector(".research-building-btn");
const researchUnitBtn = document.querySelector(".research-unit-btn");

const barbBtn = document.querySelector(".barb-btn");
const countriesBtn = document.querySelector(".countries-btn");
const barbPanel = document.querySelector(".barb-panel");
const countriesPanel = document.querySelector(".countries-panel");

const barbStatus = document.querySelector(".barb-status");
const barbContBtn = document.querySelector(".barb-continue-button");

//// Game variables ////
let gameSetup = false;
let busy = false;
let ethn = undefined; // 0 = african, 1 = european, 2 = asian
let empireName = undefined;

let year = 1;
let gold = 2000;
let population = 1;
let army = 0;

let researchCosts = [2500, 2500];

//// Unit & Building classes ////
class Buyable {
    constructor(name, desc, price, unlocked = false) {
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.unlocked = unlocked;
        this.amount = 0;

        this.type = undefined;

        this.btn = undefined;
        this.textBtn = undefined;
        this.textAmount = undefined;
        this.textDesc = undefined;
    }
}

class Building extends Buyable {
    constructor(name, desc, price, unlocked = false) {
        super(name, desc, price, unlocked);
        this.type = Building;
    }
}

class Unit extends Buyable {
    constructor(name, desc, price, armyRating = undefined, unlocked = false) {
        super(name, desc, price, unlocked);
        this.armyRating = armyRating;
        this.type = Unit;
    }
}

function SetBuyables() {
    buildings = [new Building("Granary", "A granary provides +1 population per year.", 1200, true),
                 new Building("Market", "A market provides +100 gold per population every year.", 800, true),
                 new Building("Barracks", "A barracks increases the army given by each unit.", 2000),
                 new Building("Castle", "A castle provides +5 army per year.", 5000, false)];

    units = [new Unit("Warrior", undefined, 800, 1, true),
             new Unit("Archer", undefined, 1200, 2),
             new Unit("Knight", undefined, 2000, 4),
             new Unit("Scout", "Scouts gather intelligence on enemies. Each scout adds 5% chance of information gathering.", 15000)];
}

//// Events ////
/// Nav Buttons ///
navNewGameBtn.addEventListener('click', NewGame);
navNextYearBtn.addEventListener('click', NextYear);
navResignBtn.addEventListener('click', ResignGame);
/// Ethnicity Buttons & Typing ///
ethnAfricanBtn.addEventListener('click', SelectEthn0);
ethnEuroBtn.addEventListener('click', SelectEthn1);
ethnAsianBtn.addEventListener('click', SelectEthn2);
addEventListener('keyup', CanSetup);
// Start game button
startGameBtn.addEventListener('click', StartGame);
// Main game buttons
researchBuildingBtn.addEventListener('click', ResearchBuilding);
researchUnitBtn.addEventListener('click', ResearchUnit);
barbBtn.addEventListener('click', SelectHeaderBarb);
countriesBtn.addEventListener('click', SelectHeaderCountries);


function NewGame() {
    // Make other nav buttons visible
    navNextYearBtn.classList.remove("nondisplay");
    navResignBtn.classList.remove("nondisplay");

    // Reset game variables to their defaults
    ResetDefaults();

    // Animate in setup container
    conSetup.classList.remove("nondisplay");
    conSetup.classList.remove("hidden");

    AddInfoLog("New game started.");
}

function ResignGame() {
    // Make other nav buttons hidden
    navNextYearBtn.classList.add("nondisplay");
    navResignBtn.classList.add("nondisplay");

    // Remove all containers
    conSetup.classList.add("hidden");
    conGame.classList.add("hidden");
}

function SelectHeaderBarb() {
    SelectHeaders(true);
}
function SelectHeaderCountries() {
    SelectHeaders(false);
}

function SelectHeaders(barb = true) {
    if(barb) {
        barbPanel.classList.remove("nondisplay");
        countriesPanel.classList.add("nondisplay");
        barbBtn.classList.add("selected");
        countriesBtn.classList.remove("selected");
    } else {
        barbPanel.classList.add("nondisplay");
        countriesPanel.classList.remove("nondisplay");
        barbBtn.classList.remove("selected");
        countriesBtn.classList.add("selected");
    }
}

function ResetDefaults() {
    // Game vars
    gameSetup = false;
    empireName = undefined;
    ethn = undefined;
    busy = false;

    year = 1;
    gold = 2000;
    population = 1;
    army = 0;

    barbArmy = 0;
    barbLastAttack = 0;

    researchCosts = [2500, 2500];
    researchBuildingBtn.children[0].innerHTML = `Research A New Building <b>(${FormatNum(researchCosts[0])} Gold)</b>`;
    researchUnitBtn.children[0].innerHTML = `Research A New Unit <b>(${FormatNum(researchCosts[1])} Gold)</b>`;
    barbStatus.innerHTML = "There is no information on the nearby barbarians.";
    barbBtn.innerHTML = "Barbarians";

    SetBuyables();

    // Inputs
    empireNameInput.value = "";
    SelectEthn(undefined);
    CanNextYear(false);

    // Remove all logs
    while(infoLog.children.length > 0) {
        infoLog.children[0].remove();
    }

    // Remove all buy buttons
    while(conBuyBuildings.children.length > 1) {
        conBuyBuildings.children[1].remove();
    }
    while(conBuyUnits.children.length > 1) {
        conBuyUnits.children[1].remove();
    }

    barbContBtn.classList.add("nondisplay");

    // Reset setup container
    CanSetup();

    SetInfoText();
}

// If both ethnicity & empire name have been set, allow
// user to press the start game button
function CanSetup() {
    if(!gameSetup) {
        if(empireNameInput.value.trim() != "" && ethn != undefined) {
            startGameBtn.classList.remove("disabled");
            return true;
        } else {
            startGameBtn.classList.add("disabled");
            return false;
        }
    } else {
        return true;
    }
}

// I can't figure out how to pass parameters through addEventListener,
// so I'm using 3 different functions to pass those parameters.
// I know this is terrible & hacky, no need to tell me.
function SelectEthn0() {
    SelectEthn(0);
}
function SelectEthn1() {
    SelectEthn(1);
}
function SelectEthn2() {
    SelectEthn(2);
}

// For indexes: 0 = african, 1 = european, 2 = asian
function SelectEthn(index) {
    // Set all buttons to unselected
    ethnAfricanBtn.classList.remove("selected");
    ethnEuroBtn.classList.remove("selected");
    ethnAsianBtn.classList.remove("selected");

    ethn = index;
    switch(index) {
        case 0:
            ethnAfricanBtn.classList.add("selected");
            break;
        case 1:
            ethnEuroBtn.classList.add("selected");
            break;
        case 2:
            ethnAsianBtn.classList.add("selected");
            break;
        default:
            break;
    }

    CanSetup();
}

function StartGame() {
    if(CanSetup()) {
        empireName = empireNameInput.value.trim();

        ethnNoun = "";
        switch(ethn) {
            case 0:
                ethnNoun = "Africa";
                units.forEach(unit => {
                    if(unit.armyRating != undefined) {
                        unit.armyRating += 2;
                    }
                });
                break;
            case 1:
                ethnNoun = "Europe";
                buildings[1].desc += " <b>(+50 Gold due to Europe bonus)</b>";
                break;
            case 2:
                ethnNoun = "Asia";
                buildings[0].desc += " <b>(+1 Population due to Asia bonus)</b>";
                break;
            default:
                break;
        }

        // Add buy buttons
        buildings.forEach(building => {
            if(building.unlocked) {
                CreateBuyButton(building, conBuyBuildings);
            }
        });
        units.forEach(unit => {
            if(unit.unlocked) {
                CreateBuyButton(unit, conBuyUnits);
            }
        });

        AddInfoLog(`${empireName} is founded in ${ethnNoun}.`);
        infoEmpireName.innerHTML = empireName;

        conGame.classList.remove("hidden");
        conSetup.classList.add("nondisplay");

        CanNextYear(true);

        gameSetup = true;
    }
}

function CreateBuyButton(object, parent) {
    object.btn = document.createElement("button");
    object.btn.id = "fill";
    object.textBtn = document.createElement("span");
    object.textBtn.innerHTML = `${object.name} <b>(${FormatNum(object.price)} Gold)</b>`;
    parent.appendChild(object.btn);
    object.btn.appendChild(object.textBtn);

    desc = document.createElement("div");
    desc.classList.add("desc");
    object.btn.appendChild(desc);

    object.textAmount = document.createElement("h2");
    object.textAmount.innerHTML = `${object.amount} Owned`;
    desc.appendChild(object.textAmount);

    object.textDesc = document.createElement("h3");
    object.textDesc.innerHTML = object.desc;
    desc.appendChild(object.textDesc);

    object.btn.onmouseover = () => {
        if(object.type == Unit) {
            if(object.desc == undefined) {
                object.textDesc.innerHTML = `The ${object.name} provides +${object.armyRating} army.`;
                if(buildings[2].amount > 0) {
                    barracksModifier = object.armyRating * (buildings[2].amount);
                    object.textDesc.innerHTML += `<b> (+${barracksModifier} due to barracks).</b>`
                }
            } else {
                object.textDesc.innerHTML = object.desc;
            }
        }
    }

    object.btn.onclick = () => {
        if(!busy) {
            if (gold >= object.price) {
                gold -= object.price;
                object.amount++;
    
                object.textAmount.innerHTML = `${object.amount} Owned`;
                if(object.type == Building) {
                    object.price += Math.ceil(object.price / 200) * 100;
                    object.textBtn.innerHTML = `${object.name} <b>(${FormatNum(object.price)} Gold)</b>`;
                } else {
                    if(object.armyRating != undefined) {
                        army += object.armyRating * (1 + buildings[2].amount);
                    }
                }
    
                AddInfoLog(`${object.name} bought for ${FormatNum(object.price)} Gold.`);
                SetInfoText();
            } else {
                SetMsg(`The empire cannot afford to buy a ${object.name}.`, true);
            }
        } else {
            SetMsg("The empire is currently busy and cannot purchase right now.", true);
        }
    }
}

function FormatNum(rawNum) {
    numString = rawNum.toString();
    output = "";

    if(numString.length % 3 != 0) {
        output = numString.slice(0, numString.length % 3);
        numString = numString.slice(numString.length % 3, numString.length);
        
        if(numString.length > 0) {
            output += ",";
        }
    }
    
    length = numString.length / 3;
    for(i = 0; i < length; i++) {
        output += numString.slice(0, 3);
        numString = numString.slice(3, numString.length);

        if(numString.length > 0) {
            output += ",";
        }
    }

    return output;
}

function AddInfoLog(msg) {
    // Create new p element with the msg
    let newLog = document.createElement("p");
    newLog.innerHTML = `<b>Year ${year}</b> ${msg}`;
    infoLog.appendChild(newLog);

    // Set main info message to the msg
    SetMsg(msg);

    // Make sure the info log is scrolled down
    infoLog.scrollTop = infoLog.scrollHeight;
}

function SetInfoText() {
    infoText.innerHTML = `Year ${year} / Gold: ${FormatNum(gold)} / Population: ${population} / Army: ${army}`;
}

function SetMsg(msg, red = false) {
    infoMsg.style.color = red ? "red" : "black";
    infoMsg.innerHTML = msg;
}

function ResearchBuilding() {
    if(!busy) {
        canResearch = false;
        index = undefined;
    
        for(i = 0; i < buildings.length; i++) {
            if(!buildings[i].unlocked) {
                canResearch = true;
                index = i;
                break;
            }
        }
    
        if(canResearch) {
            if(gold >= researchCosts[0]) {
                gold -= researchCosts[0];
                buildings[index].unlocked = true;
                CreateBuyButton(buildings[index], conBuyBuildings);
                SetInfoText(`${buildings[index].name} researched for ${FormatNum(researchCosts[0])}`);
                researchCosts[0] *= 2;
                researchBuildingBtn.children[0].innerHTML = `Research A New Building <b>(${FormatNum(researchCosts[0])} Gold)</b>`;
            } else {
                SetMsg("The empire cannot afford to research a new building.", true);
            }
        } else {
            SetMsg("There are no more buildings to research.", true);
        }
    } else {
        SetMsg("The empire is currently busy and cannot research right now.", true);
    }
}

function ResearchUnit() {
    if(!busy) {
        canResearch = false;
        index = undefined;
    
        for(i = 0; i < units.length; i++) {
            if(!units[i].unlocked) {
                canResearch = true;
                index = i;
                break;
            }
        }
    
        if(canResearch) {
            if(gold >= researchCosts[1]) {
                gold -= researchCosts[1];
                units[index].unlocked = true;
                CreateBuyButton(units[index], conBuyUnits);
                SetInfoText(`${units[index].name} researched for ${FormatNum(researchCosts[1])}`);
                researchCosts[1] *= 2;
                researchUnitBtn.children[0].innerHTML = `Research A New Unit <b>(${FormatNum(researchCosts[1])} Gold)</b>`;
            } else {
                SetMsg("The empire cannot afford to research a new unit.", true);
            }
        } else {
            SetMsg("There are no more units to research.", true);
        }
    } else {
        SetMsg("The empire is currently busy and cannot research right now.", true);
    }
}

function CanNextYear(bool = true) {
    busy = !bool;
    if(bool) {
        navNextYearBtn.classList.remove("disabled");
    } else {
        navNextYearBtn.classList.add("disabled");
    }
}

function NextYear() {
    if(gameSetup && !busy) {
        Barbarians();
    }
}

function CalculateYearly() {
    year++;
    population += buildings[0].amount;
    gold += population * buildings[1].amount * 100;
    army += buildings[3].amount * 5;

    gold += ethn == 1 ? population * buildings[1].amount * 50 : 0;
    population += ethn == 2 ? buildings[0].amount : 0;

    SetInfoText();
    SetMsg(`Year ${year} started.`);
}

let barbArmy = 0;
let barbLastAttack = 0;
function Barbarians() {
    if(year >= 9) {
        barbArmy += 3 * (year - 8) + 10;

        let chance = (year - barbLastAttack) / 12;
        if(Math.random() <= chance) {
            CanNextYear(false);
            barbLastAttack = year;


            barbBtn.innerHTML = "Barbarians (!)";
            barbStatus.innerHTML = `A barbarian force of <b>${barbArmy}</b> is attacking!`;
            SetMsg(`A barbarian force of ${barbArmy} is attacking!`);
            barbContBtn.classList.remove("nondisplay");
        } else {
            CalculateYearly();
        }
    } else {
        CalculateYearly();
    }
}

barbContBtn.addEventListener('click', BarbariansFight);
function BarbariansFight() {
    if(barbLastAttack == year) {
        barbContBtn.classList.add("nondisplay");
        barbStatus.innerHTML = "...Fighting...";

        setTimeout(function() {
            CalculateBarbarianFight();
        }, 1500);
    }
}

function CalculateBarbarianFight() {
    let a = army > barbArmy ? army : barbArmy;
    let b = army > barbArmy ? barbArmy : army;
    a = a == 0 ? 1 : a;
    b = b == 0 ? 1 : b;
    let x = ((a - b) / b);
    let rand = Math.random();

    if(army > barbArmy) {
        const slope = 0.3 * x + 0.85;
        const lost = Math.ceil(barbArmy / (x * 10));
        if(rand <= slope) {
            BarbarianResult(true, "The empire defeats the barbarians!", lost)
        } else {
            BarbarianResult(false, "The barbarians defeat the empire.")
        }
    } else {
        const slope = -1.7 * x + 0.85
        if(rand <= (slope < 0.1 ? 0.1 : slope)) {
            BarbarianResult(true, "Outnumbered, the empire defeats the barbarians!")
        } else {
            BarbarianResult(false, "The barbarians defeat the empire.")
        }
    }
}

function BarbarianResult(win, msg, lost = army) {
    barbStatus.innerHTML = msg;
    army -= lost > army ? army : lost;
    if(win) {
        AddInfoLog(`The empire defeats the barbarians but loses ${lost} army!`);
        barbArmy = 0;
    } else {
        AddInfoLog(`The empire is defeated! You lose!`, true);
    }

    setTimeout(function() {
        barbBtn.innerHTML = "Barbarians";
        if(win) {
            barbStatus.innerHTML = "There is no information on the nearby barbarians.";
            CalculateYearly();
            CanNextYear(true);
        } else {
            barbStatus.innerHTML = "You lose!";
        }
    }, 1500);
}