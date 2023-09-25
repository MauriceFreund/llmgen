"""
This file was auto generated. Do not modify its content.

@file Vehicle
"""

class Vehicle: 

    def __init__(self, id, price):
        self.id = id;
        self.price = price;

    def __str__(self):
        return f'Vehicle(id={self.id}, price={self.price})'

    def __eq__(self, other):
        if not isinstance(other, Vehicle):
            return False

        return (self.id == other.id) and (self.price == other.price)
