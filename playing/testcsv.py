import csv, os

test_csv = 'playing/test.csv'

if not os.path.exists(test_csv):
    with open(test_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['A', 'B', 'C', 'D'])

with open(test_csv, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['A,1', 'B1', 'C1', 'D1'])