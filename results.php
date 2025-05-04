<?php
$config = require 'config.php';
$servername = $config['servername'];
$username = $config['username'];
$password = $config['password'];
$dbname = $config['dbname'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['selectedCarSet'])) {
    $userID = '707';
    list($carNum, $setNum) = explode('|', $_POST['selectedCarSet']);

    $carNumSave = htmlspecialchars($carNum);
    $setNumSave = htmlspecialchars($setNum);
    $date = $conn->real_escape_string($_POST['date']);
    $dep = htmlspecialchars($_POST['dep']);
    $des = htmlspecialchars($_POST['des']);
    $subID = htmlspecialchars($_POST['subID']);

    $insertSql = "INSERT INTO userData (userID, carNum, setNum, date, subID, dep, des) VALUES ('$userID', '$carNumSave', '$setNumSave', '$date', '$subID', '$dep','$des')";
    try {
        if ($conn->query($insertSql) === TRUE) {
        }
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) { 
            echo "<p style='color: red;'>Duplicate Data entry, perhaps site refresh and submission</p>";
            echo "<script>alert('Duplicate Data entry, perhaps site refresh and submission');</script>";
            echo "<script>window.location.href = 'index.php';</script>";
        } else {
            echo "<p style='color: red;'>Error inserting data: " . $e->getMessage() . "</p>";
        }
    }

    $query = "SELECT * FROM userData WHERE userID = $userID ORDER BY `userData`.`date` DESC";
    $result = $conn->query($query);

    $allResults = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $allResults[] = $row;
        }
    }
} else {
    echo "<p>Invalid data submitted!  Testing: $carNumSave and $setNumSave </p>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css" />
    <title>Results</title>
    <h1><a href="../index.html" class="homeLink">Matthew Bergamini</a></h1>
</head>
<body>
<div class="social-header">
<ul>
                <li><a href="https://github.com/BergaDev">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/matthew-bergamini">Linked-In</a></li>
                <li><a href="https://www.instagram.com/could_be_a_berga/">Instagram</a></li>
                <li><a href="https://www.discordapp.com/users/579529508194091019">Discord</a></li>
                <!-- 
                <li>Resume</li>
                 !-->
            </ul>
    </div>
    <h1 id='projName' style="color: yellow;"><a href="index.php"> Train Track(ing) </a></h1>
    <?php if (!empty($allResults)): ?>

    <?php
        $theSet = 0;
        $theCar = 0;
        $setCount = 0;
        $carCount = 0;

        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['selectedCarSet'])) {
            list($carNum, $setNum) = explode('|', $_POST['selectedCarSet']);
            $theSet = htmlspecialchars($setNum);
            $theCar = htmlspecialchars($carNum);
            echo "<p>This is set number {$theSet} and car number {$theCar}</p>";
        } else {
            echo "<p>No set number provided.</p>";
        }

        foreach ($allResults as $row) {
            if ($row["setNum"] == $theSet) {
                $setCount++;
            }
        }

        foreach ($allResults as $row) {
            if ($row["carNum"] == $theCar) {
                $carCount++;
            }
        }
        ?>

        <?php
        if ($setCount >= 1 && $carCount == 0) {
            echo "<p>You have rode this set: $setCount times</p>";
        } else if ($setCount >= 1 && $carCount >= 1) {
            echo "<p>You have rode this set: $setCount times and the carriage: $carCount</p>";
        }
        ?>

        <table border="1">
            <tr>
                <th>Carriage Number</th>
                <th>Set Number</th>
                <th>Depature</th>
                <th>Destination</th>
                <th>Date</th>
                <!--
                <th>Edit</th>
                -->
            </tr>
            <?php foreach ($allResults as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row["carNum"]) ?></td>
                    <td><?= htmlspecialchars($row["setNum"]) ?></td>
                    <td><?= htmlspecialchars($row["dep"]) ?></td>
                    <td><?= htmlspecialchars($row["des"]) ?></td>
                    <td><?= htmlspecialchars($row["date"]) ?></td>
                    <!-- 
                    <td><?= htmlspecialchars($row["subID"]) ?></td> 
                    -->
                </tr>
            <?php endforeach; ?>
        </table>

        <?php else: ?>
        <p>No records found.</p>
    <?php endif; ?>

    <?php $conn->close(); ?>
</body>
</html>