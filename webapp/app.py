from flask import Flask, render_template
import psycopg2

app = Flask(__name__)
def connect_to_database():
    connection = psycopg2.connect(
        host='localhost',
        database='pioneer',
        user='pioneer',
        password='password'
    )
    return connection
@app.route('/')
def index():
    conn = connect_to_database()
    cur = conn.cursor()
    cur.execute('SELECT rfid, esd, timestamp FROM esd_log.esd_check ORDER BY timestamp DESC;')
    datatest = cur.fetchall()
    cur.close()
    conn.close()
    # create an empty array
    db_array = []
    for result in datatest:
        db_array.append(result)
    return render_template('index.html', data=db_array)


if __name__ == '__main__':
    app.run(debug=True)