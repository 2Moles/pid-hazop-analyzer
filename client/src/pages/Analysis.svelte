<script>
  import { params } from 'svelte-navigator';
  import axios from 'axios';
  import { saveAs } from 'file-saver';
  
  let fileId = $params.id;
  let analysis = null;
  let isAnalyzing = true;
  let error = null;
  let isGeneratingReport = false;
  let reportUrl = null;

  // Fetch analysis results
  const fetchAnalysis = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analysis/analyze/${fileId}`);
      analysis = response.data;
      isAnalyzing = false;
    } catch (err) {
      error = err.response?.data?.error || 'Failed to analyze P&ID';
      isAnalyzing = false;
    }
  };

  // Generate HAZOP report
  const generateReport = async () => {
    if (!analysis) return;

    isGeneratingReport = true;
    error = null;

    try {
      const response = await axios.get(`http://localhost:5000/api/analysis/report/${analysis._id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `hazop-report-${fileId}.pdf`);
      
      isGeneratingReport = false;
    } catch (err) {
      error = err.response?.data?.error || 'Failed to generate report';
      isGeneratingReport = false;
    }
  };

  // Initialize
  fetchAnalysis();
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">P&ID Analysis Results</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    {#if isAnalyzing}
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Analyzing P&ID diagram...</p>
      </div>
    {:else if analysis}
      <div class="space-y-6">
        <!-- Detected Components -->
        <section>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Detected Components</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each analysis.components as component}
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-800">{component.type}</span>
                  <span class="text-sm text-gray-500">
                    {(component.confidence * 100).toFixed(1)}% confidence
                  </span>
                </div>
                <div class="text-sm text-gray-600">
                  Position: ({component.bbox.x}, {component.bbox.y})
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Safety Issues -->
        <section>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Safety Issues</h2>
          <div class="space-y-4">
            {#each analysis.safetyIssues as issue}
              <div class="bg-red-50 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-red-800">{issue.type}</span>
                  <span class="px-2 py-1 text-sm rounded-full bg-red-200 text-red-800">
                    {issue.severity} severity
                  </span>
                </div>
                <p class="text-gray-600">{issue.description}</p>
                {#if issue.components.length > 0}
                  <div class="mt-2">
                    <span class="text-sm text-gray-500">Affected components:</span>
                    <span class="text-sm text-gray-700 ml-2">{issue.components.join(', ')}</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        <!-- Generate Report Button -->
        <div class="pt-4">
          <button
            on:click={generateReport}
            disabled={isGeneratingReport}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isGeneratingReport}
              Generating Report...
            {:else}
              Generate HAZOP Report
            {/if}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div> 