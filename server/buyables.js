function Buyables() {
    this.granary = {
        name: "Granary",
        gold: 1200,
        func: function(player) {
            player.resources.food += 4;

            return player;
        }
    }
    this.windmill = {
        name: "Windmill",
        gold: 1200,
    }
    this.fishery = {
        name: "Fishery",
        gold: 1200,
    }
    this.cattle = {
        name: "Cattle Farm",
        gold: 1200,
    }
    this.dockyard = {
        name: "Dockyard",
        gold: 1200,
    }
    this.stable = {
        name: "Stable",
        gold: 1200,
    }
    this.farmer = {
        name: "Farmer",
        gold: 400,
        pop: 1,
        func: function(player) {
            player.resources.pop++;
            
            return player;
        }
    }
    this.swordsman = {
        name: "Swordsman",
        gold: 1200,
    }
    this.knight = {
        name: "Knight",
        gold: 1200,
    }
    this.lancer = {
        name: "Lancer",
        gold: 1200,
    }
    this.galley = {
        name: "Galley",
        gold: 1200,
    }
    this.longship = {
        name: "Longship",
        gold: 1200,
    }
    this.explore = {
        name: "Explore",
        gold: 1200,
    }
}

module.exports = Buyables;