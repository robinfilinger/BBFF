from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    # Read the CSV file
    df = pd.read_csv('RawData/TeamNames.csv')
    
    # Convert DataFrame to a list of dictionaries
    teams = df.to_dict('records')
    
    return render_template('teams.html', teams=teams)

if __name__ == '__main__':
    app.run(debug=True)