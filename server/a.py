import pandas as pd

# Replace 'file1.csv' and 'file2.csv' with your actual file names
file1 = 'small-output-10.csv'
file2 = 'small-output-50.csv'

# Read CSV files into pandas DataFrames
df1 = pd.read_csv(file1, delimiter=';')
df2 = pd.read_csv(file2, delimiter=';')

# Combine DataFrames based on the common header
combined_df = pd.concat([df1, df2], ignore_index=True)

# Write the combined DataFrame to a new CSV file
combined_df.to_csv('combined_file.csv', index=False, sep=';')

print("CSV files combined successfully.")
