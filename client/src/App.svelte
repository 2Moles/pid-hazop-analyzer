<script>
  import { Router, Route } from 'svelte-navigator';
  import Navbar from './components/Navbar.svelte';
  import Upload from './pages/Upload.svelte';
  import Analysis from './pages/Analysis.svelte';
  import Reports from './pages/Reports.svelte';
  import History from './pages/History.svelte';
</script>

<main class="min-h-screen bg-gray-100">
  <Router>
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <Route path="/" component={Upload} />
      <Route path="/analysis/:id" component={Analysis} />
      <Route path="/reports" component={Reports} />
      <Route path="/history" component={History} />
    </div>
  </Router>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
</style> 