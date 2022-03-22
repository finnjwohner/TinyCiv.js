function Buyables() {
    this.granary = {
        name: "Granary",
        type: "building",
        desc: "Increases food by 4.",
        gold: 1200,
        func: function(player) {
            player.resources.food += 4;

            return player;
        }
    }
    this.windmill = {
        name: "Windmill",
        type: "building",
        desc: "Increases food by 1 each year.",
        gold: 2000,
        wood: 8,
    }
    this.sawmill = {
        name: "Sawmill",
        type: "building",
        desc: "Doubles wood given each year by your natural resources.",
        gold: 2500,
        iron: 10,
    }
    this.market = {
        name: "Market",
        type: "building",
        desc: "Doubles gold given each year by the population.",
        gold: 5000,
        brick: 10,
        steel: 8,
    }
    this.cattle = {
        name: "Cattle Farm",
        type: "building",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.dockyard = {
        name: "Dockyard",
        type: "building",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.stable = {
        name: "Stable",
        type: "building",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.farmer = {
        name: "Farmer",
        type: "unit",
        desc: "+1 Population. 100 Gold is generated per year by each population.",
        gold: 400,
        pop: 1,
        func: function(player) {
            player.resources.pop++;
            
            return player;
        }
    }
    this.swordsman = {
        name: "Swordsman",
        type: "unit",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.knight = {
        name: "Knight",
        type: "unit",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.lancer = {
        name: "Lancer",
        type: "unit",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.galley = {
        name: "Galley",
        type: "unit",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.longship = {
        name: "Longship",
        type: "unit",
        desc: "LOREM IPSUM",
        gold: 1200,
    }
    this.explore = {
        name: "Explore",
        type: "explore",
        desc: "Explore more land, discovering new resources and geography.",
        gold: 5000,
        func: function(player) {
            for (let i = 0; i < 3; i++) {
                const rand = Math.floor(Math.random() * 4);
                switch(rand) {
                    case 0:
                        player.naturalResources.wood++;
                        break;
                    case 1:
                        player.naturalResources.brick++;
                        break;
                    case 2:
                        player.naturalResources.iron++;
                        break;
                    case 3:
                        player.naturalResources.steel++;
                        break;
                    default:
                        console.error('this should not happen ' + rand + ' (buyables.js line 115');
                        break;
                }
            }

            return player;
        }
    }
}

module.exports = Buyables;