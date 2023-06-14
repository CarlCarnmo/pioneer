import binascii
import time
import signal
import sys
import warnings
import RPi.GPIO as GPIO
import psycopg2

import Adafruit_PN532 as PN532

###==> Line 104 open_door fonctions needs to be made <==###

# Ignore warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)

# PN532 configuration for a Raspberry Pi GPIO:
CS = 5
SCLK = 11
MOSI = 10
MISO = 9
SPI_CLOCK = 1000000  # Clock frequency in Hz. Default = 1 MHz

# Configuration for the PostgreSQL database
DB_HOST = "localhost"
DB_NAME = "pioneer"
DB_USER = "pioneer"
DB_PASSWORD = "password"

# Time limit for the last passing ESD check in seconds
ALLOWED_TIME_LIMIT = 6 * 60 * 60  # 6 hours

# Configuration for door unlock duration in seconds
DOOR_UNLOCK_DURATION = 10  # Adjust the value as needed

# Initialize the PN532 reader
def initialize_pn532():
    while True:
        try:
            # Create and initialize an instance of the PN532 class
            pn532 = PN532.PN532(cs=CS, sclk=SCLK, mosi=MOSI, miso=MISO, clk=SPI_CLOCK)
            pn532.begin()
            pn532.SAM_configuration()
            return pn532
        except RuntimeError as e:
            print('Failed to detect the PN532:', str(e))
            continue

# Initialize the GPIO pins for the LEDs
def initialize_gpio_pins():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BEEPER_GREENLED_PIN, GPIO.OUT, initial=GPIO.LOW)

# Connect to the PostgreSQL database
def connect_to_database():
    # Establish a connection to the PostgreSQL database
    conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    return conn

# Retrieve the last passing ESD check for a given RFID tag
def get_last_passing_esd_check(conn, rfid):
    try:
        cur = conn.cursor()
        cur.execute("SELECT esd FROM esd_log.esd_check WHERE rfid = %s AND esd = true ORDER BY id DESC LIMIT 1", (rfid,))
        row = cur.fetchone()
        if row is not None:
            return row[0]
    except (Exception, psycopg2.Error) as error:
        print("Error while retrieving data from PostgreSQL:", error)
    return None

# Handle RFID scanning
def handle_rfid_scan(pn532, conn):
    # Wait for a card to be available
    uid = pn532.read_passive_target()
    # Try again if no card found
    if uid is None:
        return

    # Print the UID of the card
    print('Card UID:', binascii.hexlify(uid).decode('utf-8'))

    # Disable accepting more RFID scans until the process is complete
    pn532.SAM_configuration()

    # Blink the success LED and beep once
    GPIO.output(BEEPER_GREENLED_PIN, GPIO.HIGH)
    time.sleep(0.1)
    GPIO.output(BEEPER_GREENLED_PIN, GPIO.LOW)
    time.sleep(0.1)

    # Check the last passing ESD check for the RFID tag
    rfid = binascii.hexlify(uid).decode('utf-8')
    last_passing_esd_check = get_last_passing_esd_check(conn, rfid)

    # Check if the last passing ESD check is within the allowed time limit
    current_time = time.time()
    if last_passing_esd_check is not None and current_time - last_passing_esd_check <= ALLOWED_TIME_LIMIT:
        # Perform the door opening action
        open_door()
    else:
        print('Access denied.')

    # Enable accepting RFID scans again
    pn532.SAM_configuration()

def open_door(): #TODO
    # Code to physically open the door goes here

    # Wait for the specified duration
    time.sleep(DOOR_UNLOCK_DURATION)

    # Code to close the door goes here

def main():
    signal.signal(signal.SIGINT, close)
    print('PN532 NFC RFID 13.56MHz Card Reader')

    # Connect to the PostgreSQL database
    conn = connect_to_database()

    # Initialize GPIO pins
    initialize_gpio_pins()

    while True:
        try:
            # Initialize the PN532 reader
            pn532 = initialize_pn532()

            handle_rfid_scan(pn532, conn)

        except RuntimeError as e:
            error_messages = [
                'Did not receive expected ACK from PN532!',
                'Response frame preamble does not contain 0x00FF!',
                'Response checksum did not match expected value!',
                'Response length checksum did not match length!',
                'Response frame does not start with 0x01!'
            ]
            if str(e) in error_messages:
                print('Scan failed. Please try again.')
                continue
            else:
                print('Unexpected error:', e)

def close(signal, frame):
    GPIO.cleanup()
    sys.exit(0)

if __name__ == "__main__":
    main()
