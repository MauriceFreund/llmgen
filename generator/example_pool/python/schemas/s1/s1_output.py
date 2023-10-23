"""
This file was auto generated. Do not modify its content.

@file Pet
"""


class Pet:

    def __init__(self, id, name=None, tag=None):
        self.id = id
        self.name = name
        self.tag = tag

    @staticmethod
    def fromJson(json):
        return Pet(**json)

    def toJson(self):
        return self.__dict__

    def __str__(self):
        return f'Student(id={self.id}, name={self.name}, tag={self.tag})'

    def __eq__(self, other):
        if not isinstance(other, Pet):
            return False

        return (self.id == other.id) and (self.name == other.name) and (self.tag == other.tag)
