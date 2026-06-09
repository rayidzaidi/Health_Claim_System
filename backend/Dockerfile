FROM python:3.11-slim

WORKDIR /code

# Copy and install requirements
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code
COPY . /code

# Expose port (7860 is default for Hugging Face Spaces)
EXPOSE 7860

# Run uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
