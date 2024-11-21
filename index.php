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

$allEntries = null;

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['show_all'])) {

    $sql2 = "SELECT * FROM userData WHERE userID LIKE '707'";
    $result = $conn->query($sql2);

    $allEntries = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $allEntries[] = $row;
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
    <title>Log Entry</title>
    <h1><a href="../index.html" class="homeLink">Matthew Bergamini</a></h1>
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
                <li><a href="https://github.com/BergaDev">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/matthew-bergamini">Linked-In</a></li>
                <li><a href="https://www.instagram.com/could_be_a_berga/">Instagram</a></li>
                <li><a href="https://www.discordapp.com/users/579529508194091019">Discord</a></li>
                <!-- 
                <li>Resume</li>
                 !-->
            </ul>
    </div>
    <h1 style="color: yellow;">Train Track(ing)</h1>
    <form action="index.php" method="POST" id="formIntro">
        <label for="query">Enter Set or carriage:</label>
        <input type="text" id="query" name="query" required placeholder="A73">
        <button type="submit" id="SearchNum">Search</button>
    </form>

    <form action="index.php" method="POST">
        <button type="submit" name="show_all" id="show_all">Show All Entries</button>
    </form>

    <!-- Form start !-->
    <form action="results.php" method="POST" id="selectForm">
                <label for="selection">Select the set and carriage:</label>
                <!--- First Select 
                Changed to merge set and car into one option !--->
                <select name="selectedCarSet" id="selectedCarSet" required>
                    <?php
                    // Group results by setNum
                    $groupedResults = [];
                    foreach ($searchResults as $row) {
                        $groupedResults[$row["setNum"]][] = $row;
                    }

                    foreach ($groupedResults as $setNum => $carriages): 
                    ?>    
                        <!-- Carriage + Set Options -->
                        <?php foreach ($carriages as $row): ?>
                            <option value="<?= htmlspecialchars($row["carNum"] . "|" . $row["setNum"]) ?>">
                                Carriage: <?= htmlspecialchars($row["carNum"]) ?> - Set: <?= htmlspecialchars($row["setNum"]) ?>
                            </option>
                        <?php endforeach; ?>

                        <!-- Single Set Option -->
                        <option value="<?= htmlspecialchars($setNum . '|' . $setNum) ?>">
                            Set: <?= htmlspecialchars($setNum) ?>
                        </option>
                    <?php endforeach; ?>
                </select>

                <label for="note">Note:</label>
                <input type="text" id="note" name="note">

                <!-- date !-->
                <label for="date">Date:</label>
                <input id="date" type="datetime-local" id="date" name="date" required onclick="newSubID()"">


                <button type="submit" name="subID" value="" id="subID">Submit</button>
            </form>
            <!--- Form End !-->

    <?php if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($searchResults)): ?>
        <h2 style="color: white;">Search Results:</h2>
        <table border="1">
            <tr><th>Carriage Number</th><th>Set Number</th><th>Type Name</th></tr>
            <?php foreach ($searchResults as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row["carNum"]) ?></td>
                    <td><?= htmlspecialchars($row["setNum"]) ?></td>
                    <td><?= htmlspecialchars($row["typeName"]) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>

    <?php if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($allEntries)): ?>
        <h2 style="color: yellow; font-family: 'spaceMonoBold'" id="allEntriesText">All Entries:</h2>
        <table border="1">
            <tr>
                <th>Set Number</th>
                <th>Car Number</th>
                <th>Note</th>
                <th>Date & Time</th>
            </tr>
            <?php foreach ($allEntries as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row["setNum"]) ?></td>
                    <td><?= htmlspecialchars($row["carNum"]) ?></td>
                    <td><?= htmlspecialchars($row["note"]) ?></td>
                    <td><?= htmlspecialchars($row["date"]) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php elseif (empty($searchResults) && empty($allEntries)): ?>
        <p id="noResultError">No results found.</p>
    <?php endif; ?>


    <script>
        //Hide error on load
        window.onload = function() {
            const element = document.getElementById('noResultError');
            if (element) {
                element.style.display = 'none';
            }
        };

        function newSubID() {
            const now = new Date();
            const time = now.getTime();
            const genID = (time * Math.floor(Math.random() * 100));
            //alert('genID as: ' + genID);

            const submitValue = document.getElementById('subID');
            submitValue.value = genID;
        };
    </script>
</body>
</html>

<?php
// Close the database connection
$conn->close();
?>