from reader import Dataset
from config import Config
from client import Client
import threading
import time
from typing import List

# go download this https://galaxy.ansible.com/sweetim/workspace_setup
# and cna u try afterwards
def main():
    dataset = Dataset()
    client = Client(
        Config.IOT_ENDPOINT,
        Config.ROOT_CA_PATH,
        Config.PRIVATE_KEY_PATH,
        Config.CERT_PATH
    )
    client.connect()

    while (True):
        client.publish(Config.TOPIC_PREFIX + Config.DEVICE_NAME, dataset.get_random(), 0)
        time.sleep(Config.MESSAGE_FREQUENCY)

if __name__== "__main__" :
    main()