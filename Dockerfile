# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Copy the requirements.txt file to the container at /api
COPY ./requirements.txt /api/requirements.txt

# Set the working directory to /api
# WORKDIR /api

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r /api/requirements.txt

# Copy the content of the local src directory to the container at /api
COPY ./api /api

# Expose port 5328
EXPOSE 5328

# Command to run on container start
CMD ["python", "-m", "flask", "--app", "api/index", "run", "-p", "5328", "--host", "0.0.0.0"]

