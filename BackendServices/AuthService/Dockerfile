FROM python:3.10
COPY . /app/
WORKDIR /app
RUN pip install -r requirements-dev.txt
CMD python -u app.py
EXPOSE 5000