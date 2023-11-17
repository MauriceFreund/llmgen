class Vehicle {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }

    static fromJson(json) {
        if (json.documentType) {
            return Vehicle.factories[json.documentType](json);
        }
        return new Vehicle(json.id, json.price);
    }

    toJson() {
        return JSON.stringify(this);
    }
}

Vehicle.factories = {};

Vehicle.registerFactory = function (type, factoryFunction) {
    Vehicle.factories[type] = factoryFunction;
};

export default Vehicle;
