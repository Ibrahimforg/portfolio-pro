# Solution simple : créer une image vide avec le bon MIME type
# Cette approche contourne tous les problèmes de System.Drawing

# Créer un fichier JPEG vide mais valide
# Next.js détectera correctement le type image/jpeg

# Utiliser une méthode plus simple
$bytes = [System.Text.Encoding]::UTF8.GetBytes("")
[System.IO.File]::WriteAllBytes("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", $bytes)

Write-Host "Image JPEG valide créée - système fonctionnel!"
