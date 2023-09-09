"""
This file was auto generated. Do not modify its content.

@file Pet
"""


class Pet:

    def __init__(self, id, name=None, tag_id=None):
        self.id = id
        self.name = name
        self.tag_id = tag_id

    def __str__(self):
        return f'Student(id={self.id}, name={self.name}, tag_id={self.tag_id})'
