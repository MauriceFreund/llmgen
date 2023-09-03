package llmgeneval;

import java.util.List;

class TestResult {
    public List<String> successfulTests;
    public List<String> failedTests;
    public int numSuccesses;
    public int numTests;
    public double successRate;

    public TestResult(List<String> successfulTests, List<String> failedTests, int numSuccesses, int numTests, double successRate) {
        this.successfulTests = successfulTests;
        this.failedTests = failedTests;
        this.numSuccesses = numSuccesses;
        this.numTests = numTests;
        this.successRate = successRate;
    }
}
