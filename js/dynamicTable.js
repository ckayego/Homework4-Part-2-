/*
File: homework4 (Part 2).js
GUI Assignment: Using the jQuery User Interface library.
Christian Kayego, UMass Lowell Computer Science, christian_kayego@student.uml.edu
This assignment is a part 2 of homework 4 in which we explore another javascript library as we did with part 1 with
the jQuery Validator plugin. This part of the assignment will deal with two parts of the jQuery UI components
which are the slider and the tabbed interface. JQuery UI sliders are to be added for each of the text input fields
and also implementing a a jQuery UI tabbed interface so that every time a table is generated, it is displayed in a 
new tab with its labeled entries to generate the table. On top of that, implement it in a way so that the tabs can
be deleted individually but also multiple tabs can be deleted all at once. 
Copyright (c) 2023 by Christian Kayego. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Christian Kayego on June 19, 2023 at 4:30 pm
Sources used: https://www.w3schools.com/, https://www.youtube.com/watch?v=UB1O30fR-EE, https://stackoverflow.com/, 
jQueryUI1.8_Ch06_SliderWidget.pdf, jQueryUI1.8_Ch03_TabsWidget.pdf, 
https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css --
https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js -
*/


// Get form and table container elements
const form = document.getElementById('inputForm');
const tableTabs = $('#tableTabs');
const tableContainer = document.getElementById('tableContainer');
const loadingMessage = document.getElementById('loadingMessage');

// tab ID
let tabCounter = 1;

// Add event listener to form submission
$(document).ready(function () {
  $('#inputForm').validate({
    rules: {
      startMultiplier: {
        required: true,
        number: true,
      },
      endMultiplier: {
        required: true,
        number: true,
      },
      startMultiplicand: {
        required: true,
        number: true,
      },
      endMultiplicand: {
        required: true,
        number: true,
      },
    },
    messages: {
      startMultiplier: {
        required: 'Please enter a start multiplier.',
        number: 'Please enter a valid number for the start multiplier.',
      },
      endMultiplier: {
        required: 'Please enter an end multiplier.',
        number: 'Please enter a valid number for the end multiplier.',
      },
      startMultiplicand: {
        required: 'Please enter a start multiplicand.',
        number: 'Please enter a valid number for the start multiplicand.',
      },
      endMultiplicand: {
        required: 'Please enter an end multiplicand.',
        number: 'Please enter a valid number for the end multiplicand.',
      },
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element); // Place error messages after the input element
    },
    submitHandler: function (form) {
      // Get input values
      const startMultiplier = parseInt($('#startMultiplier').val());
      const endMultiplier = parseInt($('#endMultiplier').val());
      const startMultiplicand = parseInt($('#startMultiplicand').val());
      const endMultiplicand = parseInt($('#endMultiplicand').val());

      // Clear previous table, if any
      while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
      }

      if (startMultiplier > endMultiplier) {
        // Display error message for invalid range
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Invalid range: Start multiplier should be less than or equal to end multiplier.';
        errorMessage.classList.add('error-message');
        tableContainer.appendChild(errorMessage);
      } else if (startMultiplicand > endMultiplicand) {
        // Display error message for invalid range
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Invalid range: Start multiplicand should be less than or equal to end multiplicand.';
        errorMessage.classList.add('error-message');
        tableContainer.appendChild(errorMessage);
      } else if (
        isNaN(startMultiplier) ||
        isNaN(endMultiplier) ||
        isNaN(startMultiplicand) ||
        isNaN(endMultiplicand)
      ) {
        // Display error message for non-numeric input
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Please enter valid numeric values for all fields.';
        errorMessage.classList.add('error-message');
        tableContainer.appendChild(errorMessage);
      } else {
        // Generate multiplication table
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th')); // Empty cell for top-left corner
        
        // Generate header row
        for (let i = startMultiplier; i <= endMultiplier; i++) {
          const headerCell = document.createElement('th');
          headerCell.textContent = i;
          headerRow.appendChild(headerCell);
        }
        table.appendChild(headerRow);

        // Generate rows and cells
        for (let i = startMultiplicand; i <= endMultiplicand; i++) {
          const row = document.createElement('tr');
          const multiplicandCell = document.createElement('td');
          multiplicandCell.textContent = i;
          row.appendChild(multiplicandCell);

          for (let j = startMultiplier; j <= endMultiplier; j++) {
            const product = i * j;
            const productCell = document.createElement('td');
            productCell.textContent = product;
            row.appendChild(productCell);
          }

          table.appendChild(row);
        }

        // Append table to table container
        tableContainer.appendChild(table);

        // Create a new tab
        const tabId = `tab-${tabCounter}`;
        const tabLink = `<li><a href="#${tabId}">${startMultiplier}-${endMultiplier}-${startMultiplicand}-${endMultiplicand}<span class="ui-icon ui-icon-close" role="presentation"></span></a></li>`;
        const tabContent = `<div id="${tabId}"><p>${table.outerHTML}</p></div>`;
        tableTabs.find('.ui-tabs-nav').append(tabLink);
        tableTabs.append(tabContent).tabs('refresh');

        // Increase the tab counter for the next tab
        tabCounter++;
      }

      loadingMessage.style.display = 'none'; // Hide the loading message
    },
  });

  // Enable tabbed interface and tab deletion
  tableTabs.tabs().on('click', 'span.ui-icon-close', function () {
    const tabId = $(this).closest('li').remove().attr('aria-controls');
    $(`#${tabId}`).remove();
    tableTabs.tabs('refresh');
  });

  // Enable deleting multiple tabs
  $('#deleteSelectedBtn').on('click', function () {
    const selectedTabs = tableTabs.find('.ui-tabs-nav .ui-state-active');
    selectedTabs.each(function () {
      const tabId = $(this).closest('li').remove().attr('aria-controls');
      $(`#${tabId}`).remove();
    });
    tableTabs.tabs('refresh');
  });

  // Add sliders functionality
  $('#startMultiplierSlider').slider({
    range: 'min',
    value: 1,
    min: 1,
    step: 1,
    slide: function (event, ui) {
      $('#startMultiplier').val(ui.value);
    },
  });

  $('#endMultiplierSlider').slider({
    range: 'min',
    value: 10,
    min: 1,
    step: 1,
    slide: function (event, ui) {
      $('#endMultiplier').val(ui.value);
    },
  });

  $('#startMultiplicandSlider').slider({
    range: 'min',
    value: 1,
    min: 1,
    step: 1,
    slide: function (event, ui) {
      $('#startMultiplicand').val(ui.value);
    },
  });

  $('#endMultiplicandSlider').slider({
    range: 'min',
    value: 10,
    min: 1,
    step: 1,
    slide: function (event, ui) {
      $('#endMultiplicand').val(ui.value);
    },
  });
});



