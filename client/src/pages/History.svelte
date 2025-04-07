<script>
  import { navigate } from 'svelte-navigator';
  import axios from 'axios';
  
  let history = [];
  let isLoading = true;
  let error = null;

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports');
      history = response.data;
      isLoading = false;
    } catch (err) {
      error = err.response?.data?.error || 'Failed to fetch history';
      isLoading = false;
    }
  };

  const viewAnalysis = (fileId) => {
    navigate(`/analysis/${fileId}`);
  };

  // Initialize
  fetchHistory();
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Analysis History</h1>
    </div>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    {#if isLoading}
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading history...</p>
      </div>
    {:else if history.length === 0}
      <div class="text-center py-8">
        <p class="text-gray-600">No analysis history found. Upload and analyze a P&ID diagram to get started.</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each history as item}
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-800">{item.filename}</h3>
                <p class="text-sm text-gray-500">
                  Analyzed on {new Date(item.createdAt).toLocaleDateString()}
                </p>
                {#if item.analysisId?.safetyIssues}
                  <div class="mt-2">
                    <span class="text-sm text-gray-500">Safety Issues:</span>
                    <span class="text-sm text-gray-700 ml-2">
                      {item.analysisId.safetyIssues.length}
                    </span>
                  </div>
                {/if}
              </div>
              <button
                on:click={() => viewAnalysis(item.analysisId._id)}
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Analysis
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 