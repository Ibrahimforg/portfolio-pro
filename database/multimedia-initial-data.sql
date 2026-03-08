-- DONNÉES INITIALES MULTIMÉDIA
-- Compétences multimédia dynamiques

-- Récupérer l'ID de la catégorie multimédia
DO $$
DECLARE
  multimedia_category_id INTEGER;
BEGIN
  SELECT id INTO multimedia_category_id FROM skill_categories WHERE slug = 'multimedia';
  
  IF multimedia_category_id IS NOT NULL THEN
    -- Insérer les compétences multimédia
    INSERT INTO skills (name, category_id, level, years_experience, icon, description, skill_type, multimedia_url, order_index) VALUES
    ('Adobe Premiere Pro', multimedia_category_id, 'Advanced', 3, 'Video', 'Montage vidéo professionnel avec effets et transitions avancées', 'multimedia', 'https://example.com/premiere-demo', 1),
    ('After Effects', multimedia_category_id, 'Intermediate', 2, 'Animation', 'Motion design et animations complexes', 'multimedia', 'https://example.com/aftereffects-demo', 2),
    ('Photoshop', multimedia_category_id, 'Expert', 4, 'Graphics', 'Design graphique et retouche photo professionnelle', 'multimedia', 'https://example.com/photoshop-demo', 3),
    ('DaVinci Resolve', multimedia_category_id, 'Advanced', 3, 'Video', 'Étalonnage couleur et montage professionnel', 'multimedia', 'https://example.com/resolve-demo', 4),
    ('Illustrator', multimedia_category_id, 'Advanced', 3, 'Graphics', 'Illustration vectorielle et design graphique', 'multimedia', 'https://example.com/illustrator-demo', 5),
    ('Audacity', multimedia_category_id, 'Advanced', 3, 'Audio', 'Édition audio et production musicale', 'multimedia', 'https://example.com/audacity-demo', 6),
    ('OBS Studio', multimedia_category_id, 'Intermediate', 2, 'Video', 'Streaming et enregistrement vidéo', 'multimedia', 'https://example.com/obs-demo', 7),
    ('Blender', multimedia_category_id, 'Intermediate', 2, 'Animation', 'Modélisation 3D et animation', 'multimedia', 'https://example.com/blender-demo', 8),
    ('Final Cut Pro', multimedia_category_id, 'Advanced', 3, 'Video', 'Montage vidéo professionnel sur macOS', 'multimedia', 'https://example.com/finalcut-demo', 9),
    ('Logic Pro X', multimedia_category_id, 'Intermediate', 2, 'Audio', 'Production musicale professionnelle', 'multimedia', 'https://example.com/logicpro-demo', 10)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Message de succès
SELECT 'Données multimédia insérées avec succès' as status;
