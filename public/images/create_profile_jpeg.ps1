# Créer une image JPEG valide pour le profil
Add-Type -AssemblyName System.Drawing

# Créer une bitmap 400x400
$bitmap = New-Object System.Drawing.Bitmap(400, 400)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fond dégradé bleu
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Point]::new(0, 0),
    [System.Drawing.Point]::new(400, 400),
    [System.Drawing.Color]::FromArgb(59, 130, 246),
    [System.Drawing.Color]::FromArgb(30, 64, 175)
)
$graphics.FillRectangle($brush, 0, 0, 400, 400)

# Cercle visage
$faceBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.FillEllipse($faceBrush, 140, 100, 120, 120)

# Corps
$bodyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$graphics.FillEllipse($bodyBrush, 120, 200, 160, 140)

# Initials
$font = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$graphics.DrawString("IF", $font, $textBrush, 170, 150)

# Sauvegarder en JPEG haute qualité
$codecInfo = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]100
)

$bitmap.Save("profile.jpg", $codecInfo, $encoderParams)

# Libérer les ressources
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "✅ Image JPEG créée: profile.jpg"
