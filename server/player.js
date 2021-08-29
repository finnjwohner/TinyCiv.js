function Player(socketId) {
    this.id = socketId;
    this.roomCode = undefined;
    this.entered = false;
    this.ready = false;
    this.avatar = false;
    this.colour = false;
    this.name = undefined;
    this.kingdom = undefined;
    this.resources = {
        pop: 1,
        gold: 2000,
        land: 10,
        wood: 0,
        brick: 0,
        iron: 0,
        steel: 0,
    };
    this.buildings = {
        granary: 0,
        windmill: 0,
        fishery: 0,
        cattle: 0,
        dockyard: 0,
        stable: 0,
    };
    this.units = {
        swordsman: 0,
        knight: 0,
        lancer: 0,
        galley: 0,
        longship: 0,
    };
    this.naturalResources = {
        wood: 0,
        brick: 0,
        iron: 0,
        steel: 0,
    };
}

module.exports = Player;