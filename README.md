## Project Plan

This project aims to create a system for monitoring ESD (Electrostatic Discharge) and RFID (Radio-Frequency Identification) events using a Raspberry Pi. The system involves a Python script, a web server, and hardware components (ESD sensor and RFID reader).

### Hardware Requirements
- Raspberry Pi
- ESD sensor (pending arrival)
- RFID reader (pending arrival)

### Software Requirements
- Raspberry Pi OS (latest version)
- PostgreSQL
- XRDP (for remote desktop access)
- `Gunicorn` (Python WSGI HTTP Server)
- Python libraries: `psycopg2`, `RPi-GPIO` (for hardware interaction)
- Web requirements: `flask`

### Step-by-Step Installation and Setup

1. **First-time Start-up**
   - Install the latest 'Raspberry Pi OS' using the Raspberry Pi Imager.
   - Run the following command to update the system:
     ```
     sudo apt update && sudo apt full-upgrade
     ```
   - Create a user named 'pioneer' for the project (not as --system):
     ```
     sudo adduser pioneer
     ```

2. **Set-up Remote Desktop(Optional)**
   - Install XRDP to enable Windows Remote Desktop access:
     ```
     sudo apt install xrdp
     ```
   - Use the IP of the Raspberry Pi (`hostname -I`) and the 'pioneer' user to connect via Remote Desktop.

3. **Enable SSH (optional)**
   - To use only SSH, enable it in the Pi's configuration and connect (username@IP)

4. **Install and Set-up PostgreSQL**
   - Install PostgreSQL and required packages:
     ```
     sudo apt install postgresql libpq-dev postgresql-client postgresql-client-common -y
     ```
   - Switch to the 'postgres' user:
     ```
     su postgres
     ```
   - Create a PostgreSQL user 'pioneer':
     ```
     createuser pioneer -P --interactive
     ```
   - Create a database 'pioneer' (for accessing 'psql' from the 'pioneer' user):
     ```
     psql
     create database pioneer;
     ```
   - Switch to the 'pioneer' user:
     ```
     su pioneer
     ```
   - Create the 'esd_log' schema:
     ```
     psql
     CREATE SCHEMA IF NOT EXISTS esd_log;
     ```
   - Create the 'esd_check' table within the 'esd_log' schema:
     ```
     CREATE TABLE esd_log.esd_check (
         ID SERIAL PRIMARY KEY,
         RFID VARCHAR(255) NOT NULL,
         ESD BOOLEAN NOT NULL,
         timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
     );
     ```
5. **Install remaining requirements**
   - Psycopg2: PostgreSQL adapter for Python.
     ```
     sudo apt install python3-psycopg2
     ```
   - Gunicorn: Webserver.
     ```
     sudo apt install gunicorn
     ```
   - Flask: web application framework.
     ```
     sudo apt install python3-flask
     ```
   

### Configuration

In the code, modify the following variables to match your configuration:

- `RFID_IO`: GPIO pin connected to the RFID reader.
- `ESD_IO`: GPIO pin connected to the ESD sensor.
- `RED_LED`, `YELLOW_LED`, `GREEN_LED`: GPIO pins connected to the LED buttons.
- `psql_host`, `psql_database`, `psql_user`, `psql_password`: PostgreSQL database connection details.
- `timeout`: Time limit in seconds for waiting for the ESD check after the RFID scan.

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

### Known Issues

- The script currently relies on button presses for simulation if the hardware components are not available. Replace the button callbacks with appropriate code when the actual RFID reader and ESD sensor are connected.

**Temporary Simulation Functions**
   - Until the RFID reader and ESD sensor arrive, simulate the functions with the following temporary simulation functions:
     - `generate_rfid_check()`: Generates an RFID check when a button is pressed. Hold the button to simulate a failed RFID check.
     - `generate_esd_check()`: Press the button once to generate an ESD check as True. Hold the button to generate an ESD check as False.


### Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please submit an issue or a pull request.

### License

This project is licensed under the [MIT License](LICENSE).
