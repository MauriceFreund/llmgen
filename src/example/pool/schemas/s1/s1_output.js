class Pet {
    constructor(id, name, tag = undefined) {
        this.id = id;
        this.name = name;
        this.tag = tag;
    }
}

module.exports = Pet;
