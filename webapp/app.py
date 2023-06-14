from flask import Flask, render_template, request, redirect, url_for
import psycopg2
import os
import datetime

app = Flask(__name__)
app.config.from_pyfile(os.path.join(".", "config.py"), silent=False)

# Function to establish database connection
def connect_to_database():
    return psycopg2.connect(app.config.get("DB_CONNECTION"))

# Connect to the database
conn = connect_to_database()

@app.route('/')
def hello():
    return redirect(url_for('main'))

@app.route('/index', methods=['GET', 'POST'])
def main():
    choosen_month = "current_timestamp"
    sortby = ""

    if request.method == 'POST':
        choosen = request.form.get('filter_month')
        if choosen is not None:
            choosen_month = f"date '{choosen}-01'"

        sort_selected = request.form.get('filter_sortby')
        if sort_selected == "rfid_high":
            sortby = "ORDER BY rfid DESC"
        elif sort_selected == "rfid_low":
            sortby = "ORDER BY rfid ASC"

    # Execute the SQL query
    with conn.cursor() as cursor:
        # Get current month name and month days from database
        cursor.execute(f"SELECT TO_CHAR({choosen_month}, 'Mon') AS \"Month\", "
                       f"date_part('days', (date_trunc('month', {choosen_month}) + interval '1 month - 1 day'))")
        month = cursor.fetchall()

        # Get all rfids in current month from database
        cursor.execute(f"SELECT DISTINCT rfid FROM esd_log.esd_check "
                       f"WHERE (timestamp >= date_trunc('month', {choosen_month}) "
                       f"AND timestamp < date_trunc('month', {choosen_month} + interval '1 month')) {sortby}")
        rfids = cursor.fetchall()

        # Get esd results and time for current month from database
        cursor.execute("SELECT rfid, TO_CHAR(timestamp, 'YYYY-MM-DD HH24:MI:SS') AS formatted_timestamp, esd "
                       f"FROM esd_log.esd_check WHERE (timestamp >= date_trunc('month', {choosen_month}) "
                       f"AND timestamp < date_trunc('month', {choosen_month} + interval '1 month'))")
        check_data = cursor.fetchall()

        # Get last 12 months from current month
        cursor.execute("WITH RECURSIVE "
                       f"cte AS (SELECT date_trunc('month', now() - interval '12 month') AS period "
                       "UNION ALL "
                       f"SELECT period + INTERVAL '1 month' "
                       "FROM cte "
                       "WHERE period < date_trunc('month', now())) "
                       "SELECT TO_CHAR(cte.period, 'YYYY-MM') "
                       "FROM cte "
                       "ORDER BY cte.period")
        last_months = cursor.fetchall()

    db_month = [result for result in month]
    return render_template('index.html', db_month=db_month, db_rfids=rfids, db_check_data=check_data,
                           last_months=last_months)

@app.route('/logbook', methods=['GET', 'POST'])
def logbook():
    sort = "timestamp DESC"
    table_rows = 10
    where_ = ""

    if request.method == 'POST':
        # Handle sorting selection
        sort_selected = request.form.get('sort_select')
        if sort_selected == "rfid_high":
            sort = "rfid DESC"
        elif sort_selected == "rfid_low":
            sort = "rfid ASC"
        elif sort_selected == "esd_high":
            sort = "esd DESC"
        elif sort_selected == "esd_low":
            sort = "esd ASC"
        elif sort_selected == "time_high":
            sort = "timestamp DESC"
        elif sort_selected == "time_low":
            sort = "timestamp ASC"

        # Handle table row selection
        rows_selected = request.form.get('rows_form')
        if rows_selected == "10":
            table_rows = 10
        elif rows_selected == "20":
            table_rows = 20
        elif rows_selected == "40":
            table_rows = 40

        # Handle time view selection
        view = request.form.get('view_time')
        if view == "today":
            where_ = "WHERE timestamp >= CURRENT_DATE"
        elif view == "this_week":
            where_ = "WHERE timestamp >= date_trunc('week', current_date)"
        elif view == "this_month":
            where_ = "WHERE timestamp >= date_trunc('month', CURRENT_DATE)"
        elif view == "last_week":
            where_ = "WHERE (timestamp >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 week') " \
                     "AND timestamp < date_trunc('week', CURRENT_TIMESTAMP))"
        elif view == "last_month":
            where_ = "WHERE (timestamp >= date_trunc('month', CURRENT_TIMESTAMP - interval '1 month') " \
                     "AND timestamp < date_trunc('month', CURRENT_TIMESTAMP))"

    # Execute the SQL query with formatted timestamp
    with conn.cursor() as cursor:
        cursor.execute(f"SELECT rfid, esd, TO_CHAR(timestamp, 'YYYY-MM-DD HH24:MI:SS') AS formatted_timestamp "
                       f"FROM esd_log.esd_check {where_} ORDER BY {sort}")
        datatest = cursor.fetchall()

    db_array = [result for result in datatest]
    return render_template('logbook.html', data=db_array, table_rows=table_rows)

@app.route('/stats', methods=['GET', 'POST'])
def stats():
    cal = "day"
    dgt = "30"
    prd = "TO_CHAR(cte.period::date, 'DD-MM-YYYY')"
    rfid = ""

    if request.method == 'POST':
        text = request.form.get('rfid_stat')
        if text is not None:
            rfid = f"WHERE rfid = '{text}'"
            cal = "month"
            dgt = "12"
            prd = "TO_CHAR(cte.period::date, 'YYYY-MM')"

        stats_selected = request.form.get('statsBtn')
        if stats_selected == "daily":
            cal = "day"
            dgt = "30"
            prd = "TO_CHAR(cte.period::date, 'DD-MM-YYYY')"
        elif stats_selected == "weekly":
            cal = "week"
            dgt = "26"
            prd = "TO_CHAR(cte.period::date, 'WW')"
        elif stats_selected == "monthly":
            cal = "month"
            dgt = "12"
            prd = "TO_CHAR(cte.period::date, 'YYYY-MM')"
        elif stats_selected == "yearly":
            cal = "year"
            dgt = "5"
            prd = "TO_CHAR(cte.period::date, 'YYYY')"

    # Execute the SQL query
    with conn.cursor() as cursor:
        cursor.execute("WITH RECURSIVE "
                       f"cte AS (SELECT date_trunc('{cal}', now() - interval '{dgt} {cal}' + interval '1 {cal}') AS period "
                       "UNION ALL "
                       f"SELECT period + INTERVAL '1 {cal}' "
                       "FROM cte "
                       f"WHERE period < date_trunc('{cal}', now())) "
                       "SELECT "
                       f"{prd}, "
                       "count(distinct timestamp) as all_tests, "
                       "count(*) filter (where esd) as esd_true, "
                       "count(*) filter (where not esd) as esd_false "
                       "FROM cte "
                       f"LEFT JOIN esd_log.esd_check on cte.period = date_trunc('{cal}', timestamp) "
                       f"{rfid} "
                       "GROUP BY cte.period::date")

        dataDB = cursor.fetchall()

    data = [result for result in dataDB]
    labels = [row[0] for row in data]
    esd_total = [row[1] for row in data]
    esd_true = [row[2] for row in data]
    esd_false = [row[3] for row in data]

    return render_template('statistics.html', labels=labels, esd_true=esd_true, esd_false=esd_false,
                           esd_total=esd_total, dgt=dgt, cal=cal)


if __name__ == '__main__':
    app.run(debug=True)
