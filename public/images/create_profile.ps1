# Script pour créer une image de profil JPEG valide
# Compatible avec Next.js et les exigences de l'utilisateur

Add-Type -AssemblyName System.Drawing

# Créer une image JPEG de 400x400 pixels
$image = New-Object System.Drawing.Bitmap(400, 400)

# Ajouter un fond blanc
$graphics = [System.Drawing.Graphics]::FromImage($image)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.FillRectangle(0, 0, 400, 400)

# Ajouter du texte "Profile"
$font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)

# Calculer la position pour centrer le texte
$text = "Profile"
$textSize = $graphics.MeasureString($text, $font)
$textX = (400 - $textSize.Width) / 2
$textY = (400 - $textSize.Height) / 2

# Dessiner le texte
$graphics.DrawString($text, $font, $brush, $textX, $textY)

# Sauvegarder l'image
$image.Save("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Libérer les ressources
$graphics.Dispose()
$image.Dispose()

Write-Host "Image de profil créée avec succès!"
