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

print('average problemUrgentScore: ', calculateAvg('problemUrgentScore'))

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
plot_histogram(df, 'problemPopularityScore')
plot_histogram(df, 'solutionImplementabilityScore')
