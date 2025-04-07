<script>
  import { navigate } from 'svelte-navigator';
  import axios from 'axios';
  
  let file = null;
  let isUploading = false;
  let error = null;
  let previewUrl = null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      file = selectedFile;
      previewUrl = URL.createObjectURL(selectedFile);
      error = null;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      error = 'Please select a file';
      return;
    }

    isUploading = true;
    error = null;

    try {
      const formData = new FormData();
      formData.append('pidImage', file);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Navigate to analysis page with the file ID
      navigate(`/analysis/${response.data.fileId}`);
    } catch (err) {
      error = err.response?.data?.error || 'Failed to upload file';
    } finally {
      isUploading = false;
    }
  };
</script>

<div class="max-w-2xl mx-auto">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Upload P&ID Diagram</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="pid-upload">
        Select P&ID Image
      </label>
      <input
        type="file"
        id="pid-upload"
        accept="image/*"
        on:change={handleFileChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {#if previewUrl}
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Preview</h2>
        <img
          src={previewUrl}
          alt="P&ID Preview"
          class="max-w-full h-auto rounded-md border border-gray-300"
        />
      </div>
    {/if}

    <button
      on:click={handleUpload}
      disabled={isUploading || !file}
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if isUploading}
        Uploading...
      {:else}
        Upload and Analyze
      {/if}
    </button>
  </div>
</div> 