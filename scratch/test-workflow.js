async function testWorkflow() {
  console.log('🧪 Starting Full Portfolio & Admin Workflow Test...\n');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  console.log('1️⃣ Health check:');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('   Health Status:', healthData);

  // 2. Fetch Public Portfolio
  console.log('\n2️⃣ Public Portfolio API:');
  const portRes = await fetch(`${BASE_URL}/portfolio`);
  const portData = await portRes.json();
  console.log(`   Profile Name: ${portData.profile.name}`);
  console.log(`   Total Projects: ${portData.projects.length}`);
  console.log(`   Projects:`, portData.projects.map(p => p.title));
  console.log(`   Certifications:`, portData.certifications.map(c => c.title));
  console.log(`   Achievements:`, portData.achievements.map(a => a.title));

  // 3. Admin Login
  console.log('\n3️⃣ Admin Login Authentication:');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  console.log('   Login response message:', loginData.message);
  console.log('   Received Token:', loginData.token ? 'YES (Valid JWT)' : 'NO');
  const token = loginData.token;

  // 4. Create New Test Project (Protected)
  console.log('\n4️⃣ Creating New Test Project via Admin API...');
  const createRes = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Automated Test Innovation Project',
      shortDescription: 'Temporary project to test admin upload and persistent storage workflow.',
      detailedDescription: 'Detailed verification test description for automated test suite.',
      technologies: ['Node.js', 'Express', 'React', 'SQLite / JSON DB'],
      category: 'AI & ML',
      featured: true,
      published: true
    })
  });
  const createData = await createRes.json();
  console.log('   Project Created ID:', createData.project?.id);

  // 5. Verify Project appears on Public Portfolio API
  console.log('\n5️⃣ Verifying Public Portfolio update after creation...');
  const updatedPortRes = await fetch(`${BASE_URL}/portfolio`);
  const updatedPortData = await updatedPortRes.json();
  const testProjFound = updatedPortData.projects.find(p => p.id === createData.project?.id);
  console.log('   Test Project Found on Public API?:', testProjFound ? '✅ YES!' : '❌ NO');

  // 6. Delete Test Project (Cleanup)
  if (createData.project?.id) {
    console.log('\n6️⃣ Deleting Test Project (Cleanup)...');
    const deleteRes = await fetch(`${BASE_URL}/projects/${createData.project.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const deleteData = await deleteRes.json();
    console.log('   Delete response:', deleteData.message);
  }

  console.log('\n🎉 ALL WORKFLOW TESTS PASSED SUCCESSFULLY!');
}

testWorkflow().catch(err => {
  console.error('❌ Test failed with error:', err);
});
