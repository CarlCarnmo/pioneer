from datetime import date

from flask import Flask, render_template, request, flash
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
@app.route('/', methods=['GET', 'POST'])
def index():
    db_array = []
    table_rows = ""
    if request.method == 'POST':
        sortBy = ""

        rows_selected = request.form.get('rows_form')
        if (rows_selected == "10"):
            table_rows = 10
        if (rows_selected == "20"):
            table_rows = 20
        if (rows_selected == "40"):
            table_rows = 40

        sort_selected = request.form.get('sort_select')
        if (sort_selected == "today"):
            sortBy = "WHERE timestamp >= CURRENT_DATE"
        if (sort_selected == "this_week"):
            sortBy = "WHERE timestamp >= date_trunc('week',current_date)"
        if (sort_selected == "this_month"):
            sortBy = "WHERE timestamp >= date_trunc('month', CURRENT_DATE)"
        if (sort_selected == "last_week"):
            sortBy = "WHERE (timestamp >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 week') and timestamp < date_trunc('week', CURRENT_TIMESTAMP))"
        if (sort_selected == "last_month"):
            sortBy = "WHERE (timestamp >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 month') and timestamp < date_trunc('month', CURRENT_TIMESTAMP))"

        conn = connect_to_database()
        cur = conn.cursor()
        cur.execute(f'SELECT rfid, esd, timestamp FROM esd_log.esd_check {sortBy} ORDER BY timestamp DESC;')
        datatest = cur.fetchall()
        cur.close()
        conn.close()
        for result in datatest:
            db_array.append(result)
    return render_template('index.html', data=db_array, table_rows=table_rows)


if __name__ == '__main__':
    app.run(debug=True)