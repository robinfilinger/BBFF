import pandas as pd
from decimal import Decimal

df_matchups = pd.read_csv('RawData/DirectMatchups.csv')
df_teams = pd.read_csv('RawData/TeamNames.csv')

df_Terps = len(df_matchups.loc[df_matchups['Winner'] =='Dirty Terps'])
df_standings = pd.DataFrame(columns=['Team', 'W', 'L', 'Points For', 'Points Against', 'Average PF', 'Average PA'])
team_records = []

def to_decimal(val):
    return Decimal(str(val)) if isinstance(val, float) else val

for col in df_matchups.columns:
    if col != 'name':
        df_matchups[col] = df_matchups[col].apply(to_decimal)

for x in range(len(df_teams)):
    teamName = df_teams.iloc[x]['Name']
    df_wins = df_matchups.loc[df_matchups['Winner'] ==teamName]
    df_losses = df_matchups.loc[df_matchups['Loser'] == teamName]

    wins = len(df_wins)
    losses = len(df_losses)

    pointsFor = df_wins['wScore'].sum() + df_losses['lScore'].sum()
    pointsAgainst = df_wins['lScore'].sum() + df_losses['wScore'].sum()
    print(pointsFor)
    print(pointsAgainst)

    averagePf = round(pointsFor/(wins + losses), 2)
    averagePa = round(pointsAgainst/(wins + losses), 2)



    df_standings.loc[len(df_standings)] = [teamName, wins, losses, pointsFor, pointsAgainst, averagePf, averagePa]


print(df_standings)
df_standings.to_csv('CompleteData/Historical/HistoricalStandings.csv', index=False)

