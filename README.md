## Project Plan

This project aims to create a system for monitoring ESD (Electrostatic Discharge) and RFID (Radio-Frequency Identification) events using a Raspberry Pi. The system involves a Python script, a web server, and hardware components (ESD sensor and RFID reader).


### Hardware Requirements
- Raspberry Pi
- ESD sensor
- RFID reader


### Software Requirements
- Raspberry Pi OS (latest version)
- PostgreSQL
- XRDP (for remote desktop access)
- `Gunicorn` (Python WSGI HTTP Server)
- Python libraries: `psycopg2`, `RPi-GPIO` (for hardware interaction)
- Web requirements: `flask`


### Step-by-Step Installation and Setup

Follow these steps to install and set up the ESD and RFID monitoring system using a Raspberry Pi.


1. **Raspberry Pi OS Installation**
   - Download the latest version of Raspberry Pi OS from the official Raspberry Pi website (Or select it in the imager).
   - Use the Raspberry Pi Imager to write the OS image onto an SD card.
   - Insert the SD card into the Raspberry Pi and power it on.


2. **System Update**
   - Connect to the Raspberry Pi via SSH or use a monitor and keyboard to access the terminal.
   - Update the system packages by running the following commands:
     ```
     sudo apt update
     sudo apt upgrade
     ```


3. **PostgreSQL Installation**
   - Install PostgreSQL and required packages:
     ```
     sudo apt install postgresql libpq-dev postgresql-client postgresql-client-common -y
     ```
   - Switch to the 'postgres' user:
     ```
     sudo su - postgres
     ```
   - Create a new PostgreSQL user 'pioneer':
     ```
     createuser pioneer -P --interactive
     ```
   - Create a database 'pioneer' (for accessing 'psql' from the 'pioneer' user):
     ```
     createdb pioneer
     ```
   - Exit the 'postgres' user:
     ```
     exit
     ```


4. **Python and Libraries Installation**
   - Install the necessary Python packages and libraries:
     ```
     sudo apt install python3-psycopg2 python3-rpi.gpio python3-pip -y
     sudo pip3 install adafruit-pn532
     ```


5. **Project Setup**
   - Clone the project repository to your Raspberry Pi:
     ```
     git clone <repository-url>
     ```
   - Navigate to the project directory:
     ```
     cd <project-directory>
     ```
   - Configure the database connection:
     - Open the `config.py` file and modify the following variables to match your PostgreSQL configuration:
       ```
       DB_HOST = "localhost"
       DB_NAME = "pioneer"
       DB_USER = "pioneer"
       DB_PASSWORD = "password"
       ```
   - Optionally, adjust any other configuration variables in the `config.py` file as needed.
   - The configs for the rfid reader script is in the read_rfid_esd.py.


6. **Database Setup**
   - Create the required schema and table in the PostgreSQL database:
     - Access the PostgreSQL shell:
       ```
       sudo su - postgres
       psql
       ```
     - Within the PostgreSQL shell, create the schema and table:
       ```
       CREATE SCHEMA IF NOT EXISTS esd_log;
       CREATE TABLE esd_log.esd_check (
           ID SERIAL PRIMARY KEY,
           RFID VARCHAR(255) NOT NULL,
           ESD BOOLEAN NOT NULL,
           timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
       );
       ```
     - Exit the PostgreSQL shell:
       ```
       \q
       exit
       ```

       
7. **Start the Gunicorn Server**
   - Install Gunicorn, a Python WSGI HTTP server:
     ```
     sudo apt install gunicorn
     ```
   - Start the Gunicorn server to run the web application:
     ```
     gunicorn -w 4 -b localhost:4000 app:app
     ```
   - The web application will now be accessible at http://localhost:4000.


8. **Run the Application**
   - Start the ESD and RFID script:
     ```
     python3 esd_rfid_esd.py
     ```
   - The system will continuously monitor the RFID reader and store the RFID and ESD data in the PostgreSQL database.


9. **Access the Web Interface**
   - Open a web browser on any device connected to the same network as the Raspberry Pi.
   - Enter the IP address of the Raspberry Pi in the browser's address bar.
   - The web interface should be accessible, displaying the ESD and RFID monitoring data.

By following these steps, you will have successfully installed and set up the ESD and RFID monitoring system on your Raspberry Pi.


### Configuration

In the code, modify the following variables to match your configuration:

#### PN532 Configuration
- `CS`: GPIO pin for Chip Select (CS) connection.
- `SCLK`: GPIO pin for Serial Clock (SCLK) connection.
- `MOSI`: GPIO pin for Master Output Slave Input (MOSI) connection.
- `MISO`: GPIO pin for Master Input Slave Output (MISO) connection.
- `SPI_CLOCK`: Clock frequency in Hz for the SPI communication. Default is 1 MHz.

#### ESD Check Buttons and LEDs Configuration
- `BUTTON_PASS_PIN`: GPIO pin for the pass button connection.
- `BUTTON_FAIL_PIN`: GPIO pin for the fail button connection.
- `BEEPER_GREENLED_PIN`: GPIO pin for the beeper and green LED connection.

#### PostgreSQL Database Configuration
- `DB_HOST`: Hostname or IP address of the PostgreSQL database server.
- `DB_NAME`: Name of the database to connect to.
- `DB_USER`: Username to use for connecting to the database.
- `DB_PASSWORD`: Password for the specified database user.

#### ESD Check Configuration
- `WAIT_TIME`: Time to wait for the ESD check in seconds.
- `BUTTON_CHECK_INTERVAL`: Interval to check button states during the wait time.


### Usage

1. Run the script using the following command:
   ```
   python3 esd_rfid_monitor.py
   ```
2. The system will continuously monitor the RFID button and the ESD button.
3. Press the RFID button to generate an RFID number.
4. Wait for the ESD button press to simulate an ESD check status.
5. The system will store the RFID number and ESD check status in the PostgreSQL database.
6. After 10 seconds of inactivity, the system will reset and wait for a new RFID scan and ESD check.


### Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please submit an issue or a pull request.


### License

This project is licensed under the [MIT License](LICENSE).
