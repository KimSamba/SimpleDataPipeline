import csv
import json
from random import random
import math

class Dataset:
    def __init__(self):
        self.data = list()
        with open('data.csv', 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            self.data = list(map(json.dumps, reader))

    def get_dataset(self):
        return self.data

    def get_random(self):
        return self.data[int(random() * len(self.data))]
