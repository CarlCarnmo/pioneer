from datetime import date

from flask import Flask, render_template, request, flash
import psycopg2

app = Flask(__name__)
def connect_to_database():
    connection = psycopg2.connect(
        host='localhost',
        database='pioneer',
        user='pioner',
        password='password'
    )
    return connection
@app.route('/', methods=['GET', 'POST'])
def main():
    sort = "timestamp DESC"
    table_rows = 10
    where_ = ""
    db_array = []

    if request.method == 'POST':
        sort_selected = request.form.get('sort_select')
        if (sort_selected == "rfid_high"):
            sort = "rfid DESC"
        if (sort_selected == "rfid_low"):
            sort = "rfid ASC"
        if (sort_selected == "esd_high"):
            sort = "esd DESC"
        if (sort_selected == "esd_low"):
            sort = "esd ASC"
        if (sort_selected == "time_high"):
            sort = "timestamp DESC"
        if (sort_selected == "time_low"):
            sort = "timestamp ASC"

        rows_selected = request.form.get('rows_form')
        if (rows_selected == "10"):
            table_rows = 10
        elif (rows_selected == "20"):
            table_rows = 20
        elif (rows_selected == "40"):
            table_rows = 40

        view = request.form.get('view_time')
        if (view == "today"):
            where_ = "WHERE timestamp >= CURRENT_DATE"
        if (view == "this_week"):
            where_ = "WHERE timestamp >= date_trunc('week',current_date)"
        if (view == "this_month"):
            where_ = "WHERE timestamp >= date_trunc('month', CURRENT_DATE)"
        if (view == "last_week"):
            where_ = "WHERE (timestamp >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 week') and timestamp < date_trunc('week', CURRENT_TIMESTAMP))"
        if (view == "last_month"):
            where_ = "WHERE (timestamp >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 month') and timestamp < date_trunc('month', CURRENT_TIMESTAMP))"

    conn = connect_to_database()
    cur = conn.cursor()
    cur.execute(f'SELECT rfid, esd, timestamp FROM esd_log.esd_check {where_} ORDER BY {sort};')
    datatest = cur.fetchall()
    cur.close()
    conn.close()
    for result in datatest:
        db_array.append(result)
    return render_template('index.html', data=db_array, table_rows=table_rows)

@app.route('/stats')
def stats():
    return render_template('statistics.html')



if __name__ == '__main__':
    app.run(debug=True)