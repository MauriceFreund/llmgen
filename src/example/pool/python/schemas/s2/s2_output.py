"""
This file was auto generated. Do not modify its content.

@file Pet
"""

class Pet:
    """
    Represents a pet
    """

    def __init__(self, id, name=None, tag=None):
        self.id = id
        self.name = name
        self.tag = tag

    def __str__(self):
        return f'Student(id={self.id}, name={self.name}, tag={self.tag})'