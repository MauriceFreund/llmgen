#!/bin/bash

current_dir=$(pwd)
target_language=$(basename "$current_dir")
parent_path=$(dirname "$current_dir")
test_case=$(basename "$parent_path")

echo "Testing generator for $target_language with $test_case..."

if test -d "./src/main/java/llmgeneval/generated/"; then
    echo "Cleaning generated"
    rm -r ./src/main/java/llmgeneval/generated/
fi

echo Start Mock Api
mockoon-cli start --data ../mock/api-mock.json &
mockoon_pid=$!

echo Run generator...
(time npx llmgen configuration.json) 2>&1 | awk '/real/ {print $2}' > runtime

echo Run tests...
./gradlew clean build run

kill -9 $mockoon_pid
