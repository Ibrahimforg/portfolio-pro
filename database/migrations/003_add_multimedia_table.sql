-- Migration 003: Ajout de la table multimedia
-- Date: 2026-06-02
-- Description: Création de la table multimedia pour gérer les fichiers multimédias

-- Table multimédia centrale
CREATE TABLE multimedia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50) NOT NULL, -- image, video, audio, document
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  duration INTEGER, -- Pour vidéos en secondes
  resolution VARCHAR(20), -- 1080p, 4K, etc.
  format VARCHAR(20), -- mp4, webm, jpg, png, etc.
  tags TEXT[],
  category VARCHAR(100),
  alt_text TEXT,
  metadata JSONB,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  skill_id INTEGER REFERENCES skills(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des galeries de projets (relation multiple)
CREATE TABLE project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  multimedia_id UUID REFERENCES multimedia(id) ON DELETE CASCADE,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour multimédia
CREATE INDEX idx_multimedia_type ON multimedia(file_type);
CREATE INDEX idx_multimedia_category ON multimedia(category);
CREATE INDEX idx_multimedia_published ON multimedia(published);
CREATE INDEX idx_multimedia_featured ON multimedia(featured);
CREATE INDEX idx_multimedia_project ON multimedia(project_id);
CREATE INDEX idx_multimedia_skill ON multimedia(skill_id);
CREATE INDEX idx_gallery_project ON project_gallery(project_id);
CREATE INDEX idx_gallery_multimedia ON project_gallery(multimedia_id);

-- Index GIN pour JSONB
CREATE INDEX idx_multimedia_metadata ON multimedia USING GIN (metadata);
CREATE INDEX idx_multimedia_tags ON multimedia USING GIN (tags);

-- Activation RLS
ALTER TABLE multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour multimedia
CREATE POLICY "Published multimedia are viewable by everyone" ON multimedia FOR SELECT USING (published = true);
CREATE POLICY "Multimedia are manageable by authenticated users" ON multimedia FOR ALL USING (auth.role() = 'authenticated');

-- Politiques RLS pour project_gallery
CREATE POLICY "Project gallery are viewable by everyone" ON project_gallery FOR SELECT USING (true);
CREATE POLICY "Project gallery are manageable by authenticated users" ON project_gallery FOR ALL USING (auth.role() = 'authenticated');

-- Trigger pour updated_at
CREATE TRIGGER update_multimedia_updated_at BEFORE UPDATE ON multimedia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_gallery_updated_at BEFORE UPDATE ON project_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
