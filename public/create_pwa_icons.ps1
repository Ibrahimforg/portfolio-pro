# Script PowerShell pour créer des icônes PWA
Add-Type -AssemblyName System.Drawing

# Fonction pour créer une icône carrée avec un design moderne
function Create-Icon($size, $filename) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Fond dégradé bleu
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Rectangle]::new(0, 0, $size, $size),
        [System.Drawing.Color]::FromArgb(59, 130, 246),  # #3B82F6
        [System.Drawing.Color]::FromArgb(29, 78, 216),   # #1D4ED8
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Lettre "I" blanche au centre
    $font = New-Object System.Drawing.Font("Arial", $size * 0.4, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $text = "I"
    
    # Centrer le texte
    $textSize = $graphics.MeasureString($text, $font)
    $textX = ($size - $textSize.Width) / 2
    $textY = ($size - $textSize.Height) / 2
    
    $graphics.DrawString($text, $font, $textBrush, $textX, $textY)
    
    # Sauvegarder l'icône
    $bitmap.Save("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\icons\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Libérer les ressources
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Créer toutes les icônes requises par le manifest
Create-Icon 72 "icon-72x72.png"
Create-Icon 96 "icon-96x96.png"
Create-Icon 128 "icon-128x128.png"
Create-Icon 144 "icon-144x144.png"
Create-Icon 152 "icon-152x152.png"
Create-Icon 192 "icon-192x192.png"
Create-Icon 384 "icon-384x384.png"
Create-Icon 512 "icon-512x512.png"

# Créer les icônes de raccourcis
Create-Icon 96 "shortcut-projects-96x96.png"
Create-Icon 96 "shortcut-skills-96x96.png"
Create-Icon 96 "shortcut-contact-96x96.png"

Write-Host "✅ Toutes les icônes PWA ont été créées avec succès!"
