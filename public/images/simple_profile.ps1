# Créer une image de profil simple sans System.Drawing
# Créer un fichier image JPEG basique

# Créer un en-tête JPEG minimal
$jpegHeader = @'
FF D8 FF E0 00 10 4A 01 00 00 00 00 00 00
'@

# Créer une image 400x400 avec fond blanc
$image = [System.Drawing.Bitmap]::new(400, 400)
$graphics = [System.Drawing.Graphics]::FromImage($image)
$graphics.Clear([System.Drawing.Color]::White)

# Ajouter un cercle simple comme placeholder
$pen = [System.Drawing.Pen]::new([System.Drawing.Color]::LightGray, 2)
$graphics.DrawEllipse(100, 100, 80, 80, $pen)

# Sauvegarder en JPEG avec qualité standard
$image.Save("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

Write-Host "Image de profil créée avec succès!"
