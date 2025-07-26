fetch('https://searchyourtour.com/api/currencies?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1')
  .then(response => response.json())
  .then(data => {
    console.log('Currencies:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  }); 