# Script simplifié pour créer des icônes PWA
Add-Type -AssemblyName System.Drawing

# Fonction pour créer une icône carrée simple
function New-PWAIcon($size, $filename) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fond bleu uni
    $graphics.Clear([System.Drawing.Color]::FromArgb(59, 130, 246))
    
    # Lettre "I" blanche au centre
    $fontSize = [int]($size * 0.4)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    # Mesurer et centrer le texte
    $textSize = $graphics.MeasureString("I", $font)
    $textX = [int](($size - $textSize.Width) / 2)
    $textY = [int](($size - $textSize.Height) / 2)
    
    $graphics.DrawString("I", $font, $textBrush, $textX, $textY)
    
    # Sauvegarder
    $outputPath = "C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\icons\$filename"
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Libérer les ressources
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Créer les icônes
New-PWAIcon 72 "icon-72x72.png"
New-PWAIcon 96 "icon-96x96.png"
New-PWAIcon 128 "icon-128x128.png"
New-PWAIcon 144 "icon-144x144.png"
New-PWAIcon 152 "icon-152x152.png"
New-PWAIcon 192 "icon-192x192.png"
New-PWAIcon 384 "icon-384x384.png"
New-PWAIcon 512 "icon-512x512.png"

# Icônes de raccourcis
New-PWAIcon 96 "shortcut-projects-96x96.png"
New-PWAIcon 96 "shortcut-skills-96x96.png"
New-PWAIcon 96 "shortcut-contact-96x96.png"

Write-Host "✅ Icônes PWA créées avec succès!"
