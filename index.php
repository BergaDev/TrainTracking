<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

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

//For train search
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['setCar'])) {
    $query = $conn->real_escape_string($_POST['setCar']);

    
    $sql = "SELECT * FROM car_sets WHERE carNum LIKE '%$query%' OR setNum LIKE '%$query%'";
    $result = $conn->query($sql);

    
    $searchResults = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $searchResults[] = $row;
        }
    }
}

//For station search
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['station'])) {
    $query = $conn->real_escape_string($_POST['station']);

    
    $sql = "SELECT * FROM stations WHERE name LIKE '%$query%'";
    $result = $conn->query($sql);

    
    $stationResults = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $stationResults[] = $row;
        }
    }
}

$allEntries = null;

//To search DB by row
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['sortColumnValue'])) {
    $query = $conn->real_escape_string($_POST['sortColumnValue']);

    $sql2 = "SELECT * FROM userData WHERE setNum ='$query' OR carNum LIKE '%$query%' OR dep LIKE '%$query%' OR des LIKE '%$query%' OR date LIKE '%$query%' ORDER BY `date` DESC";
    $result = $conn->query($sql2);

    $allEntries = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $allEntries[] = $row;
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['show_all'])) {

    $sql2 = "SELECT * FROM userData WHERE userID LIKE '707' ORDER BY `userData`.`date` DESC";
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
        function sortRowAction(value) {
            const formData = new FormData();
            formData.append("sortColumnValue", value);

            fetch("index.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, "text/html");
                const newTable = newDoc.querySelector("#filteredResults");

                if (newTable) {
                    const target = document.getElementById("allEntriesTable");
                    target.innerHTML = newTable.innerHTML;
                }
            })
            .catch(err => console.error("Search error:", err));
        }

        function resetAllEntries() {
            const formData = new FormData();
            formData.append("show_all", "true");

            fetch("index.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, "text/html");
                const newTable = newDoc.querySelector("#filteredResults");

                if (newTable) {
                    const target = document.getElementById("allEntriesTable");
                    target.innerHTML = newTable.innerHTML;
                }
            });
        }
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

    <form action="index.php" method="POST" class="ajaxForm" data-target="#setContainer">
        <label for="query" class="searchArea">Set or carriage Num:</label>
        <input type="text" id="query" name="setCar" required placeholder="A73">
        <button type="submit" id="SearchNum">Search</button>
    </form>

    <form action="index.php" method="POST" class="ajaxForm" data-target="#depContainer">
        <label for="query" class="searchArea">Departure Station:</label>
        <input type="text" id="query" name="station" required placeholder="Thirroul">
        <button type="submit" id="SearchNum">Search</button>
    </form>

    <form action="index.php" method="POST" class="ajaxForm" data-target="#desContainer">
        <label for="query" class="searchArea">Destination Station:</label>
        <input type="text" id="query" name="station" required placeholder="Central">
        <button type="submit" id="SearchNum">Search</button>
    </form>

    <form action="index.php" method="POST">
        <button type="submit" name="show_all" id="show_all">Show All Entries</button>
    </form>

    <form action="results.php" method="POST" id="combinedForm" style="display:none;">
        <div id="setContainer">
            <label for="selection">Select the set and carriage:</label>
            <select name="selectedCarSet" id="selectedCarSet" required>
                <?php
                // Group results by setNum
                $groupedResults = [];
                foreach ($searchResults as $row) {
                    $groupedResults[$row["setNum"]][] = $row;
                }

                foreach ($groupedResults as $setNum => $carriages): 
                ?>    
                    <?php foreach ($carriages as $row): ?>
                        <option value="<?= htmlspecialchars($row["carNum"] . "|" . $row["setNum"]) ?>">
                            Carriage: <?= htmlspecialchars($row["carNum"]) ?> - Set: <?= htmlspecialchars($row["setNum"]) ?>
                        </option>
                    <?php endforeach; ?>

                    <option value="<?= htmlspecialchars($setNum . '|' . $setNum) ?>">
                        Set: <?= htmlspecialchars($setNum) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div id="depContainer">
            <label for="dep">Origin:</label>
            <select name="dep" id="dep" required>
                <?php
                    if (!empty($stationResults)) {
                        // Group by letter
                        $groupedStations = [];
                        foreach ($stationResults as $row) {
                            $firstLetter = strtoupper(substr($row["name"], 0, 1));
                            $groupedStations[$firstLetter][] = $row;
                        }
                        foreach ($groupedStations as $letter => $stations) {
                            echo '<optgroup label="' . htmlspecialchars($letter) . '">';
                            foreach ($stations as $station) {
                                echo '<option value="' . htmlspecialchars($station["name"]) . '">' . htmlspecialchars($station["name"]) . '</option>';
                            }
                            echo '</optgroup>';
                        }
                    }
                ?>
            </select>
        </div>
        <div id="desContainer">
            <label for="des">Destination:</label>
            <select name="des" id="des" required>
                <?php
                    if (!empty($stationResults)) {
                        // Group by letter
                        $groupedStations = [];
                        foreach ($stationResults as $row) {
                            $firstLetter = strtoupper(substr($row["name"], 0, 1));
                            $groupedStations[$firstLetter][] = $row;
                        }
                        foreach ($groupedStations as $letter => $stations) {
                            echo '<optgroup label="' . htmlspecialchars($letter) . '">';
                            foreach ($stations as $station) {
                                echo '<option value="' . htmlspecialchars($station["name"]) . '">' . htmlspecialchars($station["name"]) . '</option>';
                            }
                            echo '</optgroup>';
                        }
                    }
                ?>
            </select>
        </div>
        <label for="date">Date:</label>
        <input id="date" type="datetime-local" name="date" required onclick="newSubID()">
        <button type="submit" name="subID" value="" id="subID">Submit</button>
    </form>

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
        <button onclick="resetAllEntries()" style="margin-top: 10px;">Show All Again</button>
        <div id="filteredResults"><table border="1" id="allEntriesTable">
            <tr>
                <th>Set Number</th>
                <th>Car Number</th>
                <th>Departure</th>
                <th>Destination</th>
                <th>Date & Time</th>
                <!--
                <th>Edit</th>
                -->
            </tr>
            
            <?php foreach ($allEntries as $row): ?>
                <tr>
                    <td id="sortUsing" onclick="sortRowAction('<?= htmlspecialchars($row["setNum"]) ?>')"><?= htmlspecialchars($row["setNum"]) ?></td>
                    <td id="sortUsing" onclick="sortRowAction('<?= htmlspecialchars($row["carNum"]) ?>')"><?= htmlspecialchars($row["carNum"]) ?></td>
                    <td id="sortUsing" onclick="sortRowAction('<?= htmlspecialchars($row["dep"]) ?>')"><?= htmlspecialchars($row["dep"]) ?></td>
                    <td id="sortUsing" onclick="sortRowAction('<?= htmlspecialchars($row["des"]) ?>')"><?= htmlspecialchars($row["des"]) ?></td>
                    <td id="sortUsing" onclick="sortRowAction('<?= htmlspecialchars($row["date"]) ?>')">
                        <?php 
                            $date = new DateTime($row["date"]);
                            echo $date->format("d/m/y h:iA"); 
                        ?>
                    </td>
                    <!--
                    <td><?= htmlspecialchars($row["subID"]) ?></td>
                    -->
                </tr>
            <?php endforeach; ?>
        </table></div>
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
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.ajaxForm').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Stop page refresh, stupid clearing data
                var targetSelector = form.getAttribute('data-target');
                var formData = new FormData(form);
                fetch('index.php', {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) { return response.text(); })
                .then(function(html) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    var newContent = tempDiv.querySelector(targetSelector);
                    if(newContent) {
                        document.querySelector(targetSelector).innerHTML = newContent.innerHTML;
                    }
                const combinedForm = document.getElementById("combinedForm");
                if (combinedForm) {
                    combinedForm.style.display = "block";
                }
                })
                .catch(function(error) { console.error('Error:', error); });
            });
        });
    });
    </script>
</body>
</html>

<?php
// Close the database connection
$conn->close();
?>