"""
This file was auto generated. Do not modify its content.

@file Car
"""

from .Vehicle import Vehicle

class Car(Vehicle):

    def __init__(self, id, price, licensePlate):
        super().__init__(id, price)
        self.licensePlate = licensePlate
        self.vehicleType = "CAR"

    @staticmethod
    def fromJson(json):
        return Car(json['id'], json['price'], json['licensePlate'])

    def toJson(self):
        return self.__dict__

    def __str__(self):
        return f'Car(id={self.id}, price={self.price},  licensePlate={self.licensePlate}, vehicleType={self.vehicleType})'

    def __eq__(self, other):
        if not isinstance(other, Car):
            return False

        return (self.id == other.id) and (self.price == other.price) and(self.licensePlate == other.licensePlate) and (self.vehicleType == other.vehicleType)

Vehicle.register_factory("CAR", Car.fromJson)
