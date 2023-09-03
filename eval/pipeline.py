import sys
import json
import subprocess
from pathlib import Path


NUM_TEST_RUNS = 1 if len(sys.argv) <= 1 else int(sys.argv[1])
OUTPUT_FILE_PATH = "./test-results.json"
TEST_OUTPUT_MARKER = "#+#"
TARGET_LANGUAGES = ["js", "py", "java"]


def run_test_script(parent_dir):
    process_output = subprocess.run(
            ["./run-test.sh"],
            cwd=parent_dir,
            stdout=subprocess.PIPE,
            text=True
    )
    try:
        test_output_str = process_output.stdout.split(TEST_OUTPUT_MARKER)[1]
        return json.loads(test_output_str)
    except Exception as e:
        print(e)
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


def run_test(test_dir, test_map):
    test_name = test_dir.name
    test_map[test_name] = {}
    print(f"Running test '{test_name}'")

    for target_language in TARGET_LANGUAGES:
        test_results = []
        target_language_dir = Path(test_dir) / target_language
        if not target_language_dir.exists():
            break
        print(f"Executing {target_language} tests.")
        for i in range(1, NUM_TEST_RUNS + 1):
            print(f"Starting run {i}/{NUM_TEST_RUNS}")
            test_output = run_test_script(target_language_dir.resolve())
            test_output["runtime"] = read_runtime(test_dir, target_language)
            test_results.append(test_output)
            test_map[test_name][target_language] = test_results


if __name__ == "__main__":
    print("Running test pipeline.")
    dir_content = Path("./test-cases/").iterdir()
    test_cases = [path for path in dir_content if path.is_dir()]
    test_map = {}
    for test in test_cases:
        run_test(test, test_map)

    resolved_output_path = Path(OUTPUT_FILE_PATH).resolve()
    with open(resolved_output_path, 'w', encoding="utf-8") as output_file:
        json.dump(test_map, output_file)
        print(f"Results written to {resolved_output_path}")
