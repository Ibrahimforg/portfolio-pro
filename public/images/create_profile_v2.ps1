# Créer une image de profil JPEG valide
Add-Type -AssemblyName System.Drawing

$image = New-Object System.Drawing.Bitmap(400, 400)
$graphics = [System.Drawing.Graphics]::FromImage($image)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.FillRectangle(0, 0, 400, 400)

$font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)

$text = "Profile"
$textSize = $graphics.MeasureString($text, $font)
$textX = (400 - $textSize.Width) / 2
$textY = (400 - $textSize.Height) / 2

$graphics.DrawString($text, $font, $brush, $textX, $textY)

$image.Save("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

$graphics.Dispose()
$image.Dispose()

Write-Host "Image de profil créée avec succès!"
