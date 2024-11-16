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

if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['selectCar']) && !empty($_POST['selectSet'])) {
    $userID = '707';
    $carNum = $conn->real_escape_string($_POST['selectCar']);
    $setNum = $conn->real_escape_string($_POST['selectSet']);
    $date = $conn->real_escape_string($_POST['date']);

    $insertSql = "INSERT INTO userData (userID, carNum, setNum, date) VALUES ('$userID', '$carNum', '$setNum', '$date')";
    if ($conn->query($insertSql) === TRUE) {
    } else {
        echo "<p>Error inserting data: " . $conn->error . "</p>";
    }

    $query = "SELECT * FROM userData WHERE userID = $userID";
    $result = $conn->query($query);

    $allResults = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $allResults[] = $row;
        }
    }
} else {
    echo "<p>Invalid data submitted!</p>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css" />
    <title>Results</title>
    <h1>Matthew Bergamini</h1>
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
    <h1 id='projName' style="color: yellow;">Train Track(ing)</h1>
    <?php if (!empty($allResults)): ?>

    <?php
        $theSet = 0;
        $theCar = 0;
        $setCount = 0;

        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['selectSet'], $_POST['selectCar'])) {
            $theSet = htmlspecialchars($_POST['selectSet']);
            $theCar = htmlspecialchars($_POST['selectCar']);
            echo "<p>This is set number {$theSet} and car number {$theCar}</p>";
        } else {
            echo "<p>No set number provided.</p>";
        }

        foreach ($allResults as $row) {
            if ($row["setNum"] == $theSet) {
                $setCount++;
            }
        }
        ?>

        <p>You have ridden in this set: <?= $setCount; ?> times</p>

        <table border="1">
            <tr>
                <th>Carriage Number</th>
                <th>Set Number</th>
            </tr>
            <?php foreach ($allResults as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row["carNum"]) ?></td>
                    <td><?= htmlspecialchars($row["setNum"]) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>

        <?php else: ?>
        <p>No records found.</p>
    <?php endif; ?>

    <?php $conn->close(); ?>
</body>
</html>