$(document).ready(function () {
  // Display Data From Database
  function getData() {
    output = "";
    $.ajax({
      url: "retrieve.php",
      type: "GET",
      dataType: "json",
      success: function (data) {
        // Check if data is available
        if (data && data.length > 0) {
          // Loop through the data and create table rows
          for (i = 0; i < data.length; i++) {
            output +=
              "<tr><td>" +
              data[i].roll +
              "</td><td>" +
              data[i].name +
              "</td><td>" +
              data[i].department +
              "</td><td><button class='btn-edit' data-stuId='" +
              data[i].id +
              "'>Edit</button><button type='submit' class='btn-delete' data-stuId='" +
              data[i].id +
              "'>Delete</button></td></tr>";
          }
        } else {
          // Display a warning if there's a problem or no data
          output = "<div class='warning'>No data available!</div>";
        }
        // Insert the generated HTML into the tbody element
        $("#tbody").html(output);
      },
    });
  }

  // Initial data display
  getData();

  // Insert Data to Database
  $("#submit").click(function (e) {
    e.preventDefault();
    // Get input values
    let id = $("#student_id").val();
    let name = $("#name").val();
    let roll = $("#roll").val();
    let department = $("#department").val();

    // Prepare data for AJAX request
    let data = { id: id, name: name, roll: roll, department: department };

    $.ajax({
      url: "insert.php",
      type: "POST",
      data: JSON.stringify(data),
      success: function (data) {
        // Check response and update UI accordingly
        if (data === "required") {
          // Display a warning if required fields are not filled
          message = "<div class='warning'>All fields are required</div>";
          $("#msg").html(message);
        }
        if (data === "success") {
          // Display success message, reset form, and refresh data
          message = "<div class='success'>Student information updated.</div>";
          $("#msg").html(message);
          $("#formData")[0].reset();
          getData();
        }
        if (data === "failed") {
          // Display a warning if there was a problem with the request
          message = "<div class='warning'>Sorry, there was a problem!</div>";
          $("#msg").html(message);
        }
      },
    });
  });

  // Edit Data From Database
  $("tbody").on("click", ".btn-edit", function () {
    let id = $(this).attr("data-stuId");
    let data = { id: id };

    $.ajax({
      url: "edit.php",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(data),
      success: function (data) {
        // Check if data is available for editing
        if (data) {
          // Populate form fields with the retrieved data
          $("#student_id").val(data.id);
          $("#name").val(data.name);
          $("#roll").val(data.roll);
          $("#department").val(data.department);
        } else {
          // Display a warning if there was a problem retrieving data
          message = "<div class='warning'>Sorry, there was a problem!</div>";
          $("#msg").html(message);
        }
      },
    });
  });

  // Delete Data From Database
  $("tbody").on("click", ".btn-delete", function () {
    let id = $(this).attr("data-stuId");
    let data = { id: id };

    $.ajax({
      url: "delete.php",
      type: "POST",
      data: JSON.stringify(data),
      success: function (data) {
        // Check response and update UI accordingly
        if (data === "success") {
          // Display success message and refresh data
          message = "<div class='success'>Student information deleted.</div>";
          $("#msg").html(message);
          getData();
        }
        if (data === "failed") {
          // Display a warning if there was a problem with the request
          message = "<div class='warning'>Sorry, there was a problem!</div>";
          $("#msg").html(message);
        }
      },
    });
  });
});
