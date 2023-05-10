import RPi.GPIO as GPIO
import time
import random
import psycopg2

# Configs
RFID_IO = 19
ESD_IO = 26
RED_LED = 16
YELLOW_LED = 20
GREEN_LED = 21
psql_host = "localhost"
psql_database = "pioneer"
psql_user = "pioneer"
psql_password = "password"

# Connect to the PostgreSQL database
def connect_to_database():
    connection = psycopg2.connect(
        host=psql_host,
        database=psql_database,
        user=psql_user,
        password=psql_password
    )
    return connection

# Insert the RFID and ESD status into the database
def insert_entry(connection, rfid, esd_status):
    cursor = connection.cursor()
    cursor.execute("INSERT INTO esd_log.esd_check (rfid, esd) VALUES (%s, %s)", (rfid, esd_status))
    connection.commit()
    print(f"Data sent to database: RFID = {rfid}, ESD Status = {esd_status}")

# Generate a random RFID number
def generate_rfid():
    rfid = random.randint(100000, 999999)
    print(f"RFID generated: {rfid}")
    return rfid

# Generate a random ESD check status (True or False)
def generate_esd_status():
    esd_status = random.choice([True, False])
    print(f"ESD check generated: {esd_status}")
    return esd_status

# Reset the RFID, ESD status, and start_time variables
def reset():
    global rfid, esd_status, start_time
    rfid = None
    esd_status = None
    start_time = None
    print("Resetting...")

# Callback function for RFID button press
def rfid_button_callback(channel):
    global rfid, start_time
    if rfid is None:
        rfid = generate_rfid()
        if start_time is None:
            start_time = time.time()

# Callback function for ESD button press
def esd_button_callback(channel):
    global esd_status, start_time
    if esd_status is None:
        esd_status = generate_esd_status()
        if start_time is None:
            start_time = time.time()

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(RFID_IO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(ESD_IO, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Add event detection for button presses
GPIO.add_event_detect(RFID_IO, GPIO.FALLING, callback=rfid_button_callback, bouncetime=200)
GPIO.add_event_detect(ESD_IO, GPIO.FALLING, callback=esd_button_callback, bouncetime=200)

# Initialize the database connection
db_connection = connect_to_database()

# Initialize RFID, ESD status, and start_time variables
rfid = None
esd_status = None
start_time = None

try:
    while True:
        if start_time is not None and time.time() - start_time > 10:
            print("10 seconds have passed.")
            reset()

        if rfid is not None and esd_status is not None:
            insert_entry(db_connection, rfid, esd_status)
            reset()

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Interrupted by user")
finally:
    GPIO.cleanup()
    db_connection.close()