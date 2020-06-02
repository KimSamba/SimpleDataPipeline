from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import uuid
from os import environ

class Client:
    def __init__(self, endpoint, root_ca, private_key, cert):
        print(endpoint, root_ca, private_key, cert)
        self.client = AWSIoTMQTTClient(str(uuid.uuid4()))
        self.client.configureEndpoint(endpoint, 8883)
        self.client.configureCredentials(root_ca, private_key, cert)

    def connect(self):
        self.client.connect()

    def publish(self, topic, payload, qos = 0):
        self.client.publish(topic, payload, qos)
