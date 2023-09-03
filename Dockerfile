FROM ubuntu:latest

RUN apt-get update \
    && apt-get -y install curl unzip \
    && apt-get -y install python3 python3-pip \
    && apt-get clean

RUN curl -L https://services.gradle.org/distributions/gradle-7.2-bin.zip -o gradle-7.2-bin.zip \
    && unzip gradle-7.2-bin.zip \
    && mv gradle-7.2 /opt/gradle \
    && ln -s /opt/gradle/bin/gradle /usr/bin/gradle \
    && rm gradle-7.2-bin.zip

RUN apt-get update && apt-get install -y ca-certificates curl gnupg \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && NODE_MAJOR=20 \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install nodejs -y 

RUN pip3 install requests

WORKDIR /usr/pipeline

COPY ./llmgen ./llmgen
COPY ./llmgen-evaluation ./llmgen-evaluation

WORKDIR /usr/pipeline/llmgen

RUN npm i && npm link

RUN npm i -g @mockoon/cli

WORKDIR /usr/pipeline/llmgen-evaluation

ENV OPENAI_API_KEY = key

CMD ["python3", "pipeline.py"]
