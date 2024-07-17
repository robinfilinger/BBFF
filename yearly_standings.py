import pandas as pd
from decimal import Decimal
import datetime


firstSeason = 2023
currentSeason = 2024

for x in range(currentSeason-firstSeason):
    currYear = firstSeason + x

    df_matchups = pd.read_csv('RawData/DirectMatchups.csv')
    df_teams = pd.read_csv('RawData/TeamNames.csv')

    df_standings = pd.DataFrame(columns=['Place','teamId','Team', 'W', 'L', 'Points For', 'Points Against', 'Average PF', 'Average PA'])

    df_currYear_matchups = df_matchups.loc[df_matchups['Season'] == currYear]
    df_currYear_Teams = df_teams.loc[df_teams['Season'] == currYear]

    def to_decimal(val):
        return Decimal(str(val)) if isinstance(val, float) else val

    for col in df_currYear_matchups.columns:
        if col != 'name':
            df_currYear_matchups[col] = df_currYear_matchups[col].apply(to_decimal)

    for x in range(len(df_currYear_Teams)):
        teamName = df_currYear_Teams.iloc[x]['Name']
        teamId = df_currYear_Teams.iloc[x]['Id']
        regFin = df_currYear_Teams.iloc[x]['RegSeasonFin']
        df_wins = df_currYear_matchups.loc[df_currYear_matchups['Winner'] ==teamName]
        df_losses = df_currYear_matchups.loc[df_currYear_matchups['Loser'] == teamName]

        wins = len(df_wins)
        losses = len(df_losses)

        pointsFor = df_wins['wScore'].sum() + df_losses['lScore'].sum()
        pointsAgainst = df_wins['lScore'].sum() + df_losses['wScore'].sum()
        print(pointsFor)
        print(pointsAgainst)

        averagePf = round(pointsFor/(wins + losses), 2)
        averagePa = round(pointsAgainst/(wins + losses), 2)

        df_standings.loc[len(df_standings)] = [regFin, teamId, teamName, wins, losses, pointsFor, pointsAgainst, averagePf, averagePa]

        print(df_standings)
        df_standings.to_csv('CompleteData/' + str(currYear) + '/' + str(currYear) + 'Standings.csv', index=False)






