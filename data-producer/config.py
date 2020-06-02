from environs import Env

env = Env()
env.read_env('.env')

class Config:
    """Set configuration vars from .env file."""

    # General Config
    IOT_ENDPOINT = env('IOT_ENDPOINT')
    CERT_PATH = "./cert.crt"
    PRIVATE_KEY_PATH = "./key.pem"
    ROOT_CA_PATH = "./AmazonRootCA1.pem"
    TOPIC_PREFIX = "sensors/"
    DEVICE_NAME = "1"
    MESSAGE_FREQUENCY = 0.1