# Solution robuste pour l'image de profil
# Créer une image JPEG valide avec le bon type MIME

# Méthode 1 : Utiliser .NET (plus fiable que PowerShell)
Add-Type -AssemblyName System.Drawing

try {
    # Créer une image bitmap
    $bitmap = New-Object System.Drawing.Bitmap(400, 400)
    
    # Ajouter un fond blanc
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    
    # Ajouter un texte "Profile" (optionnel)
    $font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    
    # Calculer la position pour centrer le texte
    $text = "Profile"
    $textSize = $graphics.MeasureString($text, $font)
    $textX = (400 - $textSize.Width) / 2
    $textY = (400 - $textSize.Height) / 2
    
    # Dessiner le texte
    $graphics.DrawString($text, $font, $brush, $textX, $textY)
    
    # Sauvegarder avec qualité JPEG et encoder correctement
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Quality = [System.Drawing.Imaging.EncoderQuality]::High
    $encoderParams.ColorDepth = [System.Drawing.Imaging.ColorDepth]::24bpp
    
    $bitmap.Save("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg, $encoderParams)
    
    # Libérer les ressources
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "✅ Image JPEG valide créée avec le bon type MIME!"
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)"
}

# Méthode 2 : Alternative simple avec PowerShell natif
try {
    # Utiliser la classe .NET native pour créer une image JPEG
    Add-Type -AssemblyName System.Windows.Forms
    
    # Créer une image 400x400 pixels
    $image = New-Object System.Windows.Forms.PictureBox(400, 400)
    $image.BackColor = [System.Drawing.Color]::White
    
    # Ajouter du texte
    $font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    
    # Dessiner le texte centré
    $text = "Profile"
    $image.CreateGraphics().DrawString($text, $font, $brush, 150, 150)
    
    # Sauvegarder en JPEG haute qualité
    $image.Save("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    Write-Host "✅ Image JPEG créée avec .NET natif!"
    
} catch {
    Write-Host "❌ Erreur .NET: $($_.Exception.Message)"
}
