package llmgeneval;

import java.util.List;

class TestResult {
    public List<String> successful_tests;
    public List<String> failed_tests;
    public int num_successes;
    public int num_tests;
    public double success_rate;

    public TestResult(List<String> successfulTests, List<String> failedTests, int numSuccesses, int numTests,
            double successRate) {
        this.successful_tests = successfulTests;
        this.failed_tests = failedTests;
        this.num_successes = numSuccesses;
        this.num_tests = numTests;
        this.success_rate = successRate;
    }
}
