# llmgen

An experimental code generator for REST apis built on top of a large language
model.

This repo contains two parts. The directory 'generator' contains the implementation
of the generator while 'eval' implements an evaluation pipeline for the
generator.

## Using the generator

Prerequisites:

- NodeJS and npm have to be installed
- A .env file with an OpenAI API key needs to be placed in the 'generator' directory.

The content of the .env file has to look like this:

```
OPENAI_API_KEY=<Your API Key>
```

### Installation

After checkout install the npm dependencies by running this command within
the 'generator' directory:

```
npm i
```

Then run the following command within the 'generator' directory:

```
npm link
```

This will allow you to run llmgen globally. If you want to unlink llmgen use
the following command:

```
npm uninstall -g llmgen
```

### Code Generation

In order to generate a client for an API you need the specification of the API
in the OpenAPI format and a configuration file for llmgen. The content of the
generation file might look like this:

```json
{
  "meta": {
    "model": "gpt-3.5-turbo",
    "temperature": 0,
    "topP": 1,
    "inputPaths": {
      "openApi": "../input/api.json"
    },
    "outputDir": "./src/main/java/llmgeneval/generated/"
  },
  "generator": {
    "targetLanguage": "Java",
    "comments": false,
    "javaPackagePrefix": "llmgeneval.generated"
  }
}
```

Here is an explanation of the configuration parameters:

| Parameter  | Description                     | Value                                                                                              |
| ---------- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| meta.model | Name of the OpenAI model to use | see [OpenAI docs](https://platform.openai.com/docs/models) (needs to support chat completions api) |
| meta.temperature | Value of the temperature parameter for the llm | [OpenAI docs](https://platform.openai.com/docs/api-reference/chat/create) |
| meta.topP | Value of the top_p parameter for the llm | see [OpenAI docs](https://platform.openai.com/docs/api-reference/chat/create) |
| meta.inputPaths.openApi | Location of the OpenApi spec file | Either absolute path or path relative to configuration file |
| meta.outputDir | Path to the directory in which the generated code should be placed in | Either absolute path or path relative to configuration file |
| generator.targetLanguage | The language that should be used for the generated client | "JavaScript", "Python" or "Java" |
| generator.comments | Whether or not the code should contain additional comments for documentation | true or false |
| generator.javaPackagePrefix | Only necessary when targetLanguage equals Java. Denotes the package the generated code is placed in. | e.g. "org.something.api" |

In order to start the code generation process navigate to the folder containing
the configuration file and run 

```
llmgen <name of the configuration file>
``` 

## Running the evaluation

The repository includes an evaluation pipeline designed for testing the 
generators capabilities. The pipeline contains two test scenarions named 
"simple-api" and "inheritance". Each test scenario in turn contains configuration
files for each supported target language (subfolders "js", "py" and "java").

The pipeline will start a mockserver for each test scenario, generate the code
for an OpenAPI spec in each target language and run a set of tests to check the generated api client.
The easiest way to run the pipeline is by using the docker-compose file located
in the root of the repository. The corresponding docker file installs all 
the dependencies that are necessary to run the pipeline.

Each generation process is run with a default set of configuration parameters.
If you wish to change those parameters you need to edit the configuration file
of each combination of test scenario and target language. For example the 
configuration file of the scenario "simple-api" and the language "JavaScript"
is located in "eval/test-scenarios/simple-api/js/configuration.json"

The results of the evaluation will be saved in the folder "eval/results".
