/**
 * Represents a pet
 */
class Pet {
    constructor(id, name, tag = undefined) {
        this.id = id;
        this.name = name;
        this.tag = tag;
    }

    static fromJson(json) {
        return new Pet(json.id, json.name, json.tag);
    }

    toJson() {
        return JSON.stringify(this);
    }
}

export default Pet;
