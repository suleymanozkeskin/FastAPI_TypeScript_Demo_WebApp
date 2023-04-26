FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app
COPY ./entrypoint.sh /code/entrypoint.sh

ENTRYPOINT ["/code/entrypoint.sh"]



#docker run -d --name mycontainer -p 8000:8000 myimage


