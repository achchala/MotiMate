document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('save-settings');
    const frequencyInput = document.getElementById('frequency');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
  
    // Function to load and display saved settings
    function loadSettings() {
      chrome.storage.sync.get({
        categories: [],
        frequency: '',
        startTime: '',
        endTime: ''
      }, function(items) {
        // Set checked status for each checkbox based on saved categories
        Object.keys(items.categories).forEach(category => {
          document.getElementById(category).checked = true;
        });
  
        frequencyInput.value = items.frequency; // Set frequency
        startTimeInput.value = items.startTime; // Set start time
        endTimeInput.value = items.endTime; // Set end time
      });
    }
  
    // Call the function to load settings when popup is opened
    loadSettings();
  
    saveButton.addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
      const categories = Array.from(checkboxes).map(checkbox => checkbox.value);
      const frequency = frequencyInput.value;
      const startTime = startTimeInput.value;
      const endTime = endTimeInput.value;
  
      chrome.storage.sync.set({
        categories: categories,
        frequency: frequency,
        startTime: startTime,
        endTime: endTime
      }, function() {
        alert('Settings saved!');
        loadSettings(); // Reload settings after saving
      });
    });
  });
  