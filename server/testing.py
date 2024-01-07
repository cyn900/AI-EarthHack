import csv
import pandas as pd
import matplotlib.pyplot as plt

# avgProblemPopularityScore = 0
# avgProblemGrowingScore = 0
# avgProblemUrgentScore = 0
# avgProblemExpenseScore = 0
# avgProblemFrequentScore = 0
# avgSolutionCompletenessScore = 0
# avgSolutionTargetScore = 0
# avgSolutionNoveltyScore = 0
# avgSolutionFinImpactScore = 0
# avgSolutionImplementabilityScore = 0


with open('server/output.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:
        print(row['problem'], row['solution'])

 = 'X_Column'
y_column = 'Y_Column'

# Plotting the line graph
plt.figure(figsize=(10, 6))
plt.plot(df[x_column], df[y_column], marker='o')
plt.title('Line Graph from CSV Data')
plt.xlabel(x_column)
plt.ylabel(y_column)
plt.grid(True)
plt.show()