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

    
    $sql = "SELECT * FROM car_sets WHERE carNum LIKE '%$query%' OR setNum LIKE '%$query%'";
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
    <form action="index.php" method="POST" id="formIntro">
        <label for="query">Enter Set or carriage:</label>
        <input type="text" id="query" name="query" required placeholder="A75">
        <button type="submit">Search</button>
    </form>

    <?php if ($_SERVER["REQUEST_METHOD"] == "POST"): ?>

        
        <h2 style="color: white;">Search Results:</h2>

            <!-- Form start !-->
            <form action="results.php" method="POST">
                <label for="selection">Select the set or carriage:</label>
                <select name="selection" id="selection" required>
                    <option value="<?= htmlspecialchars($row["setNum"]) ?>">
                       Set Number: <?= htmlspecialchars($row["setNum"]) ?>
                    </option>
                    <?php foreach ($searchResults as $row): ?>
                        <option value="<?= htmlspecialchars($row["carNum"]) . '-' . htmlspecialchars($row["setNum"]) ?>">
                            Carriage Number: <?= htmlspecialchars($row["carNum"]) ?>, Set Number: <?= htmlspecialchars($row["setNum"]) ?>
                        </option>
                        <option value="<?= htmlspecialchars($row["setNum"]) ?>">
                            Set Number: <?= htmlspecialchars($row["setNum"]) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <button type="submit" name="select">Submit Selection</button>
            </form>
            <!--- Form End !-->

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