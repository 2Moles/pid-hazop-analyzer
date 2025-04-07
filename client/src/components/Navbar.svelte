<script>
  import { Link } from 'svelte-navigator';
</script>

<nav class="bg-white shadow-lg">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="flex items-center">
        <Link to="/" class="flex items-center">
          <span class="text-xl font-bold text-gray-800">P&ID HAZOP Analyzer</span>
        </Link>
      </div>
      
      <div class="flex space-x-4">
        <Link to="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Upload
        </Link>
        <Link to="/reports" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Reports
        </Link>
        <Link to="/history" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          History
        </Link>
      </div>
    </div>
  </div>
</nav> 