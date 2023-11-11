/**
 * This file was auto generated. Do not modify its content.
 *
 * @file Car
 */
import Vehicle from './Vehicle.js';

class Car extends Vehicle {
    constructor(id, price, licensePlate) {
        super(id, price);
        this.licensePlate = licensePlate;
        this.vehicleType = 'CAR';
    }

    static fromJson(json) {
        return new Car(json.id, json.price, json.licensePlate);
    }

    toJson() {
        return JSON.stringify(this);
    }
}

Vehicle.registerFactory('CAR', Car.fromJson);

export default Car;
