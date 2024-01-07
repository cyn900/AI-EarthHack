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


# with open('server/output.csv', newline='') as csvfile:
#     reader = csv.DictReader(csvfile)
    
#     for row in reader:
#         print(row['problemPopularityScore'])


# Replace with the path to your CSV file
file_path = 'server/output.csv'

# Read the CSV file using Pandas
df = pd.read_csv(file_path, delimiter=';')

# Assuming the column with numbers is named 'Numbers'
# Replace 'Numbers' with the actual column name from your CSV
data = df['problemPopularityScore']

# Plotting the histogram
plt.figure(figsize=(10, 6))
plt.hist(data, bins=20, range=(0, 10), edgecolor='black')  # Adjust the number of bins as needed

# Adding titles and labels
plt.title('Number Distribution')
plt.xlabel('Value')
plt.ylabel('Frequency')

# Show the plot
plt.show()
