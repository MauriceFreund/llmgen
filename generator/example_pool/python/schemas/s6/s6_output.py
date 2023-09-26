"""
This file was auto generated. Do not modify its content.

@file Car
"""

from .Vehicle import Vehicle

class Car(Vehicle):
    """
    The Car class
    """

    def __init__(self, id, licensePlate):
        super().__init__(id)
        self.licensePlate = licensePlate
        self.vehicleType = "CAR"

    def __str__(self):
        return f'Car(id={self.id}, licensePlate={self.licensePlate}, vehicleType={self.vehicleType})'

    def __eq__(self, other):
        if not isinstance(other, Car):
            return False

        return (self.id == other.id) and (self.licensePlate == other.licensePlate) and (self.vehicleType == other.vehicleType)
