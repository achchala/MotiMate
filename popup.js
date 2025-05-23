document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("save-settings");
  const frequencyInput = document.getElementById("frequency");
  const startTimeInput = document.getElementById("start-time");
  const endTimeInput = document.getElementById("end-time");

  // Function to load and display saved settings
  function loadSettings() {
    chrome.storage.sync.get(
      {
        categories: [],
        frequency: "30", // Default to every 30 minutes
        startTime: "09:00",
        endTime: "17:00",
      },
      function (items) {
        // Set checked status for each checkbox based on saved categories
        const checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach((checkbox) => {
          checkbox.checked = items.categories.includes(checkbox.value);
        });

        frequencyInput.value = items.frequency;
        startTimeInput.value = items.startTime;
        endTimeInput.value = items.endTime;
      }
    );
  }

  // Function to validate time inputs
  function validateTimeInputs() {
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    if (!startTime || !endTime) {
      throw new Error("Please set both start and end times for quote display");
    }

    if (startTime >= endTime) {
      throw new Error("End time must be after start time");
    }
  }

  // Function to validate frequency
  function validateFrequency() {
    const frequency = parseInt(frequencyInput.value);
    if (isNaN(frequency) || frequency < 5) {
      throw new Error("Please enter a valid frequency (minimum 5 minutes)");
    }
    if (frequency > 1440) {
      throw new Error("Frequency cannot be more than 24 hours (1440 minutes)");
    }
  }

  // Function to validate categories
  function validateCategories() {
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    if (checkboxes.length === 0) {
      throw new Error("Please select at least one quote category");
    }
  }

  // Call the function to load settings when popup is opened
  loadSettings();

  saveButton.addEventListener("click", function () {
    try {
      // Validate inputs
      validateTimeInputs();
      validateFrequency();
      validateCategories();

      const checkboxes = document.querySelectorAll(
        "input[type=checkbox]:checked"
      );
      const categories = Array.from(checkboxes).map(
        (checkbox) => checkbox.value
      );
      const frequency = frequencyInput.value;
      const startTime = startTimeInput.value;
      const endTime = endTimeInput.value;

      chrome.storage.sync.set(
        {
          categories: categories,
          frequency: frequency,
          startTime: startTime,
          endTime: endTime,
        },
        function () {
          // Show success message
          const successMessage = document.createElement("div");
          successMessage.textContent =
            "Quote settings saved! Your motivational quotes will appear according to your schedule.";
          successMessage.style.color = "green";
          successMessage.style.textAlign = "center";
          successMessage.style.marginTop = "10px";
          successMessage.style.padding = "10px";
          successMessage.style.backgroundColor = "#e8f5e9";
          successMessage.style.borderRadius = "4px";

          // Remove any existing message
          const existingMessage = document.querySelector(".status-message");
          if (existingMessage) {
            existingMessage.remove();
          }

          successMessage.className = "status-message";
          document.body.appendChild(successMessage);

          // Remove the message after 3 seconds
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      );
    } catch (error) {
      // Show error message
      const errorMessage = document.createElement("div");
      errorMessage.textContent = error.message;
      errorMessage.style.color = "#d32f2f";
      errorMessage.style.textAlign = "center";
      errorMessage.style.marginTop = "10px";
      errorMessage.style.padding = "10px";
      errorMessage.style.backgroundColor = "#ffebee";
      errorMessage.style.borderRadius = "4px";

      // Remove any existing message
      const existingMessage = document.querySelector(".status-message");
      if (existingMessage) {
        existingMessage.remove();
      }

      errorMessage.className = "status-message";
      document.body.appendChild(errorMessage);

      // Remove the message after 3 seconds
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  });
});
