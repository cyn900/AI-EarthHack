import csv
import pandas as pd
import matplotlib.pyplot as plt

def calculateAvg(score):
    num = 0
    i = 0
    with open('server/output.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        
        for row in reader:
            num += float(row[score])
            i += 1

    return num/i

# print the problemUrgentScore average
# print('average problemUrgentScore: ', calculateAvg('problemUrgentScore'))

def plot_histogram(data, column_name, bins=20, range=(0, 10)):
    """
    Plot a histogram for a given column in the DataFrame.

    Parameters:
    data (DataFrame): The DataFrame containing the data to plot.
    column_name (str): The name of the column to plot.
    bins (int): Number of bins in the histogram.
    range (tuple): The range of values for the histogram.
    """
    plt.figure(figsize=(10, 6))
    plt.hist(data[column_name], bins=bins, range=range, edgecolor='black')
    plt.title(f'{column_name} Distribution')
    plt.xlabel('Value')
    plt.ylabel('Frequency')
    plt.show()

# Replace with the path to your CSV file
file_path = 'server/output.csv'

# Read the CSV file using Pandas
df = pd.read_csv(file_path, delimiter=';')

# Plot histograms for different columns
# plot_histogram(df, 'problemPopularityScore')
# plot_histogram(df, 'solutionImplementabilityScore')

# Select the row - for example, the row with index 5
selected_row = df.iloc[3]

# Define outlier criteria for a specific column - for example, 'problemPopularityScore'
column_name = 'problemPopularityScore'

# Compute the IQR for the entire column
Q1 = df[column_name].quantile(0.25)
Q3 = df[column_name].quantile(0.75)
IQR = Q3 - Q1

# Define bounds for outliers
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# Check if the selected row's value in the specified column is an outlier
def idOutlier(score):
    if selected_row[score] < lower_bound or selected_row[score] > upper_bound:
        print(f"The value in row {selected_row.newName} is an outlier in column '{score}'.")
    else:
        print("There is no outlier.")

    # with open('server/output.csv', newline='') as csvfile:
    #     reader = csv.DictReader(csvfile, delimiter=';')
            
    #     for row in reader:
    #         print(row[score])

# 'problemPopularityScore'
idOutlier('problemPopularityScore')
