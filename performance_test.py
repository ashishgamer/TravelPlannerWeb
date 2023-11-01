import time
import re
from selenium import webdriver
from selenium.webdriver.common.by import By

# Create a new instance of the Chrome driver
driver = webdriver.Chrome()

# Open your web page
driver.get("file:///C:/Users/Ashish%20Ranjan/Documents/MTech/SEM%204/TravelPlanner/TravelPlannerWebApp/index.html")

# Find the REST and GraphQL buttons
rest_button = driver.find_element(By.ID,"rest-btn")
graphql_button = driver.find_element(By.ID,"graphql-btn")

# Locate the source and destination input elements
source_input = driver.find_element(By.ID,"source")  # Use the actual ID of the source input element
destination_input = driver.find_element(By.ID,"destination")  # Use the actual ID of the destination input element

# Enter text in the source and destination fields
source_input.send_keys("Paris")
destination_input.send_keys("Delhi")

# Function to get the time from results
def get_search_time():
    results_heading = driver.find_element(By.ID,"results-heading")
    # Assuming results_heading.text contains the text "Search completed in 11.70 ms"
    match = re.search(r'\d+\.\d+\s(\w+)', results_heading.text)

    if match:
        time_taken = match.group(0)  # This will be "11.70 ms"
        time_in_milliseconds = float(time_taken.split()[0])  # Extract the number and convert to float
        print(f"Time taken: {time_in_milliseconds} ms")
        return float(time_in_milliseconds)  # Extract the time in milliseconds
    else:
        print("Time not found in the results heading")

# Click each button 100 times and measure the time
rest_times = []
graphql_times = []

for _ in range(100):
    rest_button.click()
    # Wait for a few seconds to allow the search results to load
    time.sleep(1)
    rest_time = get_search_time()
    rest_times.append(rest_time)

    graphql_button.click()
    # Wait for a few seconds to allow the search results to load
    time.sleep(1)
    graphql_time = get_search_time()
    graphql_times.append(graphql_time)

# Close the browser
driver.close()

# Calculate and print the average time for REST and GraphQL
avg_rest_time = sum(rest_times) / len(rest_times)
avg_graphql_time = sum(graphql_times) / len(graphql_times)

print(f"Average time taken for REST: {avg_rest_time} ms")
print(f"Average time taken for GraphQL: {avg_graphql_time} ms")
print(f"Time difference (REST - GraphQL): {avg_rest_time - avg_graphql_time} ms")
