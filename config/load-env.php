<?php
/**
 * Charger le fichier .env pour les variables d'environnement
 * Usage: require_once __DIR__ . '/config/load-env.php';
 */

$envFile = __DIR__ . '/../.env';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Ignorer les commentaires
        if (str_starts_with(trim($line), '#')) {
            continue;
        }
        
        // Diviser par le premier =
        if (str_contains($line, '=')) {
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Ajouter à $_ENV et putenv
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}
?>
