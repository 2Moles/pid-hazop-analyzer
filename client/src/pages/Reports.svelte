<script>
  import axios from 'axios';
  import { saveAs } from 'file-saver';
  
  let reports = [];
  let isLoading = true;
  let error = null;

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports');
      reports = response.data;
      isLoading = false;
    } catch (err) {
      error = err.response?.data?.error || 'Failed to fetch reports';
      isLoading = false;
    }
  };

  const downloadReport = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/${reportId}/download`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `hazop-report-${reportId}.pdf`);
    } catch (err) {
      error = err.response?.data?.error || 'Failed to download report';
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/reports/${reportId}`);
      reports = reports.filter(report => report._id !== reportId);
    } catch (err) {
      error = err.response?.data?.error || 'Failed to delete report';
    }
  };

  // Initialize
  fetchReports();
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Generated Reports</h1>
    </div>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    {#if isLoading}
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading reports...</p>
      </div>
    {:else if reports.length === 0}
      <div class="text-center py-8">
        <p class="text-gray-600">No reports found. Upload and analyze a P&ID diagram to generate reports.</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each reports as report}
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-800">{report.filename}</h3>
                <p class="text-sm text-gray-500">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  on:click={() => downloadReport(report._id)}
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Download
                </button>
                <button
                  on:click={() => deleteReport(report._id)}
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 