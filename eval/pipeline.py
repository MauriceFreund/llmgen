import datetime
import sys
import json
import subprocess
import shutil
from pathlib import Path


NUM_TEST_RUNS = 1 if len(sys.argv) <= 1 else int(sys.argv[1])
OUTPUT_DIR = "./results"
OUTPUT_FILE_NAME = "test-results.json"
TEST_OUTPUT_MARKER = "#+#"
TARGET_LANGUAGES = ["js", "py", "java"]
TEST_CASES = ["simple-api", "inheritance"]

def log(msg):
    print("[eval-pipeline]", msg)


def run_test_script(parent_dir):
    process_output = subprocess.run(
            ["./run-test.sh"],
            cwd=parent_dir,
            stdout=subprocess.PIPE,
            text=True
    )
    try:
        print(process_output.stdout)
        test_output_str = process_output.stdout.split(TEST_OUTPUT_MARKER)[1]
        print(test_output_str)
        return json.loads(test_output_str)
    except Exception as e:
        log(f"Error when running test script {e}")
        return {}


def read_runtime(test_dir, target_language):
    runtime = -1
    runtime_file_path = Path(test_dir) / target_language / "runtime"
    if (runtime_file_path.exists):
        with open(runtime_file_path, 'r') as runtime_file:
            runtime = runtime_file.readline()
            runtimeSplit = runtime.split('m')
            minutes = int(runtimeSplit[0])
            filtered_string = ''.join([c for c in runtimeSplit[1] if c.isdigit()])
            milliseconds = int(filtered_string)
            runtime = minutes * 60 * 1000 + milliseconds
    return runtime

def read_eval_results(test_dir, target_language):
    eval_file_path = Path(test_dir) / target_language / "evalResults.json"
    if (eval_file_path.exists):
        with open(eval_file_path, 'r') as eval_file:
            return json.load(eval_file)
    return None

def copy_output(test_dir, out_dir, target_language, scenario, run):
    source_file_path = Path(test_dir) / target_language / "eval.output"
    dest_path = Path(out_dir) / scenario / target_language
    dest_file = dest_path / f"{run}.output"
    if (source_file_path.exists):
        try:
            dest_path.mkdir(parents=True, exist_ok=True) 
            shutil.copy(source_file_path.resolve(), dest_file.resolve())
        except Exception as e:
            print(f"Could not copy output file for {scenario}/{target_language}/{run}", e)

    


def run_test(test_dir, test_map, out_dir):
    test_name = test_dir.name
    test_map[test_name] = {}
    log(f"Running test '{test_name}'")

    for target_language in TARGET_LANGUAGES:
        test_results = []
        target_language_dir = Path(test_dir) / target_language
        if not target_language_dir.exists():
            break
        log(f"Executing {target_language} tests.")
        for i in range(1, NUM_TEST_RUNS + 1):
            log(f"Starting run {i}/{NUM_TEST_RUNS}")
            test_output = run_test_script(target_language_dir.resolve())
            test_output["runtime"] = read_runtime(test_dir, target_language)
            eval_results = read_eval_results(test_dir, target_language)
            if eval_results != None:
                test_output["eval_results"] = eval_results
            test_results.append(test_output)
            test_map[test_name][target_language] = test_results
            copy_output(test_dir, out_dir, target_language, test_name, i)


if __name__ == "__main__":
    log("Running test pipeline.")
    dir_content = Path("./test-cases/").iterdir()
    test_cases = [path for path in dir_content if path.is_dir() and path.name in TEST_CASES]

    current_datetime = datetime.datetime.now()
    formatted_datetime = current_datetime.strftime("%d-%m-%Y_%H:%M:%S")
    output_dir = (Path(OUTPUT_DIR) / formatted_datetime).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    test_map = {}

    for test in test_cases:
        run_test(test, test_map, output_dir)

    file_path = Path(output_dir) / OUTPUT_FILE_NAME

    with open(file_path.resolve(), 'w', encoding="utf-8") as output_file:
        json.dump(test_map, output_file)
        log(f"Results written to {output_dir}")
