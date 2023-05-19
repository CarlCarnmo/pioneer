from flask import Flask, render_template, request
import psycopg2, os

app = Flask(__name__)
app.config.from_pyfile(os.path.join(".", "config/config.conf"), silent=False)

# Connect to the database
conn = psycopg2.connect(app.config.get("DB_CONNECTION"))
cur = conn.cursor()

@app.route('/', methods=['GET', 'POST'])
def main():
    # Default sorting and table row values
    sort = "timestamp DESC"
    table_rows = 10
    where_ = ""
    db_array = []

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
                     "and timestamp < date_trunc('week', CURRENT_TIMESTAMP))"
        elif view == "last_month":
            where_ = "WHERE (timestamp >= date_trunc('week', CURRENT_TIMESTAMP - interval '1 month') " \
                     "and timestamp < date_trunc('month', CURRENT_TIMESTAMP))"

    # Execute the SQL query with formatted timestamp
    cur.execute(f"SELECT rfid, esd, TO_CHAR(timestamp, 'YYYY-MM-DD HH:MI:SS') AS formatted_timestamp "
                f"FROM esd_log.esd_check {where_} ORDER BY {sort};")

    # Fetch all the data
    datatest = cur.fetchall()

    # Close the cursor and the database connection
    cur.close()
    conn.close()

    # Store the results in a list
    db_array = [result for result in datatest]

    # Render the template with data and table_rows
    return render_template('index.html', data=db_array, table_rows=table_rows)

@app.route('/stats')
def stats():
    return render_template('statistics.html')

if __name__ == '__main__':
    app.run(debug=True)
