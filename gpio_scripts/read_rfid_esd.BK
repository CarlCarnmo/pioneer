import binascii
import time
import signal
import sys
import warnings
import psycopg2
import RPi.GPIO as GPIO

import Adafruit_PN532 as PN532

# Ignore warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)

# PN532 configuration for a Raspberry Pi GPIO:
CS = 5
SCLK = 11
MOSI = 10
MISO = 9

# Configuration for the ESD check buttons and LEDs
BUTTON_PASS_PIN = 2
BUTTON_FAIL_PIN = 3
LED_SUCCESS_PIN = 14
LED_FAILURE_PIN = 15

# Configuration for the PostgreSQL database
DB_HOST = "localhost"
DB_NAME = "pioneer"
DB_USER = "pioneer"
DB_PASSWORD = "password"

# Configure the time to wait for the ESD check in seconds
WAIT_TIME = 5
BUTTON_CHECK_INTERVAL = 0.1  # Interval to check button states during the wait time

# Connect to the PostgreSQL database
def connect_to_database():
    # Establish a connection to the PostgreSQL database
    conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    return conn

# Function to insert an entry into the PostgreSQL database
def insert_entry(conn, rfid, esd_status):
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO esd_log.esd_check (rfid, esd) VALUES (%s, %s)", (rfid, esd_status))
        conn.commit()
        print("Data inserted successfully")
        return True
    except (Exception, psycopg2.Error) as error:
        print("Error while inserting data into PostgreSQL", error)
        return False

# Initialize the PN532 reader
def initialize_pn532():
    while True:
        try:
            # Create and initialize an instance of the PN532 class
            pn532 = PN532.PN532(cs=CS, sclk=SCLK, mosi=MOSI, miso=MISO)
            pn532.begin()
            pn532.SAM_configuration()
            return pn532
        except RuntimeError as e:
            print('Failed to detect the PN532:', str(e))
            continue

# Initialize the GPIO pins for the buttons and LEDs
def initialize_gpio_pins():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BUTTON_PASS_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(BUTTON_FAIL_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(LED_SUCCESS_PIN, GPIO.OUT, initial=GPIO.LOW)  # Set initial state to low
    GPIO.setup(LED_FAILURE_PIN, GPIO.OUT, initial=GPIO.LOW)  # Set initial state to low

# Perform the ESD check
def perform_esd_check():
    print('Performing ESD check...')
    start_time = time.time()
    esd_status = None
    while time.time() - start_time < WAIT_TIME:
        # Check button states periodically
        if not GPIO.input(BUTTON_PASS_PIN):
            esd_status = True
            break
        elif not GPIO.input(BUTTON_FAIL_PIN):
            esd_status = False
            break
        time.sleep(BUTTON_CHECK_INTERVAL)
    return esd_status

# Handle RFID scanning and database insertion
def handle_rfid_scan(pn532, conn):
    # Wait for a card to be available
    uid = pn532.read_passive_target()
    # Try again if no card found
    if uid is None:
        return

    # Print the UID of the card
    print('Card UID:', binascii.hexlify(uid).decode('utf-8'))

    # Store the RFID value
    rfid = binascii.hexlify(uid).decode('utf-8')

    # Disable accepting more RFID scans until the process is complete
    pn532.SAM_configuration()

    # Blink the success LED three times
    for _ in range(3):
        GPIO.output(LED_SUCCESS_PIN, GPIO.HIGH)
        time.sleep(0.2)
        GPIO.output(LED_SUCCESS_PIN, GPIO.LOW)
        time.sleep(0.2)

    # Perform the ESD check
    esd_status = perform_esd_check()

    print('ESD Check Result:', esd_status)

    # Only insert the entry into the PostgreSQL database if both RFID scan and ESD check are done correctly
    if uid is not None and esd_status is not None:
        # Blink the failure LED twice if ESD check fails
        if not esd_status:
            for _ in range(2):
                GPIO.output(LED_FAILURE_PIN, GPIO.HIGH)
                time.sleep(0.5)
                GPIO.output(LED_FAILURE_PIN, GPIO.LOW)
                time.sleep(0.5)

        # Insert the entry into the PostgreSQL database
        if insert_entry(conn, rfid, esd_status):
            # Blink the success LED twice with a longer duration if ESD check passes
            if esd_status:
                for _ in range(2):
                    GPIO.output(LED_SUCCESS_PIN, GPIO.HIGH)
                    time.sleep(0.5)
                    GPIO.output(LED_SUCCESS_PIN, GPIO.LOW)
                    time.sleep(0.5)
    else:
        print('Skipping database insertion.')

    # Enable accepting RFID scans again
    pn532.SAM_configuration()


def main():
    signal.signal(signal.SIGINT, close)
    print('PN532 NFC RFID 13.56MHz Card Reader')

    # Connect to the PostgreSQL database
    conn = connect_to_database()

    # Initialize GPIO pins
    initialize_gpio_pins()

    # Flag to keep track of RFID scan
    rfid_scanned = False

    while True:
        try:
            # Initialize the PN532 reader
            pn532 = initialize_pn532()

            handle_rfid_scan(pn532, conn)

            rfid_scanned = True

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
                raise e


def close(signal, frame):
    GPIO.cleanup()
    sys.exit(0)


if __name__ == "__main__":
    main()
