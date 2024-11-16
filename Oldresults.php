<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "matthew";
$password = "MagicSpaceWaffle!";
$dbname = "trains_project";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed, check auth: " . $conn->connect_error);
}

$searchResults = null;

if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['query'])) {
    $query = $conn->real_escape_string($_POST['query']);

    $insertSql = "INSERT INTO userData (searchQuery) VALUES ('$query')";
    if (!$conn->query($insertSql)) {
        die("Error logging the search query: " . $conn->error);
    }
    
    $sql = "SELECT * FROM userData WHERE userID = '707' AND (setNum LIKE '%$query%' OR carNum LIKE '%$query%')";
    $result = $conn->query($sql);

    
    $searchResults = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $searchResults[] = $row;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css" />
    <title>Train Search</title>
    <h1>Matthew Bergamini</h1>
    <script>
        // Need to make this less hacky
        /*
        window.onload = function() {
            document.getElementById('formIntro').submit();
        };
        */
    </script>
</head>
<body>
    <div class="social-header">
            <ul>
                <li><a href="https://www.linkedin.com/in/matthew-bergamini">Linked-In</a></li>
                <li><a href="https://www.instagram.com/could_be_a_berga/">Instagram</a></li>
                <li><a href="https://www.discordapp.com/users/579529508194091019">Discord</a></li>
                <!-- 
                <li>Resume</li>
                 !-->
            </ul>
    </div>
    <h1 style="color: yellow;">Train search</h1>
    <form action="allTrips.php" method="POST" id="formIntro">
        <label for="query">Enter Set or carriage:</label>
        <input type="text" id="query" name="query" required placeholder="707" value="707">
        <button type="submit">Search</button>
    </form>

    <?php if ($_SERVER["REQUEST_METHOD"] == "POST"): ?>
        <h2>Current Trip</h2>
        <p>You have ridden in times before </p>


        <!--- 
        Below, list of all records, Top should show the actioned input, giving count 
        !--->
        <h2 style="color: white;">Past Trips:</h2>
        <?php if (!empty($searchResults)): ?>
            <table border="1">
                <tr><th>Carriage Number</th><th>Set Number</th><th>Type Name</th></tr>
                <?php foreach ($searchResults as $row): ?>
                    <tr>
                        <td><?= htmlspecialchars($row["carNum"]) ?></td>
                        <td><?= htmlspecialchars($row["setNum"]) ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p>No results found.</p>
        <?php endif; ?>
    <?php endif; ?>

</body>
</html>

<?php
// Close the database connection
$conn->close();
?>