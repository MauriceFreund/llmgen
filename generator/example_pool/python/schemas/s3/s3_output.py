class Vehicle: 
    factories = {}

    def __init__(self, id, price):
        self.id = id;
        self.price = price;

    @classmethod
    def fromJson(cls, json):
        if json['vehicleType'] != None:
            return cls.factories[json['vehicleType']](json)
        return Vehicle(json['id'], json['price'])

    def toJson(self):
        return self.__dict__

    @staticmethod
    def register_factory(vehicleType, factoryFunction):
        Vehicle.factories[vehicleType] = factoryFunction

    def __str__(self):
        return f'Vehicle(id={self.id}, price={self.price})'

    def __eq__(self, other):
        if not isinstance(other, Vehicle):
            return False

        return (self.id == other.id) and (self.price == other.price)
